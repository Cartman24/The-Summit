import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SummitConsultation, GenerationRequest } from "../types";
import { SYSTEM_INSTRUCTION, MODEL_NAME, THINKING_BUDGET } from "../constants";

const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    throw new Error("API_KEY environment variable is missing.");
  }
  return key;
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    phase1_diagnostic: {
      type: Type.STRING,
      description: "Detailed critique from the panel (Max Martin, Sia, etc.) grounding real theory into the v5.2 context.",
    },
    phase2_surgery: {
      type: Type.ARRAY,
      description: "A list of specific lyrical improvements.",
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING, description: "The original line or concept." },
          polished: { type: Type.STRING, description: "The rewritten line with IPA if needed." },
          reasoning: { type: Type.STRING, description: "Why this change was made (syllable count, phonetics, etc)." }
        },
        required: ["original", "polished", "reasoning"]
      }
    },
    phase3_architecture: {
      type: Type.OBJECT,
      description: "Technical specifications for Suno v5.2.",
      properties: {
        vocalPersona: { type: Type.STRING, description: "Format: [Persona: ..., Gender: ..., Breathiness: ..., Range: ...]" },
        mixSettings: { type: Type.STRING, description: "Format: [Studio-Settings: ...]" },
        metaTags: { type: Type.STRING, description: "Comma separated meta tags example: [Intro: ...], [Hook: ...]" }
      },
      required: ["vocalPersona", "mixSettings", "metaTags"]
    },
    phase4_masterPrompt: {
      type: Type.OBJECT,
      description: "The final executable prompt block.",
      properties: {
        concept: { type: Type.STRING },
        stylePrompt: { type: Type.STRING },
        exclude: { type: Type.STRING },
        weirdness: { type: Type.INTEGER },
        styleInfluence: { type: Type.INTEGER },
        lyrics: { type: Type.STRING, description: "Full lyrics with structural tags and IPA syntax." }
      },
      required: ["concept", "stylePrompt", "exclude", "weirdness", "styleInfluence", "lyrics"]
    }
  },
  required: ["phase1_diagnostic", "phase2_surgery", "phase3_architecture", "phase4_masterPrompt"],
};

export const generateSunoPrompt = async (request: GenerationRequest): Promise<SummitConsultation> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });

  let promptContext = "";
  if (request.mode === 'review') {
    promptContext = `
      CONTEXT: The user has provided an EXISTING Suno v5.0 draft (lyrics, style tags, or partial prompt).
      MISSION: The Panel must AUDIT this draft.
      - Phase 1: Ruthlessly critique the existing choices against the "SunoAI Complete Meta Tags Guide". Identify weak rhymes, cliche words ("neon", "abyss"), and poor tag formatting.
      - Phase 2: Rewrite the content to correct these errors.
      - Phase 3 & 4: Output the perfected version.
    `;
  } else if (request.mode === 'image') {
    promptContext = `
      CONTEXT: The user has uploaded an image for visual analysis.
      MISSION: Translate the visual vibe into "Jack Antonoff" atmospheric production and "Sia" emotional resonance.
    `;
  } else {
    promptContext = `
      CONTEXT: The user has provided a raw concept or genre idea.
      MISSION: Build a professional-grade Suno v5.0 structure from scratch.
    `;
  }

  const promptText = `
    ${promptContext}
    
    Input Data:
    "${request.input}"
    
    EXECUTE THE 4-PHASE PRODUCTION WORKFLOW.
    REMEMBER THE HEARTBEAT PATCH (FEB 14 2026) CONTEXT.
  `;

  const contents = [];
  
  if (request.mode === 'image' && request.imagePart) {
    contents.push({
        inlineData: request.imagePart.inlineData
    });
  }
  
  contents.push({ text: promptText });

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: {
            thinkingBudget: THINKING_BUDGET
        },
        tools: [{googleSearch: {}}]
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    const result: SummitConsultation = JSON.parse(text);
    return result;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};