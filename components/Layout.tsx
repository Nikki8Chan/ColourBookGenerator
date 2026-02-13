
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen scribble-bg bg-slate-50">
      <nav className="bg-white/90 backdrop-blur-lg border-b border-brand-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-200">
              M
            </div>
            <span className="font-black text-2xl text-brand-900 tracking-tight">MagicColor</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-brand-600 transition-colors">Home</a>
            <a href="#" className="hover:text-brand-600 transition-colors">My Books</a>
            <a href="#" className="hover:text-brand-600 transition-colors px-5 py-2 bg-brand-50 text-brand-600 rounded-full">Print Guide</a>
          </div>
        </div>
      </nav>
      <main className="min-h-[calc(100vh-160px)]">
        {children}
      </main>
      <footer className="py-16 text-center text-slate-400 font-medium border-t border-slate-100 bg-white">
        <p>&copy; 2024 Magic Color Book. Made with ✨ and Gemini.</p>
        <p className="text-xs mt-2 text-slate-300">High quality line art generation powered by Gemini Pro Image.</p>
      </footer>
    </div>
  );
};
