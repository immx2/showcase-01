# showcase-01 — Project Instructions

> Update this file in the same commit as the code change it describes. A stale AGENTS.md is worse than none.

## Intent
An interactive 3D product viewer built as a standalone Nuxt 4 app. The design system is purpose-built for this project — not shared with or borrowed from any other repo.

Dev server runs on port 3001 (`npm run dev`).

## Linting & Typecheck
- Run `npm run lint:all && npm run typecheck` always before committing. Fix all errors before committing.
- `npm run lint:all` — ESLint (JS/TS/Vue `<script>`) + Stylelint (CSS/Vue `<style>`)
- Run `npm run lint:all` after editing any `.ts`, `.css`, or `.vue` files.

## Conventions

### State
`useViewer.ts` is the single source of truth. All components read from it via `useViewer()` — no local state for anything shared. When adding a new control, add its state here first, then wire up in `ViewerScene`/`LamboModel` and `ViewerControls`.

`screenshotFn` is a special ref: `ViewerScene` writes a closure into it on canvas ready, `ViewerControls` calls it. Pattern for any action that needs renderer access from a sibling component.

### CSS
- Token-first: always reach for `--space-*`, `--radius-*`, `--duration-*` before hardcoding values
- Colors live in `_colors.css` — 3-tier color mode (auto/light/dark) via `data-color-mode` on `<html>`
- Color mode is handled by `@nuxtjs/color-mode` (configured in `nuxt.config.ts` with `dataValue: 'color-mode'`). Use `useColorMode()` (auto-imported) — `colorMode.preference` is 'system'|'light'|'dark', `colorMode.value` is the resolved 'light'|'dark'. The module prevents FOUC natively.
- All component styles in `<style scoped>`, no Tailwind, no CSS-in-JS

### VueUse
- `@vueuse/nuxt` is in `nuxt.config.ts` modules; it depends on `@vueuse/core` — keep only `@vueuse/nuxt` in `package.json` unless you need to pin `@vueuse/core` explicitly.
- VueUse composables (`useEventListener`, etc.) are Nuxt auto-imported; do not import from `@vueuse/core` in app code.

### Nuxt MCP
Always fetch from the Nuxt MCP (`mcp__nuxt-remote__*`) when answering questions about Nuxt behavior, module config, or deployment — do not rely on training knowledge alone. The MCP provides live, accurate docs and is especially important for Nuxt 4 specifics.

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

## Environment Maps

### How env maps work
Environment presets are defined in `useViewer.ts` (`envPresets`). Each preset has a `url` pointing to a pre-baked `.exr` file in `public/env/`. At runtime, `SceneSetup.vue` loads these via a Web Worker (`exr-loader.worker.ts`) that decodes the EXR off the main thread, then reconstructs a `THREE.DataTexture` with `CubeUVReflectionMapping` on the main thread. No `PMREMGenerator` runs at runtime — only a GPU texture upload (~2ms).

Switching envs fades `scene.backgroundIntensity` and `scene.environmentIntensity` together over 220ms (matching `--duration-base`) so the model's reflections and the background panorama transition as a unit. Decoded textures are cached in-memory for instant subsequent switches.

### Adding a new env preset
1. Find a 2k HDR on [Poly Haven](https://polyhaven.com/hdris) (or any source — keep the HDR file locally for baking)
2. Add an entry to `envPresets` in `useViewer.ts` with a temporary `url` pointing to the Poly Haven CDN or a local `/public/env/source/` path
3. Run the baking tool (see below) to produce a `.exr` — this pre-bakes the PMREM mip chain so no `PMREMGenerator` runs on the client
4. Move the baked `.exr` to `public/env/` and update the preset's `url` to `/env/<name>.exr`
5. Commit the `.exr` file alongside the code change

### Baking tool (dev only)
`/dev/bake-envmaps` (`app/pages/dev/bake-envmaps.vue` + `app/components/EnvBaker.vue`) — runs `PMREMGenerator` + `EXRExporter` in-browser for every preset that has a `url`. Navigate to it with `npm run dev`, wait for the downloads, move the files to `public/env/`.

The baked files are larger than the source HDRs (~7–9 MB each) because they store the full PMREM mip chain. Decoding is fast because the Worker does the CPU work and only the GPU upload hits the main thread.

### Reverting to Poly Haven CDN (not recommended)
If you want to load HDRs directly from Poly Haven at runtime instead of serving baked EXRs:
- Replace `EXRLoader` in `exr-loader.worker.ts` with `RGBELoader` (for `.hdr`) or keep `EXRLoader` (for `.exr`)
- Change preset `url` values back to absolute CDN URLs (e.g. `https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/2k/sunset_jhbcentre_2k.exr`)
- Add `PMREMGenerator` back to `SceneSetup.vue` — run it on the `DataTexture` received from the worker, then set `scene.environment` / `scene.background` to the PMREM render target's texture
- Note: `PMREMGenerator.fromEquirectangular()` is synchronous and **blocks the JS event loop** for ~200–800ms depending on device — this is why we pre-bake

## Known trade-offs

- **Loading states** — `isLoading` is set in `useViewer.ts` when a `.glb` or environment map is resolving, but no visible indicator is wired up yet. A spinner or canvas overlay in `ViewerScene.vue` / `ViewerControls.vue` would close this gap.
- **Anti-aliasing** — the renderer currently has no AA pass. Options to explore: `antialias` on the renderer (MSAA), or FXAA/SMAA via `@tresjs/post-processing`. Worth exposing as a user toggle given the performance trade-off.

## Boundaries
- This app is standalone — no shared code or styles from other repos
- No Tailwind
