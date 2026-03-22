<script setup lang="ts">
useSeoMeta({
  title: 'showcase-01 — 3D Product Viewer',
  description: 'An interactive 3D product viewer built with TresJS and Nuxt 4.',
})
</script>

<template>
  <div class="root">
    <AppNav />
    <ClientOnly>
      <ViewerScene />
    </ClientOnly>
    <ViewerControls />
    <ViewerOverlay />
  </div>
</template>

<style scoped>
.root {
  position: relative;
  height: 100dvh;
  overflow: hidden;
  background: var(--color-bg);
}
</style>
