
import React from 'react';

const QuickExit: React.FC = () => {
  const handleExit = () => {
    // Redirect to a neutral page like Google or Weather
    window.location.href = 'https://www.google.com/search?q=weather';
  };

  return (
    <button 
      onClick={handleExit}
      className="fixed bottom-6 right-6 z-50 bg-rose-600 hover:bg-rose-700 text-white font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all active:scale-95 group"
      title="Quick Exit (Esc)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      <span>Quick Exit</span>
      <span className="hidden md:inline-block text-xs bg-rose-800 px-1.5 py-0.5 rounded ml-1 opacity-60">Esc</span>
    </button>
  );
};

export default QuickExit;
