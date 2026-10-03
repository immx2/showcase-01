<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { geometryGroups, geometryOptions } from '~/composables/useViewer'

const { showOnboarding, geometry, vertexCount, isLoading } = useViewer()
const isLambo = computed(() => geometry.value === 'lamborghini')
const colorMode = useColorMode()
const mounted = useMounted()

const modelName = computed(() => geometryOptions.find(o => o.id === geometry.value)?.label ?? '')

const geoItems = computed<DropdownMenuItem[][]>(() => geometryGroups.map(g => [
  { type: 'label', label: g.label },
  ...g.options.map(o => ({
    label: o.label,
    type: 'checkbox' as const,
    checked: geometry.value === o.id,
    onSelect: () => { geometry.value = o.id },
  })),
]))

const modes = [
  { value: 'system', label: 'Auto (device)', icon: 'i-lucide-monitor' },
  { value: 'light', label: 'Light', icon: 'i-lucide-sun' },
  { value: 'dark', label: 'Dark', icon: 'i-lucide-moon' },
] as const

// Preference is only known on the client; avoid a hydration mismatch on the active state
const isActiveMode = (value: string) => mounted.value && colorMode.preference === value
</script>

<template>
  <header class="nav">
    <div class="nav-start">
      <UDropdownMenu :items="geoItems" :content="{ align: 'start' }">
        <UButton
          :label="modelName"
          trailing-icon="i-lucide-chevrons-up-down"
          color="neutral"
          variant="ghost"
          class="model-btn"
          aria-label="Select model"
        />
      </UDropdownMenu>

      <span v-if="!isLoading" class="model-stat">{{ vertexCount.toLocaleString() }} vertices</span>
      <a
        v-if="isLambo && !isLoading"
        class="model-attr"
        href="https://sketchfab.com/3d-models/lamborghini-aventador-888e37a3641d4f7b94bc1a39396e2441"
        target="_blank"
        rel="noopener noreferrer"
        title="Lamborghini Aventador by Arion Digital — CC BY 4.0"
      >CC BY · Arion Digital</a>
    </div>

    <div class="nav-end">
      <UFieldGroup role="group" aria-label="Color mode">
        <UButton
          v-for="mode in modes"
          :key="mode.value"
          :icon="mode.icon"
          :title="mode.label"
          :aria-label="mode.label"
          :aria-pressed="isActiveMode(mode.value)"
          :color="isActiveMode(mode.value) ? 'primary' : 'neutral'"
          :variant="isActiveMode(mode.value) ? 'soft' : 'outline'"
          size="sm"
          @click="colorMode.preference = mode.value"
        />
      </UFieldGroup>

      <UButton
        icon="i-lucide-circle-help"
        aria-label="Open guide"
        title="Open guide"
        color="neutral"
        variant="ghost"
        @click="showOnboarding = true"
      />
    </div>
  </header>
</template>

<style scoped>
.nav {
  flex-shrink: 0;
  z-index: 35;
  height: var(--nav-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-3);
  background: var(--ui-bg);
  border-bottom: 1px solid var(--ui-border);
}

.nav-start,
.nav-end {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.nav-end {
  gap: var(--space-3);
}

.model-btn {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.model-stat,
.model-attr {
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--ui-text-muted);
}

.model-stat {
  font-variant-numeric: tabular-nums;
}

.model-attr::before {
  content: '·';
  margin-right: var(--space-2);
}

.model-attr:hover {
  color: var(--ui-text);
}
</style>
