
import React from 'react';

interface ApiKeyOverlayProps {
  onSelected: () => void;
}

export const ApiKeyOverlay: React.FC<ApiKeyOverlayProps> = ({ onSelected }) => {
  const handleOpenSelect = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    onSelected();
  };

  return (
    <div className="fixed inset-0 bg-indigo-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 text-center">
      <div className="bg-white max-w-md w-full rounded-[2.5rem] p-10 shadow-2xl space-y-8 animate-in zoom-in-95">
        <div className="w-20 h-20 bg-indigo-100 rounded-3xl mx-auto flex items-center justify-center text-4xl">
          🎨
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-gray-900 leading-tight">Unlock Pro Magic</h2>
          <p className="text-gray-600 leading-relaxed">
            This app uses premium models for high-quality, print-ready line art. 
            Please select your Pro API key to continue.
          </p>
          <div className="p-4 bg-indigo-50 rounded-2xl text-xs text-indigo-700 font-medium">
            <p>Ensure you have billing enabled on your project.</p>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              className="underline mt-1 block hover:text-indigo-900"
            >
              Learn about billing →
            </a>
          </div>
        </div>
        <button
          onClick={handleOpenSelect}
          className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl hover:shadow-indigo-200 active:scale-95"
        >
          Select My API Key
        </button>
      </div>
    </div>
  );
};
