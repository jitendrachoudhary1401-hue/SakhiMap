
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.hash = ''}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 leading-none">SakhiMap</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Resource Portal</span>
          </div>
        </div>
        
        <nav className="hidden lg:flex items-center gap-10">
          <a href="#/" className="text-sm font-black text-indigo-600 border-b-2 border-indigo-600 pb-1">Find Pads</a>
          <a href="#/about" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Privacy Ethics</a>
          <a href="#" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Register Hub</a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Safe Connection</span>
          </div>
          <button className="lg:hidden p-2 text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
