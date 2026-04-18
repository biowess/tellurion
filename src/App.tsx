import { HashRouter, Routes, Route } from 'react-router-dom';
import GlobePage from './pages/GlobePage';
import CountryPage from './pages/CountryPage';
import ComparePage from './pages/ComparePage';
import SettingsPage from './pages/SettingsPage';
import BookmarksPage from './pages/BookmarksPage';
import DocsPage from './pages/DocsPage';
import AboutPage from './pages/AboutPage';
import Layout from './components/layout/Layout';
import SplashScreen from './components/ui/SplashScreen';
import { useStore } from './store/useStore';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const { theme } = useStore();
  const [showSplash, setShowSplash] = useState(() => {
    return localStorage.getItem('hasSeenSplash') !== 'true';
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
    localStorage.setItem('hasSeenSplash', 'true');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('bg-sapphire', 'text-white');
      document.body.classList.remove('bg-day-sky', 'text-gray-900');
    } else {
      document.body.classList.remove('bg-sapphire', 'text-white');
      document.body.classList.add('bg-day-sky', 'text-gray-900');
    }
  }, [theme]);

  // Make the body overflow hidden to prevent scrolling the whole page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>
      
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<GlobePage />} />
            <Route path="/country/:iso" element={<CountryPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Layout>
      </HashRouter>
    </>
  );
}
