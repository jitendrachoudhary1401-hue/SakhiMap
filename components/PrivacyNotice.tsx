
import React from 'react';

const PrivacyNotice: React.FC = () => {
  return (
    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 md:p-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="bg-emerald-500 p-2 rounded-lg text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
        </div>
        <div>
          <h3 className="text-emerald-900 font-semibold mb-1">Privacy-First Guarantee</h3>
          <p className="text-emerald-700 text-sm leading-relaxed">
            SakhiMap does not use cookies, track your location automatically, or require an account. 
            All search data is cleared when you close your browser tab. We prioritize your anonymity 
            and safety.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyNotice;
