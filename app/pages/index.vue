<script setup lang="ts">
useSeoMeta({
  title: 'showcase-01 — 3D Product Viewer',
  description: 'An interactive 3D product viewer built with TresJS and Nuxt 4.',
})


</script>

<template>
  <div class="root">
    <AppNav />
    <div class="body">
      <ViewerControls />
      <ClientOnly>
        <ViewerScene />
      </ClientOnly>
    </div>
    <ViewerOverlay />
    <OnboardingOverlay />
  </div>
</template>

<style scoped>
.root {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  background: var(--color-bg);
}

.body {
  flex: 1;
  display: flex;
  flex-direction: row;
  min-height: 0;
}
</style>
