import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, ChevronRight, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export default function BookmarksPage() {
  const { theme, bookmarks, removeBookmark, clearBookmarks, setSelectedCountry } = useStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleOpenCountry = (country: any, iso3: string) => {
    setSelectedCountry(country);
    navigate(`/country/${iso3}`);
  };

  const Card = ({ country }: any) => {
    const props = country.properties;
    const name = props.NAME || 'Unknown';
    const iso2 = props.ISO_A2 !== '-99' ? props.ISO_A2 : 'UN';
    const iso3 = props.ISO_A3 !== '-99' ? props.ISO_A3 : encodeURIComponent(name);
    const continent = props.CONTINENT || 'Unknown';
    const flagUrl = iso2 !== 'UN' ? `https://flagcdn.com/w160/${iso2.toLowerCase()}.png` : null;

    return (
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`p-4 md:p-5 rounded-2xl flex items-center justify-between gap-3 group ${isDark ? 'glass-panel hover:bg-white/10' : 'glass-panel-light hover:bg-black/5'} transition-colors cursor-pointer overflow-hidden`}
        onClick={() => handleOpenCountry(country, iso3)}
      >
        <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
          {flagUrl ? (
            <div className="w-10 h-7 md:w-12 md:h-8 rounded shrink-0 overflow-hidden shadow-sm border border-black/10">
              <img src={flagUrl} alt={`${name} flag`} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className={`w-10 h-7 md:w-12 md:h-8 rounded shrink-0 flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-black/5'}`}>
               <span className="text-[10px] md:text-xs font-mono">{iso3}</span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-base md:text-lg font-semibold leading-tight truncate">{name}</h3>
            <p className={`text-[10px] md:text-xs font-sans uppercase tracking-wider truncate mt-0.5 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>{continent}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              removeBookmark(iso3);
            }}
            className={`p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 ${
              isDark ? 'hover:bg-white/10 text-white/50 hover:text-white' : 'hover:bg-black/10 text-gray-400 hover:text-black'
            }`}
          >
            <X size={16} />
          </button>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-sapphire-neon/20 text-sapphire-neon' : 'bg-day-accent/10 text-day-accent'}`}>
            <ChevronRight size={16} />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full h-[100dvh] overflow-y-auto px-6 pt-20 pb-12 md:p-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className={`inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full text-xs font-sans uppercase tracking-widest font-bold ${isDark ? 'bg-sapphire-neon/20 text-sapphire-neon' : 'bg-day-accent/20 text-day-accent'}`}>
              <Bookmark size={14} className={isDark ? 'fill-sapphire-neon' : 'fill-day-accent'} /> 
              Your Collection
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Bookmarks</h1>
          </div>
          
          {bookmarks.length > 0 && (
            <button 
              onClick={() => setShowConfirm(true)}
              className={`px-4 py-2 rounded-lg font-sans text-sm font-semibold transition-colors ${
                isDark ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
            >
              Clear All Bookmarks
            </button>
          )}
        </div>

        {bookmarks.length === 0 ? (
          <div className={`p-12 rounded-3xl flex flex-col items-center justify-center text-center ${isDark ? 'border border-white/10 bg-white/5' : 'border border-black/5 bg-black/5'}`}>
             <Bookmark size={48} className={`mb-4 opacity-20 ${isDark ? 'text-white' : 'text-black'}`} />
             <h2 className="text-xl font-serif font-semibold mb-2">No bookmarks yet</h2>
             <p className={`font-sans max-w-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
               Explore the globe and bookmark countries to build your personal atlas collection.
             </p>
             <button 
               onClick={() => navigate('/')}
               className={`mt-6 px-6 py-3 rounded-xl font-sans text-sm font-semibold transition-all ${
                 isDark ? 'bg-sapphire-neon text-white hover:bg-blue-600' : 'bg-day-accent text-white hover:bg-sky-600'
               }`}
             >
               Go to Explorer
             </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {bookmarks.map((country) => (
                <Card key={country.properties.ISO_A3} country={country} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Confirmation Modal */}
      {createPortal(
        <AnimatePresence>
          {showConfirm && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => setShowConfirm(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={`relative z-10 w-full max-w-sm rounded-3xl p-6 shadow-2xl ${isDark ? 'bg-[#0B132B] border border-white/10 text-white' : 'bg-white border border-black/10 text-gray-900'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-red-500/20 text-red-500' : 'bg-red-100 text-red-600'}`}>
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2">Delete all bookmarks?</h3>
                <p className={`text-sm font-sans mb-6 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                  This action cannot be undone. All your saved countries will be removed from your collection.
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowConfirm(false)}
                    className={`flex-1 py-2.5 rounded-xl font-sans text-sm font-semibold transition-colors ${
                      isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      clearBookmarks();
                      setShowConfirm(false);
                    }}
                    className="flex-1 py-2.5 rounded-xl font-sans text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors"
                  >
                    Delete All
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
