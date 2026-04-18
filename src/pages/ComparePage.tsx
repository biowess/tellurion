import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowLeft, Search, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function CountryColumn({ country, isDark }: { country: any; isDark: boolean }) {
  if (!country) return null;
  const props = country.properties;
  const name = props.NAME;
  const iso2 = props.ISO_A2 !== '-99' ? props.ISO_A2 : 'UN';
  const flagUrl = iso2 !== 'UN' ? `https://flagcdn.com/w640/${iso2.toLowerCase()}.png` : null;
  
  const pop = new Intl.NumberFormat('en-US').format(props.POP_EST);
  const gdp = props.GDP_MD_EST ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(props.GDP_MD_EST * 1000000) : 'Unknown';

  return (
    <div className="flex flex-col space-y-8 pb-12">
      {/* Identity Header */}
      <div className={`relative w-full h-64 md:h-80 flex flex-col justify-end rounded-3xl overflow-hidden ${isDark ? 'border border-white/10' : 'border border-black/5 shadow-md'}`}>
        <div className={`absolute inset-0 z-0 ${isDark ? 'bg-gradient-to-t from-sapphire to-sapphire/80' : 'bg-gradient-to-t from-white via-white/80 to-white/50'}`}></div>
        
        {flagUrl && (
          <div className="absolute inset-0 z-0 opacity-20 blur-md pointer-events-none" style={{ backgroundImage: `url(${flagUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        )}

        <div className="relative z-10 w-full p-6 md:p-8 flex items-end gap-6">
          {flagUrl && (
            <div className={`w-24 md:w-32 aspect-[3/2] rounded-lg overflow-hidden shadow-xl shrink-0 border ${isDark ? 'border-white/20' : 'border-black/10'}`}>
              <img src={flagUrl} alt={`${name} flag`} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className={`font-sans tracking-[0.2em] text-xs md:text-sm uppercase font-semibold mb-2 ${isDark ? 'text-sapphire-neon' : 'text-day-accent'}`}>
              {props.CONTINENT}
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold leading-none tracking-tight break-words">
              {name}
            </h2>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-5 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/5'}`}>
          <span className={`block text-[10px] font-sans uppercase tracking-wider mb-2 font-semibold ${isDark ? 'text-sapphire-neon' : 'text-day-accent'}`}>Population</span>
          <span className="font-mono text-xl">{pop}</span>
        </div>
        <div className={`p-5 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/5'}`}>
          <span className={`block text-[10px] font-sans uppercase tracking-wider mb-2 font-semibold ${isDark ? 'text-sapphire-neon' : 'text-day-accent'}`}>Est. GDP</span>
          <span className="font-mono text-xl">{gdp}</span>
        </div>
        <div className={`p-5 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/5'}`}>
          <span className={`block text-[10px] font-sans uppercase tracking-wider mb-2 font-semibold ${isDark ? 'text-sapphire-neon' : 'text-day-accent'}`}>Region</span>
          <span className="font-serif text-lg leading-tight">{props.SUBREGION}</span>
        </div>
        <div className={`p-5 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/5'}`}>
          <span className={`block text-[10px] font-sans uppercase tracking-wider mb-2 font-semibold ${isDark ? 'text-sapphire-neon' : 'text-day-accent'}`}>Economy</span>
          <span className="font-serif text-[15px] leading-tight">{props.ECONOMY}</span>
        </div>
      </div>

      {/* Overview */}
      <section className={`p-6 md:p-8 rounded-3xl ${isDark ? 'glass-panel border-white/10' : 'glass-panel-light border-black/10'}`}>
        <h3 className="text-2xl font-serif mb-4 flex items-center gap-3">
          <Info size={20} className={isDark ? 'text-sapphire-neon' : 'text-day-accent'} />
          Overview
        </h3>
        <div className={`font-serif text-base leading-relaxed space-y-4 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
          <p>
            {name}, situated in {props.SUBREGION}, represents a unique confluence of geography within {props.CONTINENT}. 
            The nation holds a population of approximately {pop} individuals.
          </p>
          <p>
            Its economy reflects the diverse activities and resources available within its borders. 
            The integration of {name} into broader regional dynamics plays a crucial role in international affairs.
          </p>
        </div>
      </section>
    </div>
  );
}

export default function ComparePage() {
  const navigate = useNavigate();
  const { theme, setGlobeLocked, compareCountryA, compareCountryB, setCompareCountryB, countries } = useStore();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');

  // Immediately redirect if no Country A acts as base
  useEffect(() => {
    if (!compareCountryA) {
      navigate('/');
    }
    setGlobeLocked(true);
    return () => setGlobeLocked(false);
  }, [compareCountryA, navigate, setGlobeLocked]);

  // Autocomplete matching
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !countries.length) return [];
    const lowerQuery = searchQuery.toLowerCase().trim();
    return countries.filter(c => 
      c.properties.NAME?.toLowerCase().includes(lowerQuery) ||
      c.properties.ISO_A3?.toLowerCase().includes(lowerQuery) ||
      c.properties.ISO_A2?.toLowerCase() === lowerQuery
    ).slice(0, 5); // top 5 matches
  }, [searchQuery, countries]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchResults.length > 0) {
      setCompareCountryB(searchResults[0]);
      setSearchQuery('');
      setActiveTab('B');
    }
  };

  const handleSelectResult = (country: any) => {
    setCompareCountryB(country);
    setSearchQuery('');
    setActiveTab('B');
  };

  if (!compareCountryA) return null;

  return (
    <div className={`w-full h-full overflow-y-auto overflow-x-hidden relative z-10 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      
      {/* Header Area */}
      <div className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b px-6 pt-20 pb-4 xl:py-4 xl:px-8 flex items-center justify-between ${
        isDark ? 'bg-sapphire/80 border-white/10' : 'bg-day-sky/80 border-black/10'
      }`}>
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className={`p-2 rounded-full transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-white shadow-sm border border-black/5 hover:bg-gray-50'}`}
          >
            <ArrowLeft size={18} />
          </motion.button>
          <h1 className="font-serif text-xl md:text-2xl font-bold">Compare Mode</h1>
        </div>
        
        {/* Mobile Tab Switcher */}
        {compareCountryB && (
          <div className="md:hidden flex bg-black/10 rounded-lg p-1">
            <button 
              onClick={() => setActiveTab('A')}
              className={`px-4 py-1.5 rounded-md font-sans text-sm font-medium transition-all ${
                activeTab === 'A' ? (isDark ? 'bg-white/20 text-white shadow' : 'bg-white text-day-accent shadow-sm') : 'text-white/60 opacity-70'
              }`}
            >
              {compareCountryA.properties.ISO_A3 !== '-99' ? compareCountryA.properties.ISO_A3 : 'Left'}
            </button>
            <button 
              onClick={() => setActiveTab('B')}
              className={`px-4 py-1.5 rounded-md font-sans text-sm font-medium transition-all ${
                activeTab === 'B' ? (isDark ? 'bg-white/20 text-white shadow' : 'bg-white text-day-accent shadow-sm') : 'text-white/60 opacity-70'
              }`}
            >
              {compareCountryB.properties.ISO_A3 !== '-99' ? compareCountryB.properties.ISO_A3 : 'Right'}
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-[1400px] mx-auto p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative w-full">
          
          {/* COLUMN A (Hidden on mobile if Tab B is active or if selecting B) */}
          <div className={`w-full ${!compareCountryB ? 'hidden md:block' : activeTab === 'A' ? 'block' : 'hidden md:block'}`}>
            <CountryColumn country={compareCountryA} isDark={isDark} />
          </div>

          {/* COLUMN B (Hidden on mobile if Tab A is active, but always visible if selecting B) */}
          <div className={`w-full ${!compareCountryB ? 'block' : activeTab === 'B' ? 'block' : 'hidden md:block'}`}>
            {!compareCountryB ? (
              <div className="flex flex-col items-center justify-center mt-12 md:mt-32">
                <div className={`w-full max-w-md p-8 rounded-3xl ${isDark ? 'glass-panel border-white/10' : 'glass-panel-light border-black/10'} text-center shadow-xl`}>
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 shadow-lg ${isDark ? 'bg-sapphire-neon/20 text-sapphire-neon' : 'bg-day-accent/10 text-day-accent'}`}>
                    <Search size={28} />
                  </div>
                  <h2 className="text-2xl font-serif font-bold mb-3">Select Target</h2>
                  <p className={`font-sans text-sm mb-8 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                    Search for a country to compare against {compareCountryA.properties.NAME}.
                  </p>
                  
                  <form onSubmit={handleSearchSubmit} className={`relative flex items-center w-full rounded-xl border transition-colors ${
                    isDark ? 'border-white/20 bg-black/40 focus-within:border-sapphire-neon/80' : 'border-black/10 bg-white focus-within:border-day-accent'
                  }`}>
                    <Search size={18} className={`absolute left-4 ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
                    <input 
                      type="text"
                      placeholder="Type a country name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full bg-transparent py-4 pl-12 pr-4 outline-none font-sans text-base ${
                        isDark ? 'text-white placeholder:text-white/30' : 'text-gray-900 placeholder:text-gray-500'
                      }`}
                    />
                  </form>

                  <AnimatePresence>
                    {searchResults.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`absolute mt-2 w-[calc(100%-4rem)] max-w-md z-50 rounded-xl overflow-hidden shadow-2xl border ${
                          isDark ? 'glass-panel border-white/20 bg-[#0a1128]/95' : 'bg-white border-black/10'
                        }`}
                      >
                        {searchResults.map((res: any) => (
                          <button
                            key={res.properties.ISO_A3}
                            onClick={() => handleSelectResult(res)}
                            className={`w-full text-left px-5 py-4 font-sans border-b transition-colors flex justify-between items-center ${
                              isDark ? 'border-white/5 hover:bg-white/10' : 'border-black/5 hover:bg-gray-50'
                            }`}
                          >
                            <span className="font-semibold">{res.properties.NAME}</span>
                            <span className={`text-xs font-mono uppercase opacity-50`}>{res.properties.ISO_A3 !== '-99' ? res.properties.ISO_A3 : ''}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setCompareCountryB(null)}
                  className={`relative md:absolute w-fit mb-6 md:mb-0 md:-top-4 md:right-0 z-20 flex items-center gap-2 px-4 py-2 rounded-full font-sans text-sm font-semibold transition-all ${
                    isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-gray-900'
                  }`}
                >
                  <Search size={14} /> Change Country
                </button>
                <CountryColumn country={compareCountryB} isDark={isDark} />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
