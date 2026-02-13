
import React from 'react';

interface ApiKeyOverlayProps {
  onSelected: () => void;
}

export const ApiKeyOverlay: React.FC<ApiKeyOverlayProps> = ({ onSelected }) => {
  const handleOpenSelect = async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      onSelected();
    } else {
      onSelected();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 text-center">
      <div className="bg-white max-w-lg w-full rounded-[3rem] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-10 animate-in zoom-in-95 fade-in duration-300">
        <div className="w-24 h-24 bg-brand-50 rounded-[2rem] mx-auto flex items-center justify-center text-5xl shadow-inner">
          🎨
        </div>
        <div className="space-y-6">
          <h2 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">Access Pro Features</h2>
          <p className="text-slate-600 font-medium text-lg leading-relaxed">
            We use high-definition creative models to draw your coloring pages. 
            Please select a paid API key to unlock the magic!
          </p>
          <div className="p-6 bg-brand-50 rounded-3xl text-sm text-brand-800 font-bold border border-brand-100">
            <p>Ensure you have billing enabled on your project.</p>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              className="inline-block mt-3 px-4 py-1 bg-white rounded-full text-brand-600 border border-brand-200 hover:bg-brand-600 hover:text-white transition-all shadow-sm"
            >
              Billing Guide & Docs →
            </a>
          </div>
        </div>
        <button
          onClick={handleOpenSelect}
          className="w-full py-6 bg-brand-600 text-white rounded-[1.5rem] font-black text-xl hover:bg-brand-700 transition-all shadow-2xl shadow-brand-200 active:scale-95"
        >
          Select My API Key
        </button>
      </div>
    </div>
  );
};
