<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useGLTF } from '@tresjs/cientos'
import * as THREE from 'three'
import { useViewer } from '~/composables/useViewer'

const { color, metalness, roughness, wireframe, vertexCount, isLoading, envEnabled } = useViewer()

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
  gltf.scene.scale.setScalar(0.5)
  gltf.scene.position.set(0, -0.6, 0)
  gltf.scene.rotation.y = Math.PI
  applyMaterial()
  isLoading.value = false
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
