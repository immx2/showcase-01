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
  <div class="flex h-full flex-col bg-default">
    <AppNav />
    <div class="flex min-h-0 flex-1">
      <AppToolbar />
      <ClientOnly>
        <ViewerScene />
      </ClientOnly>
    </div>
    <AppOnboarding />
    <AppSplash />
  </div>
</template>
