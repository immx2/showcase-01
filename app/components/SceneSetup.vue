<script setup lang="ts">
/**
 * Renderless component that must live inside <TresCanvas>.
 * Uses useTresContext() — the canonical TresJS way to access scene/renderer —
 * to set up the environment map and the screenshot function.
 */
import { watch, onUnmounted } from 'vue'
import { useTresContext, useLoop } from '@tresjs/core'
import * as THREE from 'three'
import { useViewer, envPresets } from '~/composables/useViewer'

const { envPreset, screenshotFn, splashEnvReady } = useViewer()
const { scene, renderer, camera } = useTresContext()

// Two textures per environment, with different lifetimes:
// - env: the prefiltered PMREM (reflections). Small (512px faces for a 2k HDR)
//   and costly to rebuild, so it is cached for every visited preset.
// - background: the decoded equirect. three.js converts it to a 1024px cube, which
//   is sharp but large (~50 MB of GPU memory), so only the active preset keeps one.
//   The PMREM is not used as the background because its faces are only width/4.
// Render targets (not bare textures) so dispose() also frees their framebuffers.
const cache = new Map<string, THREE.WebGLRenderTarget>()
let activeBackground: THREE.Texture | null = null

function setBackground(bg: THREE.Texture | null) {
  const previous = activeBackground
  activeBackground = bg
  scene.value.background = bg
  previous?.dispose() // frees the equirect and the cube three.js built from it
}

// Prefilters a decoded equirect HDR into a PMREM (cube render target).
// The generator is created lazily and reused for every preset.
let pmrem: THREE.PMREMGenerator | null = null

function getPmrem(): THREE.PMREMGenerator {
  if (!pmrem) {
    pmrem = new THREE.PMREMGenerator(renderer.instance as THREE.WebGLRenderer)
    // Compile the equirect shader now, while the Worker decodes the HDR, so the
    // first bake does not also pay for the compile.
    pmrem.compileEquirectangularShader()
  }
  return pmrem
}

function bakePmrem(equirect: THREE.DataTexture): THREE.WebGLRenderTarget {
  return getPmrem().fromEquirectangular(equirect)
}

// Decode HDR files in a Worker so the main thread never blocks
let hdrWorker: Worker | null = null

function getHdrWorker(): Worker {
  if (!hdrWorker) {
    hdrWorker = new Worker(
      new URL('../workers/hdr-loader.worker.ts', import.meta.url),
      { type: 'module' },
    )
  }
  return hdrWorker
}

function decodeHDR(url: string): Promise<THREE.DataTexture> {
  return new Promise((resolve, reject) => {
    const worker = getHdrWorker()
    const handler = (e: MessageEvent) => {
      if (e.data.id !== url) return
      worker.removeEventListener('message', handler)
      if (e.data.error) { reject(new Error(e.data.error as string)); return }
      const { buffer, width, height, type, format, colorSpace, flipY } = e.data
      const data = type === THREE.HalfFloatType ? new Uint16Array(buffer as ArrayBuffer) : new Float32Array(buffer as ArrayBuffer)
      const tex = new THREE.DataTexture(data, width as number, height as number, format as THREE.PixelFormat, type as THREE.TextureDataType)
      tex.colorSpace = colorSpace as string
      tex.flipY = flipY as boolean
      tex.mapping = THREE.EquirectangularReflectionMapping
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.generateMipmaps = false
      tex.needsUpdate = true
      resolve(tex)
    }
    worker.addEventListener('message', handler)
    worker.postMessage({ id: url, url })
  })
}

// Background intensity fade — purely WebGL so the 3D model stays in front throughout.
// scene.backgroundIntensity and scene.environmentIntensity lerp to 0 together (env +
// reflections fade out), texture swaps, then lerp back to 1. Matches --duration-base.
const FADE_MS = 220
let bgFadeFrom   = 1.0
let bgFadeTarget = 1.0
let bgFadeStart  = 0

function startBgFade(target: number) {
  bgFadeFrom   = scene.value?.backgroundIntensity ?? 1.0
  bgFadeTarget = target
  bgFadeStart  = performance.now()
}

function markEnvReady() {
  if (!splashEnvReady.value) splashEnvReady.value = true
}

async function applyPreset(id: string) {
  const preset = envPresets.find(p => p.id === id)
  // Skip the fade during the initial splash load — splash handles that UX.
  const afterSplash = splashEnvReady.value

  if (!preset?.url) {
    if (afterSplash && scene.value.background !== null) {
      startBgFade(0)
      await new Promise<void>(resolve => setTimeout(resolve, FADE_MS))
    }
    scene.value.environment = null
    setBackground(null)
    scene.value.backgroundIntensity  = 1 // reset for the next env
    scene.value.environmentIntensity = 1
    markEnvReady()
    return
  }

  if (afterSplash) {
    startBgFade(0)
    await new Promise<void>(resolve => setTimeout(resolve, FADE_MS))
  }

  // Background is already faded out (or skipped for the initial load).
  // The equirect is decoded on every switch because only the PMREM is cached.
  try {
    if (!cache.has(id)) getPmrem() // starts the shader compile before the decode
    const equirect = await decodeHDR(preset.url)
    let env = cache.get(id)
    if (!env) {
      env = bakePmrem(equirect)
      cache.set(id, env)
    }
    if (envPreset.value !== id) {
      equirect.dispose() // the user switched again while this one loaded
      return
    }
    if (afterSplash) {
      scene.value.backgroundIntensity  = 0
      scene.value.environmentIntensity = 0
    }
    scene.value.environment = env.texture
    setBackground(equirect)
    if (afterSplash) {
      // The first render with a new background uploads the equirect and builds its
      // cube (one-time GPU work, a long frame). Do it now, while intensity is 0 and
      // nothing is visible, so the time-based fade-in starts after the hitch and
      // plays its full duration instead of losing most of it to that frame.
      const r = renderer.instance as THREE.WebGLRenderer
      r.render(scene.value, camera.activeCamera.value)
      startBgFade(1)
    }
    markEnvReady()
  } catch (err) {
    console.warn('[SceneSetup] env load failed:', preset.url, err)
    markEnvReady()
  }
}

// Screenshot — renderer, scene, camera all come straight from context
screenshotFn.value = () => {
  const r = renderer.instance as THREE.WebGLRenderer
  r.render(scene.value, camera.activeCamera.value)
  const url = r.domElement.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = 'product-viewer.png'
  a.click()
}

// Force-sync renderer resolution to canvas CSS size every frame so the
// WebGL viewport tracks CSS transitions (TresJS ResizeObserver fires too late).
const { onBeforeRender } = useLoop()
// Keep camera aspect and renderer size in sync with the canvas CSS size every
// frame. TresJS's ResizeObserver fires after layout (post-paint), so the camera
// aspect lags one frame behind during CSS animations. Running this in
// onBeforeRender ensures the projection is always correct before each draw.
onBeforeRender(() => {
  const r = renderer.instance as THREE.WebGLRenderer
  if (!r) return
  const canvas = r.domElement
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  if (!w || !h) return

  // Sync renderer buffer size (Three.js uses Math.floor internally)
  const dpr = r.getPixelRatio()
  if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
    r.setSize(w, h, false)
  }

  // Always sync camera aspect — this is what actually causes the visible snap
  const cam = camera.activeCamera.value as THREE.PerspectiveCamera
  if (cam?.isPerspectiveCamera) {
    const aspect = w / h
    if (Math.abs(cam.aspect - aspect) > 0.0001) {
      cam.aspect = aspect
      cam.updateProjectionMatrix()
    }
  }

  // Drive background + environment intensity toward target (linear over FADE_MS)
  if (scene.value && bgFadeTarget !== bgFadeFrom) {
    const t = Math.min(1, (performance.now() - bgFadeStart) / FADE_MS)
    const intensity = bgFadeFrom + (bgFadeTarget - bgFadeFrom) * t
    scene.value.backgroundIntensity  = intensity
    scene.value.environmentIntensity = intensity
  }
})

watch(
  [envPreset, renderer.isInitialized],
  ([preset]) => { if (renderer.isInitialized.value) applyPreset(preset as string) },
  { immediate: true }
)

onUnmounted(() => {
  cache.forEach(t => t.dispose()) // render targets: frees textures and framebuffers
  setBackground(null)
  pmrem?.dispose()
  pmrem = null
  hdrWorker?.terminate()
  hdrWorker = null
})
</script>

<script lang="ts">
export default { render: () => null }
</script>
