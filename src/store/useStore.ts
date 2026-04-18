import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light';

interface AppState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  selectedCountry: any | null;
  setSelectedCountry: (country: any | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  uiIntensity: 'high' | 'low';
  setUiIntensity: (intensity: 'high' | 'low') => void;
  motionPreference: 'full' | 'reduced';
  setMotionPreference: (pref: 'full' | 'reduced') => void;
  bookmarks: any[];
  addBookmark: (country: any) => void;
  removeBookmark: (iso3: string) => void;
  clearBookmarks: () => void;
  isGlobeLocked: boolean;
  setGlobeLocked: (locked: boolean) => void;
  countries: any[];
  setCountries: (countries: any[]) => void;
  compareCountryA: any | null;
  setCompareCountryA: (country: any | null) => void;
  compareCountryB: any | null;
  setCompareCountryB: (country: any | null) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      selectedCountry: null,
      setSelectedCountry: (country) => set({ selectedCountry: country }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      uiIntensity: 'high',
      setUiIntensity: (intensity) => set({ uiIntensity: intensity }),
      motionPreference: 'full',
      setMotionPreference: (pref) => set({ motionPreference: pref }),
      bookmarks: [],
      addBookmark: (country) => set((state) => {
        // Prevent duplicates
        const exists = state.bookmarks.find(b => b.properties.ISO_A3 === country.properties.ISO_A3);
        if (exists) return state;
        return { bookmarks: [...state.bookmarks, country] };
      }),
      removeBookmark: (iso3) => set((state) => ({
        bookmarks: state.bookmarks.filter(b => b.properties.ISO_A3 !== iso3)
      })),
      clearBookmarks: () => set({ bookmarks: [] }),
      isGlobeLocked: false,
      setGlobeLocked: (locked) => set({ isGlobeLocked: locked }),
      countries: [],
      setCountries: (countries) => set({ countries }),
      compareCountryA: null,
      setCompareCountryA: (country) => set({ compareCountryA: country }),
      compareCountryB: null,
      setCompareCountryB: (country) => set({ compareCountryB: country }),
    }),
    {
      name: 'atlas-storage',
      partialize: (state) => ({ 
        theme: state.theme, 
        uiIntensity: state.uiIntensity, 
        motionPreference: state.motionPreference,
        bookmarks: state.bookmarks
      }),
    }
  )
);

