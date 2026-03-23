<script setup lang="ts">
/**
 * Renderless component — must live inside <TresCanvas>.
 * Each animation frame it projects every lamboHotspot's world-space position
 * to screen-space percentages and writes them to hotspotScreenPositions.
 */
import { onMounted, onUnmounted } from 'vue'
import { Vector3 } from 'three'
import { useTresContext } from '@tresjs/core'
import { useViewer, lamboHotspots } from '~/composables/useViewer'

const { camera } = useTresContext()
const { hotspotScreenPositions } = useViewer()

const _v = new Vector3()
let rafId: number

function project() {
  const cam = camera.activeCamera?.value
  if (cam) {
    hotspotScreenPositions.value = lamboHotspots.map(h => {
      _v.set(h.position[0], h.position[1], h.position[2])
      _v.project(cam)
      return {
        id: h.id,
        x: (_v.x + 1) / 2 * 100,
        y: (-_v.y + 1) / 2 * 100,
        behind: _v.z > 1,
      }
    })
  }
  rafId = requestAnimationFrame(project)
}

onMounted(() => { rafId = requestAnimationFrame(project) })
onUnmounted(() => cancelAnimationFrame(rafId))
</script>

<template />
