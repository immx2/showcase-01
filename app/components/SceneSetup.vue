<script setup lang="ts">
/**
 * Renderless component that must live inside <TresCanvas>.
 * Uses useTresContext() — the canonical TresJS way to access scene/renderer —
 * to set up the environment map and the screenshot function.
 */
import { watch, onUnmounted } from 'vue'
import { useTresContext, useLoop } from '@tresjs/core'
import * as THREE from 'three'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'
import { useViewer, envPresets } from '~/composables/useViewer'

const { envPreset, screenshotFn, splashEnvReady } = useViewer()
const { scene, renderer, camera } = useTresContext()

let pmrem: THREE.PMREMGenerator | null = null
const cache = new Map<string, THREE.Texture>()

function getPmrem(): THREE.PMREMGenerator {
  if (!pmrem) {
    pmrem = new THREE.PMREMGenerator(renderer.instance as THREE.WebGLRenderer)
    pmrem.compileEquirectangularShader()
  }
  return pmrem
}

function markEnvReady() {
  if (!splashEnvReady.value) splashEnvReady.value = true
}

async function applyPreset(id: string) {
  const preset = envPresets.find(p => p.id === id)

  if (!preset?.url) {
    scene.value.environment = null
    scene.value.background  = null
    markEnvReady()
    return
  }

  if (cache.has(id)) {
    scene.value.environment = cache.get(id)!
    scene.value.background  = cache.get(id)!
    markEnvReady()
    return
  }

  try {
    const hdr = await new HDRLoader().loadAsync(preset.url)
    const tex = getPmrem().fromEquirectangular(hdr).texture
    hdr.dispose()
    cache.set(id, tex)
    // Guard against a preset switch that happened while loading
    if (envPreset.value === id) {
      scene.value.environment = tex
      scene.value.background  = tex
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
})

watch(
  [envPreset, renderer.isInitialized],
  ([preset]) => { if (renderer.isInitialized.value) applyPreset(preset as string) },
  { immediate: true }
)

onUnmounted(() => {
  cache.forEach(t => t.dispose())
  pmrem?.dispose()
})
</script>

<script lang="ts">
export default { render: () => null }
</script>
