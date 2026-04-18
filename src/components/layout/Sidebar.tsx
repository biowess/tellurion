import { Globe, Search, Settings, Map as MapIcon, X, Bookmark, Book, Info } from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import React, { useState, useEffect } from 'react';

export default function Sidebar() {
  const { theme, searchQuery, setSearchQuery, selectedCountry, setSelectedCountry, countries } = useStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || !countries.length) return;

    const lowerQuery = searchQuery.toLowerCase().trim();
    
    // 1. Try exact match first (NAME or ISO codes)
    let match = countries.find(c => 
      c.properties.NAME?.toLowerCase() === lowerQuery || 
      c.properties.ISO_A3?.toLowerCase() === lowerQuery ||
      c.properties.ISO_A2?.toLowerCase() === lowerQuery
    );

    // 2. If no exact match, use first substring match
    if (!match) {
      match = countries.find(c => 
        c.properties.NAME?.toLowerCase().includes(lowerQuery) ||
        c.properties.ISO_A3?.toLowerCase().includes(lowerQuery)
      );
    }

    if (match) {
      setSelectedCountry(match);
      if (location.pathname !== '/') {
        navigate('/');
      }
      setIsMobileOpen(false); // Close sidebar for mobile selection
    }
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleClear = () => {
    setSearchQuery('');
    setSelectedCountry(null);
    navigate('/');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) => `
    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
    ${isActive 
      ? (theme === 'dark' ? 'bg-sapphire-neon/20 text-sapphire-neon shadow-[0_0_15px_rgba(58,134,255,0.3)] border border-sapphire-neon/30' : 'bg-day-accent text-white shadow-md')
      : (theme === 'dark' ? 'hover:bg-white/5 text-white/70 hover:text-white' : 'hover:bg-black/10 text-gray-700 hover:text-black')
    }
  `;

  const isCompareRoute = location.pathname.startsWith('/compare');
  const bpHide = isCompareRoute ? 'xl:hidden' : 'md:hidden';
  const bpPosition = isCompareRoute ? 'fixed xl:relative' : 'fixed md:relative';
  const bpFull = isCompareRoute ? '-translate-x-full xl:translate-x-0' : '-translate-x-full md:translate-x-0';

  return (
    <>
      {/* Mobile toggle */}
      <button 
        className={`${bpHide} fixed top-4 left-4 z-[999] p-2 rounded-full transition-all duration-300 shadow-lg ${
          theme === 'dark' 
            ? 'glass-panel border-white/20' 
            : 'bg-white/90 backdrop-blur-md border border-black/10 shadow-day-accent/10'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setIsMobileOpen(!isMobileOpen);
        }}
      >
        <Globe size={20} className={theme === 'dark' ? 'text-sapphire-neon' : 'text-day-accent'} />
      </button>

      <aside className={`
        ${bpPosition} z-[1000] h-full w-64 flex flex-col transition-transform duration-500 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : bpFull}
        ${theme === 'dark' ? 'glass-panel border-r border-white/5' : 'glass-panel-light border-r border-black/5'}
      `}>
        {/* Logo area */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${theme === 'dark' ? 'bg-sapphire-neon text-white shadow-sapphire-neon/50' : 'bg-day-accent text-white shadow-day-accent/50'}`}>
              <Globe size={18} />
            </div>
            <h1 className={`text-xl font-sans font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Tellurion</h1>
          </div>
        </div>

        {/* Search */}
        <div className="px-5 py-4">
          <form 
            onSubmit={handleSearchSubmit}
            className={`relative flex items-center w-full overflow-hidden rounded-lg border transition-colors ${theme === 'dark' ? 'border-white/10 bg-black/20 focus-within:border-sapphire-neon/50' : 'border-black/10 bg-white/50 focus-within:border-day-accent'}`}
          >
            <Search size={16} className={`absolute left-3 ${theme === 'dark' ? 'text-white/40' : 'text-gray-500'}`} />
            <input 
              type="text"
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
              className={`w-full bg-transparent py-2 pl-9 pr-16 text-sm outline-none font-sans ${theme === 'dark' ? 'text-white placeholder:text-white/30' : 'text-gray-900 placeholder:text-gray-500'}`}
            />
            <div className="absolute right-1 flex items-center gap-1">
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => setSearchQuery('')} 
                  className={`p-1.5 opacity-40 hover:opacity-100 transition-opacity ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                  <X size={14} />
                </button>
              )}
              <button 
                type="submit"
                className={`p-1.5 rounded-md transition-all ${
                  theme === 'dark' 
                    ? 'hover:bg-white/10 text-sapphire-neon' 
                    : 'hover:bg-black/5 text-day-accent'
                }`}
              >
                <Search size={14} />
              </button>
            </div>
          </form>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <NavLink to="/" className={navItemClass}>
            <MapIcon size={18} />
            <span className="font-sans text-sm font-medium">Explorer</span>
          </NavLink>
          <NavLink to="/bookmarks" className={navItemClass}>
            <Bookmark size={18} />
            <span className="font-sans text-sm font-medium">Bookmarks</span>
          </NavLink>
          <NavLink to="/docs" className={navItemClass}>
            <Book size={18} />
            <span className="font-sans text-sm font-medium">Documentation</span>
          </NavLink>
          <NavLink to="/about" className={navItemClass}>
            <Info size={18} />
            <span className="font-sans text-sm font-medium">About</span>
          </NavLink>
        </nav>

        {/* Footer / Settings */}
        <div className="p-4 mt-auto">
          <NavLink to="/settings" className={navItemClass}>
            <Settings size={18} />
            <span className="font-sans text-sm font-medium">Settings</span>
          </NavLink>
        </div>
      </aside>
      
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[998] ${bpHide}`}
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
