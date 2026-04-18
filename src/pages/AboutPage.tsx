import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { Globe } from 'lucide-react';

export default function AboutPage() {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <div className="w-full h-full overflow-y-auto px-6 pt-20 pb-12 md:p-16 relative z-10 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="flex justify-center mb-8">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl ${isDark ? 'bg-sapphire-neon/10 text-sapphire-neon shadow-sapphire-neon/20' : 'bg-day-accent text-white shadow-day-accent/30'}`}>
            <Globe size={48} strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">
          The World, <br />
          <span className={isDark ? 'text-sapphire-neon' : 'text-day-accent'}>Curated.</span>
        </h1>

        <div className={`space-y-6 text-lg md:text-xl font-serif leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
          <p>
            Tellurion was born from a singular vision: to bridge the gap between 
            raw geographic data and meticulous editorial design. It is not merely 
            a map, but an interactive encyclopedia built for the modern web.
          </p>
          <p>
            By mapping real-world vector polygons onto a 3D WebGL sphere, we 
            transform the classic classroom globe into a fluid, responsive 
            digital artifact. The user interface borrows language from high-end 
            print media, pairing the stark utilitarianism of Space Grotesk with 
            the classic authority of Cormorant Garamond.
          </p>
          <p>
            Every gradient, motion curve, and atmospheric lens flare has been 
            engineered to pull focus back to the Earth. Whether immersed in the 
            sapphire void of deep space or the brilliant clarity of a midday sky, 
            the geometry remains true.
          </p>
        </div>

        <div className={`mt-16 pt-8 border-t ${isDark ? 'border-white/10 text-white/40' : 'border-black/10 text-gray-400'}`}>
          <p className="font-sans text-xs uppercase tracking-widest font-bold">
            Built with React, Three.js, and Framer Motion<br/>
            Engineered by Biowess
          </p>
        </div>
      </motion.div>
    </div>
  );
}
