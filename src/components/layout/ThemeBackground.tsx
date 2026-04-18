import { useStore } from '../../store/useStore';
import { motion } from 'motion/react';

export default function ThemeBackground() {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {isDark ? (
        // Deep Space Environment
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-[#010614]"
        >
          {/* Subtle starfield via noise and gradients */}
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
                              radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)),
                              radial-gradient(1px 1px at 90px 40px, #ffffff, rgba(0,0,0,0))`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            opacity: 0.3
          }}></div>
          
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(2px 2px at 150px 150px, #ffffff, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 100px 200px, rgba(255,255,255,0.8), rgba(0,0,0,0))`,
            backgroundRepeat: 'repeat',
            backgroundSize: '300px 300px',
            opacity: 0.15
          }}></div>

          {/* Galaxy-like gradients */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sapphire-neon rounded-full mix-blend-screen filter blur-[150px] opacity-20"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
          <div className="absolute top-3/4 left-1/2 w-80 h-80 bg-purple-900 rounded-full mix-blend-screen filter blur-[200px] opacity-15"></div>
        </motion.div>
      ) : (
        // Light Mode: Daylight Atmosphere
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] to-[#E0F2FE]"
        >
          {/* Sun rays coming from right side */}
          <div className="absolute top-0 right-0 w-full h-full mix-blend-overlay opacity-60 pointer-events-none" style={{ background: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.8) 0%, transparent 60%)' }}></div>
          
          {/* Soft cloud-like layers */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/30 to-transparent pointer-events-none"></div>
        </motion.div>
      )}
    </div>
  );
}
