import { useStore } from '../store/useStore';
// @ts-ignore
import { Book, Code, Layers, FileJson, Cpu, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export default function DocsPage() {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  const Section = ({ title, icon: Icon, children }: any) => (
    <section className={`mb-12 p-8 rounded-3xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-black/5 shadow-sm'}`}>
      <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isDark ? 'bg-sapphire-neon/20 text-sapphire-neon' : 'bg-day-accent/10 text-day-accent'}`}>
          <Icon size={20} />
        </div>
        {title}
      </h2>
      <div className={`prose prose-lg max-w-none font-sans prose-headings:font-serif ${isDark ? 'prose-invert prose-p:text-white/70 prose-strong:text-white' : 'prose-p:text-gray-600 prose-strong:text-gray-900'}`}>
        {children}
      </div>
    </section>
  );

  return (
    <div className="w-full h-full overflow-y-auto px-6 pt-20 pb-12 md:p-16 relative z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className={`inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-sans uppercase tracking-widest font-bold ${isDark ? 'bg-sapphire-neon/20 text-sapphire-neon' : 'bg-day-accent/20 text-day-accent'}`}>
            <Book size={14} /> 
            Engineering Manual
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Documentation</h1>
          <p className={`text-lg font-sans ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
            Architecture, geometry, and rendering concepts for the Atlas application.
          </p>
        </motion.div>

        <Section title="Architecture Overview" icon={Layers}>
          <p>
            Atlas is built using a modern <strong>React + TypeScript + Vite</strong> stack. The interface follows a strict glassmorphism design system layered over a dynamically rendered WebGL canvas. 
          </p>
          <p>
            Routing is handled via <code>react-router-dom</code>, mapping physical paths to modular page components while preserving the globally persistent 3D background. The <code>Layout</code> component wraps all routes, orchestrating the <code>Sidebar</code>, the <code>ThemeBackground</code>, and the main view container.
          </p>
        </Section>

        <Section title="State Management" icon={Cpu}>
          <p>
            Global deterministic state is managed through <strong>Zustand</strong> due to its minimal boilerplate and direct hook integration. 
          </p>
          <p>
            The store (<code>useStore.ts</code>) isolates:
          </p>
          <ul>
            <li><strong>Theming & Visuals</strong> (dark/light mode, UI intensity, motion preference)</li>
            <li><strong>Selection State</strong> (active search query, currently focused country object)</li>
            <li><strong>Collections</strong> (client-persisted bookmarks array)</li>
            <li><strong>Interaction Flags</strong> (globe rotation locks)</li>
          </ul>
          <p>
            Crucial user preferences (theme, bookmarks, preferences) are persisted to <code>localStorage</code> automatically via Zustand's <code>persist</code> middleware.
          </p>
        </Section>

        <Section title="3D Globe & WebGL Implementation" icon={Globe}>
          <p>
            The globe is driven by <code>react-globe.gl</code>, an abstraction over <code>three.js</code>. 
          </p>
          <p>
            Instead of simply wrapping a sphere in a texture, the app downloads a lightweight <code>110m</code> resolution GeoJSON dataset. The rendering engine parses the polygon rings for each country, extrudes them slightly above the base sphere radius to create a tactile surface, and handles raycasting for accurate mesh intersection (hover/click).
          </p>
          <p>
            <strong>Camera Logic:</strong> Upon country selection, the globe calculates the centroid of the clicked polygon natively and transitions the <code>pointOfView</code> via spherical interpolation to smoothly center the target. The <code>controls.autoRotate</code> boolean is explicitly managed by our global <code>isGlobeLocked</code> state flag to halt inertia when a target requires reading focus.
          </p>
        </Section>

        <Section title="Data Strategy & Generation" icon={FileJson}>
          <p>
            Atlas operates <em>without</em> a dedicated backend node. The deep-dive formatting on the <code>CountryPage</code> acts as a smart procedural template.
          </p>
          <p>
            The <code>useEffect</code> fetches the GeoJSON once. When navigating to `/country/:iso`, the app queries this local GeoJSON feature array by ISO code or Name. Properties embedded directly in the geographic data (Population, GDP, Continent, Subregion) are extracted and injected into the Garamond typographical layout.
          </p>
          <p>
            Narrative content (the Overview paragraphs) dynamically interpolates these variables to generate readable, editorial-style paragraphs procedurally, giving the illusion of a hand-written Wikipedia article for all 190+ entities.
          </p>
        </Section>

        <Section title="Bookmarking Integrity" icon={Book}>
          <p>
            The Bookmark system operates entirely client-side. The Zustand action <code>addBookmark</code> validates the incoming Feature object, strictly checking its <code>ISO_A3</code> string against the existing store array to ensure mathematical idempotency (no duplicates).
          </p>
          <p>
            The <code>BookmarksPage</code> iterates this state, utilizing <code>framer-motion</code>'s <code>layout</code> and <code>AnimatePresence</code> directives to smoothly recalculate the CSS Grid when a node is removed from the DOM.
          </p>
        </Section>
      </div>
    </div>
  );
}
