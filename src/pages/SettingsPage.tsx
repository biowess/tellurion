import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { Sun, Moon, Sparkles, Activity } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme, uiIntensity, setUiIntensity, motionPreference, setMotionPreference } = useStore();
  const isDark = theme === 'dark';

  const Card = ({ children, title, icon: Icon }: any) => (
    <div className={`p-6 md:p-8 rounded-3xl ${isDark ? 'glass-panel border-white/10' : 'glass-panel-light border-black/10'} transition-all`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-xl ${isDark ? 'bg-sapphire-neon/20 text-sapphire-neon' : 'bg-day-accent/20 text-day-accent'}`}>
          <Icon size={20} />
        </div>
        <h2 className="text-xl font-sans font-medium">{title}</h2>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full overflow-y-auto px-6 pt-20 pb-12 md:p-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Settings</h1>
          <p className={`font-sans ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Customize your atlas experience.</p>
        </div>

        {/* Theme Settings */}
        <Card title="Appearance" icon={isDark ? Moon : Sun}>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${
                theme === 'dark' 
                  ? 'bg-sapphire border-2 border-sapphire-neon ring-4 ring-sapphire-neon/20' 
                  : (isDark ? 'bg-white/5 hover:bg-white/10 border-2 border-transparent' : 'bg-black/5 hover:bg-black/10 border-2 border-transparent')
              }`}
            >
              <Moon size={24} className={theme === 'dark' ? 'text-sapphire-neon' : ''} />
              <span className="font-sans font-medium">Deep Space</span>
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${
                theme === 'light' 
                  ? 'bg-white border-2 border-day-accent ring-4 ring-day-accent/20 shadow-md' 
                  : (isDark ? 'bg-white/5 hover:bg-white/10 border-2 border-transparent' : 'bg-black/5 hover:bg-black/10 border-2 border-transparent')
              }`}
            >
              <Sun size={24} className={theme === 'light' ? 'text-day-accent' : ''} />
              <span className="font-sans font-medium">Clear Sky</span>
            </button>
          </div>
        </Card>

        {/* Visual Intensity */}
        <Card title="Visual Intensity" icon={Sparkles}>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setUiIntensity('low')}
              className={`p-4 rounded-2xl flex items-center justify-center gap-3 transition-all ${
                uiIntensity === 'low' 
                  ? (isDark ? 'bg-sapphire-neon/20 border-2 border-sapphire-neon' : 'bg-day-accent/20 border-2 border-day-accent')
                  : (isDark ? 'bg-white/5 border-2 border-transparent' : 'bg-black/5 border-2 border-transparent')
              }`}
            >
              <span className="font-sans font-medium">Subtle</span>
            </button>
            <button
              onClick={() => setUiIntensity('high')}
              className={`p-4 rounded-2xl flex items-center justify-center gap-3 transition-all ${
                uiIntensity === 'high' 
                  ? (isDark ? 'bg-sapphire-neon/20 border-2 border-sapphire-neon relative overflow-hidden' : 'bg-day-accent/20 border-2 border-day-accent')
                  : (isDark ? 'bg-white/5 border-2 border-transparent' : 'bg-black/5 border-2 border-transparent')
              }`}
            >
              <span className="font-sans font-medium relative z-10">Vibrant</span>
              {uiIntensity === 'high' && isDark && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]"></div>
              )}
            </button>
          </div>
          <p className={`text-sm mt-3 px-1 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
            Controls the amount of glow and atmospheric effects on the globe.
          </p>
        </Card>

        {/* Motion Settings */}
        <Card title="Motion & Physics" icon={Activity}>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setMotionPreference('reduced')}
              className={`p-4 rounded-2xl flex items-center justify-center gap-3 transition-all ${
                motionPreference === 'reduced' 
                  ? (isDark ? 'bg-sapphire-neon/20 border-2 border-sapphire-neon' : 'bg-day-accent/20 border-2 border-day-accent')
                  : (isDark ? 'bg-white/5 border-2 border-transparent' : 'bg-black/5 border-2 border-transparent')
              }`}
            >
              <span className="font-sans font-medium">Reduced</span>
            </button>
            <button
              onClick={() => setMotionPreference('full')}
              className={`p-4 rounded-2xl flex items-center justify-center gap-3 transition-all ${
                motionPreference === 'full' 
                  ? (isDark ? 'bg-sapphire-neon/20 border-2 border-sapphire-neon' : 'bg-day-accent/20 border-2 border-day-accent')
                  : (isDark ? 'bg-white/5 border-2 border-transparent' : 'bg-black/5 border-2 border-transparent')
              }`}
            >
              <span className="font-sans font-medium">Fluid</span>
            </button>
          </div>
          <p className={`text-sm mt-3 px-1 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
            Choose "Fluid" for smooth rotations and inertia, or "Reduced" for minimal animations.
          </p>
        </Card>

      </motion.div>
    </div>
  );
}
