export interface LyricalSurgeryDiff {
  original: string;
  polished: string;
  reasoning: string;
}

export interface SummitConsultation {
  phase1_diagnostic: string;
  phase2_surgery: LyricalSurgeryDiff[];
  phase3_architecture: {
    vocalPersona: string;
    mixSettings: string;
    metaTags: string;
  };
  phase4_masterPrompt: {
    concept: string;
    stylePrompt: string;
    exclude: string;
    weirdness: number;
    styleInfluence: number;
    lyrics: string;
  };
}

export interface GenerationRequest {
  input: string;
  mode: 'text' | 'image' | 'review';
  imagePart?: {
    inlineData: {
      data: string;
      mimeType: string;
    }
  };
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}