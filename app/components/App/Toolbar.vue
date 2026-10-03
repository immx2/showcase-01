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
  <div class="rail" :class="{ expanded: labelsExpanded }">
    <div class="rail-main">

      <UPopover v-model:open="materialOpen" :content="popoverContent">
        <AppRailButton icon="i-lucide-palette" label="Material" :active="materialOpen" />

        <template #content>
          <div class="material-panel">
            <div class="panel-row">
              <span class="panel-label">Preset</span>
              <span class="panel-value">{{ activeMaterial?.label ?? 'Custom' }}</span>
            </div>
            <div class="swatches">
              <button
                v-for="preset in materialPresets"
                :key="preset.id"
                type="button"
                class="swatch-btn"
                :class="{ active: activeMaterial?.id === preset.id }"
                :style="{ background: preset.color }"
                :title="preset.label"
                :aria-label="preset.label"
                :aria-pressed="activeMaterial?.id === preset.id"
                @click="applyMaterialPreset(preset)"
              />
            </div>

            <USeparator />

            <span class="panel-label">Color</span>
            <UColorPicker v-model="color" format="hex" size="sm" />

            <USeparator />

            <div class="panel-row">
              <span class="panel-label">Metalness</span>
              <span class="panel-value">{{ metalness.toFixed(2) }}</span>
            </div>
            <USlider v-model="metalness" :min="0" :max="1" :step="0.05" aria-label="Metalness" />

            <div class="panel-row">
              <span class="panel-label">Roughness</span>
              <span class="panel-value">{{ roughness.toFixed(2) }}</span>
            </div>
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

      <USeparator class="rail-sep" />

      <UPopover v-model:open="envOpen" :content="popoverContent">
        <AppRailButton icon="i-lucide-globe" label="Environment" :active="envOpen" />

        <template #content>
          <div class="list-panel">
            <p class="panel-label">Environment</p>
            <AppPresetList :items="envItems" :active-id="envPreset" @select="selectEnv" />
          </div>
        </template>
      </UPopover>

      <UPopover v-model:open="lightOpen" :content="popoverContent">
        <AppRailButton icon="i-lucide-sun" label="Lighting" :active="lightOpen" />

        <template #content>
          <div class="list-panel">
            <p class="panel-label">Lighting</p>
            <AppPresetList :items="lightItems" :active-id="lightPreset" @select="selectLight" />
          </div>
        </template>
      </UPopover>

      <USeparator class="rail-sep" />

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

    <div class="rail-foot">
      <USeparator class="rail-sep" />
      <AppRailButton
        :icon="labelsExpanded ? 'i-lucide-panel-left-close' : 'i-lucide-panel-left-open'"
        :label="labelsExpanded ? 'Collapse' : 'Expand'"
        :aria-pressed="labelsExpanded"
        @click="labelsExpanded = !labelsExpanded"
      />
    </div>
  </div>
</template>

<style scoped>
.rail {
  position: relative;
  z-index: 30;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  width: 56px;
  padding: var(--space-2);
  background: var(--ui-bg);
  border-right: 1px solid var(--ui-border);
  transition: width var(--duration-slow) var(--ease-out);
}

.rail.expanded {
  width: 176px;
}

.rail-main {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  overflow: hidden auto;
  scrollbar-width: none;
}

.rail-foot {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.rail-sep {
  margin: var(--space-1) 0;
}

.material-panel,
.list-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3);
}

/* Fits the `sm` UColorPicker exactly: 160px square + 16px gap + 8px hue bar = 184px, plus padding */
.material-panel {
  width: calc(184px + var(--space-3) * 2);
  gap: var(--space-3);
}

.list-panel {
  min-width: 168px;
}

.panel-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
}

.panel-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.panel-value {
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: var(--ui-text-muted);
}

.swatches {
  display: flex;
  justify-content: space-between;
}

.swatch-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--ui-border-accented);
  cursor: pointer;
  transition: box-shadow var(--duration-fast) var(--ease-out);
}

.swatch-btn:hover {
  box-shadow: 0 0 0 2px var(--ui-border-accented);
}

.swatch-btn.active {
  box-shadow: 0 0 0 2px var(--ui-bg), 0 0 0 4px var(--ui-primary);
}

.swatch-btn:focus-visible {
  outline: 2px solid var(--ui-primary);
  outline-offset: 2px;
}
</style>
