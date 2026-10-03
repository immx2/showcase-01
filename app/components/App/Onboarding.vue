<script setup lang="ts">
const STORAGE_KEY = 'showcase-01:onboarding-seen'
const { showOnboarding, splashDone } = useViewer()

const tips = [
  { icon: 'i-lucide-move-3d', bold: 'Drag', text: 'to orbit · ', bold2: 'Scroll', text2: 'to zoom' },
  { icon: 'i-lucide-box', bold: 'Model name', text: 'in the top nav — choose geometries' },
  { icon: 'i-lucide-sliders-horizontal', bold: 'Toolbar', text: 'on the left — swap materials, lighting & environment' },
  { icon: 'i-lucide-keyboard', bold: 'Spacebar', text: 'toggles auto-orbit on and off' },
  { icon: 'i-lucide-camera', bold: 'Camera', text: 'button saves a screenshot' },
]

watch(splashDone, (done) => {
  if (!done) return
  if (!localStorage.getItem(STORAGE_KEY)) showOnboarding.value = true
}, { immediate: true })

// Any way of closing the guide (button, X, Esc, overlay) marks it as seen
watch(showOnboarding, (open) => {
  if (!open) localStorage.setItem(STORAGE_KEY, '1')
})
</script>

<template>
  <UModal
    v-model:open="showOnboarding"
    title="Explore every angle"
    description="Rotate, zoom, and customise any model in real time."
    :ui="{ content: 'max-w-md', footer: 'px-6 pt-4 pb-6' }"
  >
    <template #body>
      <ul class="flex flex-col gap-4">
        <li v-for="tip in tips" :key="tip.bold" class="flex items-center gap-3 text-sm/snug text-toned">
          <span class="flex size-9 shrink-0 items-center justify-center rounded-md border border-default bg-elevated text-primary">
            <UIcon :name="tip.icon" class="size-5" />
          </span>
          <span>
            <strong class="font-semibold text-highlighted">{{ tip.bold }}</strong> {{ tip.text }}<template v-if="tip.bold2"><strong class="font-semibold text-highlighted">{{ tip.bold2 }}</strong> {{ tip.text2 }}</template>
          </span>
        </li>
      </ul>
    </template>

    <template #footer>
      <div class="flex w-full flex-col gap-4">
        <p class="text-center text-[0.8rem] text-muted">Reopen this guide anytime with the <strong class="font-semibold text-highlighted">?</strong> button in the top nav.</p>
        <UButton
          label="Start exploring"
          color="neutral"
          class="self-center"
          trailing-icon="i-lucide-arrow-right"
          :ui="{ label: 'relative -top-[0.07em]' }"
          @click="showOnboarding = false"
        />
      </div>
    </template>
  </UModal>
</template>
