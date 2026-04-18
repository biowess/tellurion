# DOCUMENTATION.md

## 1. System Overview

This application is an interactive geography explorer built as a single-page React app with route-level views layered over a persistent 3D globe. The codebase is structured around one central idea: the globe is the primary spatial interface, and every other feature is a view into the same country model.

At a conceptual level, the system has four layers:

1. **Application shell**
   The root `App` component owns routing, splash-screen gating, and body-level theme side effects.

2. **Persistent layout layer**
   `Layout` wraps every route and keeps the navigation sidebar and atmospheric background mounted across page changes.

3. **Interaction/state layer**
   Zustand holds global UI state, selected country state, bookmarks, compare mode state, search input, and rendering preferences.

4. **Visualization/data layer**
   `react-globe.gl` renders the country mesh on a Three.js-backed globe using GeoJSON features fetched from a remote dataset.

The result is not a typical content site. It is a stateful geographic interface where the same country feature object can drive globe highlighting, preview cards, compare mode, bookmarks, and detail pages.

The UI is branded in the code as **Tellurion**, while the package metadata identifies the app as **Atlas**. Both refer to the same application.

---

## 2. Core Architecture Design

### 2.1 Application composition

The route tree is straightforward:

```text
App
├── SplashScreen (first session only)
└── BrowserRouter
    └── Layout
        ├── ThemeBackground
        ├── Sidebar
        └── main
            ├── /            → GlobePage
            ├── /country/:iso → CountryPage
            ├── /compare      → ComparePage
            ├── /settings     → SettingsPage
            ├── /bookmarks    → BookmarksPage
            ├── /docs         → DocsPage
            └── /about        → AboutPage
```

The important design decision is that **navigation does not destroy the app shell**. The sidebar and background remain mounted while the main route content swaps underneath them. That keeps the globe experience and visual atmosphere consistent across the whole product.

### 2.2 State management model

The app uses **Zustand** with `persist` middleware for a split state model:

* **Persisted preferences**

  * `theme`
  * `uiIntensity`
  * `motionPreference`
  * `bookmarks`

* **Volatile interaction state**

  * `selectedCountry`
  * `searchQuery`
  * `isGlobeLocked`
  * `countries`
  * `compareCountryA`
  * `compareCountryB`

This separation matters. User preferences survive reloads, while transient selection state stays in memory and resets naturally during session flow.

The store is also intentionally simple: it stores raw country feature objects, not normalized IDs. That keeps the globe and pages easy to wire together, but it also means many comparisons are done by object identity or ISO code string.

### 2.3 Data flow: selection, compare, globe interaction

The country interaction flow is the backbone of the app:

1. **Country data is fetched** into the shared `countries` array in the store.
2. **Search** finds a matching feature in that array.
3. The match is written to `selectedCountry`.
4. The globe reacts to `selectedCountry` and recenters the camera.
5. A preview panel appears for that country.
6. From the preview, the user can:

   * open the country detail route,
   * bookmark the country,
   * or enter compare mode.

Compare mode adds a second selected country:

* `compareCountryA` is the base country
* `compareCountryB` is the target country chosen inside `/compare`

The compare page also sets `isGlobeLocked = true` while active, which prevents the globe from continuing its automatic rotation behavior when the user is trying to read side-by-side data.

### 2.4 Component hierarchy

The major interaction chain on the globe view is:

```text
GlobePage
├── EarthGlobe
│   ├── loads country polygons
│   ├── updates selected country
│   ├── animates camera focus
│   └── renders polygon labels
└── CountryPreviewPanel
    ├── bookmark toggle
    ├── deep dive navigation
    └── compare entry point
```

The preview panel is an overlay, not part of the globe canvas itself. That separation makes the 3D scene simpler and lets the UI remain responsive and accessible.

---

## 3. Key Modules Breakdown

### 3.1 Globe system

`src/components/globe/EarthGlobe.tsx` is the most important visual module.

It uses `react-globe.gl`, which itself wraps Three.js rendering, controls, and polygon interaction. The app supplies:

* a globe base texture,
* a bump map,
* a country polygon dataset,
* click handlers,
* label rendering,
* and visual styling based on theme and intensity.

Important behaviors:

* **Country polygons** are rendered from GeoJSON features.
* **Selected countries** are drawn higher (`polygonAltitude`) and with stronger highlight colors.
* **Non-selected countries** get lower contrast when `uiIntensity` is set to `low`.
* **Clicking a polygon** updates the global selected country.
* **Hover labels** are provided as HTML tooltips.

The globe also manipulates the underlying Three.js scene after mount:

* it customizes the globe material color,
* adds an ambient light,
* and changes orbit control settings depending on the motion preference.

### 3.2 Country data system

The app uses a GeoJSON country dataset from the react-globe.gl example repository:

* `ne_110m_admin_0_countries.geojson`

The feature properties drive almost every non-visual data point in the UI:

* `NAME`
* `NAME_LONG`
* `ISO_A2`
* `ISO_A3`
* `CONTINENT`
* `SUBREGION`
* `POP_EST`
* `GDP_MD_EST`
* `ECONOMY`

This is a feature-geometry-first architecture. The UI is not backed by a custom relational data model; instead, it uses the GeoJSON feature as the canonical country record.

Flags are loaded separately from `flagcdn.com` using `ISO_A2`.

### 3.3 Compare engine

`src/pages/ComparePage.tsx` implements a dual-view comparison workspace.

Architecturally, compare mode behaves like a small state machine:

* entering compare requires `compareCountryA`
* the page locks the globe
* the left column always represents country A
* the right column is used to search and choose country B
* once B is selected, the interface becomes true side-by-side comparison

On mobile, compare mode switches from a two-column view to a tabbed single-column view. The active tab is controlled by local page state (`activeTab`), not by global store.

This keeps the compare experience usable on small screens without changing the underlying data model.

### 3.4 Sidebar navigation system

`src/components/layout/Sidebar.tsx` handles:

* route navigation,
* country search,
* mobile open/close behavior,
* and quick access to explorer, bookmarks, docs, about, and settings.

The sidebar search is intentionally direct:

1. exact name or ISO match,
2. otherwise substring match,
3. then write the result to `selectedCountry`,
4. then navigate to the globe if needed.

That makes the search bar act like a global command palette for country selection.

The sidebar also behaves differently on compare routes. It changes its breakpoint behavior so it does not conflict with the compare page’s own responsive layout.

### 3.5 Search system

There are two search layers:

* **Sidebar search**
  Sets the global selected country and can navigate back to the globe route.

* **Compare-page search**
  Searches within the `countries` store array and populates `compareCountryB`.

There is also a globe-level search reaction in `EarthGlobe`:

* whenever `searchQuery` matches a country, the globe recenters on that feature,
* and the matched country is promoted into `selectedCountry`.

This is a useful pattern: the search input updates global state, and multiple views observe that state independently.

### 3.6 UI system

The UI language is built around a consistent set of design tokens and shared utility classes.

Key visual primitives:

* `glass-panel`
* `glass-panel-light`
* `text-sapphire-neon`
* `bg-sapphire`
* `bg-day-sky`
* `bg-day-accent`

The system uses:

* translucent surfaces,
* blurred backdrops,
* thin borders,
* soft shadows,
* and a dark deep-space palette versus a bright sky palette.

The result is a cinematic interface where the globe remains the visual anchor and the UI reads like a layered control surface.

---

## 4. Rendering & Performance Strategy

### 4.1 3D globe rendering model

The globe is not manually rasterized. It is rendered through `react-globe.gl`, which handles:

* the Three.js scene,
* orbit controls,
* polygon extrusion,
* and camera transitions.

The app configures the globe with:

* `width` and `height` from the container element,
* `backgroundColor="rgba(0,0,0,0)"`,
* country polygons,
* textures for the sphere,
* and hover labels.

The globe’s camera focus uses `pointOfView(...)` to smoothly transition toward a selected feature.

### 4.2 Mount timing and scene customization

Several globe adjustments are delayed using `setTimeout`. That is a practical workaround for mount timing: the globe and scene internals are not guaranteed to exist immediately on first render.

This includes:

* orbit control configuration,
* material updates,
* and scene light injection.

### 4.3 Optimization strategies

The codebase uses a few lightweight optimizations:

* `useMemo` for search matching and compare filtering
* resize listener bound to a single container ref
* conditional rendering of the globe only after dimensions are known
* no unnecessary page reflow outside the main viewport
* `AnimatePresence` only around elements that truly animate in and out

There is no custom requestAnimationFrame loop in the app code. Motion is delegated to:

* `motion/react`
* the globe library’s internal animation system
* orbit controls

### 4.4 Tradeoff

The main performance compromise is that the country dataset is fetched and stored in a fairly raw form. That keeps the implementation simple, but it increases dependency on object identity and makes centralized caching less formal than it could be.

---

## 5. State Management Logic

### 5.1 Selection flow

Selection is the central state transition:

* search result or polygon click → `selectedCountry`
* globe observes `selectedCountry`
* preview panel appears
* detail or compare actions branch from that state

The system treats the selected feature object itself as the active country, which keeps all downstream components simple.

### 5.2 Compare mode transitions

Compare mode starts from the preview panel:

* user clicks **Compare**
* app stores `compareCountryA`
* app clears `compareCountryB`
* navigation goes to `/compare`

Inside compare mode:

* if `compareCountryA` does not exist, the route redirects home
* globe interaction is locked
* country B is chosen through local search
* once B is selected, the right column switches from search input to comparison content

This is a good example of route-driven state plus page-local state working together.

### 5.3 UI reaction model

The UI reacts to state in three ways:

1. **Structural change**
   Route changes and compare mode change the layout itself.

2. **Visual change**
   Theme, intensity, and motion preference change colors and animation behavior.

3. **Spatial change**
   Globe camera and polygon styling respond to selected countries.

Because the state lives in a single store, these reactions stay synchronized without prop drilling.

---

## 6. Responsive Design System

The responsive system is implemented primarily with Tailwind breakpoints, not custom media query logic.

### 6.1 Mobile behavior

* Sidebar becomes an off-canvas panel with a floating globe button.
* Compare mode collapses into a tabbed single-column layout.
* Preview panels expand to near-full width.
* Bookmarks become a single-column list.

### 6.2 Tablet behavior

* Country pages switch from stacked to grid-based layout.
* Compare mode starts showing two columns at `md`.
* Sidebar remains available but does not dominate the viewport.

### 6.3 Desktop behavior

* Sidebar is persistent.
* Compare mode uses a true two-column layout.
* Globe preview panel sits as a compact floating card.
* Country detail pages use editorial spacing and a multi-column information architecture.

### 6.4 Breakpoint strategy

The code uses breakpoints to change layout, not to change data logic. That keeps behavior consistent across screen sizes. The underlying state model does not depend on viewport width; only the presentation does.

---

## 7. API / Data Layer

### 7.1 External data sources

The inspected code uses two remote sources:

* **Country geometry and properties**
  A GeoJSON feature collection fetched from GitHub raw content.

* **Flag images**
  Country flags loaded from `flagcdn.com` based on ISO country codes.

There is no actual Wikipedia API integration in the runtime code. The country detail pages generate editorial-style prose procedurally from the loaded country properties instead.

### 7.2 Data transformation

The data pipeline is minimal:

* fetch GeoJSON
* parse JSON
* extract `features`
* store them in Zustand
* use feature properties directly in UI components

Formatting logic happens at the view layer:

* population uses `Intl.NumberFormat`
* GDP is compact-formatted as USD
* flags are built from `ISO_A2`
* country lookup is done by ISO or name

### 7.3 Caching behavior

There is a partial client cache:

* the `countries` array is stored in Zustand during the session
* `EarthGlobe` will not refetch if countries already exist in state

However:

* the countries array is not persisted
* `CountryPage` fetches the GeoJSON again instead of reusing the store
* there is no normalized entity cache

That is a deliberate simplicity tradeoff rather than a full data-layer abstraction.

---

## 8. UI/UX Design System

### 8.1 Design philosophy

The visual language is a blend of:

* **glassmorphism**
* **editorial typography**
* **space UI**
* **high-contrast atmospheric theming**

The interface is designed so the globe feels like a physical object floating inside a curated control environment.

### 8.2 Typography system

The CSS theme defines two font families:

* `Space Grotesk` for sans-serif UI text
* `Cormorant Garamond` for serif headlines and narrative copy

This pairing is used intentionally:

* sans-serif for controls, labels, metadata, and navigation
* serif for country names, overview text, and editorial framing
* monospace for codes, populations, and compact facts

That gives the app a split personality: functional for controls, literary for content.

### 8.3 Color system

Dark mode is built around:

* `#010614` deep space base
* `#0B132B` sapphire surfaces
* `#3A86FF` neon accent

Light mode is built around:

* `#87CEEB` sky base
* `#E0F2FE` cloud surface
* `#0284C7` daylight accent

These are not just theme colors. They also affect scene lighting, panel contrast, and the ambient background system.

### 8.4 Interaction principles

The interface follows a few consistent interaction rules:

* keep the globe visible whenever possible
* use overlays instead of full-page mode switches
* keep primary actions near the selected object
* preserve context during navigation
* prefer immediate visual feedback over nested dialogs

The splash screen and theme background reinforce continuity so the app never feels like a blank route change.

---

## 9. Known Limitations / Tradeoffs

### 9.1 Weak typing

The store and many page components use `any` for country objects. That reduces friction during development, but it weakens compile-time guarantees and makes the code more dependent on runtime property names.

### 9.2 Feature object identity

Several comparisons rely on the same feature object instance being reused. That works because the app usually selects countries from the shared dataset, but it is fragile if the same country is reconstructed from a new fetch or deep clone.

### 9.3 Duplicate fetch paths

The globe page and country detail page both fetch the same GeoJSON source independently. This is acceptable for a small app, but a more formal architecture would centralize fetch-and-cache behavior.

### 9.4 Procedural detail content

The country detail pages generate editorial copy from data fields rather than from a factual knowledge base. That means the text is structurally polished but not a substitute for a real curated encyclopedia entry.

### 9.5 Timing sensitivity in 3D setup

Controls and material changes are applied after short delays. This is pragmatic, but it couples behavior to mount timing and library internals.

### 9.6 Client-side only persistence

Bookmarks and preferences are stored in localStorage. That keeps the app self-contained, but it also means there is no account sync, no server validation, and no cross-device persistence.

---

## 10. Learning Notes

This codebase is useful as a study in several real-world architecture patterns:

### 10.1 Global state as interaction backbone

A single Zustand store coordinates selection, theming, motion settings, bookmarks, and compare mode. This shows how a small global state model can replace a much more complicated prop chain.

### 10.2 Route-level composition

The app separates:

* shell concerns,
* route concerns,
* and shared visual concerns.

That is a strong pattern for applications with both persistent navigation and changing content views.

### 10.3 3D scene integration in React

`react-globe.gl` demonstrates how to keep a complex WebGL scene responsive to React state without manually managing the full render loop.

### 10.4 State-driven UI layers

The preview panel, compare page, and country detail page are all different projections of the same country feature. That is an excellent example of using one source of truth to power multiple interfaces.

### 10.5 Responsive control surfaces

The sidebar and compare page show how a single interaction model can be adapted for desktop and mobile without changing the underlying data semantics.

### 10.6 Visual system consistency

Fonts, accents, panels, and motion all come from the same design language. That matters architecturally because it reduces one-off styling decisions and keeps the UI cohesive.

### 10.7 Tradeoff literacy

The app is a good example of pragmatic engineering:

* simple fetches instead of a backend,
* raw GeoJSON instead of a normalized data store,
* object-state coupling instead of a more elaborate entity system,
* and library-driven 3D rendering instead of custom WebGL plumbing.

Those decisions make the code easier to understand and ship, while still exposing the architectural concerns that matter in a real interactive system.

