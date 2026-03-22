<script setup lang="ts">
import { watch } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import * as THREE from 'three'
import { useViewer } from '~/composables/useViewer'

const { geometry, color, metalness, roughness, wireframe, autoRotate, lightConfig, vertexCount } = useViewer()

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
</script>

<template>
  <div class="scene-wrapper">
    <TresCanvas
      clear-color="#f5f4f0"
      alpha
      class="canvas"
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
          :env-map-intensity="1.0"
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
