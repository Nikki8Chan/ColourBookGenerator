
import React, { useState, useEffect, useCallback } from 'react';
import { ColoringBookGenerator } from './components/Generator';
import { ChatBot } from './components/Chat';
import { Layout } from './components/Layout';
import { ApiKeyOverlay } from './components/ApiKeyOverlay';

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      const exists = await window.aistudio.hasSelectedApiKey();
      setHasKey(exists);
    };
    checkKey();
  }, []);

  const handleKeySelected = () => {
    setHasKey(true);
  };

  return (
    <Layout>
      {hasKey === false && <ApiKeyOverlay onSelected={handleKeySelected} />}
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-indigo-600 mb-4 tracking-tight">
            ✨ Magic Color Book ✨
          </h1>
          <p className="text-gray-600 text-lg">
            Create personalized coloring adventures for your little ones in seconds!
          </p>
        </header>

        <ColoringBookGenerator />
      </div>

      <ChatBot />
    </Layout>
  );
};

export default App;
