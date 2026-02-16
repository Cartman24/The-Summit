import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { OutputDisplay } from './components/OutputDisplay';
import { generateSunoPrompt } from './services/geminiService';
import { AppState, GenerationRequest, SummitConsultation } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<SummitConsultation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (request: GenerationRequest) => {
    setAppState(AppState.GENERATING);
    setError(null);
    setResult(null);

    try {
      const data = await generateSunoPrompt(request);
      setResult(data);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setAppState(AppState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col items-center relative overflow-x-hidden selection:bg-indigo-500/30">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-900/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none"></div>

      <Header />

      <main className="w-full flex-1 px-4 py-8 z-10 flex flex-col items-center">
        <InputForm onGenerate={handleGenerate} appState={appState} />

        {error && (
          <div className="w-full max-w-2xl mt-6 p-4 bg-red-900/20 border border-red-800 text-red-200 rounded-lg text-sm text-center font-mono">
            ERROR: {error}
          </div>
        )}

        {appState === AppState.SUCCESS && result && (
          <OutputDisplay result={result} />
        )}

        {appState === AppState.IDLE && (
           <div className="mt-12 text-center max-w-lg">
             <h3 className="text-zinc-500 font-mono text-xs uppercase tracking-[0.2em] mb-4">THE SUMMIT PROTOCOL</h3>
             <div className="grid grid-cols-2 gap-4 text-left">
                <div className="p-4 border border-zinc-800 rounded bg-zinc-900/30">
                    <span className="block text-red-400 text-xs font-bold mb-1">MAX MARTIN</span>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                        Melodic Math & Syllable Symmetry validation.
                    </p>
                </div>
                <div className="p-4 border border-zinc-800 rounded bg-zinc-900/30">
                    <span className="block text-indigo-400 text-xs font-bold mb-1">GREG KURSTIN</span>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                        v5.2 Heartbeat Patch optimization & Biometric Tempo.
                    </p>
                </div>
             </div>
           </div>
        )}
      </main>

      <footer className="w-full py-6 text-center border-t border-zinc-900 mt-auto bg-zinc-950">
        <p className="text-zinc-600 text-xs font-mono">
          SYSTEM: ONLINE // MODEL: GEMINI-3-PRO // PATCH: v5.2
        </p>
      </footer>
    </div>
  );
};

export default App;