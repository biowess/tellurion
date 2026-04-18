import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useEffect, useState } from 'react';
import { ArrowLeft, Map as MapIcon, Globe, Info, Loader2, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';

// For editorial content, we'll augment the basic properties with mock editorial text
// Since we don't have a 195-country editorial database, we'll generate smart paragraphs based on the geometry props.

export default function CountryPage() {
  const { iso } = useParams<{ iso: string }>();
  const navigate = useNavigate();
  const { theme, setGlobeLocked, bookmarks, addBookmark, removeBookmark } = useStore();
  const [country, setCountry] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const isDark = theme === 'dark';

  useEffect(() => {
    setLoading(true);
    // Fetch the GeoJSON to get this country's data
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => {
        const decodedIso = decodeURIComponent(iso || '');
        const found = data.features.find((f: any) => 
          f.properties.ISO_A3 === decodedIso || 
          f.properties.NAME === decodedIso || 
          f.properties.NAME_LONG === decodedIso
        );
        setCountry(found);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [iso]);

  useEffect(() => {
    setGlobeLocked(true);
    return () => setGlobeLocked(false);
  }, [setGlobeLocked]);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Loader2 className={`animate-spin ${isDark ? 'text-sapphire-neon' : 'text-day-accent'} w-10 h-10 mb-4`} />
        <p className={`font-sans tracking-widest uppercase text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Loading Atlas Data...</p>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif mb-4">Country Not Found</h2>
        <button onClick={() => navigate('/')} className={`px-4 py-2 ${isDark ? 'bg-sapphire-neon' : 'bg-day-accent'} text-white rounded-lg font-sans`}>
          Return to Globe
        </button>
      </div>
    );
  }

  const props = country.properties;
  const name = props.NAME;
  const iso2 = props.ISO_A2 !== '-99' ? props.ISO_A2 : 'UN';
  const iso3 = props.ISO_A3 !== '-99' ? props.ISO_A3 : encodeURIComponent(name);
  const flagUrl = iso2 !== 'UN' ? `https://flagcdn.com/w640/${iso2.toLowerCase()}.png` : null;
  
  const pop = new Intl.NumberFormat('en-US').format(props.POP_EST);
  const gdp = props.GDP_MD_EST ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(props.GDP_MD_EST * 1000000) : 'Unknown';

  const isBookmarked = !!bookmarks.find(b => (b.properties.ISO_A3 !== '-99' ? b.properties.ISO_A3 : encodeURIComponent(b.properties.NAME)) === iso3);

  const toggleBookmark = () => {
    if (isBookmarked) {
      removeBookmark(iso3);
    } else {
      addBookmark(country);
    }
  };

  return (
    <div className={`w-full h-full overflow-y-auto overflow-x-hidden relative z-10 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {/* Editorial Header */}
      <div className="relative w-full h-[40vh] md:h-[50vh] flex flex-col justify-end">
        {/* Background ambient gradient */}
        <div className={`absolute inset-0 z-0 ${isDark ? 'bg-gradient-to-t from-sapphire to-transparent' : 'bg-gradient-to-t from-transparent via-white/50 to-white'}`}></div>
        
        {flagUrl && isDark && (
           <div className="absolute inset-0 z-0 opacity-10 blur-xl pointer-events-none" style={{ backgroundImage: `url(${flagUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        )}

        <div className="relative z-10 w-full h-full max-w-5xl mx-auto px-6 md:px-8 pt-20 pb-8 flex flex-col justify-between">
          <div className="flex justify-between items-start w-full gap-4">
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/')}
              className={`shrink-0 p-3 rounded-full transition-colors ${
                isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-white shadow-md border border-black/5 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft size={20} />
            </motion.button>

            <motion.button 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              onClick={toggleBookmark}
              className={`shrink-0 p-3 rounded-full transition-colors ${
                isBookmarked 
                  ? (isDark ? 'bg-sapphire-neon/20 text-sapphire-neon border border-sapphire-neon/50' : 'bg-day-accent text-white shadow-md')
                  : (isDark ? 'bg-white/10 hover:bg-white/20 text-white/70' : 'bg-white shadow-md border border-black/5 text-gray-500 hover:text-gray-900')
              }`}
            >
              <Bookmark className={(isBookmarked && !isDark) ? 'fill-white text-white' : (isBookmarked && isDark ? 'fill-sapphire-neon text-sapphire-neon' : '')} size={20} />
            </motion.button>
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-6 w-full mt-auto">
            <div className="flex-1 min-w-0">
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`font-sans tracking-[0.2em] text-sm uppercase font-semibold mb-3 ${isDark ? 'text-sapphire-neon' : 'text-day-accent'}`}
              >
                {props.CONTINENT} • {props.SUBREGION}
              </motion.p>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-7xl font-serif font-bold leading-none tracking-tight break-words"
              >
                {name}
              </motion.h1>
            </div>
            
            {flagUrl && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className={`w-32 md:w-48 aspect-[3/2] rounded-lg overflow-hidden shadow-2xl border shrink-0 ${isDark ? 'border-white/10' : 'border-black/10'}`}
              >
                <img src={flagUrl} alt={`${name} flag`} className="w-full h-full object-cover" />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="w-full max-w-5xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left Column: Editorial Text */}
        <div className="md:col-span-8 space-y-8">
          <section>
            <h2 className="text-3xl font-serif mb-6 flex items-center gap-3">
              <Info size={24} className={isDark ? 'text-sapphire-neon' : 'text-day-accent'} />
              Overview
            </h2>
            <div className={`prose prose-lg max-w-none font-serif leading-relaxed ${isDark ? 'prose-invert prose-p:text-white/80' : 'prose-p:text-gray-700'}`}>
              <p>
                {name}, situated in the heart of {props.SUBREGION}, represents a unique confluence of geography and history within {props.CONTINENT}. 
                Spanning a dynamic landscape, the nation holds a population of approximately {pop} individuals, contributing to a vibrant demographic mosaic.
              </p>
              <p>
                {name} is recognized globally under its ISO designation {iso}. Its economy, with an estimated GDP of {gdp}, reflects the diverse activities and resources available within its borders. The integration of {name} into the broader regional dynamics of {props.CONTINENT} plays a crucial role in international affairs and cultural exchange.
              </p>
              <p>
                From an ecological and geographical standpoint, {name} offers distinct topographical characteristics that define its climate and natural reserves. 
                The governance and infrastructure have continually evolved to support its population centers, navigating the challenges and opportunities presented by its specific global positioning.
              </p>
            </div>
          </section>

          <section className={`p-8 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white/60 border border-black/5 shadow-sm'}`}>
            <h3 className="text-xl font-sans font-medium mb-4">Geographic Attributes</h3>
            <p className={`font-serif text-lg leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
              The territorial delineation of {name} encompasses varied terrains that dictate both the lifestyle of its inhabitants and the flora and fauna that thrive there. 
              As part of {props.CONTINENT}, it shares broader climatic trends while possessing localized micro-climates shaped by elevation, proximity to bodies of water, and latitudinal placement.
            </p>
          </section>
        </div>

        {/* Right Column: Quick Facts Bento */}
        <div className="md:col-span-4 space-y-4">
          <div className={`p-6 rounded-2xl ${isDark ? 'glass-panel' : 'glass-panel-light'}`}>
            <h3 className="font-sans font-bold uppercase tracking-widest text-xs mb-6 opacity-60">At a Glance</h3>
            
            <div className="space-y-6">
              <div>
                <span className={`block text-xs font-sans uppercase tracking-wider mb-1 ${isDark ? 'text-sapphire-neon' : 'text-day-accent'}`}>Population</span>
                <span className="font-mono text-xl">{pop}</span>
              </div>
              
              <div className={`h-px w-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`}></div>
              
              <div>
                <span className={`block text-xs font-sans uppercase tracking-wider mb-1 ${isDark ? 'text-sapphire-neon' : 'text-day-accent'}`}>Est. GDP</span>
                <span className="font-mono text-xl">{gdp}</span>
              </div>
              
              <div className={`h-px w-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`}></div>

              <div>
                <span className={`block text-xs font-sans uppercase tracking-wider mb-1 ${isDark ? 'text-sapphire-neon' : 'text-day-accent'}`}>Region</span>
                <span className="font-serif text-xl">{props.SUBREGION}</span>
              </div>
              
              <div className={`h-px w-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`}></div>

              <div>
                <span className={`block text-xs font-sans uppercase tracking-wider mb-1 ${isDark ? 'text-sapphire-neon' : 'text-day-accent'}`}>Economy Type</span>
                <span className="font-serif text-xl">{props.ECONOMY}</span>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl flex flex-col items-center text-center ${isDark ? 'bg-sapphire-neon/10 border border-sapphire-neon/20' : 'bg-day-accent/10 border border-day-accent/20'}`}>
            <Globe className={`mb-3 ${isDark ? 'text-sapphire-neon' : 'text-day-accent'}`} />
            <h4 className="font-sans font-medium mb-1">View on Globe</h4>
            <p className={`text-sm font-sans mb-4 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Locate {name} on the interactive 3D map.</p>
            <button 
              onClick={() => navigate('/')}
              className={`w-full py-2.5 rounded-lg font-sans text-sm transition-colors ${
                isDark ? 'bg-sapphire-neon text-white hover:bg-sapphire-neon/80' : 'bg-day-accent text-white hover:bg-sky-600'
              }`}
            >
              Show Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
