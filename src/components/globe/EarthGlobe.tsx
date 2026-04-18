import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

// Using reliable geometry data source
const GEOJSON_URL = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json'; 
// Actually, world-atlas is TopoJSON. react-globe.gl prefers GeoJSON for polygons.
// react-globe.gl example GeoJSON:
const REAL_GEOJSON_URL = 'https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson';

export default function EarthGlobe() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const { theme, selectedCountry, setSelectedCountry, searchQuery, uiIntensity, motionPreference, isGlobeLocked, countries, setCountries } = useStore();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Resize handling
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set OrbitControls based on motionPreference
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    if (globeRef.current) {
      const applyControls = () => {
        try {
          const controls = globeRef.current?.controls();
          if (controls) {
            if (motionPreference === 'reduced') {
              controls.enableDamping = false;
              controls.autoRotate = false;
            } else {
              controls.enableDamping = true;
              controls.dampingFactor = 0.05;
              
              // Reduce rotation dynamically
              if (selectedCountry || isGlobeLocked) {
                controls.autoRotate = false; // Lock rotation when focused
              } else {
                controls.autoRotate = true;
                controls.autoRotateSpeed = 0.5;
              }
            }
          }
        } catch(e) {}
      };
      
      timeout = setTimeout(applyControls, 100);
    }
    return () => clearTimeout(timeout);
  }, [motionPreference, selectedCountry, isGlobeLocked, globeRef.current]);

  // Fetch GeoJSON
  useEffect(() => {
    if (countries && countries.length > 0) return;
    fetch(REAL_GEOJSON_URL)
      .then(res => res.json())
      .then(data => {
        setCountries(data.features || []);
      })
      .catch(err => console.error("Could not load country data.", err));
  }, [setCountries, countries]);

  // Search filter logic
  const searchMatch = useMemo(() => {
    if (!searchQuery) return null;
    const lowerQuery = searchQuery.toLowerCase();
    return countries.find(f => 
      f.properties.NAME?.toLowerCase().includes(lowerQuery) ||
      f.properties.ISO_A3?.toLowerCase() === lowerQuery
    );
  }, [searchQuery, countries]);

  // Focus on selected or searched country
  useEffect(() => {
    const targetInfo = selectedCountry || searchMatch;
    if (targetInfo && globeRef.current) {
      setTimeout(() => {
        if (!globeRef.current) return;
        try {
          const geoToCenter = targetInfo.geometry;
          let lat = 0, lng = 0;
          if (geoToCenter.type === 'Polygon') {
             const coords = geoToCenter.coordinates[0][0];
             lng = coords[0]; lat = coords[1];
          } else if (geoToCenter.type === 'MultiPolygon') {
             const coords = geoToCenter.coordinates[0][0][0];
             lng = coords[0]; lat = coords[1];
          }
          globeRef.current.pointOfView({ lat, lng, altitude: 1.5 }, 1200);
        } catch(e) {}
      }, 100);
    }
  }, [selectedCountry, searchMatch]);

  // When search match changes intentionally from typing, update the selected country
  useEffect(() => {
    if (searchMatch && searchMatch !== selectedCountry) {
      setSelectedCountry(searchMatch);
    }
  }, [searchMatch]);
  
  // Customizing materials
  useEffect(() => {
    let timeout: any;
    if (globeRef.current) {
      const applyMaterial = () => {
        try {
          const globeMaterial = globeRef.current?.globeMaterial?.() as THREE.MeshPhongMaterial | undefined;
          
          if (globeMaterial) {
            if (theme === 'dark') {
              globeMaterial.color = new THREE.Color(0x0a1128); // Sapphire base
              globeMaterial.emissive = new THREE.Color(0x1a2c5b);
              globeMaterial.emissiveIntensity = 0.1;
              globeMaterial.shininess = 0.7;
            } else {
              globeMaterial.color = new THREE.Color(0x2d9cdb); // Blue water base
              globeMaterial.emissive = new THREE.Color(0x3498db);
              globeMaterial.emissiveIntensity = 0.1;
              globeMaterial.shininess = 0.5;
            }
          }
          
          const scene = globeRef.current?.scene?.();
          if (scene) {
            // Add atmospheric ambient light
            scene.children.forEach((c: any) => { if (c.name === 'customAmbient') scene.remove(c) });
            const ambientLight = new THREE.AmbientLight(0xffffff, theme === 'dark' ? 0.3 : 0.6);
            ambientLight.name = 'customAmbient';
            scene.add(ambientLight);
          }
        } catch(e) {}
      };
      
      timeout = setTimeout(applyMaterial, 500); // Give it a sec to mount scene
    }
    return () => clearTimeout(timeout);
  }, [theme, globeRef.current]);

  const isDark = theme === 'dark';

  return (
    <div ref={containerRef} className="w-full h-full relative cursor-grab">
      {dimensions.width > 0 && dimensions.height > 0 && (
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          
          // Environment
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={isDark ? '//unpkg.com/three-globe/example/img/earth-dark.jpg' : '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'}
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          
          // Polygons (Countries)
          polygonsData={countries}
          polygonAltitude={d => (d === selectedCountry ? 0.04 : 0.01)}
          polygonCapColor={d => {
            if (d === selectedCountry) {
              return isDark ? 'rgba(58, 134, 255, 0.4)' : 'rgba(255, 255, 255, 0.5)';
            }
            if (uiIntensity === 'low') {
              return isDark ? 'rgba(11, 19, 43, 0.1)' : 'rgba(255, 255, 255, 0.05)';
            }
            return isDark ? 'rgba(11, 19, 43, 0.3)' : 'rgba(255, 255, 255, 0.1)';
          }}
          polygonSideColor={() => 'rgba(0, 0, 0, 0.1)'}
          polygonStrokeColor={d => {
            if (d === selectedCountry) {
              return isDark ? '#3A86FF' : '#ffffff';
            }
            if (uiIntensity === 'low') {
              return isDark ? 'rgba(255,255,255, 0.05)' : 'rgba(0,0,0, 0.05)';
            }
            return isDark ? 'rgba(255,255,255, 0.15)' : 'rgba(0,0,0, 0.1)';
          }}
          
          // Interactions
          onPolygonClick={(polygon) => {
            // Use immediate state update to ensure preview renders instantly
            setSelectedCountry(polygon);
          }}
          
          // Labels
          polygonLabel={(d: any) => `
            <div class="px-2 py-1 rounded-md text-xs font-sans font-bold bg-black/60 text-white backdrop-blur-sm border border-white/20" style="pointer-events: none; touch-action: none;">
              ${d.properties.NAME}
            </div>
          `}
        />
      )}
    </div>
  );
}
