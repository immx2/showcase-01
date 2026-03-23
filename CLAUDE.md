# showcase-01 — Claude Instructions

## Maintaining this file
Update CLAUDE.md in the same commit as the code change it describes — new components, new state, changed conventions. A stale CLAUDE.md is worse than none.

## What this is
An interactive 3D product viewer — the first showcase project for the portfolio at `../my-portfolio`. Built as a standalone Nuxt 4 app.

## Stack
- Nuxt 4 + Vue 3 + TypeScript
- TresJS (`@tresjs/nuxt`, `@tresjs/cientos`) — Vue-native Three.js
- CSS custom properties (own design system, distinct from portfolio)
- `@vueuse/core`, `@nuxt/fonts` (Inter)

## Commands
- `npm run dev` — start dev server at localhost:3001
- `npm run build` — production build
- `npm run generate` — static site generation
- `npm run preview` — preview production build

## Project structure
- `app/pages/index.vue` — root page, composes all components
- `app/components/ViewerScene.vue` — TresCanvas + 3D scene (lights, mesh, OrbitControls)
- `app/components/ViewerControls.vue` — floating toolbar controls panel
- `app/components/AppNav.vue` — minimal top nav (brand + portfolio back-link)
- `app/components/ViewerOverlay.vue` — top-left product label, vertex count, hint text, loading spinner
- `app/components/LamboModel.vue` — loads `lamborghini.glb` via `useGLTF`, applies reactive materials, reports vertex count
- `app/composables/useViewer.ts` — all shared reactive state + typed config data
- `app/assets/styles/` — `_tokens.css` (spacing/radius/duration), `_global.css` (colors + reset), `main.css`
- `public/models/lamborghini.glb` — Lamborghini 3D model

## State — useViewer.ts
Single source of truth for the viewer. All components read from it via `useViewer()`.
- `geometry` — active geometry type (`icosahedron` | `sphere` | `torusKnot` | `box` | `octahedron` | `lamborghini`)
- `color` — hex string, material base color
- `metalness`, `roughness` — PBR material sliders (0–1)
- `wireframe` — boolean, toggles wireframe on all meshes
- `autoRotate` — boolean, OrbitControls auto-rotation
- `lightPreset` — active lighting config (`studio` | `dramatic` | `soft` | `cold`)
- `lightConfig` — computed, resolves preset to `{ ambient, key, fill, rim }` light parameters
- `vertexCount` — total vertex count of the active model (set by `LamboModel.vue` or `ViewerScene.vue`)
- `isLoading` — boolean, true while a model is being loaded; drives the overlay spinner

New controls → add state here first, then wire up in ViewerScene/LamboModel + ViewerControls.

## CSS conventions
- Token-first: use `--space-*`, `--radius-*`, `--duration-*` from `_tokens.css`
- Color palette in `_global.css` (light-only, no dark mode)
  - `--color-bg: #f5f4f0` — warm off-white canvas background
  - `--color-surface` / `--color-surface-2` / `--color-border` / `--color-text` / `--color-text-muted`
- Component styles in `<style scoped>` blocks
- No Tailwind, no CSS-in-JS

## TresJS conventions
- TresJS components are auto-imported by `@tresjs/nuxt` — no manual imports needed for `Tres*` prefixed components
- `OrbitControls` from `@tresjs/cientos` must be explicitly imported
- `ViewerScene.vue` wraps `TresCanvas` in a `ClientOnly` (via `index.vue`) — no SSR
- Geometry swap: both solid and wireframe meshes are `:key`ed on `geometry` to force remount
- Lights are driven reactively from `lightConfig` computed — edit presets in `useViewer.ts`, not in the template
- `LamboModel.vue` uses `useGLTF` to load the model and `scene.traverse` to apply materials reactively

## Adding more product models
Drop a `.glb` into `public/models/` and create a new component following the `LamboModel.vue` pattern:
1. Load with `useGLTF`, apply materials via `scene.traverse`
2. Set `vertexCount` and `isLoading` via `useViewer()`
3. Add the new `GeometryType` id + label to `geometryOptions` in `useViewer.ts`
4. Render the component conditionally in `ViewerScene.vue` based on `geometry`
