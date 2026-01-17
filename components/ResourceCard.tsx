
import React from 'react';
import { ResourceLocation, ResourceType } from '../types';

interface Props {
  resource: ResourceLocation;
}

const ResourceCard: React.FC<Props> = ({ resource }) => {
  const isGov = resource.type === ResourceType.GOVERNMENT;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 discreet-shadow hover:border-indigo-300 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
          isGov ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {resource.type}
        </span>
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Verified {new Date(resource.verifiedAt).toLocaleDateString()}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight">{resource.name}</h3>
      <p className="text-sm text-slate-500 mb-4 flex items-start gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        {resource.address}, {resource.city}
      </p>

      <div className="space-y-3 mb-5">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-tighter mb-1">Requirements</div>
          <div className="flex flex-wrap gap-2 mt-1">
            {resource.requirements.map((req, idx) => (
              <span key={idx} className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                {req}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {resource.operatingHours}
        </div>
      </div>

      <div className="flex gap-2">
        <a 
          href={`https://www.google.com/maps/dir/?api=1&destination=${resource.coordinates.lat},${resource.coordinates.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-indigo-600 text-white text-center py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          Directions
        </a>
        {resource.contactPhone && (
          <a 
            href={`tel:${resource.contactPhone}`}
            className="w-12 border border-slate-200 text-slate-600 flex items-center justify-center rounded-lg hover:bg-slate-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </a>
        )}
      </div>
    </div>
  );
};

export default ResourceCard;
