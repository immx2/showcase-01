# showcase-01 — Project Instructions

> Update this file in the same commit as the code change it describes. A stale CLAUDE.md is worse than none.

## Intent
An interactive 3D product viewer built as a standalone Nuxt 4 app. The design system is purpose-built for this project — not shared with or borrowed from any other repo.

Dev server runs on port 3001 (`npm run dev`).

## Linting & Typecheck
- Fix all errors before committing.
- **CSS/style-only changes** (only `.css` files or only `<style>` blocks in `.vue` files): run `npm run lint:css` (Stylelint only).
- **Code-only changes** (any `.ts` files, or `<script>` blocks in `.vue` files): run `npm run lint && npm run typecheck` (ESLint + typecheck, skip CSS).
- **Mixed changes** (both code and CSS): run `npm run lint:all && npm run typecheck`.
- `npm run lint` — ESLint only (JS/TS/Vue `<script>`)
- `npm run lint:css` — Stylelint only (CSS/Vue `<style>`)
- `npm run lint:all` — ESLint + Stylelint

## Conventions

### State
`useViewer.ts` is the single source of truth. All components read from it via `useViewer()` — no local state for anything shared. When adding a new control, add its state here first, then wire up in `ViewerScene`/`LamboModel` and `AppToolbar`. Toolbar buttons use `AppRailButton`; preset lists inside popovers use `AppPresetList`.

`screenshotFn` is a special ref: `ViewerScene` writes a closure into it on canvas ready, `AppToolbar` calls it. Pattern for any action that needs renderer access from a sibling component.

### CSS
- UI is built on **Nuxt UI v4** (`@nuxt/ui`). Prefer its components (`UButton`, `UPopover`, `UDropdownMenu`, `UModal`, `USlider`, ...) over hand-rolled markup. Icons are Lucide via `i-lucide-*` (`@iconify-json/lucide` is installed, so icons bundle locally).
- **Tailwind-first:** style our own markup with Tailwind CSS 4 utility classes. Prefer Nuxt UI's semantic utilities (`bg-default`, `bg-muted`, `bg-elevated`, `border-default`, `border-accented`, `text-muted`, `text-dimmed`, `text-highlighted`, `text-primary`, `ring-accented`) over raw palette classes (`bg-neutral-900`).
- **Nuxt UI idioms:** restyle a Nuxt UI component through its `ui` prop (slot classes) or `app.config.ts`, not with `:deep()` selectors. Use the `color` and `variant` props for state. Put values that repeat across components into `@theme` in `main.css`. Extract a component when the same utility string appears three or more times (`AppPanelLabel`, `AppPanelRow`).
- **Theme tokens:** `main.css` holds `@theme` (font, `ease-snappy`, `animate-hotspot-pulse`). Use Tailwind's spacing, radius, and duration scales. There is no `tokens.css`.
- **Tooltips:** use `UTooltip`, never the native `title` attribute. Keep `aria-label` on icon-only controls. `AppRailButton` wraps its `UButton` in a `UTooltip` that is disabled while the rail is expanded. It sets `inheritAttrs: false` and forwards `$attrs` to the `UButton`, so reka-ui triggers such as `UPopover` still work.
- Vue `<Transition>`: set the state classes through props (`enter-active-class` and so on) instead of a `<style>` block.
- **Color theme lives in `app/app.config.ts`** (`ui.colors.primary` = accent, `ui.colors.neutral` = chrome tint). There is no custom color file. In CSS and arbitrary values use Nuxt UI's semantic vars (utilities such as `bg-default` map to them): `--ui-bg`, `--ui-bg-muted`, `--ui-bg-elevated`, `--ui-border`, `--ui-border-accented`, `--ui-text`, `--ui-text-highlighted`, `--ui-text-muted`, `--ui-text-dimmed`, `--ui-primary`. Never hardcode UI colors.
- **`@immx2/portfolio-nav` bridge:** the shared top strip (from the `my-portfolio` sibling repo) reads `--color-bg`, `--color-text`, `--color-text-muted`, `--color-border` and falls back to light values if they are missing. `global.css` maps those four names onto `--ui-*` variables. Do not delete that block, and do not add other `--color-*` tokens of our own.
- The WebGL clear color in `ViewerScene.vue` is a hex that must be kept in sync with `--ui-bg-muted` if the `neutral` color changes.
- Color mode is handled by `@nuxtjs/color-mode`, which Nuxt UI registers (configured in `nuxt.config.ts`, storage key `showcase-color-mode`). It sets a `dark` class on `<html>`. Use `useColorMode()` (auto-imported) — `colorMode.preference` is 'system'|'light'|'dark', `colorMode.value` is the resolved 'light'|'dark'. The preference is client-only, so gate UI that depends on it with `useMounted()` to avoid hydration mismatches.
- No `<style scoped>` blocks and no CSS-in-JS. Use a `<style>` block only for what utilities cannot express. Global CSS lives in `app/assets/styles/` (`main.css`: Tailwind + Nuxt UI + `@theme`; `global.css`: portfolio-nav bridge + base rules).

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

- **Anti-aliasing** — the renderer currently has no AA pass. Options to explore: `antialias` on the renderer (MSAA), or FXAA/SMAA via `@tresjs/post-processing`. Worth exposing as a user toggle given the performance trade-off.

## Boundaries
- This app is standalone — no shared code or styles from other repos
- No hardcoded UI colors: use Nuxt UI semantic utilities or `--ui-*` variables

## Claude Code Settings
Permissions and plugin config live in `.claude/settings.json` (tracked in git) so they apply on every machine. Claude Code defaults new session-granted permissions to `.claude/settings.local.json` — move non-sensitive ones into `settings.json` manually.

When suggesting a permission to add:
- **Non-sensitive** (e.g. `npm run:*`, `WebFetch(domain:...)`, MCP read tools): suggest adding to `settings.json`
- **Sensitive** (e.g. broad `Bash(**)`, destructive commands, `git push`, `rm`): suggest adding to `settings.local.json` only, and note that it won't be shared across machines
