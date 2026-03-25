# Showcase 01 — Interactive 3D Product Viewer

A real-time 3D product viewer built as a portfolio showcase, demonstrating how complex rendering and interaction can be made accessible and delightful in the browser.

Built with Nuxt 4, TresJS (Three.js for Vue), and TypeScript. Intentional design system — not a template.

---

## What it demonstrates

- **3D interaction design** — orbit controls, environment lighting presets, and material switching without exposing Three.js complexity to the user
- **Annotation systems** — 3D hotspots that project from world space to screen space, with contextual detail panels
- **Progressive onboarding** — a gesture-based overlay that teaches controls on first visit, then gets out of the way
- **Screenshot capability** — canvas capture that respects the current scene state (`preserveDrawingBuffer`)
- **Systems-thinking in state** — a single `useViewer.ts` composable owns all shared state; components never coordinate directly

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Nuxt 4 + Vue 3 |
| 3D | TresJS + Three.js |
| Language | TypeScript |
| Color mode | `@nuxtjs/color-mode` (light / dark / system) |
| Utilities | `@vueuse/core` |

---

## Features

- Real-time 3D model rendering with orbit controls (rotate, pan, zoom)
- Environment map switching (studio, outdoor, neutral)
- Wireframe and solid geometry toggle
- Annotated hotspots with 3D-to-2D projection
- Light preset system (driven reactively from composable state)
- Screenshot export
- Onboarding overlay for first-time visitors
- Light / dark / system color mode

---

## Project structure

```
app/
  components/
    AppNav.vue           # Top navigation
    ViewerScene.vue      # TresCanvas + scene composition
    ViewerControls.vue   # All UI controls (sidebar/panel)
    LamboModel.vue       # GLB model loader + material setup
    SceneSetup.vue       # Renderless: env map, screenshot access via useTresContext()
    ModelHotspots.vue    # Hotspot overlay management
    HotspotProjector.vue # World → screen projection for a single hotspot
    ViewerOverlay.vue    # Loading + status overlays
    OnboardingOverlay.vue
  composables/
    useViewer.ts         # Single source of truth for all viewer state
  pages/
    index.vue
public/
  models/               # .glb assets
```

---

## Model attribution

The Lamborghini Aventador model is ["Lamborghini Aventador"](https://sketchfab.com/3d-models/lamborghini-aventador-888e37a3641d4f7b94bc1a39396e2441) by [Arion Digital](https://sketchfab.com/andrewswihart), licensed under [CC Attribution 4.0](http://creativecommons.org/licenses/by/4.0/).

---

## Running locally

```bash
npm install
npm run dev  # http://localhost:3001
```

```bash
npm run build    # production build
npm run generate # static output
npm run preview  # preview production build
```
