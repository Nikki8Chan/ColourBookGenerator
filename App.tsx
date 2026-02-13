
import React, { useState, useEffect } from 'react';
import { ColoringBookGenerator } from './components/Generator';
import { ChatBot } from './components/Chat';
import { Layout } from './components/Layout';
import { ApiKeyOverlay } from './components/ApiKeyOverlay';

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const exists = await window.aistudio.hasSelectedApiKey();
        setHasKey(exists);
      } else {
        // Fallback for environments without the selection tool
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleKeySelected = () => {
    setHasKey(true);
  };

  return (
    <Layout>
      {hasKey === false && <ApiKeyOverlay onSelected={handleKeySelected} />}
      
      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <header className="text-center mb-16">
          <div className="inline-block mb-4 p-3 bg-white rounded-2xl shadow-sm border border-brand-100">
            <span className="text-4xl">🎨</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-brand-700 mb-6 tracking-tight drop-shadow-sm">
            Magic Color Book
          </h1>
          <p className="text-slate-600 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Personalized coloring adventures created by AI, just for your little explorer.
          </p>
        </header>

        <section className="relative">
          <ColoringBookGenerator />
        </section>
      </div>

      <ChatBot />
    </Layout>
  );
};

export default App;
