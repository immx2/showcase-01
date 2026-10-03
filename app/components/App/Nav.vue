<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { geometryGroups, geometryOptions } from '~/composables/useViewer'

const { showOnboarding, geometry, vertexCount, isLoading } = useViewer()
const isLambo = computed(() => geometry.value === 'lamborghini')

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
</script>

<template>
  <header class="z-35 flex h-12 shrink-0 items-center justify-between border-b border-default bg-default px-3">
    <div class="flex items-center gap-2">
      <UDropdownMenu :items="geoItems" :content="{ align: 'start' }">
        <UButton
          :label="modelName"
          trailing-icon="i-lucide-chevrons-up-down"
          color="neutral"
          variant="ghost"
          class="text-[13px] font-medium tracking-[0.08em] uppercase"
          aria-label="Select model"
        />
      </UDropdownMenu>

      <span v-if="!isLoading" class="text-[11px] tracking-[0.04em] text-muted tabular-nums">{{ vertexCount.toLocaleString() }} vertices</span>
      <UTooltip v-if="isLambo && !isLoading" text="Lamborghini Aventador by Arion Digital — CC BY 4.0">
        <a
          class="text-[11px] tracking-[0.04em] text-muted before:mr-2 before:content-['·'] hover:text-default"
          href="https://sketchfab.com/3d-models/lamborghini-aventador-888e37a3641d4f7b94bc1a39396e2441"
          target="_blank"
          rel="noopener noreferrer"
        >CC BY · Arion Digital</a>
      </UTooltip>
    </div>

    <div class="flex items-center gap-3">
      <UColorModeSelect color="neutral" size="sm" class="w-32" aria-label="Color mode" />

      <UTooltip text="Open guide">
        <UButton
          icon="i-lucide-circle-help"
          aria-label="Open guide"
          color="neutral"
          variant="ghost"
          @click="showOnboarding = true"
        />
      </UTooltip>
    </div>
  </header>
</template>
