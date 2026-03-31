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

const cache = new Map<string, THREE.Texture>()

// Decode EXR files in a Worker so the main thread never blocks
let exrWorker: Worker | null = null

function getExrWorker(): Worker {
  if (!exrWorker) {
    exrWorker = new Worker(
      new URL('../workers/exr-loader.worker.ts', import.meta.url),
      { type: 'module' },
    )
  }
  return exrWorker
}

function decodeEXR(url: string): Promise<THREE.DataTexture> {
  return new Promise((resolve, reject) => {
    const worker = getExrWorker()
    const handler = (e: MessageEvent) => {
      if (e.data.id !== url) return
      worker.removeEventListener('message', handler)
      if (e.data.error) { reject(new Error(e.data.error as string)); return }
      const { buffer, width, height, type, format, colorSpace } = e.data
      const data = type === THREE.HalfFloatType ? new Uint16Array(buffer as ArrayBuffer) : new Float32Array(buffer as ArrayBuffer)
      const tex = new THREE.DataTexture(data, width as number, height as number, format as THREE.PixelFormat, type as THREE.TextureDataType)
      tex.colorSpace = colorSpace as string
      tex.mapping = THREE.CubeUVReflectionMapping
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
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
    scene.value.background  = null
    scene.value.backgroundIntensity  = 1 // reset for the next env
    scene.value.environmentIntensity = 1
    markEnvReady()
    return
  }

  if (afterSplash) {
    startBgFade(0)
    await new Promise<void>(resolve => setTimeout(resolve, FADE_MS))
  }

  if (cache.has(id)) {
    if (afterSplash) scene.value.backgroundIntensity = 0
    scene.value.environment = cache.get(id)!
    scene.value.background  = cache.get(id)!
    if (afterSplash) startBgFade(1)
    markEnvReady()
    return
  }

  // Cache miss — background is already faded out (or skipped for initial load)
  try {
    const tex = await decodeEXR(preset.url)
    cache.set(id, tex)
    if (envPreset.value === id) {
      if (afterSplash) scene.value.backgroundIntensity = 0
      scene.value.environment = tex
      scene.value.background  = tex
      if (afterSplash) startBgFade(1)
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
  cache.forEach(t => t.dispose())
  exrWorker?.terminate()
  exrWorker = null
})
</script>

<script lang="ts">
export default { render: () => null }
</script>
