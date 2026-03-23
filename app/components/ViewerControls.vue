<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useViewer, geometryOptions, materialPresets, envPresets, type LightPreset, type MaterialPreset, type EnvPresetId } from '~/composables/useViewer'

const { geometry, color, metalness, roughness, wireframe, autoRotate, lightPreset, envPreset, screenshotFn } = useViewer()

const lightPresets: { id: LightPreset; label: string }[] = [
  { id: 'studio',   label: 'Studio' },
  { id: 'dramatic', label: 'Dramatic' },
  { id: 'soft',     label: 'Soft' },
  { id: 'cold',     label: 'Cold' },
]

function applyMaterialPreset(preset: MaterialPreset) {
  color.value = preset.color
  metalness.value = preset.metalness
  roughness.value = preset.roughness
  activePopout.value = null
}

const activePopout = ref<'geometry' | 'lighting' | 'materials' | 'environment' | null>(null)
const labelsExpanded = ref(false)
const wrapRef = ref<HTMLElement | null>(null)

function togglePopout(name: 'geometry' | 'lighting' | 'materials' | 'environment') {
  activePopout.value = activePopout.value === name ? null : name
}

function onDocClick(e: MouseEvent) {
  if (wrapRef.value && !wrapRef.value.contains(e.target as Node)) {
    activePopout.value = null
  }
}

onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div class="toolbar-wrap" ref="wrapRef">

    <!-- Toolbar — comes first so popouts expand to the right -->
    <div class="toolbar" :class="{ expanded: labelsExpanded }">

      <!-- Geometry picker button -->
      <button
        class="icon-btn"
        :class="{ active: activePopout === 'geometry' }"
        title="Geometry"
        aria-label="Pick geometry"
        @click="togglePopout('geometry')"
      >
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="7,1 13,4.5 13,9.5 7,13 1,9.5 1,4.5"/>
          <line x1="7" y1="1" x2="7" y2="13"/>
          <line x1="1" y1="4.5" x2="13" y2="4.5"/>
          <line x1="1" y1="9.5" x2="13" y2="9.5"/>
        </svg>
        <span class="btn-label">Geometry</span>
      </button>

      <span class="sep" />

      <!-- Material group -->
      <div class="group">
        <!-- Material presets picker -->
        <button
          class="icon-btn"
          :class="{ active: activePopout === 'materials' }"
          title="Material presets"
          aria-label="Material presets"
          @click="togglePopout('materials')"
        >
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="4.5" cy="4.5" r="2.5"/>
            <circle cx="9.5" cy="4.5" r="2.5"/>
            <circle cx="4.5" cy="9.5" r="2.5"/>
            <circle cx="9.5" cy="9.5" r="2.5"/>
          </svg>
          <span class="btn-label">Material</span>
        </button>
        <label class="color-swatch" title="Color">
          <span class="color-dot" :style="{ background: color }"></span>
          <span class="btn-label">Color</span>
          <input type="color" v-model="color" class="color-input" />
        </label>
        <div class="slider-group">
          <div class="slider-popup">
            <span class="slider-val">{{ metalness.toFixed(2) }}</span>
            <input type="range" class="slider-vert" orient="vertical" min="0" max="1" step="0.05" v-model.number="metalness" />
          </div>
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="7" cy="7" r="5.5"/>
            <path d="M4.5 4.5 Q5.5 3 7 3.5" stroke-width="1.1"/>
          </svg>
          <span class="btn-label">Metalness</span>
        </div>
        <div class="slider-group">
          <div class="slider-popup">
            <span class="slider-val">{{ roughness.toFixed(2) }}</span>
            <input type="range" class="slider-vert" orient="vertical" min="0" max="1" step="0.05" v-model.number="roughness" />
          </div>
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M1.5 4.5 Q3 3 4.5 4.5 Q6 6 7.5 4.5 Q9 3 10.5 4.5 Q12 6 12.5 5.5"/>
            <path d="M1.5 7 Q3 5.5 4.5 7 Q6 8.5 7.5 7 Q9 5.5 10.5 7 Q12 8.5 12.5 8"/>
            <path d="M1.5 9.5 Q3 8 4.5 9.5 Q6 11 7.5 9.5 Q9 8 10.5 9.5 Q12 11 12.5 10.5"/>
          </svg>
          <span class="btn-label">Roughness</span>
        </div>
        <button
          class="icon-btn"
          :class="{ active: wireframe }"
          :aria-pressed="wireframe"
          aria-label="Wireframe"
          title="Wireframe"
          @click="wireframe = !wireframe"
        >
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="7,1 13,12 1,12"/>
            <line x1="7" y1="1" x2="7" y2="12"/>
            <line x1="1" y1="12" x2="10" y2="6.5"/>
            <line x1="13" y1="12" x2="4" y2="6.5"/>
          </svg>
          <span class="btn-label">Wireframe</span>
        </button>
      </div>

      <span class="sep" />

      <!-- Environment picker button -->
      <button
        class="icon-btn"
        :class="{ active: activePopout === 'environment' }"
        title="Environment"
        aria-label="Environment"
        @click="togglePopout('environment')"
      >
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="7" cy="7" r="5.5"/>
          <path d="M1.5 7 Q3.5 4 7 7 Q10.5 10 12.5 7"/>
          <path d="M1.5 7 Q3.5 10 7 7 Q10.5 4 12.5 7"/>
          <line x1="7" y1="1.5" x2="7" y2="12.5"/>
        </svg>
        <span class="btn-label">Environment</span>
      </button>

      <!-- Lighting picker button -->
      <button
        class="icon-btn"
        :class="{ active: activePopout === 'lighting' }"
        title="Lighting"
        aria-label="Lighting preset"
        @click="togglePopout('lighting')"
      >
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
          <circle cx="7" cy="7" r="2.5"/>
          <line x1="7" y1="1" x2="7" y2="2.5"/>
          <line x1="7" y1="11.5" x2="7" y2="13"/>
          <line x1="1" y1="7" x2="2.5" y2="7"/>
          <line x1="11.5" y1="7" x2="13" y2="7"/>
          <line x1="2.93" y1="2.93" x2="3.99" y2="3.99"/>
          <line x1="10.01" y1="10.01" x2="11.07" y2="11.07"/>
          <line x1="11.07" y1="2.93" x2="10.01" y2="3.99"/>
          <line x1="3.99" y1="10.01" x2="2.93" y2="11.07"/>
        </svg>
        <span class="btn-label">Lighting</span>
      </button>

      <span class="sep" />

      <!-- Auto-rotate toggle -->
      <button
        class="icon-btn"
        :class="{ active: autoRotate }"
        title="Auto-rotate"
        aria-label="Auto-rotate"
        :aria-pressed="autoRotate"
        @click="autoRotate = !autoRotate"
      >
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 7A5 5 0 1 1 9.5 2.5"/>
          <path d="M9.5 1v2.5H12"/>
        </svg>
        <span class="btn-label">Auto-rotate</span>
      </button>

      <!-- Screenshot button -->
      <button
        class="icon-btn"
        title="Save screenshot"
        aria-label="Save screenshot"
        @click="screenshotFn?.()"
      >
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <rect x="1" y="3.5" width="12" height="9" rx="1.5"/>
          <circle cx="7" cy="8" r="2.2"/>
          <path d="M4.5 3.5 L5.5 1.5 H8.5 L9.5 3.5"/>
        </svg>
        <span class="btn-label">Screenshot</span>
      </button>

      <span class="sep" />

      <!-- Labels toggle -->
      <button
        class="icon-btn expand-toggle"
        :class="{ active: labelsExpanded }"
        :aria-pressed="labelsExpanded"
        :title="labelsExpanded ? 'Hide labels' : 'Show labels'"
        :aria-label="labelsExpanded ? 'Hide labels' : 'Show labels'"
        @click="labelsExpanded = !labelsExpanded"
      >
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="expand-icon">
          <polyline points="5 3 9 7 5 11"/>
        </svg>
        <span class="btn-label">Collapse</span>
      </button>

    </div>

    <!-- Geometry popout — expands to the right of the toolbar -->
    <Transition name="popout">
      <div v-if="activePopout === 'geometry'" class="popout">
        <span class="popout-title">Geometry</span>
        <button
          v-for="opt in geometryOptions"
          :key="opt.id"
          class="chip"
          :class="{ active: geometry === opt.id }"
          :aria-label="opt.label"
          :aria-pressed="geometry === opt.id"
          @click="geometry = opt.id; activePopout = null"
        >{{ opt.label }}</button>
      </div>
    </Transition>

    <!-- Material presets popout -->
    <Transition name="popout">
      <div v-if="activePopout === 'materials'" class="popout">
        <span class="popout-title">Material</span>
        <button
          v-for="preset in materialPresets"
          :key="preset.id"
          class="chip chip--material"
          :aria-label="preset.label"
          @click="applyMaterialPreset(preset)"
        >
          <span class="preset-dot" :style="{ background: preset.color }" />
          {{ preset.label }}
        </button>
      </div>
    </Transition>

    <!-- Lighting popout -->
    <Transition name="popout">
      <div v-if="activePopout === 'lighting'" class="popout">
        <span class="popout-title">Lighting</span>
        <button
          v-for="preset in lightPresets"
          :key="preset.id"
          class="chip"
          :class="{ active: lightPreset === preset.id }"
          :aria-pressed="lightPreset === preset.id"
          @click="lightPreset = preset.id"
        >{{ preset.label }}</button>
      </div>
    </Transition>

    <!-- Environment popout -->
    <Transition name="popout">
      <div v-if="activePopout === 'environment'" class="popout">
        <span class="popout-title">Environment</span>
        <button
          v-for="preset in envPresets"
          :key="preset.id"
          class="chip chip--env"
          :class="{ active: envPreset === preset.id }"
          :aria-pressed="envPreset === preset.id"
          @click="envPreset = preset.id as EnvPresetId; activePopout = null"
        >
          <span class="env-swatch" :style="{ background: preset.swatch }" />
          {{ preset.label }}
        </button>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
/* Wrap: fixed to the left edge, vertically centred */
.toolbar-wrap {
  position: fixed;
  left: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: var(--space-2);
}

/* Toolbar: vertical pill */
.toolbar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 52px;
  padding: var(--space-3) 0;
  gap: 4px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
  transition: width var(--duration-base) var(--ease-out);
}

/* Expanded toolbar */
.toolbar.expanded {
  width: 168px;
}

/* Group: stack icons vertically */
.group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

/* Separator: horizontal rule */
.sep {
  display: block;
  width: 26px;
  height: 1px;
  background: var(--color-border-subtle);
  flex-shrink: 0;
  margin: var(--space-2) 0;
  transition: width var(--duration-base) var(--ease-out);
}

.expanded .sep {
  width: calc(100% - var(--space-6));
  align-self: center;
}

/* Button label text */
.btn-label {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  max-width: 0;
  opacity: 0;
  transition:
    max-width var(--duration-base) var(--ease-out),
    opacity var(--duration-base) var(--ease-out);
  pointer-events: none;
}

.expanded .btn-label {
  max-width: 120px;
  opacity: 1;
}

/* Expand icon rotates when active */
.expand-icon {
  transition: transform var(--duration-base) var(--ease-out);
  flex-shrink: 0;
}

.expand-toggle.active .expand-icon {
  transform: rotate(180deg);
}

/* Popouts — expand to the right of the toolbar */
.popout {
  display: flex;
  flex-direction: column;
  padding: var(--space-2);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.09);
  min-width: 140px;
}

.popout-title {
  padding: var(--space-1) var(--space-3) var(--space-2);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-1);
}

/* Popout: slide in from the toolbar side */
.popout-enter-active {
  transition: opacity var(--duration-base) var(--ease-out),
              transform var(--duration-base) var(--ease-out);
}
.popout-leave-active {
  transition: opacity var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-out);
}
.popout-enter-from,
.popout-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}

/* Slider groups */
.slider-group svg {
  color: var(--color-text-muted);
  transition: color var(--duration-fast);
}

.slider-group:hover svg {
  color: var(--color-text);
}

.slider-group {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 10px;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition: background var(--duration-fast),
              width var(--duration-base) var(--ease-out);
}

.slider-group:hover {
  background: var(--color-surface-2);
}

.expanded .slider-group {
  width: 148px;
  gap: var(--space-2);
}

/* Slider popup — expands to the right */
.slider-popup {
  position: absolute;
  left: calc(100% + var(--space-3));
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-2);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--duration-fast);
}

.slider-group:hover .slider-popup,
.slider-group:focus-within .slider-popup {
  opacity: 1;
  pointer-events: auto;
}

.slider-val {
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-muted);
}

.slider-vert {
  writing-mode: vertical-lr;
  direction: rtl;
  width: 2px;
  height: 80px;
  appearance: none;
  background: var(--color-border);
  border-radius: 1px;
  outline: none;
  cursor: pointer;
}

.slider-vert::-webkit-slider-thumb {
  appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-text);
  cursor: pointer;
  border: none;
}

.slider-vert::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-text);
  cursor: pointer;
  border: none;
}

/* Color swatch */
.color-swatch {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background var(--duration-fast),
              width var(--duration-base) var(--ease-out);
}

.color-swatch:hover {
  background: var(--color-surface-2);
}

.expanded .color-swatch {
  width: 148px;
  gap: var(--space-2);
}

.color-dot {
  width: 18px;
  height: 18px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(0, 0, 0, 0.12);
  display: block;
  flex-shrink: 0;
  pointer-events: none;
}

.color-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border: none;
  padding: 0;
}

/* Chip buttons */
.chip {
  width: 100%;
  height: 34px;
  padding: 0 var(--space-3);
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background var(--duration-fast), color var(--duration-fast);
}

.chip:hover {
  background: var(--color-surface-2);
  color: var(--color-text);
}

.chip.active {
  background: var(--color-text);
  color: var(--color-surface);
}

.chip--material,
.chip--env {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.preset-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.12);
  flex-shrink: 0;
}

.env-swatch {
  display: inline-block;
  width: 24px;
  height: 14px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(0, 0, 0, 0.10);
  flex-shrink: 0;
}

/* Icon buttons */
.icon-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 10px;
  flex-shrink: 0;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  overflow: hidden;
  transition: background var(--duration-fast), color var(--duration-fast),
              width var(--duration-base) var(--ease-out);
}

.icon-btn:hover {
  background: var(--color-surface-2);
  color: var(--color-text);
}

.icon-btn.active {
  background: var(--color-text);
  color: var(--color-surface);
}

.expanded .icon-btn {
  width: 148px;
  gap: var(--space-2);
}

.icon-btn svg {
  flex-shrink: 0;
}
</style>
