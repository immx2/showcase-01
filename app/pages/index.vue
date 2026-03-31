<script setup lang="ts">
useSeoMeta({
  title: 'showcase-01 — 3D Product Viewer',
  description: 'An interactive 3D product viewer built with TresJS and Nuxt 4.',
})

const { autoRotate } = useViewer()

useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.code !== 'Space') return
  const t = e.target as HTMLElement | null
  if (!t) return
  const tag = t.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON' || tag === 'A') return
  if (t.isContentEditable) return
  e.preventDefault()
  autoRotate.value = !autoRotate.value
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
    <OnboardingOverlay />
    <SplashScreen />
  </div>
</template>

<style scoped>
.root {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-surface);
}

.body {
  flex: 1;
  display: flex;
  flex-direction: row;
  min-height: 0;
}
</style>
