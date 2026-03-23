<script setup lang="ts">
/**
 * Renderless component that must live inside <TresCanvas>.
 * Uses useTresContext() — the canonical TresJS way to access scene/renderer —
 * to set up the environment map and the screenshot function.
 */
import { watch, onUnmounted } from 'vue'
import { useTresContext } from '@tresjs/core'
import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { useViewer, envPresets } from '~/composables/useViewer'

const { envPreset, screenshotFn } = useViewer()
const { scene, renderer, camera } = useTresContext()

let pmrem: THREE.PMREMGenerator | null = null
const cache = new Map<string, THREE.Texture>()

function getPmrem(): THREE.PMREMGenerator {
  if (!pmrem) {
    pmrem = new THREE.PMREMGenerator(renderer.value)
    pmrem.compileEquirectangularShader()
  }
  return pmrem
}

async function applyPreset(id: string) {
  const preset = envPresets.find(p => p.id === id)

  if (!preset?.url) {
    scene.environment = null
    scene.background  = null
    return
  }

  if (cache.has(id)) {
    scene.environment = cache.get(id)!
    scene.background  = cache.get(id)!
    return
  }

  try {
    const hdr = await new RGBELoader().loadAsync(preset.url)
    const tex = getPmrem().fromEquirectangular(hdr).texture
    hdr.dispose()
    cache.set(id, tex)
    // Guard against a preset switch that happened while loading
    if (envPreset.value === id) {
      scene.environment = tex
      scene.background  = tex
    }
  } catch (err) {
    console.warn('[SceneSetup] env load failed:', preset.url, err)
  }
}

// Screenshot — renderer, scene, camera all come straight from context
screenshotFn.value = () => {
  renderer.value.render(scene, camera.value)
  const url = renderer.value.domElement.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = 'product-viewer.png'
  a.click()
}

watch(envPreset, applyPreset, { immediate: true })

onUnmounted(() => {
  cache.forEach(t => t.dispose())
  pmrem?.dispose()
})
</script>

<template />
