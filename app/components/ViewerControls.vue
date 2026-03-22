<script setup lang="ts">
import { useViewer, geometryOptions, type GeometryType, type LightPreset } from '~/composables/useViewer'

const { geometry, color, metalness, roughness, wireframe, autoRotate, lightPreset } = useViewer()

const lightPresets: { id: LightPreset; label: string }[] = [
  { id: 'studio',   label: 'Studio' },
  { id: 'dramatic', label: 'Dramatic' },
  { id: 'soft',     label: 'Soft' },
  { id: 'cold',     label: 'Cold' },
]
</script>

<template>
  <aside class="controls">
    <div class="controls-inner">

      <!-- MOTION -->
      <section class="section">
        <span class="section-label">Motion</span>
        <div class="row">
          <span class="label">Rotate</span>
          <button
            class="toggle"
            :class="{ active: autoRotate }"
            @click="autoRotate = !autoRotate"
            :aria-pressed="autoRotate"
          >
            {{ autoRotate ? 'On' : 'Off' }}
          </button>
        </div>
      </section>

      <div class="divider" />

      <!-- GEOMETRY -->
      <section class="section">
        <span class="section-label">Geometry</span>
        <div class="chip-grid">
          <button
            v-for="opt in geometryOptions"
            :key="opt.id"
            class="chip"
            :class="{ active: geometry === opt.id }"
            @click="geometry = opt.id"
          >
            {{ opt.label }}
          </button>
        </div>
      </section>

      <div class="divider" />

      <!-- MATERIAL -->
      <section class="section">
        <span class="section-label">Material</span>

        <div class="row">
          <span class="label">Color</span>
          <label class="color-swatch" :style="{ background: color }">
            <input type="color" v-model="color" class="color-input" />
          </label>
        </div>

        <div class="slider-row">
          <div class="slider-header">
            <span class="label">Metalness</span>
            <span class="value">{{ metalness.toFixed(2) }}</span>
          </div>
          <input type="range" min="0" max="1" step="0.05" v-model.number="metalness" class="slider" />
        </div>

        <div class="slider-row">
          <div class="slider-header">
            <span class="label">Roughness</span>
            <span class="value">{{ roughness.toFixed(2) }}</span>
          </div>
          <input type="range" min="0" max="1" step="0.05" v-model.number="roughness" class="slider" />
        </div>

        <div class="row">
          <span class="label">Wireframe</span>
          <button
            class="toggle"
            :class="{ active: wireframe }"
            @click="wireframe = !wireframe"
            :aria-pressed="wireframe"
          >
            {{ wireframe ? 'On' : 'Off' }}
          </button>
        </div>
      </section>

      <div class="divider" />

      <!-- LIGHTING -->
      <section class="section">
        <span class="section-label">Lighting</span>
        <div class="chip-grid">
          <button
            v-for="preset in lightPresets"
            :key="preset.id"
            class="chip"
            :class="{ active: lightPreset === preset.id }"
            @click="lightPreset = preset.id"
          >
            {{ preset.label }}
          </button>
        </div>
      </section>

    </div>
  </aside>
</template>

<style scoped>
.controls {
  position: fixed;
  bottom: var(--space-8);
  right: var(--space-8);
  z-index: 10;
  width: 256px;
  max-height: calc(100dvh - var(--nav-height) - var(--space-16));
  overflow-y: auto;
}

.controls-inner {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* Section */
.section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.section-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.divider {
  height: 1px;
  background: var(--color-border-subtle);
  margin: 0 calc(-1 * var(--space-1));
}

/* Row */
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--color-text);
}

/* Toggle button */
.toggle {
  font-size: 11px;
  font-weight: 500;
  padding: 2px var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface-2);
  color: var(--color-text-muted);
  transition: background var(--duration-fast), color var(--duration-fast), border-color var(--duration-fast);
}

.toggle.active {
  background: var(--color-text);
  color: var(--color-surface);
  border-color: var(--color-text);
}

/* Chip grid */
.chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.chip {
  font-size: 11px;
  font-weight: 500;
  padding: 3px var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background var(--duration-fast), color var(--duration-fast), border-color var(--duration-fast);
}

.chip.active {
  background: var(--color-text);
  color: var(--color-surface);
  border-color: var(--color-text);
}

/* Color swatch */
.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  cursor: pointer;
  display: block;
  overflow: hidden;
  flex-shrink: 0;
}

.color-input {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border: none;
  padding: 0;
}

/* Sliders */
.slider-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.slider {
  width: 100%;
  height: 2px;
  appearance: none;
  background: var(--color-border);
  border-radius: 1px;
  outline: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-text);
  cursor: pointer;
  border: none;
}

.slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-text);
  cursor: pointer;
  border: none;
}

.value {
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-muted);
}
</style>
