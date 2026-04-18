import { useEffect, useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import EarthGlobe from '../components/globe/EarthGlobe';
import CountryPreviewPanel from '../components/ui/CountryPreviewPanel';
import { AnimatePresence } from 'motion/react';

export default function GlobePage() {
  const { selectedCountry, searchQuery } = useStore();

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* 3D Globe */}
      <div className="absolute inset-0 cursor-grab active:cursor-grabbing">
        <EarthGlobe />
      </div>

      {/* Floating UI Elements */}
      <AnimatePresence>
        {selectedCountry && (
          <CountryPreviewPanel 
            key={String(selectedCountry.properties?.ISO_A3 || selectedCountry.properties?.NAME)} 
            country={selectedCountry} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
