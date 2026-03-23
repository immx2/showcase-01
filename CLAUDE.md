# showcase-01 — Claude Instructions

> Update this file in the same commit as the code change it describes. A stale CLAUDE.md is worse than none.

## Intent
An interactive 3D product viewer — the first showcase project for the portfolio at `../my-portfolio`. Built as a standalone Nuxt 4 app. The design system is intentionally distinct from the portfolio's; don't borrow styles or tokens from `../my-portfolio`.

Dev server runs on port 3001 (`npm run dev`) to avoid conflicting with the portfolio on 3000.

## Conventions

### State
`useViewer.ts` is the single source of truth. All components read from it via `useViewer()` — no local state for anything shared. When adding a new control, add its state here first, then wire up in `ViewerScene`/`LamboModel` and `ViewerControls`.

`screenshotFn` is a special ref: `ViewerScene` writes a closure into it on canvas ready, `ViewerControls` calls it. Pattern for any action that needs renderer access from a sibling component.

### CSS
- Token-first: always reach for `--space-*`, `--radius-*`, `--duration-*` before hardcoding values
- Colors live in `_global.css` — light-only, no dark mode planned
- All component styles in `<style scoped>`, no Tailwind, no CSS-in-JS

### TresJS
- `Tres*` components are auto-imported — no manual imports needed
- `OrbitControls` (from `@tresjs/cientos`) must be explicitly imported
- No SSR — `TresCanvas` is wrapped in `ClientOnly` via `index.vue`
- Edit light presets in `useViewer.ts`, not in templates — lights are driven reactively from `lightConfig`
- Environment map: `RoomEnvironment` + `PMREMGenerator` is set up in `ViewerScene`'s `@ready` callback; toggled by `envEnabled` in state. `preserve-drawing-buffer` is set on the canvas for screenshot support.

## Patterns

### Adding a product model
1. Drop a `.glb` into `public/models/`
2. Create a component following `LamboModel.vue`: load with `useGLTF`, apply materials via `scene.traverse`, set `vertexCount` and `isLoading` through `useViewer()`
3. Add the new id + label to `geometryOptions` in `useViewer.ts`
4. Render it conditionally in `ViewerScene.vue` based on `geometry`

### Geometry with built-in primitives
Solid and wireframe meshes are both `:key`ed on `geometry` to force a clean remount on swap.

## Boundaries
- This app is standalone — don't reach into `../my-portfolio` for anything
- No dark mode
- No Tailwind
