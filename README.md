<div align="center">

# Showcase 01

**An interactive 3D product viewer for the browser.**

Orbit a Lamborghini Aventador. Swap materials, lighting, and environments. Inspect annotated hotspots. Capture a screenshot.

![Nuxt 4](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt&logoColor=white)
![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-TresJS-000000?logo=threedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-blue)

</div>

---

## Overview

Showcase 01 is a portfolio piece. It shows how complex real-time rendering can feel simple in the browser. The UI hides all Three.js detail from the user. The design system is built for this project and does not come from a template.

## Features

- **Orbit controls.** Rotate, pan, and zoom the model. Auto-rotate is on by default.
- **Models.** View the Lamborghini Aventador or one of five primitives: box, icosahedron, octahedron, sphere, and torus knot.
- **Materials.** Choose Chrome, Matte Black, Brushed Steel, Gloss Red, or Ceramic.
- **Lighting.** Choose the Studio, Dramatic, Soft, or Cold light preset.
- **Environments.** Choose the Sunset, Tower, Forest, or Night HDR. The reflections and the background change together.
- **Wireframe toggle.** Switch between solid and wireframe geometry.
- **Hotspots.** Four annotations follow the car in 3D space: V10 Engine, Active Rear Wing, Hex Air Intakes, and Carbon Fibre Shell.
- **Screenshot export.** Save the canvas in its current state.
- **Onboarding.** A gesture overlay teaches the controls on the first visit.
- **Color mode.** Choose light, dark, or system.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Nuxt 4](https://nuxt.com) + Vue 3 |
| 3D | [TresJS](https://tresjs.org) (`@tresjs/nuxt`, `@tresjs/cientos`) + [Three.js](https://threejs.org) |
| UI components | [Nuxt UI v4](https://ui.nuxt.com) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) utility classes with Nuxt UI semantic colors |
| Icons | [Lucide](https://lucide.dev) through `@iconify-json/lucide`, bundled locally |
| Color mode | `@nuxtjs/color-mode`, registered by Nuxt UI. Storage key: `showcase-color-mode`. |
| Utilities | [VueUse](https://vueuse.org) through `@vueuse/nuxt` |
| Shared navigation | `@immx2/portfolio-nav`, the top strip shared with the portfolio site |
| Language | TypeScript |
| Linting | ESLint (`@nuxt/eslint`) and Stylelint |
| Hosting | Vercel, with Analytics and Speed Insights |

## Design system

The design system is built for this project.

- **Theme.** `app/app.config.ts` sets the colors. `primary` is `neutral` and `neutral` is `stone`.
- **Tokens.** `app/assets/styles/main.css` holds the Tailwind `@theme`: font, easing, and the hotspot pulse animation. Spacing, radius, and duration use Tailwind's scales.
- **Component styles.** Components use Tailwind utility classes. Nuxt UI components change through the `ui` prop. No component has a `<style>` block.
- **Semantic colors.** Utilities such as `bg-default` and `text-muted` read the Nuxt UI variables `--ui-bg` and `--ui-text-muted`. No component hardcodes a UI color.
- **Navigation bridge.** `global.css` maps `--color-bg`, `--color-text`, `--color-text-muted`, and `--color-border` onto `--ui-*` variables. The shared `portfolio-nav` strip reads those four names.
- **Font.** Inter, loaded from Google Fonts.

## Getting started

Install the dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open <http://localhost:3001>.

### Scripts

| Command | Action |
|---|---|
| `npm run dev` | Start the dev server on port 3001 |
| `npm run build` | Create a production build |
| `npm run generate` | Create static output |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run lint:css` | Run Stylelint |
| `npm run lint:all` | Run ESLint and Stylelint |
| `npm run typecheck` | Run the TypeScript check |

Before a commit, run the checks that match the change:

- **Style-only change:** `npm run lint:css`
- **Code-only change:** `npm run lint && npm run typecheck`
- **Mixed change:** `npm run lint:all && npm run typecheck`

## Architecture

### State

`app/composables/useViewer.ts` owns all shared state. Components read from it with `useViewer()`. Components do not talk to each other directly.

### Adding a product model

1. Put a `.glb` file in `public/models/`.
2. Create a component that follows `LamboModel.vue`. Load the file with `useGLTF`. Apply materials with `scene.traverse`.
3. Add the new id and label to `geometryOptions` in `useViewer.ts`.
4. Render the component in `ViewerScene.vue` when `geometry` matches the id.

### Environment maps

Each environment is a pre-baked `.exr` file in `public/env/`. The baked file holds the full PMREM mip chain. A Web Worker decodes the file off the main thread. The main thread then uploads the texture to the GPU. No `PMREMGenerator` runs at runtime, so a switch costs about 2 ms of main-thread time. The app fades the reflections and the background together over 220 ms.

### Project structure

```
app/
  components/
    App/
      Nav.vue              Top navigation
      Toolbar.vue          Viewer controls
      PresetList.vue       Preset list used inside popovers
      RailButton.vue       Toolbar button
      PanelLabel.vue       Small uppercase label for popover panels
      PanelRow.vue         Label and value row for popover panels
      Onboarding.vue       First-visit gesture overlay
      Splash.vue           Loading screen
    ViewerScene.vue        TresCanvas and scene composition
    LamboModel.vue         GLB loader and material setup
    SceneSetup.vue         Renderless: env map and screenshot access
    ModelHotspots.vue      Hotspot overlay
    HotspotProjector.vue   World-to-screen projection for one hotspot
    EnvBaker.vue           Dev only: in-browser env map baking
  composables/
    useViewer.ts           Single source of truth for viewer state
  workers/
    exr-loader.worker.ts   Decodes EXR files off the main thread
  pages/
    index.vue
    dev/bake-envmaps.vue   Dev route for env map baking
public/
  models/                  .glb assets
  env/                     Baked .exr environment maps
```

## Known trade-offs

The renderer has no anti-aliasing pass. Options are MSAA on the renderer, or FXAA/SMAA through `@tresjs/post-processing`. A user toggle could expose the performance trade-off.

## Dev tools

The `/dev/bake-envmaps` route bakes environment maps in the browser. Run `npm run dev`, open the route, and wait for the downloads. Move the `.exr` files to `public/env/`. `CLAUDE.md` holds the project conventions and the full env map pipeline.

## Credits

- **Model:** ["Lamborghini Aventador"](https://sketchfab.com/3d-models/lamborghini-aventador-888e37a3641d4f7b94bc1a39396e2441) by [Arion Digital](https://sketchfab.com/andrewswihart), licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/).
- **HDRIs:** [Poly Haven](https://polyhaven.com/hdris), licensed under CC0.

## License

[MIT](LICENSE)
