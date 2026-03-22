<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useViewer, geometryOptions, type GeometryType, type LightPreset } from '~/composables/useViewer'

const { geometry, color, metalness, roughness, wireframe, autoRotate, lightPreset } = useViewer()

const lightPresets: { id: LightPreset; label: string }[] = [
  { id: 'studio',   label: 'Stu' },
  { id: 'dramatic', label: 'Dra' },
  { id: 'soft',     label: 'Soft' },
  { id: 'cold',     label: 'Cold' },
]

const geoShort: Record<GeometryType, string> = {
  icosahedron: 'Ico',
  sphere:      'Sph',
  torusKnot:   'Knot',
  box:         'Box',
  octahedron:  'Oct',
  lamborghini: 'Lam',
}

const activePopout = ref<'geometry' | 'lighting' | null>(null)
const wrapRef = ref<HTMLElement | null>(null)

function togglePopout(name: 'geometry' | 'lighting') {
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

    <!-- Geometry popout -->
    <div v-if="activePopout === 'geometry'" class="popout">
      <button
        v-for="opt in geometryOptions"
        :key="opt.id"
        class="chip"
        :class="{ active: geometry === opt.id }"
        :aria-label="opt.label"
        :aria-pressed="geometry === opt.id"
        @click="geometry = opt.id; activePopout = null"
      >{{ geoShort[opt.id] }}</button>
    </div>

    <!-- Lighting popout -->
    <div v-if="activePopout === 'lighting'" class="popout">
      <button
        v-for="preset in lightPresets"
        :key="preset.id"
        class="chip"
        :class="{ active: lightPreset === preset.id }"
        :aria-pressed="lightPreset === preset.id"
        @click="lightPreset = preset.id"
      >{{ preset.label }}</button>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">

      <!-- Geometry picker button -->
      <button
        class="icon-btn"
        :class="{ active: activePopout === 'geometry' }"
        title="Geometry"
        aria-label="Pick geometry"
        @click="togglePopout('geometry')"
      >
        <!-- Polygon/shape icon -->
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="7,1 13,4.5 13,9.5 7,13 1,9.5 1,4.5"/>
          <line x1="7" y1="1" x2="7" y2="13"/>
          <line x1="1" y1="4.5" x2="13" y2="4.5"/>
          <line x1="1" y1="9.5" x2="13" y2="9.5"/>
        </svg>
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
      </button>

      <span class="sep" />

      <!-- Material: inline group -->
      <div class="group">
        <label class="color-swatch" :style="{ background: color }" title="Color">
          <input type="color" v-model="color" class="color-input" />
        </label>
        <div class="slider-group">
          <div class="slider-popup">
            <span class="slider-val">{{ metalness.toFixed(2) }}</span>
            <input type="range" class="slider-vert" orient="vertical" min="0" max="1" step="0.05" v-model.number="metalness" />
          </div>
          <span class="slider-label">M</span>
        </div>
        <div class="slider-group">
          <div class="slider-popup">
            <span class="slider-val">{{ roughness.toFixed(2) }}</span>
            <input type="range" class="slider-vert" orient="vertical" min="0" max="1" step="0.05" v-model.number="roughness" />
          </div>
          <span class="slider-label">R</span>
        </div>
        <button
          class="icon-btn"
          :class="{ active: wireframe }"
          :aria-pressed="wireframe"
          aria-label="Wireframe"
          title="Wireframe"
          @click="wireframe = !wireframe"
        >
          <!-- Wireframe mesh icon -->
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="7,1 13,12 1,12"/>
            <line x1="7" y1="1" x2="7" y2="12"/>
            <line x1="1" y1="12" x2="10" y2="6.5"/>
            <line x1="13" y1="12" x2="4" y2="6.5"/>
          </svg>
        </button>
      </div>

      <span class="sep" />

      <!-- Lighting picker button -->
      <button
        class="icon-btn"
        :class="{ active: activePopout === 'lighting' }"
        title="Lighting"
        aria-label="Lighting preset"
        @click="togglePopout('lighting')"
      >
        <!-- Sun / light icon -->
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
      </button>

    </div>

  </div>
</template>

<style scoped>
.toolbar-wrap {
  position: fixed;
  bottom: var(--space-6);
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

/* Popouts sit above the toolbar */
.popout {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.09);
}

.slider-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
}

.color-swatch {
  width: 22px;
  height: 22px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
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

.slider-group {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition: background var(--duration-fast);
}

.slider-group:hover {
  background: var(--color-surface-2);
}

.slider-group:hover .slider-label {
  color: var(--color-text);
}

.slider-popup {
  position: absolute;
  bottom: calc(100% + var(--space-3));
  left: 50%;
  transform: translateX(-50%);
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


/* Toolbar pill */
.toolbar {
  display: flex;
  align-items: center;
  height: 52px;
  padding: 0 var(--space-3);
  gap: 4px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
}

.group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.sep {
  display: block;
  width: 1px;
  height: 26px;
  background: var(--color-border-subtle);
  flex-shrink: 0;
  margin: 0 var(--space-2);
}

/* Chip buttons */
.chip {
  height: 26px;
  padding: 0 var(--space-2);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: background var(--duration-fast), color var(--duration-fast), border-color var(--duration-fast);
}

.chip:hover {
  background: var(--color-surface-2);
  color: var(--color-text);
}

.chip.active {
  background: var(--color-text);
  color: var(--color-surface);
  border-color: var(--color-text);
}

/* Icon buttons */
.icon-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background var(--duration-fast), color var(--duration-fast);
}

.icon-btn:hover {
  background: var(--color-surface-2);
  color: var(--color-text);
}

.icon-btn.active {
  background: var(--color-text);
  color: var(--color-surface);
}
</style>
