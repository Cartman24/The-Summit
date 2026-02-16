import React, { useState, useRef } from 'react';
import { AppState, GenerationRequest } from '../types';

interface InputFormProps {
  onGenerate: (request: GenerationRequest) => void;
  appState: AppState;
}

export const InputForm: React.FC<InputFormProps> = ({ onGenerate, appState }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'review'>('text');
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (appState === AppState.GENERATING) return;

    if ((activeTab === 'text' || activeTab === 'review') && !inputText.trim()) return;
    if (activeTab === 'image' && !selectedImage) return;

    let request: GenerationRequest = {
      input: inputText,
      mode: activeTab
    };

    if (activeTab === 'image' && selectedImage) {
        // Convert file to base64 string without prefix for Gemini API
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            request.imagePart = {
                inlineData: {
                    data: base64String,
                    mimeType: selectedImage.type
                }
            };
            onGenerate(request);
        };
        reader.readAsDataURL(selectedImage);
    } else {
        onGenerate(request);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative 'tape' for review mode */}
      {activeTab === 'review' && (
         <div className="absolute top-0 right-0 -mr-8 mt-6 w-40 transform rotate-45 bg-amber-500/20 text-amber-500 text-[10px] font-mono border-y border-amber-500/50 text-center py-1 font-bold pointer-events-none tracking-widest uppercase z-0">
             Audit Mode
         </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-zinc-800 pb-2 relative z-10">
        <button
          onClick={() => setActiveTab('text')}
          className={`pb-2 text-xs md:text-sm font-semibold transition-colors ${
            activeTab === 'text'
              ? 'text-indigo-400 border-b-2 border-indigo-400'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          CONCEPT / GENRE
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`pb-2 text-xs md:text-sm font-semibold transition-colors ${
            activeTab === 'review'
              ? 'text-amber-400 border-b-2 border-amber-400'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          REVIEW / POLISH
        </button>
        <button
          onClick={() => setActiveTab('image')}
          className={`pb-2 text-xs md:text-sm font-semibold transition-colors ${
            activeTab === 'image'
              ? 'text-indigo-400 border-b-2 border-indigo-400'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          IMAGE ANALYSIS
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        {activeTab === 'text' && (
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-2 uppercase">
              Describe your song concept
            </label>
            <textarea
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-4 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 h-32 resize-none placeholder-zinc-700 font-mono text-sm"
              placeholder="E.g., A melancholic progressive rock ballad about losing touch with reality, heavy reverb, female vocals..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={appState === AppState.GENERATING}
            />
          </div>
        )}

        {activeTab === 'review' && (
          <div>
            <label className="block text-xs font-mono text-amber-500 mb-2 uppercase font-bold">
              Paste Existing Draft (Lyrics + Tags)
            </label>
            <textarea
              className="w-full bg-zinc-950 border border-amber-900/30 rounded-lg p-4 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 h-48 resize-none placeholder-zinc-700 font-mono text-xs leading-relaxed"
              placeholder={`[Verse 1]
Walking down the neon street
Heart skipping a beat
Into the abyss I go...

[Styles]
Rock, Pop, 80s`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={appState === AppState.GENERATING}
            />
             <p className="text-[10px] text-zinc-500 mt-2 font-mono">
                *The Summit will audit this against strict v5.2 standards and rewrite for better flow.
             </p>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="space-y-4">
             <label className="block text-xs font-mono text-zinc-400 mb-2 uppercase">
              Upload Vibe Image
            </label>
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 hover:bg-zinc-900 transition-all relative overflow-hidden group"
            >
                {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                ) : (
                    <div className="text-center p-4">
                        <svg className="w-8 h-8 text-zinc-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <p className="text-zinc-500 text-sm">Click to upload image</p>
                    </div>
                )}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                />
            </div>
             <div>
                <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">
                  Additional Context (Optional)
                </label>
                <input
                    type="text"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="E.g., Make it sound like 1980s synthwave"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={appState === AppState.GENERATING}
                />
             </div>
          </div>
        )}

        <button
          type="submit"
          disabled={appState === AppState.GENERATING || ((activeTab === 'text' || activeTab === 'review') && !inputText) || (activeTab === 'image' && !selectedImage)}
          className={`w-full py-3 rounded-lg font-bold tracking-wider transition-all duration-300 
            ${appState === AppState.GENERATING 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : activeTab === 'review'
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]'
            }`}
        >
          {appState === AppState.GENERATING ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              CONSULTING THE SUMMIT...
            </span>
          ) : activeTab === 'review' ? (
             'AUDIT & POLISH'
          ) : (
            'GENERATE BLUEPRINT'
          )}
        </button>
      </form>
    </div>
  );
};