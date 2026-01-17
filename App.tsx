
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import PrivacyNotice from './components/PrivacyNotice';
import ResourceCard from './components/ResourceCard';
import MapSelector from './components/MapSelector';
import { MOCK_RESOURCES, CITIES, REGIONS_BY_CITY } from './constants';
import { ResourceLocation, ResourceType, SearchMode } from './types';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(onComplete, 800);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-indigo-900 transition-opacity duration-700 ${isFading ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center animate-in zoom-in-95 duration-700 ease-out">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-indigo-900 font-black text-5xl shadow-2xl mb-8">
          S
        </div>
        <h1 className="text-white text-4xl font-black tracking-tight mb-2">SakhiMap</h1>
        <div className="flex items-center gap-2 text-indigo-300 text-sm font-bold uppercase tracking-widest mb-12">
          <span>Safe</span>
          <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
          <span>Private</span>
          <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
          <span>Verified</span>
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <div className="w-48 h-1 bg-indigo-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-400 animate-[loading_2s_ease-in-out_infinite]"></div>
          </div>
          <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em]">Securing your connection</p>
        </div>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0%); }
          100% { width: 0%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

type DiscoveryStep = 'LOCATION' | 'DELIVERY' | 'RESULTS';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [step, setStep] = useState<DiscoveryStep>('LOCATION');
  const [searchMode, setSearchMode] = useState<SearchMode>('city');
  const [selectedCity, setSelectedCity] = useState<string>(''); 
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [pincodeQuery, setPincodeQuery] = useState<string>('');
  const [manualAddress, setManualAddress] = useState<string>('');
  const [filterType, setFilterType] = useState<ResourceType | 'ALL'>('ALL');
  const [needsDelivery, setNeedsDelivery] = useState<boolean | null>(null);
  const [view, setView] = useState<'home' | 'about' | 'volunteer'>('home');
  const [gpsLoading, setGpsLoading] = useState(false);

  const handleGpsDetect = () => {
    if ("geolocation" in navigator) {
      setGpsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedCity('Mumbai');
          setSearchMode('city');
          setGpsLoading(false);
          setStep('DELIVERY');
        },
        (error) => {
          alert("Could not detect location. Please enter manually.");
          setGpsLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const isLocationSet = useMemo(() => {
    if (searchMode === 'pincode') return pincodeQuery.length === 6;
    if (searchMode === 'city') return selectedCity !== '' || manualAddress.length > 5;
    if (searchMode === 'map') return selectedCity !== '' && selectedRegion !== '';
    return false;
  }, [searchMode, selectedCity, selectedRegion, pincodeQuery, manualAddress]);

  const filteredResources = useMemo(() => {
    return MOCK_RESOURCES.filter(r => {
      if (filterType !== 'ALL' && r.type !== filterType) return false;
      
      // If delivery is needed, only show resources that support it
      if (needsDelivery && !r.offersDelivery) return false;

      if (searchMode === 'city') {
        if (selectedCity) return r.city === selectedCity;
        if (manualAddress) {
          const addr = manualAddress.toLowerCase();
          return addr.includes(r.city.toLowerCase()) || addr.includes(r.region.toLowerCase());
        }
        return true;
      }
      if (searchMode === 'pincode') return pincodeQuery ? r.pincode.startsWith(pincodeQuery) : true;
      if (searchMode === 'map') {
        const cityMatch = selectedCity ? r.city === selectedCity : true;
        const regionMatch = selectedRegion ? r.region === selectedRegion : true;
        return cityMatch && regionMatch;
      }
      return true;
    });
  }, [searchMode, selectedCity, selectedRegion, pincodeQuery, filterType, needsDelivery, manualAddress]);

  const availableRegions = useMemo(() => {
    return selectedCity ? REGIONS_BY_CITY[selectedCity] || [] : [];
  }, [selectedCity]);

  const renderHome = () => (
    <div>
      <section className="bg-gradient-to-br from-indigo-700 to-indigo-900 text-white py-16 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-20 -mr-48 -mt-48"></div>
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/30 rounded-full text-indigo-100 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm border border-indigo-400/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Verified Resources in Mumbai & Navi Mumbai
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight max-w-4xl leading-[1.1]">
            Menstrual Dignity. <br/>
            <span className="text-indigo-300">Privacy First.</span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl mb-10 leading-relaxed font-light">
            Locate verified sanitary pad distribution points from NGOs and government schemes. 
            Now featuring <span className="text-indigo-200 font-bold">Volunteer-led Delivery</span> for those who need it most.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
             <button 
               onClick={() => document.getElementById('finder')?.scrollIntoView({behavior: 'smooth'})}
               className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-xl"
             >
               Find Resources
             </button>
             <button 
               onClick={() => setView('volunteer')}
               className="bg-indigo-600 border border-indigo-400 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-500 transition-all flex items-center gap-2"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
               Become a Volunteer
             </button>
          </div>
        </div>
      </section>

      <div id="finder" className="max-w-7xl mx-auto px-4 py-12 -mt-10 relative z-20">
        <div className="max-w-4xl mx-auto">
          {/* Progress Tracker */}
          <div className="flex items-center justify-between mb-8 px-4">
            {[
              { id: 'LOCATION', label: '1. Location' },
              { id: 'DELIVERY', label: '2. Delivery' },
              { id: 'RESULTS', label: '3. Resources' }
            ].map((s, idx) => (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className={`flex items-center gap-2 ${step === s.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === s.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {idx + 1}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">{s.label}</span>
                </div>
                {idx < 2 && <div className={`flex-1 h-px mx-4 ${step === 'RESULTS' || (step === 'DELIVERY' && idx === 0) ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden min-h-[400px]">
            {/* STEP 1: LOCATION */}
            {step === 'LOCATION' && (
              <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-black text-slate-800 mb-2">First, where are you?</h2>
                <p className="text-slate-500 mb-8">For delivery, enter your <span className="font-bold text-indigo-600">full location</span>. For browsing, just enter your city/area.</p>
                
                <div className="flex border-b border-slate-100 mb-8">
                  <button 
                    onClick={() => setSearchMode('city')}
                    className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${searchMode === 'city' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'}`}
                  >
                    Address / Area
                  </button>
                  <button 
                    onClick={() => setSearchMode('pincode')}
                    className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${searchMode === 'pincode' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'}`}
                  >
                    Pincode
                  </button>
                  <button 
                    onClick={() => setSearchMode('map')}
                    className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${searchMode === 'map' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'}`}
                  >
                    Regions
                  </button>
                </div>

                <div className="space-y-8">
                  {searchMode === 'city' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Quick Select City</label>
                        <select 
                          value={selectedCity} 
                          onChange={(e) => {
                            setSelectedCity(e.target.value);
                            setManualAddress('');
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-lg focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                        >
                          <option value="">Choose City...</option>
                          {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                      </div>
                      <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-slate-100"></div>
                        <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">OR TYPE FULL ADDRESS</span>
                        <div className="flex-grow border-t border-slate-100"></div>
                      </div>
                      <div>
                        <textarea 
                          placeholder="Type full address for delivery (e.g. 102, Shanti Villa, Worli Seaface, Mumbai)"
                          value={manualAddress}
                          onChange={(e) => {
                            setManualAddress(e.target.value);
                            setSelectedCity('');
                          }}
                          rows={3}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-medium focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {searchMode === 'pincode' && (
                    <input 
                      type="text"
                      placeholder="Enter 6-digit Pincode"
                      value={pincodeQuery}
                      onChange={(e) => setPincodeQuery(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-xl focus:ring-4 focus:ring-indigo-500/10 outline-none placeholder:text-slate-300"
                    />
                  )}

                  {searchMode === 'map' && (
                    <div className="space-y-6">
                      <select 
                        value={selectedCity} 
                        onChange={(e) => { setSelectedCity(e.target.value); setSelectedRegion(''); }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none"
                      >
                        <option value="">Select City...</option>
                        {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                      </select>
                      <MapSelector 
                        regions={availableRegions} 
                        selectedRegion={selectedRegion} 
                        onSelect={setSelectedRegion} 
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    <button 
                      disabled={!isLocationSet}
                      onClick={() => setStep('DELIVERY')}
                      className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all ${isLocationSet ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                    >
                      Confirm Location
                    </button>
                    
                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-slate-100"></div>
                      <span className="flex-shrink mx-4 text-xs font-bold text-slate-300 uppercase tracking-widest">or</span>
                      <div className="flex-grow border-t border-slate-100"></div>
                    </div>

                    <button 
                      onClick={handleGpsDetect}
                      disabled={gpsLoading}
                      className="w-full py-4 border-2 border-slate-100 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
                    >
                      {gpsLoading ? (
                         <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" x2="12" y1="2" y2="22"/><line x1="2" x2="22" y1="12" y2="12"/></svg>
                      )}
                      Use GPS to detect location (optional)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: DELIVERY */}
            {step === 'DELIVERY' && (
              <div className="p-8 md:p-12 text-center animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17h4V5H2v12h3m0 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0m10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0m3-2h3l2-5h-5z"/></svg>
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Do you need delivery?</h2>
                <p className="text-slate-500 mb-12 max-w-sm mx-auto">SakhiMap volunteers offer discreet home delivery for those who cannot travel. We use the address you provided in the previous step.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => { setNeedsDelivery(true); setStep('RESULTS'); }}
                    className="py-6 rounded-3xl bg-white border-2 border-indigo-100 hover:border-indigo-600 hover:bg-indigo-50 text-indigo-600 font-black text-xl transition-all shadow-sm"
                  >
                    Yes, I need delivery
                  </button>
                  <button 
                    onClick={() => { setNeedsDelivery(false); setStep('RESULTS'); }}
                    className="py-6 rounded-3xl bg-white border-2 border-slate-100 hover:border-slate-400 text-slate-600 font-black text-xl transition-all shadow-sm"
                  >
                    No, I'll pick it up
                  </button>
                </div>
                
                <button 
                  onClick={() => setStep('LOCATION')}
                  className="mt-12 text-slate-400 font-bold hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  Go back to location
                </button>
              </div>
            )}

            {/* STEP 3: RESULTS */}
            {step === 'RESULTS' && (
              <div className="p-0 animate-in fade-in duration-700">
                <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-1">Showing Resources for</h3>
                    <p className="font-bold text-slate-800">
                      {searchMode === 'city' && (selectedCity || (manualAddress.length > 20 ? manualAddress.slice(0, 20) + '...' : manualAddress))}
                      {searchMode === 'pincode' && `Pincode ${pincodeQuery}`}
                      {searchMode === 'map' && `${selectedRegion}, ${selectedCity}`}
                      {needsDelivery && <span className="ml-2 text-emerald-600 text-xs bg-emerald-100 px-2 py-0.5 rounded-full uppercase">Delivery Enabled</span>}
                    </p>
                  </div>
                  <button 
                    onClick={() => { setStep('LOCATION'); setNeedsDelivery(null); }}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-white hover:border-indigo-300 transition-all"
                  >
                    Change
                  </button>
                </div>

                <div className="p-8">
                  <div className="flex flex-wrap gap-2 mb-8">
                    {(['ALL', ResourceType.GOVERNMENT, ResourceType.NGO] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-6 py-3 rounded-xl border text-xs font-bold transition-all ${
                          filterType === type 
                            ? 'bg-slate-900 border-slate-900 text-white' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                        }`}
                      >
                        {type === 'ALL' ? 'All Providers' : type}
                      </button>
                    ))}
                  </div>

                  {needsDelivery && (
                    <div className="mb-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-sm text-indigo-700 font-medium flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17h4V5H2v12h3m0 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0m10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0m3-2h3l2-5h-5z"/></svg>
                      Volunteer delivery is prioritized. Please contact the NGO directly via the listing to confirm your slot.
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredResources.length > 0 ? (
                      filteredResources.map(resource => (
                        <ResourceCard key={resource.id} resource={resource} />
                      ))
                    ) : (
                      <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">No locations found</h3>
                        <p className="text-slate-500">Try changing your location or clearing filters.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-12">
            <PrivacyNotice />
          </div>
        </div>
      </div>

      <section className="bg-slate-100 py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              A Safe Space for Menstrual Hygiene.
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md shrink-0 text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg mb-1">Encrypted Browsing</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">All information is served via HTTPS and we do not use trackers that can build a profile of your health needs.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md shrink-0 text-emerald-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg mb-1">Manually Verified</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">Our team of volunteers verifies every NGO and government location weekly to ensure stock and eligibility accuracy.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-200">
            <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Help Others Get Dignity</h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Our <span className="text-indigo-600 font-bold">Volunteer Delivery Network</span> is powered by people like you. Join us to deliver sanitary pads across Mumbai and Navi Mumbai.
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => setView('volunteer')}
                className="w-full flex items-center justify-between p-5 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
              >
                <span>Sign Up to Deliver</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
              <button 
                onClick={() => setView('about')}
                className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 font-bold hover:bg-white hover:border-indigo-300 transition-all"
              >
                <span>Our Privacy Ethics</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-2xl">S</div>
                <span className="text-2xl font-black tracking-tight text-white">SakhiMap</span>
              </div>
              <p className="text-lg max-w-sm leading-relaxed mb-6">
                Building India's largest verified portal for menstrual hygiene resources. Private by default.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Resources</h4>
              <ul className="space-y-4 text-sm">
                <li><button onClick={() => setView('volunteer')} className="hover:text-indigo-400 transition-colors">Partner with us</button></li>
                <li><button onClick={() => setView('volunteer')} className="hover:text-indigo-400 transition-colors">NGO Directory</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Privacy</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">No-Cookie Policy</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Safety Tips</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-xs">
            <p>&copy; 2024 SakhiMap. All verified data is current as of June 2024. Use responsibly.</p>
          </div>
        </div>
      </footer>
    </div>
  );

  const renderAbout = () => (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <button onClick={() => setView('home')} className="mb-10 text-indigo-600 font-black flex items-center gap-2 hover:gap-3 transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back to Portal
      </button>
      <h1 className="text-5xl font-black mb-10 tracking-tight text-slate-900 leading-tight">Digital Privacy as a Human Right.</h1>
      <div className="prose prose-slate prose-lg text-slate-600 space-y-8">
        <p className="text-xl text-slate-800 font-medium leading-relaxed">
          At SakhiMap, we believe that accessing menstrual health resources shouldn't come at the cost of your digital privacy.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
             <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black mb-4">1</div>
             <h4 className="font-bold text-slate-900 mb-2">No Tracking</h4>
             <p className="text-sm text-slate-500">We don't use cookies or analytics that can deanonymize your health-seeking behavior.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
             <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black mb-4">2</div>
             <h4 className="font-bold text-slate-900 mb-2">Zero Logins</h4>
             <p className="text-sm text-slate-500">You will never be asked to create an account or provide a phone number to use this service.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVolunteer = () => (
    <div className="max-w-4xl mx-auto px-4 py-20">
       <button onClick={() => setView('home')} className="mb-10 text-indigo-600 font-black flex items-center gap-2 hover:gap-3 transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back to Portal
      </button>

      <div className="bg-indigo-900 rounded-[3rem] p-12 text-white mb-12 shadow-2xl overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>
         <h1 className="text-5xl font-black mb-6 tracking-tight relative z-10">Deliver Dignity. <br/><span className="text-indigo-300">Volunteer Today.</span></h1>
         <p className="text-xl text-indigo-100 max-w-2xl mb-8 leading-relaxed font-light relative z-10">
           Many women in Mumbai lack access to sanitary products due to travel constraints or social stigma. As a SakhiMap volunteer, you help bridge the gap by delivering pads directly to those in need.
         </p>
         <div className="flex gap-4 relative z-10">
           <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
             <div className="text-3xl font-black text-indigo-300">1 in 5</div>
             <div className="text-xs uppercase tracking-widest font-bold">Lack access in India</div>
           </div>
           <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
             <div className="text-3xl font-black text-indigo-300">100%</div>
             <div className="text-xs uppercase tracking-widest font-bold">Volunteer Driven</div>
           </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">How You Can Help</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17h4V5H2v12h3m0 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0m10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0m3-2h3l2-5h-5z"/></svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Last-Mile Delivery</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Pick up supplies from NGOs or Gov centers and deliver them to designated community drop-off points or private addresses.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Awareness Campaigning</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Help us identify new areas in Mumbai and Navi Mumbai that need support and spread the word about the portal.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Verification Ally</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Regularly visit listed points to ensure they have stock and are adhering to free/subsidized distribution rules.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl">
           <h3 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">Volunteer Registration</h3>
           <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-500/10" placeholder="e.g. Anjali Sharma" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Area for Delivery</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-500/10">
                  <option>Mumbai South</option>
                  <option>Mumbai Central</option>
                  <option>Navi Mumbai</option>
                  <option>Western Suburbs</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Mobile (For internal use only)</label>
                <input type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-500/10" placeholder="+91 XXXX-XXXXXX" />
              </div>
              <div className="pt-4">
                 <button 
                  onClick={() => alert("Thank you for your interest! As a privacy-first platform, we've simulated this signup. In production, we'd use zero-knowledge proofs to verify your identity without storing PII.")}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all"
                 >
                   Register as Volunteer
                 </button>
                 <p className="text-[10px] text-slate-400 mt-4 text-center leading-relaxed">By clicking register, you agree to our privacy ethics and pledge to maintain the dignity of all recipients.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <Header />
      <main>
        {view === 'home' && renderHome()}
        {view === 'about' && renderAbout()}
        {view === 'volunteer' && renderVolunteer()}
      </main>
    </div>
  );
};

export default App;
