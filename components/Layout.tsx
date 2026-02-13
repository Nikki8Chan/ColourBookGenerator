
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen scribble-bg">
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>
            <span className="font-bold text-xl text-indigo-900">MagicColor</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-indigo-600">Home</a>
            <a href="#" className="hover:text-indigo-600">My Books</a>
            <a href="#" className="hover:text-indigo-600">Print Guide</a>
          </div>
        </div>
      </nav>
      <main>{children}</main>
      <footer className="py-12 text-center text-gray-400 text-sm">
        &copy; 2024 Magic Color Book. Powered by Gemini.
      </footer>
    </div>
  );
};
