import { motion } from 'motion/react';
import { useStore } from '../../store/useStore';
import { useEffect } from 'react';
import { Globe } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  // Automatically dismiss after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
        isDark ? 'bg-[#010614]' : 'bg-gradient-to-b from-[#87CEEB] to-[#E0F2FE]'
      }`}
      onClick={onComplete}
    >
      {/* Background ambient lighting for transition consistency */}
      {isDark ? (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sapphire-neon rounded-full mix-blend-screen filter blur-[200px] opacity-10"></div>
          {/* Subtle starfield matching the app */}
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
                              radial-gradient(1px 1px at 90px 40px, #ffffff, rgba(0,0,0,0))`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            opacity: 0.2
          }}></div>
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-0 right-0 w-full h-full mix-blend-overlay opacity-50" style={{ background: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.8) 0%, transparent 60%)' }}></div>
        </div>
      )}

      {/* Central Sequence */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, filter: 'blur(10px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className={`relative flex items-center justify-center w-24 h-24 rounded-full border ${isDark ? 'border-sapphire-neon/30 bg-sapphire-neon/5' : 'border-white/50 bg-white/10'}`}>
          <Globe 
            size={36} 
            strokeWidth={1} 
            className={isDark ? 'text-sapphire-neon' : 'text-white'} 
          />
        </div>
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
          className={`absolute inset-0 rounded-full blur-[25px] -z-10 ${isDark ? 'bg-sapphire-neon/40' : 'bg-white/80'}`}
        />
      </motion.div>

      {/* Branding */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
        className={`absolute bottom-12 font-sans text-[10px] uppercase tracking-[0.5em] font-medium ${
          isDark ? 'text-sapphire-neon/60 drop-shadow-[0_0_8px_rgba(58,134,255,0.4)]' : 'text-white drop-shadow-md'
        }`}
      >
        Biowess 2026
      </motion.div>
    </motion.div>
  );
}
