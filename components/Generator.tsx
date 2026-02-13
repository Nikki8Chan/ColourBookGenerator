
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
    setProgress('✨ Summoning creative ideas...');

    try {
      const promptTexts = await generatePagePrompts(settings.theme);
      
      const initialPages: ColoringPage[] = promptTexts.map((p, i) => ({
        id: `page-${i}`,
        prompt: p,
        status: 'pending'
      }));
      setPages(initialPages);

      for (let i = 0; i < initialPages.length; i++) {
        setProgress(`✍️ Drawing page ${i + 1} of 5...`);
        setPages(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'generating' } : p));
        
        try {
          const imageUrl = await generateColoringImage(initialPages[i].prompt, settings.imageSize);
          setPages(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'completed', imageUrl } : p));
        } catch (err) {
          console.error(`Error on page ${i}`, err);
          setPages(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'error' } : p));
        }
      }
      setProgress('🎉 Your coloring book is ready!');
    } catch (err) {
      console.error(err);
      setProgress('😅 Oops! The magic wands are tangled. Please try again.');
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
    doc.setFillColor(79, 70, 229); // brand-600
    doc.rect(0, 0, width, height, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(40);
    doc.text(settings.childName + "'s", width / 2, height / 3, { align: 'center' });
    doc.setFontSize(50);
    doc.text("Coloring Book", width / 2, height / 2, { align: 'center' });
    doc.setFontSize(20);
    doc.text("An Adventure in: " + settings.theme, width / 2, (height * 2) / 3, { align: 'center' });

    // Coloring Pages
    for (const page of pages) {
      if (page.imageUrl) {
        doc.addPage();
        // Add a nice border
        doc.setDrawColor(200, 200, 200);
        doc.rect(5, 5, width - 10, height - 10);
        
        doc.addImage(page.imageUrl, 'PNG', 10, 10, width - 20, width - 20);
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(14);
        doc.text(page.prompt, width / 2, height - 25, { align: 'center', maxWidth: width - 40 });
      }
    }

    doc.save(`${settings.childName}_ColoringBook.pdf`);
  };

  return (
    <div className="space-y-16">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-brand-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <span className="text-8xl">🖍️</span>
        </div>
        
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end relative z-10">
          <div className="space-y-3">
            <label className="text-sm font-black text-slate-700 uppercase tracking-widest">Child's Name</label>
            <input
              type="text"
              required
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-brand-500 focus:bg-white focus:outline-none transition-all text-lg font-bold text-slate-800"
              placeholder="e.g. Leo"
              value={settings.childName}
              onChange={e => setSettings(s => ({ ...s, childName: e.target.value }))}
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-black text-slate-700 uppercase tracking-widest">Adventure Theme</label>
            <input
              type="text"
              required
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-brand-500 focus:bg-white focus:outline-none transition-all text-lg font-bold text-slate-800"
              placeholder="e.g. Space Dinosaurs"
              value={settings.theme}
              onChange={e => setSettings(s => ({ ...s, theme: e.target.value }))}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-3">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest">Detail</label>
              <select
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-brand-500 focus:bg-white focus:outline-none transition-all text-lg font-bold text-slate-800 appearance-none"
                value={settings.imageSize}
                onChange={e => setSettings(s => ({ ...s, imageSize: e.target.value as ImageSize }))}
              >
                <option value="1K">Standard</option>
                <option value="2K">High Def</option>
                <option value="4K">Ultra HD</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-10 py-4 bg-brand-600 text-white rounded-2xl font-black text-lg hover:bg-brand-700 disabled:bg-slate-300 transition-all shadow-xl shadow-brand-200 active:scale-95 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Drawing...
                </>
              ) : (
                'Create Magic!'
              )}
            </button>
          </div>
        </form>
      </div>

      {progress && (
        <div className="text-center bg-brand-50 py-4 px-8 rounded-full inline-block mx-auto w-full max-w-lg shadow-sm border border-brand-100 animate-bounce">
          <p className="text-brand-700 font-black text-lg">{progress}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {pages.map((page, i) => (
          <div key={page.id} className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 group relative transition-all hover:shadow-2xl hover:-translate-y-1">
            <div className="aspect-square bg-slate-50 rounded-[1.5rem] overflow-hidden flex items-center justify-center border-2 border-dashed border-slate-200">
              {page.status === 'completed' && page.imageUrl ? (
                <img src={page.imageUrl} alt={page.prompt} className="w-full h-full object-cover" />
              ) : page.status === 'error' ? (
                <div className="text-red-400 text-center p-6 space-y-2">
                  <span className="text-4xl">❌</span>
                  <p className="font-bold">Drawing Error</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin"></div>
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Pencil drafting...</span>
                </div>
              )}
            </div>
            <div className="mt-6 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Description</span>
              <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                "{page.prompt}"
              </p>
            </div>
            <div className="absolute -top-4 -left-4 bg-brand-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-brand-200 rotate-[-10deg]">
              {i + 1}
            </div>
          </div>
        ))}
      </div>

      {pages.length > 0 && pages.every(p => p.status === 'completed' || p.status === 'error') && (
        <div className="flex flex-col items-center gap-6 pb-20 pt-10">
          <button
            onClick={handleDownloadPdf}
            className="group flex items-center gap-4 px-16 py-6 bg-emerald-500 text-white rounded-[2rem] font-black text-2xl hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-200 active:scale-95"
          >
            <div className="p-2 bg-white/20 rounded-xl group-hover:rotate-12 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            Download Printable Book
          </button>
          <p className="text-slate-400 font-bold text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
            Ready to print on standard A4 / Letter paper
          </p>
        </div>
      )}
    </div>
  );
};
