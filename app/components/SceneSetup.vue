<script setup lang="ts">
/**
 * Renderless component that must live inside <TresCanvas>.
 * Uses useTresContext() — the canonical TresJS way to access scene/renderer —
 * to set up the environment map and the screenshot function.
 */
import { watch, onUnmounted } from 'vue'
import { useTresContext } from '@tresjs/core'
import * as THREE from 'three'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'
import { useViewer, envPresets } from '~/composables/useViewer'

const { envPreset, screenshotFn } = useViewer()
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

async function applyPreset(id: string) {
  const preset = envPresets.find(p => p.id === id)

  if (!preset?.url) {
    scene.value.environment = null
    scene.value.background  = null
    return
  }

  if (cache.has(id)) {
    scene.value.environment = cache.get(id)!
    scene.value.background  = cache.get(id)!
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
  } catch (err) {
    console.warn('[SceneSetup] env load failed:', preset.url, err)
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

<template />
