
import React from 'react';

interface Props {
  regions: string[];
  selectedRegion: string;
  onSelect: (region: string) => void;
}

const MapSelector: React.FC<Props> = ({ regions, selectedRegion, onSelect }) => {
  return (
    <div className="mt-8 border-t border-slate-100 pt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Select Region from Map</h3>
          <p className="text-xs text-slate-500">Click a sector or area to filter results</p>
        </div>
        {selectedRegion && (
          <button 
            onClick={() => onSelect('')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Clear Selection
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {regions.length > 0 ? (
          regions.map((region) => (
            <button
              key={region}
              onClick={() => onSelect(region)}
              className={`p-5 rounded-2xl border-2 text-sm font-bold transition-all flex flex-col items-center justify-center gap-3 group ${
                selectedRegion === region
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200 -translate-y-1'
                  : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-300 hover:shadow-lg'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                selectedRegion === region ? 'bg-indigo-500 text-white' : 'bg-slate-50 text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-300'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <span className="text-center leading-tight">{region}</span>
            </button>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-sm font-medium">
            Select a city first to browse regional zones
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-2 mt-8 py-3 bg-emerald-50 rounded-xl border border-emerald-100">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
        <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
          Selection data is processed in-browser only
        </p>
      </div>
    </div>
  );
};

export default MapSelector;
