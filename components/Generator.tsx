
import React, { useState } from 'react';
import { generatePagePrompts, generateColoringImage } from '../services/gemini';
import { BookSettings, ColoringPage, ImageSize } from '../types';

export const ColoringBookGenerator: React.FC = () => {
  const [settings, setSettings] = useState<BookSettings>({
    childName: '',
    theme: '',
    imageSize: '1K'
  });
  const [pages, setPages] = useState<ColoringPage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings.childName || !settings.theme) return;

    setIsGenerating(true);
    setPages([]);
    setProgress('Imagining your scenes...');

    try {
      const promptTexts = await generatePagePrompts(settings.theme);
      
      const initialPages: ColoringPage[] = promptTexts.map((p, i) => ({
        id: `page-${i}`,
        prompt: p,
        status: 'pending'
      }));
      setPages(initialPages);

      for (let i = 0; i < initialPages.length; i++) {
        setProgress(`Drawing page ${i + 1} of 5...`);
        setPages(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'generating' } : p));
        
        try {
          const imageUrl = await generateColoringImage(initialPages[i].prompt, settings.imageSize);
          setPages(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'completed', imageUrl } : p));
        } catch (err) {
          console.error(`Error on page ${i}`, err);
          setPages(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'error' } : p));
        }
      }
      setProgress('Magic complete!');
    } catch (err) {
      console.error(err);
      setProgress('Oops! Something went wrong.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPdf = async () => {
    // @ts-ignore
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Cover Page
    doc.setFillColor(79, 70, 229); // indigo-600
    doc.rect(0, 0, width, height, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(40);
    doc.text(settings.childName + "'s", width / 2, height / 3, { align: 'center' });
    doc.setFontSize(50);
    doc.text("Coloring Book", width / 2, height / 2, { align: 'center' });
    doc.setFontSize(24);
    doc.text("Theme: " + settings.theme, width / 2, (height * 2) / 3, { align: 'center' });

    // Coloring Pages
    for (const page of pages) {
      if (page.imageUrl) {
        doc.addPage();
        doc.addImage(page.imageUrl, 'PNG', 10, 10, width - 20, width - 20);
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(12);
        doc.text(page.prompt, width / 2, height - 20, { align: 'center', maxWidth: width - 40 });
      }
    }

    doc.save(`${settings.childName}_MagicColorBook.pdf`);
  };

  return (
    <div className="space-y-12">
      <section className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-50">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Child's Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 focus:outline-none transition-colors"
              placeholder="e.g. Leo"
              value={settings.childName}
              onChange={e => setSettings(s => ({ ...s, childName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Adventure Theme</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 focus:outline-none transition-colors"
              placeholder="e.g. Space Dinosaurs"
              value={settings.theme}
              onChange={e => setSettings(s => ({ ...s, theme: e.target.value }))}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-semibold text-gray-700">Detail Level</label>
              <select
                className="w-full px-4 py-3 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 focus:outline-none transition-colors"
                value={settings.imageSize}
                onChange={e => setSettings(s => ({ ...s, imageSize: e.target.value as ImageSize }))}
              >
                <option value="1K">Standard (1K)</option>
                <option value="2K">High Definition (2K)</option>
                <option value="4K">Ultra Crisp (4K)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:bg-gray-300 transition-all shadow-lg hover:shadow-indigo-200 active:scale-95"
            >
              {isGenerating ? 'Working...' : 'Create Magic!'}
            </button>
          </div>
        </form>
      </section>

      {progress && (
        <div className="text-center">
          <p className="text-indigo-600 font-medium animate-pulse">{progress}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {pages.map((page, i) => (
          <div key={page.id} className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 group relative">
            <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
              {page.status === 'completed' && page.imageUrl ? (
                <img src={page.imageUrl} alt={page.prompt} className="w-full h-full object-contain" />
              ) : page.status === 'error' ? (
                <div className="text-red-400 text-center p-4">
                  <p>Failed to draw this page.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-gray-300">
                  <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
                  <span className="text-sm font-medium">Drafting...</span>
                </div>
              )}
            </div>
            <p className="mt-4 text-xs text-gray-400 line-clamp-2 italic px-1">
              {page.prompt}
            </p>
            <div className="absolute top-6 left-6 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md">
              {i + 1}
            </div>
          </div>
        ))}
      </div>

      {pages.length > 0 && pages.every(p => p.status === 'completed' || p.status === 'error') && (
        <div className="flex justify-center pb-12">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-3 px-12 py-5 bg-green-500 text-white rounded-2xl font-black text-xl hover:bg-green-600 transition-all shadow-xl hover:shadow-green-200 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download {settings.childName}'s Book (PDF)
          </button>
        </div>
      )}
    </div>
  );
};
