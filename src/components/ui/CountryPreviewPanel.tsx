import { motion } from 'motion/react';
import { useStore } from '../../store/useStore';
import { X, ChevronRight, Users, MapPin, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CountryPreviewPanelProps {
  country: any;
  key?: string;
}

export default function CountryPreviewPanel({ country }: CountryPreviewPanelProps) {
  const { theme, setSelectedCountry, bookmarks, addBookmark, removeBookmark, setCompareCountryA, setCompareCountryB } = useStore();
  const navigate = useNavigate();

  if (!country) return null;

  const isDark = theme === 'dark';
  
  // Extract GeoJSON properties. Using ISO_A2 or ISO_A3 for flag
  const name = country.properties?.NAME || 'Unknown';
  const iso2 = country.properties?.ISO_A2 !== '-99' ? country.properties?.ISO_A2 : 'UN';
  const iso3 = country.properties?.ISO_A3 !== '-99' ? country.properties?.ISO_A3 : encodeURIComponent(name);
  const continent = country.properties?.CONTINENT || 'Unknown';
  const popEst = country.properties?.POP_EST || 0;
  
  const formattedPop = new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(popEst);

  const flagUrl = iso2 && iso2 !== 'UN' ? `https://flagcdn.com/w320/${iso2.toLowerCase()}.png` : null;

  const isBookmarked = !!bookmarks.find(b => (b.properties.ISO_A3 !== '-99' ? b.properties.ISO_A3 : encodeURIComponent(b.properties.NAME)) === iso3);

  const toggleBookmark = () => {
    if (isBookmarked) {
      removeBookmark(iso3);
    } else {
      addBookmark(country);
    }
  };

  const handleCompare = () => {
    setCompareCountryA(country);
    setCompareCountryB(null);
    navigate('/compare');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, x: 20 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className={`absolute top-6 right-6 md:top-8 md:right-8 w-[calc(100%-3rem)] md:w-80 rounded-2xl p-5 pointer-events-auto ${
        isDark ? 'glass-panel text-white border-white/20' : 'glass-panel-light text-gray-900 border-black/10'
      }`}
    >
      <div className="absolute top-3 right-3 flex gap-2">
        <button 
          onClick={toggleBookmark}
          className={`p-2 rounded-full transition-colors ${
            isBookmarked 
              ? (isDark ? 'bg-sapphire-neon/20 text-sapphire-neon' : 'bg-day-accent/20 text-day-accent')
              : (isDark ? 'hover:bg-white/10 text-white/50 hover:text-white' : 'hover:bg-black/5 text-gray-500 hover:text-black')
          }`}
        >
          <Bookmark className={(isBookmarked && !isDark) ? 'fill-day-accent text-day-accent' : (isBookmarked && isDark ? 'fill-sapphire-neon text-sapphire-neon' : '')} size={16} />
        </button>
        <button 
          onClick={() => setSelectedCountry(null)}
          className={`p-2 rounded-full transition-colors ${
            isDark ? 'hover:bg-white/10' : 'hover:bg-black/5 hover:text-black text-gray-500'
          }`}
        >
          <X size={16} />
        </button>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-4 mt-2">
        {flagUrl ? (
          <div className="w-12 h-8 rounded shrink-0 overflow-hidden shadow-sm border border-white/10 relative">
            <img src={flagUrl} alt={`${name} flag`} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className={`w-12 h-8 rounded shrink-0 flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-black/5'}`}>
            <span className="text-xs font-mono">{iso3}</span>
          </div>
        )}
        <div className="pr-6">
          <h2 className="font-serif text-2xl font-semibold leading-tight mb-1">{name}</h2>
          <p className={`text-xs font-sans uppercase tracking-wider ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
            {continent}
          </p>
        </div>
      </div>

      {/* Stats/Facts */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className={`p-3 rounded-xl flex flex-col ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
          <div className={`flex items-center gap-1.5 mb-1 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
            <Users size={12} />
            <span className="text-[10px] font-sans uppercase tracking-wider font-semibold">Population</span>
          </div>
          <span className="font-mono text-sm">{formattedPop}</span>
        </div>
        <div className={`p-3 rounded-xl flex flex-col ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
          <div className={`flex items-center gap-1.5 mb-1 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
            <MapPin size={12} />
            <span className="text-[10px] font-sans uppercase tracking-wider font-semibold">Code</span>
          </div>
          <span className="font-mono text-sm">{iso3 || iso2}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => navigate(`/country/${iso3}`)}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-sans text-sm font-semibold transition-all ${
            isDark 
              ? 'bg-sapphire-neon/20 text-sapphire-neon hover:bg-sapphire-neon/30 border border-sapphire-neon/50' 
              : 'bg-day-accent text-white hover:bg-sky-600 shadow-md hover:shadow-lg'
          }`}
        >
          <span>Explore Deep Dive</span>
          <ChevronRight size={16} />
        </button>
        <button 
          onClick={handleCompare}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-sans text-sm font-semibold transition-all ${
            isDark 
              ? 'bg-white/5 text-white hover:bg-white/10' 
              : 'bg-black/5 text-gray-900 hover:bg-black/10'
          }`}
        >
          <span>Compare</span>
        </button>
      </div>
    </motion.div>
  );
}
