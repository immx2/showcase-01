# showcase-01 — Claude Instructions

## What this is
An interactive 3D product viewer — the first showcase project for the portfolio at `../my-portfolio`. Built as a standalone Nuxt 4 app.

## Stack
- Nuxt 4 + Vue 3 + TypeScript
- TresJS (`@tresjs/core`, `@tresjs/cientos`) — Vue-native Three.js
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
- `app/components/ViewerControls.vue` — floating controls panel
- `app/components/AppNav.vue` — minimal top nav (brand + portfolio back-link)
- `app/components/ViewerOverlay.vue` — bottom-left product label + hint
- `app/composables/useViewer.ts` — all shared reactive state + typed config data
- `app/assets/styles/` — `_tokens.css` (spacing/radius/duration), `_global.css` (colors + reset), `main.css`

## State — useViewer.ts
Single source of truth for the viewer. All components read from it via `useViewer()`.
- `geometry` — active geometry type (`icosahedron` | `sphere` | `torusKnot` | `box` | `octahedron`)
- `color` — hex string, material base color
- `metalness`, `roughness` — PBR material sliders (0–1)
- `wireframe` — boolean, toggles wireframe overlay mesh
- `autoRotate` — boolean, OrbitControls auto-rotation
- `lightPreset` — active lighting config (`studio` | `dramatic` | `soft` | `cold`)
- `lightConfig` — computed, resolves preset to `{ ambient, key, fill, rim }` light parameters

New controls → add state here first, then wire up in ViewerScene + ViewerControls.

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

## Adding a real product model
Drop a `.glb` into `public/models/` and replace the geometry block in `ViewerScene.vue` with:
```vue
<GLTFModel path="/models/your-file.glb" cast-shadow receive-shadow />
```
`GLTFModel` is auto-imported from `@tresjs/cientos` via the Nuxt module.
