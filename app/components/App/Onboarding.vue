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
    :ui="{ content: 'max-w-md' }"
  >
    <template #body>
      <ul class="tips">
        <li v-for="tip in tips" :key="tip.bold" class="tip">
          <span class="tip-icon">
            <UIcon :name="tip.icon" class="tip-glyph" />
          </span>
          <span>
            <strong>{{ tip.bold }}</strong> {{ tip.text }}<template v-if="tip.bold2"><strong>{{ tip.bold2 }}</strong> {{ tip.text2 }}</template>
          </span>
        </li>
      </ul>
    </template>

    <template #footer>
      <div class="footer">
        <p class="reopen-hint">Reopen this guide anytime with the <strong>?</strong> button in the top nav.</p>
        <UButton
          label="Start exploring"
          trailing-icon="i-lucide-arrow-right"
          @click="showOnboarding = false"
        />
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.tips {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.tip {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: 0.875rem;
  line-height: 1.45;
  color: var(--ui-text-toned);
}

.tip strong {
  font-weight: 600;
  color: var(--ui-text-highlighted);
}

.tip-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius);
  color: var(--ui-primary);
}

.tip-glyph {
  width: 20px;
  height: 20px;
}

.footer {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.reopen-hint {
  flex: 1 1 14rem;
  font-size: 0.8rem;
  color: var(--ui-text-muted);
}

.reopen-hint strong {
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
</style>
