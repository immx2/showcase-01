<script setup lang="ts">
import { materialPresets, envPresets, type LightPreset, type MaterialPreset, type EnvPresetId } from '~/composables/useViewer'

const { geometry, color, metalness, roughness, wireframe, autoRotate, lightPreset, envPreset, screenshotFn, hotspotsVisible, labelsExpanded } = useViewer()

const lightItems: { id: LightPreset, label: string }[] = [
  { id: 'studio', label: 'Studio' },
  { id: 'dramatic', label: 'Dramatic' },
  { id: 'soft', label: 'Soft' },
  { id: 'cold', label: 'Cold' },
]
const envItems = envPresets.map(p => ({ id: p.id, label: p.label, swatch: p.swatch }))

const materialOpen = ref(false)
const envOpen = ref(false)
const lightOpen = ref(false)

// Popovers open to the right of the rail, aligned with their trigger
const popoverContent = { side: 'right', align: 'start', sideOffset: 8 } as const

// UColorPicker round-trips the hex through HSV and can shift a channel by a few steps,
// so colors are compared with a small tolerance instead of exact equality.
function sameColor(a: string, b: string) {
  const hex = /^#[0-9a-f]{6}$/i
  if (!hex.test(a) || !hex.test(b)) return false
  const channel = (c: string, i: number) => parseInt(c.slice(1 + i * 2, 3 + i * 2), 16)
  return [0, 1, 2].every(i => Math.abs(channel(a, i) - channel(b, i)) <= 3)
}

// A preset counts as active only while color, metalness and roughness all still match it
const activeMaterial = computed(() => materialPresets.find(p =>
  sameColor(p.color, color.value)
  && p.metalness === metalness.value
  && p.roughness === roughness.value,
))

function applyMaterialPreset(preset: MaterialPreset) {
  color.value = preset.color
  metalness.value = preset.metalness
  roughness.value = preset.roughness
}

function selectEnv(id: string) {
  envPreset.value = id as EnvPresetId
  envOpen.value = false
}

function selectLight(id: string) {
  lightPreset.value = id as LightPreset
  lightOpen.value = false
}

onMounted(() => {
  labelsExpanded.value = window.innerWidth >= 768
})
</script>

<template>
  <div
    class="relative z-30 flex shrink-0 flex-col border-r border-default bg-default p-2 transition-[width] duration-400 ease-snappy"
    :class="labelsExpanded ? 'w-44' : 'w-14'"
  >
    <div class="flex min-h-0 flex-1 flex-col gap-1 overflow-x-hidden overflow-y-auto [scrollbar-width:none]">

      <UPopover v-model:open="materialOpen" :content="popoverContent">
        <AppRailButton icon="i-lucide-palette" label="Material" :active="materialOpen" />

        <template #content>
          <!-- Fits the `sm` UColorPicker exactly: 160px square + 16px gap + 8px hue bar = 184px, plus padding -->
          <div class="flex w-[calc(184px+1.5rem)] flex-col gap-3 p-3">
            <AppPanelRow label="Preset" :value="activeMaterial?.label ?? 'Custom'" />
            <div class="flex justify-between">
              <UTooltip v-for="preset in materialPresets" :key="preset.id" :text="preset.label">
                <button
                  type="button"
                  class="size-7 rounded-full border border-accented transition-shadow duration-120 ease-snappy hover:ring-2 hover:ring-accented focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  :class="activeMaterial?.id === preset.id && 'ring-2 ring-primary ring-offset-2 ring-offset-(--ui-bg) hover:ring-primary'"
                  :style="{ background: preset.color }"
                  :aria-label="preset.label"
                  :aria-pressed="activeMaterial?.id === preset.id"
                  @click="applyMaterialPreset(preset)"
                />
              </UTooltip>
            </div>

            <USeparator />

            <AppPanelLabel>Color</AppPanelLabel>
            <UColorPicker v-model="color" format="hex" size="sm" />

            <USeparator />

            <AppPanelRow label="Metalness" :value="metalness.toFixed(2)" />
            <USlider v-model="metalness" :min="0" :max="1" :step="0.05" aria-label="Metalness" />

            <AppPanelRow label="Roughness" :value="roughness.toFixed(2)" />
            <USlider v-model="roughness" :min="0" :max="1" :step="0.05" aria-label="Roughness" />
          </div>
        </template>
      </UPopover>

      <AppRailButton
        icon="i-lucide-box"
        label="Wireframe"
        :active="wireframe"
        :aria-pressed="wireframe"
        @click="wireframe = !wireframe"
      />

      <USeparator class="my-1" />

      <UPopover v-model:open="envOpen" :content="popoverContent">
        <AppRailButton icon="i-lucide-globe" label="Environment" :active="envOpen" />

        <template #content>
          <div class="flex min-w-42 flex-col gap-2 p-3">
            <AppPanelLabel>Environment</AppPanelLabel>
            <AppPresetList :items="envItems" :active-id="envPreset" @select="selectEnv" />
          </div>
        </template>
      </UPopover>

      <UPopover v-model:open="lightOpen" :content="popoverContent">
        <AppRailButton icon="i-lucide-sun" label="Lighting" :active="lightOpen" />

        <template #content>
          <div class="flex min-w-42 flex-col gap-2 p-3">
            <AppPanelLabel>Lighting</AppPanelLabel>
            <AppPresetList :items="lightItems" :active-id="lightPreset" @select="selectLight" />
          </div>
        </template>
      </UPopover>

      <USeparator class="my-1" />

      <AppRailButton
        icon="i-lucide-rotate-3d"
        label="Auto-rotate"
        :active="autoRotate"
        :aria-pressed="autoRotate"
        @click="autoRotate = !autoRotate"
      />
      <AppRailButton icon="i-lucide-camera" label="Screenshot" @click="screenshotFn?.()" />
      <AppRailButton
        v-if="geometry === 'lamborghini'"
        icon="i-lucide-map-pin"
        label="Hotspots"
        :active="hotspotsVisible"
        :aria-pressed="hotspotsVisible"
        @click="hotspotsVisible = !hotspotsVisible"
      />
    </div>

    <div class="flex shrink-0 flex-col gap-1">
      <USeparator class="my-1" />
      <AppRailButton
        :icon="labelsExpanded ? 'i-lucide-panel-left-close' : 'i-lucide-panel-left-open'"
        :label="labelsExpanded ? 'Collapse' : 'Expand'"
        :aria-pressed="labelsExpanded"
        @click="labelsExpanded = !labelsExpanded"
      />
    </div>
  </div>
</template>
