<script setup lang="ts">
import { watch } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { useViewer, envPresets } from '~/composables/useViewer'

const {
  geometry, color, metalness, roughness, wireframe,
  autoRotate, lightConfig, vertexCount,
  envPreset, envEnabled, screenshotFn,
} = useViewer()

function countBuiltinVertices(geo: typeof geometry.value): number {
  let g: THREE.BufferGeometry
  switch (geo) {
    case 'icosahedron': g = new THREE.IcosahedronGeometry(1.4, 6); break
    case 'sphere':      g = new THREE.SphereGeometry(1.4, 64, 64); break
    case 'torusKnot':   g = new THREE.TorusKnotGeometry(0.9, 0.34, 200, 32); break
    case 'box':         g = new THREE.BoxGeometry(2, 2, 2); break
    case 'octahedron':  g = new THREE.OctahedronGeometry(1.5, 4); break
    default: return 0
  }
  const count = g.attributes.position.count
  g.dispose()
  return count
}

watch(geometry, (geo) => {
  if (geo !== 'lamborghini') vertexCount.value = countBuiltinVertices(geo)
}, { immediate: true })

// Environment — HDRs loaded on demand, cached by preset id
let pmremRef: THREE.PMREMGenerator | null = null
let sceneRef: THREE.Scene | null = null
let rendererRef: THREE.WebGLRenderer | null = null
let cameraRef: THREE.Camera | null = null
const envCache = new Map<string, THREE.Texture>()

type TresContext = {
  scene: THREE.Scene
  renderer: { value: THREE.WebGLRenderer }
  camera: { value: THREE.Camera }
}

async function applyEnvPreset(presetId: string) {
  if (!sceneRef || !pmremRef) return
  const preset = envPresets.find(p => p.id === presetId)
  if (!preset || !preset.url) {
    sceneRef.environment = null
    sceneRef.background = null
    return
  }

  // Serve from cache if already loaded
  if (envCache.has(presetId)) {
    sceneRef.environment = envCache.get(presetId)!
    sceneRef.background  = envCache.get(presetId)!
    return
  }

  try {
    const loader = new RGBELoader()
    const hdr = await loader.loadAsync(preset.url)
    const tex = pmremRef.fromEquirectangular(hdr).texture
    hdr.dispose()
    envCache.set(presetId, tex)
    // Guard: user may have switched presets while this was loading
    if (envPreset.value === presetId && sceneRef) {
      sceneRef.environment = tex
      sceneRef.background  = tex
    }
  } catch (err) {
    console.warn('[env] failed to load', preset.url, err)
  }
}

function onCanvasReady({ scene, renderer, camera }: TresContext) {
  sceneRef    = scene
  rendererRef = renderer.value
  cameraRef   = camera.value

  pmremRef = new THREE.PMREMGenerator(renderer.value)
  pmremRef.compileEquirectangularShader()

  applyEnvPreset(envPreset.value)

  screenshotFn.value = () => {
    if (!rendererRef || !sceneRef || !cameraRef) return
    rendererRef.render(sceneRef, cameraRef)
    const url = rendererRef.domElement.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'product-viewer.png'
    a.click()
  }
}

watch(envPreset, applyEnvPreset)
</script>

<template>
  <div class="scene-wrapper">
    <TresCanvas
      clear-color="#f5f4f0"
      alpha
      preserve-drawing-buffer
      class="canvas"
      @ready="onCanvasReady"
    >
      <TresPerspectiveCamera
        :position="[0, 0, 6]"
        :fov="45"
        :near="0.1"
        :far="100"
      />

      <OrbitControls
        :enable-damping="true"
        :damping-factor="0.06"
        :auto-rotate="autoRotate"
        :auto-rotate-speed="3"
        :min-distance="3"
        :max-distance="12"
        :enable-pan="false"
      />

      <!-- Reactive lights driven by preset -->
      <TresAmbientLight :intensity="lightConfig.ambient" />
      <TresDirectionalLight
        :position="lightConfig.key.pos"
        :intensity="lightConfig.key.intensity"
        :color="lightConfig.key.color"
      />
      <TresDirectionalLight
        :position="lightConfig.fill.pos"
        :intensity="lightConfig.fill.intensity"
        :color="lightConfig.fill.color"
      />
      <TresDirectionalLight
        :position="lightConfig.rim.pos"
        :intensity="lightConfig.rim.intensity"
        :color="lightConfig.rim.color"
      />

      <!-- Lamborghini — loaded on demand -->
      <LamboModel v-if="geometry === 'lamborghini'" />

      <!-- Main solid mesh — keyed so geometry swap force-remounts -->
      <TresMesh v-else :position="[0, 0, 0]" :key="`solid-${geometry}`">
        <TresIcosahedronGeometry v-if="geometry === 'icosahedron'" :args="[1.4, 6]" />
        <TresSphereGeometry     v-else-if="geometry === 'sphere'"      :args="[1.4, 64, 64]" />
        <TresTorusKnotGeometry  v-else-if="geometry === 'torusKnot'"   :args="[0.9, 0.34, 200, 32]" />
        <TresBoxGeometry        v-else-if="geometry === 'box'"         :args="[2, 2, 2]" />
        <TresOctahedronGeometry v-else-if="geometry === 'octahedron'"  :args="[1.5, 4]" />

        <TresMeshPhysicalMaterial
          :color="color"
          :metalness="metalness"
          :roughness="roughness"
          :env-map-intensity="envEnabled ? 1.0 : 0.0"
          :clearcoat="0.2"
          :clearcoat-roughness="0.1"
        />
      </TresMesh>

      <!-- Wireframe overlay mesh -->
      <TresMesh v-if="wireframe && geometry !== 'lamborghini'" :position="[0, 0, 0]" :key="`wire-${geometry}`">
        <TresIcosahedronGeometry v-if="geometry === 'icosahedron'" :args="[1.4, 6]" />
        <TresSphereGeometry     v-else-if="geometry === 'sphere'"      :args="[1.4, 64, 64]" />
        <TresTorusKnotGeometry  v-else-if="geometry === 'torusKnot'"   :args="[0.9, 0.34, 200, 32]" />
        <TresBoxGeometry        v-else-if="geometry === 'box'"         :args="[2, 2, 2]" />
        <TresOctahedronGeometry v-else-if="geometry === 'octahedron'"  :args="[1.5, 4]" />

        <TresMeshBasicMaterial
          color="#888070"
          :wireframe="true"
          :transparent="true"
          :opacity="0.35"
          :depthTest="false"
        />
      </TresMesh>
    </TresCanvas>
  </div>
</template>

<style scoped>
.scene-wrapper {
  position: fixed;
  inset: 0;
  top: var(--nav-height);
}

.canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
