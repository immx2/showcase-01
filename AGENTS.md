# showcase-01 — Project Instructions

> Update this file in the same commit as the code change it describes. A stale AGENTS.md is worse than none.

## Intent
An interactive 3D product viewer built as a standalone Nuxt 4 app. The design system is purpose-built for this project — not shared with or borrowed from any other repo.

Dev server runs on port 3001 (`npm run dev`).

## Conventions

### State
`useViewer.ts` is the single source of truth. All components read from it via `useViewer()` — no local state for anything shared. When adding a new control, add its state here first, then wire up in `ViewerScene`/`LamboModel` and `ViewerControls`.

`screenshotFn` is a special ref: `ViewerScene` writes a closure into it on canvas ready, `ViewerControls` calls it. Pattern for any action that needs renderer access from a sibling component.

### CSS
- Token-first: always reach for `--space-*`, `--radius-*`, `--duration-*` before hardcoding values
- Colors live in `_global.css` — 3-tier color mode (auto/light/dark) via `data-color-mode` on `<html>`
- Color mode is handled by `@nuxtjs/color-mode` (configured in `nuxt.config.ts` with `dataValue: 'color-mode'`). Use `useColorMode()` (auto-imported) — `colorMode.preference` is 'system'|'light'|'dark', `colorMode.value` is the resolved 'light'|'dark'. The module prevents FOUC natively.
- All component styles in `<style scoped>`, no Tailwind, no CSS-in-JS

### TresJS
- `Tres*` components are auto-imported — no manual imports needed
- `OrbitControls` (from `@tresjs/cientos`) must be explicitly imported
- No SSR — `TresCanvas` is wrapped in `ClientOnly` via `index.vue`
- Edit light presets in `useViewer.ts`, not in templates — lights are driven reactively from `lightConfig`
- Environment map + screenshot: handled by `SceneSetup.vue`, a renderless component that lives inside `TresCanvas` and calls `useTresContext()` — the only reliable way to access `scene`/`renderer` from inside a canvas. `preserve-drawing-buffer` is set on the canvas for screenshot support.

## Patterns

### Adding a product model
1. Drop a `.glb` into `public/models/`
2. Create a component following `LamboModel.vue`: load with `useGLTF`, apply materials via `scene.traverse`, set `vertexCount` and `isLoading` through `useViewer()`
3. Add the new id + label to `geometryOptions` in `useViewer.ts`
4. Render it conditionally in `ViewerScene.vue` based on `geometry`

### Geometry with built-in primitives
Solid and wireframe meshes are both `:key`ed on `geometry` to force a clean remount on swap.

## Known trade-offs

- **Loading states** — `isLoading` is set in `useViewer.ts` when a `.glb` or environment map is resolving, but no visible indicator is wired up yet. A spinner or canvas overlay in `ViewerScene.vue` / `ViewerControls.vue` would close this gap.
- **Anti-aliasing** — the renderer currently has no AA pass. Options to explore: `antialias` on the renderer (MSAA), or FXAA/SMAA via `@tresjs/post-processing`. Worth exposing as a user toggle given the performance trade-off.

## Boundaries
- This app is standalone — no shared code or styles from other repos
- No Tailwind
