<script setup lang="ts">
import { watch } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls, useGLTF } from '@tresjs/cientos'
import * as THREE from 'three'
import { useViewer } from '~/composables/useViewer'

const { geometry, color, metalness, roughness, wireframe, autoRotate, lightConfig, vertexCount } = useViewer()

const { state: lamboGltf } = useGLTF('/models/lamborghini.glb')

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

function countLamboVertices(): number {
  const scene = lamboGltf.value?.scene
  if (!scene) return 0
  let count = 0
  scene.traverse((child: THREE.Object3D) => {
    const mesh = child as THREE.Mesh
    if (mesh.isMesh && mesh.geometry?.attributes?.position) {
      count += mesh.geometry.attributes.position.count
    }
  })
  return count
}

watch(geometry, (geo) => {
  vertexCount.value = geo === 'lamborghini'
    ? countLamboVertices()
    : countBuiltinVertices(geo)
}, { immediate: true })

function applyLamboMaterial() {
  const scene = lamboGltf.value?.scene
  if (!scene) return
  scene.traverse((child: THREE.Object3D) => {
    if (!(child as THREE.Mesh).isMesh) return
    const mats = Array.isArray((child as THREE.Mesh).material)
      ? (child as THREE.Mesh).material as THREE.MeshStandardMaterial[]
      : [(child as THREE.Mesh).material as THREE.MeshStandardMaterial]
    for (const mat of mats) {
      if (!mat || !('color' in mat)) continue
      mat.color.set(color.value)
      mat.metalness = metalness.value
      mat.roughness = roughness.value
      mat.wireframe = wireframe.value
      mat.needsUpdate = true
    }
  })
}

watch(lamboGltf, (gltf) => {
  if (!gltf?.scene) return
  gltf.scene.scale.setScalar(0.5)
  gltf.scene.position.set(0, -0.6, 0)
  applyLamboMaterial()
  vertexCount.value = countLamboVertices()
})

watch([color, metalness, roughness, wireframe], applyLamboMaterial)
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

      <!-- Lamborghini GLB model -->
      <primitive
        v-if="geometry === 'lamborghini' && lamboGltf?.scene"
        :object="lamboGltf.scene"
      />

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
