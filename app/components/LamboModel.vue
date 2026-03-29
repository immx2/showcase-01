<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useGLTF } from '@tresjs/cientos'
import * as THREE from 'three'
import { useViewer } from '~/composables/useViewer'

const { color, metalness, roughness, wireframe, vertexCount, isLoading, envEnabled, splashModelReady } = useViewer()

const { state: lamboGltf } = useGLTF('/models/lamborghini.glb')

onMounted(() => {
  if (!lamboGltf.value?.scene) isLoading.value = true
})

function applyMaterial() {
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
      mat.envMapIntensity = envEnabled.value ? 1.0 : 0.0
      mat.needsUpdate = true
    }
  })
}

watch(lamboGltf, (gltf) => {
  if (!gltf?.scene) return
  const box = new THREE.Box3().setFromObject(gltf.scene)
  const size = new THREE.Vector3()
  box.getSize(size)
  // Normalize by the camera-facing cross-section (x/y), not the car's depth (z),
  // so the visible size matches the built-in primitives at the same camera distance.
  const maxDim = Math.max(size.x, size.y)
  gltf.scene.scale.setScalar(2.8 / maxDim)
  box.setFromObject(gltf.scene)
  const center = new THREE.Vector3()
  box.getCenter(center)
  gltf.scene.position.set(0, -center.y, 0)
  gltf.scene.rotation.y = 0
  applyMaterial()
  isLoading.value = false
  if (!splashModelReady.value) splashModelReady.value = true
  let count = 0
  gltf.scene.traverse((child: THREE.Object3D) => {
    const mesh = child as THREE.Mesh
    if (mesh.isMesh && mesh.geometry?.attributes?.position) {
      count += mesh.geometry.attributes.position.count
    }
  })
  vertexCount.value = count
})

watch([color, metalness, roughness, wireframe, envEnabled], applyMaterial)
</script>

<template>
  <primitive v-if="lamboGltf?.scene" :object="lamboGltf.scene" />
</template>
