import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-8 px-4 flex flex-col items-center justify-center border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></div>
        <h1 className="text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-400 to-zinc-200">
          THE SUMMIT
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-zinc-500 text-sm font-mono tracking-widest uppercase">
          Suno v5.2 Architect
        </p>
        <span className="bg-zinc-900 border border-zinc-700 text-[10px] px-1.5 py-0.5 rounded text-red-400 font-mono">
          HEARTBEAT PATCH
        </span>
      </div>
    </header>
  );
};