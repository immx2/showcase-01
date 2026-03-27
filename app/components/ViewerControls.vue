<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useViewer, materialPresets, envPresets, type LightPreset, type MaterialPreset, type EnvPresetId } from '~/composables/useViewer'

const { geometry, color, metalness, roughness, wireframe, autoRotate, lightPreset, envPreset, screenshotFn, hotspotsVisible, labelsExpanded } = useViewer()

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

const activePopout    = ref<'lighting' | 'materials' | 'environment' | null>(null)
const popoutY         = ref(0)
const popoutBottom    = ref(0)
const popoutMaxH      = ref(0)
const popoutFlipUp    = ref(false)
const wrapRef         = ref<HTMLElement | null>(null)

function togglePopout(name: 'lighting' | 'materials' | 'environment', e: MouseEvent) {
  if (activePopout.value === name) {
    activePopout.value = null
    return
  }
  const btn = e.currentTarget as HTMLElement
  const wr  = wrapRef.value!.getBoundingClientRect()
  const br  = btn.getBoundingClientRect()
  const spaceBelow = window.innerHeight - br.top
  const spaceAbove = br.bottom

  if (spaceAbove > spaceBelow) {
    // More room above — anchor bottom to button bottom, grow upward
    popoutFlipUp.value  = true
    popoutBottom.value  = wr.bottom - br.bottom
    popoutMaxH.value    = spaceAbove - 12
  } else {
    // More room below (default) — anchor top to button top, grow downward
    popoutFlipUp.value  = false
    popoutY.value       = br.top - wr.top
    popoutMaxH.value    = spaceBelow - 12
  }
  activePopout.value = name
}

function onDocClick(e: MouseEvent) {
  if (wrapRef.value && !wrapRef.value.contains(e.target as Node)) {
    activePopout.value = null
  }
}

// Slider float popup — lives at toolbar-wrap level to escape overflow-x: hidden on .toolbar
const activeSlider = ref<'metalness' | 'roughness' | null>(null)
const sliderY      = ref(0)
let sliderTimer: ReturnType<typeof setTimeout> | null = null

function openSlider(name: 'metalness' | 'roughness', e: MouseEvent) {
  if (sliderTimer) { clearTimeout(sliderTimer); sliderTimer = null }
  const el = e.currentTarget as HTMLElement
  const wr = wrapRef.value!.getBoundingClientRect()
  const br = el.getBoundingClientRect()
  sliderY.value = br.top - wr.top + br.height / 2
  activeSlider.value = name
}

function scheduleCloseSlider() {
  sliderTimer = setTimeout(() => { activeSlider.value = null }, 120)
}

function cancelCloseSlider() {
  if (sliderTimer) { clearTimeout(sliderTimer); sliderTimer = null }
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  labelsExpanded.value = window.innerWidth >= 768
})
onUnmounted(() => {
  document.removeEventListener('click', onDocClick)
  if (sliderTimer) clearTimeout(sliderTimer)
})
</script>

<template>
  <div ref="wrapRef" class="toolbar-wrap" :class="{ expanded: labelsExpanded }">

    <!-- Toolbar — comes first so popouts expand to the right -->
    <div class="toolbar">

      <!-- Material group -->
      <div class="group">
        <!-- Material presets picker -->
        <button
          class="icon-btn"
          :class="{ active: activePopout === 'materials' }"
          title="Material presets"
          aria-label="Material presets"
          @click="togglePopout('materials', $event)"
        >
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="4.5" cy="4.5" r="2.5"/>
            <circle cx="9.5" cy="4.5" r="2.5"/>
            <circle cx="4.5" cy="9.5" r="2.5"/>
            <circle cx="9.5" cy="9.5" r="2.5"/>
          </svg>
          <span class="btn-label">Material</span>
        </button>
        <label class="icon-btn color-swatch" title="Color">
          <span class="color-dot" :style="{ background: color }"/>
          <span class="btn-label">Color</span>
          <input v-model="color" type="color" class="color-input" >
        </label>
        <div
          class="icon-btn slider-group"
          @mouseenter="openSlider('metalness', $event)"
          @mouseleave="scheduleCloseSlider"
        >
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="7" cy="7" r="5.5"/>
            <path d="M4.5 4.5 Q5.5 3 7 3.5" stroke-width="1.1"/>
          </svg>
          <span class="btn-label">Metalness</span>
        </div>
        <div
          class="icon-btn slider-group"
          @mouseenter="openSlider('roughness', $event)"
          @mouseleave="scheduleCloseSlider"
        >
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
        @click="togglePopout('environment', $event)"
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
        @click="togglePopout('lighting', $event)"
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
        title="Auto-rotate (Space outside of buttons and fields)"
        aria-label="Auto-rotate. Press Space when focus is on the canvas to toggle."
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

      <!-- Hotspot annotations toggle — only for the Lamborghini model -->
      <button
        v-if="geometry === 'lamborghini'"
        class="icon-btn"
        :class="{ active: hotspotsVisible }"
        :aria-pressed="hotspotsVisible"
        title="Hotspot annotations"
        aria-label="Toggle hotspot annotations"
        @click="hotspotsVisible = !hotspotsVisible"
      >
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="7" cy="6" r="2.5"/>
          <path d="M7 8.5 C7 8.5 3 11 3 11" stroke-width="1.2" opacity="0.5"/>
          <path d="M7 8.5 C7 8.5 11 11 11 11" stroke-width="1.2" opacity="0.5"/>
          <circle cx="7" cy="6" r="0.8" fill="currentColor" stroke="none"/>
        </svg>
        <span class="btn-label">Hotspots</span>
      </button>

    </div>

    <!-- Always-visible footer: labels toggle -->
    <div class="toolbar-foot">
      <span class="sep" />
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

    <!-- Material presets popout -->
    <Transition name="popout">
      <div
v-if="activePopout === 'materials'" class="popout menu-panel" :style="popoutFlipUp
        ? { bottom: popoutBottom + 'px', maxHeight: popoutMaxH + 'px' }
        : { top: popoutY + 'px',         maxHeight: popoutMaxH + 'px' }">
        <span class="menu-group">Material</span>
        <button
          v-for="preset in materialPresets"
          :key="preset.id"
          class="menu-chip chip-material"
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
      <div
v-if="activePopout === 'lighting'" class="popout menu-panel" :style="popoutFlipUp
        ? { bottom: popoutBottom + 'px', maxHeight: popoutMaxH + 'px' }
        : { top: popoutY + 'px',         maxHeight: popoutMaxH + 'px' }">
        <span class="menu-group">Lighting</span>
        <button
          v-for="preset in lightPresets"
          :key="preset.id"
          class="menu-chip"
          :class="{ active: lightPreset === preset.id }"
          :aria-pressed="lightPreset === preset.id"
          @click="lightPreset = preset.id"
        >{{ preset.label }}</button>
      </div>
    </Transition>

    <!-- Environment popout -->
    <Transition name="popout">
      <div
v-if="activePopout === 'environment'" class="popout menu-panel" :style="popoutFlipUp
        ? { bottom: popoutBottom + 'px', maxHeight: popoutMaxH + 'px' }
        : { top: popoutY + 'px',         maxHeight: popoutMaxH + 'px' }">
        <span class="menu-group">Environment</span>
        <button
          v-for="preset in envPresets"
          :key="preset.id"
          class="menu-chip chip-env"
          :class="{ active: envPreset === preset.id }"
          :aria-pressed="envPreset === preset.id"
          @click="envPreset = preset.id as EnvPresetId; activePopout = null"
        >
          <span class="env-swatch" :style="{ background: preset.swatch }" />
          {{ preset.label }}
        </button>
      </div>
    </Transition>

    <!-- Slider float — at toolbar-wrap level to escape .toolbar's overflow-x: hidden -->
    <div
      v-if="activeSlider"
      class="slider-float"
      :style="{ top: sliderY + 'px' }"
      @mouseenter="cancelCloseSlider"
      @mouseleave="scheduleCloseSlider"
    >
      <span class="slider-val">
        {{ (activeSlider === 'metalness' ? metalness : roughness).toFixed(2) }}
      </span>
      <input
        v-if="activeSlider === 'metalness'"
        v-model.number="metalness" type="range" class="slider-vert"
        orient="vertical" min="0" max="1"
        step="0.05"
      >
      <input
        v-else
        v-model.number="roughness" type="range" class="slider-vert"
        orient="vertical" min="0" max="1"
        step="0.05"
      >
    </div>

  </div>
</template>

<style scoped>
/* Sidebar: fixed width left panel, full height */
.toolbar-wrap {
  position: relative;
  overflow: visible;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 52px;
  background: var(--color-bg);
  border-right: 1px solid var(--color-border);
  z-index: 30;
  transition: width var(--duration-slow) var(--ease-out);
}

.toolbar-wrap.expanded {
  width: 168px;
}

/* Toolbar: scrollable inner button stack */
.toolbar {
  flex: 1;
  overflow: hidden auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: var(--space-3) 0;
  gap: 4px;
  scrollbar-width: none;
}

.toolbar::-webkit-scrollbar {
  display: none;
}

/* Footer: always-visible expand toggle */
.toolbar-foot {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding-bottom: var(--space-3);
  gap: 4px;
}

/* Group: stack icons vertically */
.group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-left: 7px;
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
  color: var(--color-text-secondary);
  cursor: pointer;
  overflow: hidden;
  transition: background var(--duration-base),
              width var(--duration-base) var(--ease-out);
}

.icon-btn:hover {
  background: var(--color-bg-hover);
  color: var(--color-text);
  transition: background 0ms,
              width var(--duration-slow) var(--ease-out);
}

.icon-btn.active {
  background: var(--color-bg-active);
  color: var(--color-text);
}

.toolbar > .icon-btn,
.toolbar-foot > .icon-btn {
  margin-left: 7px;
}

/* Separator: horizontal rule */
.sep {
  display: block;
  width: calc(100% - 14px);
  height: 1px;
  background: var(--color-border-subtle);
  flex-shrink: 0;
  margin: var(--space-2) 7px;
}

/* Button label text */
.btn-label {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  opacity: 0;
  transition: opacity var(--duration-slow) var(--ease-out);
  pointer-events: none;
}

.expanded .btn-label {
  opacity: 1;
}

/* Expand icon rotates when active */
.expand-icon {
  transition: transform var(--duration-slow) var(--ease-out);
  flex-shrink: 0;
}

.expand-toggle.active .expand-icon {
  transform: rotate(180deg);
}

/* Popouts — float to the right, top-aligned to their trigger button */
.popout {
  left: calc(100% + var(--space-2));
  min-width: 140px;
  overflow-y: auto;
  z-index: 30;
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


.slider-group {
  user-select: none;
}

.expanded .slider-group {
  width: 148px;
  gap: var(--space-2);
}

/* Slider float — positioned at toolbar-wrap level to escape overflow-x: hidden */
.slider-float {
  position: absolute;
  left: calc(100% + var(--space-3));
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-2);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 16px rgb(0 0 0 / 12%);
  z-index: 31;
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
  position: relative;
  overflow: hidden;
}

.expanded .color-swatch {
  width: 148px;
  gap: var(--space-2);
}

.color-dot {
  width: 18px;
  height: 18px;
  border-radius: var(--radius-sm);
  border: 1px solid rgb(0 0 0 / 12%);
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

.chip-material,
.chip-env {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.preset-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  flex-shrink: 0;
}

.env-swatch {
  display: inline-block;
  width: 24px;
  height: 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  flex-shrink: 0;
}

.expanded .icon-btn {
  width: 148px;
  gap: var(--space-2);
}

.icon-btn svg {
  flex-shrink: 0;
  transition: color var(--duration-fast), transform var(--duration-slow) var(--ease-out);
}

</style>
