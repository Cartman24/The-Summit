import React, { useState } from 'react';
import { SummitConsultation } from '../types';

interface OutputDisplayProps {
  result: SummitConsultation;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ result }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 space-y-12 animate-fade-in-up pb-24">
      
      {/* PHASE 1: DIAGNOSTIC */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 text-zinc-400 border-b border-zinc-800 pb-2">
            <span className="text-xs font-mono bg-zinc-800 text-zinc-300 px-2 py-1 rounded">PHASE 1</span>
            <h3 className="text-xl font-bold text-white tracking-tight">THE DIAGNOSTIC</h3>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl shadow-lg backdrop-blur-sm">
            <div className="prose prose-invert prose-sm max-w-none font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {result.phase1_diagnostic}
            </div>
        </div>
      </section>

      {/* PHASE 2: SURGERY */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 text-zinc-400 border-b border-zinc-800 pb-2">
            <span className="text-xs font-mono bg-zinc-800 text-zinc-300 px-2 py-1 rounded">PHASE 2</span>
            <h3 className="text-xl font-bold text-white tracking-tight">LYRICAL SURGERY</h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
            {result.phase2_surgery.map((item, idx) => (
                <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col md:flex-row">
                    <div className="p-4 md:w-1/3 bg-zinc-950/50 border-b md:border-b-0 md:border-r border-zinc-800 relative">
                        <span className="absolute top-2 left-2 text-[10px] text-red-500 font-mono uppercase tracking-wider">Original</span>
                        <p className="mt-4 text-zinc-400 font-mono text-sm italic">"{item.original}"</p>
                    </div>
                    <div className="p-4 md:w-1/3 bg-zinc-900 relative border-b md:border-b-0 md:border-r border-zinc-800">
                        <span className="absolute top-2 left-2 text-[10px] text-emerald-500 font-mono uppercase tracking-wider">Polished</span>
                        <p className="mt-4 text-emerald-100 font-mono text-sm font-medium">"{item.polished}"</p>
                    </div>
                    <div className="p-4 md:w-1/3 bg-zinc-900/30 relative">
                         <span className="absolute top-2 left-2 text-[10px] text-indigo-400 font-mono uppercase tracking-wider">Reasoning</span>
                         <p className="mt-4 text-zinc-500 text-xs">{item.reasoning}</p>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* PHASE 3: ARCHITECTURE */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 text-zinc-400 border-b border-zinc-800 pb-2">
            <span className="text-xs font-mono bg-zinc-800 text-zinc-300 px-2 py-1 rounded">PHASE 3</span>
            <h3 className="text-xl font-bold text-white tracking-tight">SUNO v5.2 ARCHITECTURE</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg">
                <label className="text-xs text-indigo-400 font-bold uppercase tracking-wider block mb-2">Vocal Persona</label>
                <code className="text-xs text-zinc-300 font-mono break-all">{result.phase3_architecture.vocalPersona}</code>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg">
                <label className="text-xs text-indigo-400 font-bold uppercase tracking-wider block mb-2">The Mix</label>
                <code className="text-xs text-zinc-300 font-mono break-all">{result.phase3_architecture.mixSettings}</code>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg">
                <label className="text-xs text-indigo-400 font-bold uppercase tracking-wider block mb-2">Meta Tags</label>
                <code className="text-xs text-zinc-300 font-mono break-all">{result.phase3_architecture.metaTags}</code>
            </div>
        </div>
      </section>

      {/* PHASE 4: MASTER PROMPT */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 text-zinc-400 border-b border-zinc-800 pb-2">
            <span className="text-xs font-mono bg-red-900 text-red-200 px-2 py-1 rounded animate-pulse">PHASE 4</span>
            <h3 className="text-xl font-bold text-white tracking-tight">MASTER PROTOCOL</h3>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-red-500"></div>
            
            <div className="p-6 grid gap-6">
                 {/* Concept */}
                 <div>
                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Concept</span>
                    <p className="text-xl text-white font-bold tracking-tight mt-1">{result.phase4_masterPrompt.concept}</p>
                 </div>

                 {/* Style & Exclude */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group relative">
                        <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest">Style Prompt</span>
                        <div className="bg-zinc-950 mt-2 p-3 rounded border border-zinc-800 font-mono text-sm text-indigo-100 break-words">
                            {result.phase4_masterPrompt.stylePrompt}
                        </div>
                        <button 
                            onClick={() => copyToClipboard(result.phase4_masterPrompt.stylePrompt, 'style')}
                            className="absolute top-0 right-0 text-[10px] bg-zinc-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-white"
                        >
                            {copiedSection === 'style' ? 'COPIED!' : 'COPY'}
                        </button>
                    </div>
                    <div className="group relative">
                        <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Exclude</span>
                        <div className="bg-zinc-950 mt-2 p-3 rounded border border-zinc-800 font-mono text-sm text-red-100 break-words">
                            {result.phase4_masterPrompt.exclude}
                        </div>
                         <button 
                            onClick={() => copyToClipboard(result.phase4_masterPrompt.exclude, 'exclude')}
                            className="absolute top-0 right-0 text-[10px] bg-zinc-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-white"
                        >
                            {copiedSection === 'exclude' ? 'COPIED!' : 'COPY'}
                        </button>
                    </div>
                 </div>

                 {/* Lyrics */}
                 <div className="relative group">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Final Lyrics</span>
                        <button
                            onClick={() => copyToClipboard(result.phase4_masterPrompt.lyrics, 'lyrics')}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold py-1 px-3 rounded transition-colors uppercase tracking-wider"
                        >
                            {copiedSection === 'lyrics' ? 'COPIED TO CLIPBOARD' : 'COPY FULL PROMPT'}
                        </button>
                    </div>
                    <div className="bg-zinc-950 p-6 rounded-lg border border-zinc-800 font-mono text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                        {result.phase4_masterPrompt.lyrics}
                    </div>
                 </div>
            </div>
            
            {/* Footer Params */}
            <div className="bg-zinc-950 border-t border-zinc-800 p-4 flex gap-6 text-xs font-mono text-zinc-500">
                <span>WEIRDNESS: <span className="text-indigo-400">{result.phase4_masterPrompt.weirdness}%</span></span>
                <span>INFLUENCE: <span className="text-indigo-400">{result.phase4_masterPrompt.styleInfluence}%</span></span>
            </div>
        </div>
      </section>

    </div>
  );
};