import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { useStore } from '../../store/useStore';
import ThemeBackground from './ThemeBackground';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { theme } = useStore();
  
  return (
    <div className={`flex w-full h-screen overflow-hidden ${
      theme === 'dark' 
        ? 'bg-sapphire text-white' 
        : 'bg-gradient-to-b from-day-sky to-day-cloud text-gray-900'
    }`}>
      {/* Dynamic Background System */}
      <ThemeBackground />
      
      <Sidebar />
      <main className="flex-1 relative z-10 w-full h-full">
        {children}
      </main>
    </div>
  );
}
