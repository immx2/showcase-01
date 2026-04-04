<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { geometryGroups, geometryOptions, type GeometryType } from '~/composables/useViewer'
import type { Section } from '~/components/MenuPanel.vue'

const { showOnboarding, geometry, vertexCount, isLoading } = useViewer()
const isLambo = computed(() => geometry.value === 'lamborghini')
const colorMode = useColorMode()

const modelName = computed(() => geometryOptions.find(o => o.id === geometry.value)?.label ?? '')

const geoMenuGroups: Section[] = geometryGroups.map(g => ({
  label: g.label,
  items: g.options.map(o => ({ id: o.id, label: o.label })),
}))

const geoOpen = ref(false)
const startRef = ref<HTMLElement | null>(null)

function selectGeo(id: GeometryType) {
  geometry.value = id
  geoOpen.value = false
}

function onDocClick(e: MouseEvent) {
  if (startRef.value && !startRef.value.contains(e.target as Node)) {
    geoOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))

function setMode(pref: 'system' | 'light' | 'dark') {
  colorMode.preference = pref
  document.documentElement.setAttribute('data-color-pref', pref)
}
</script>

<template>
  <nav class="nav">
    <div ref="startRef" class="nav-start">

      <!-- Model picker button -->
      <button
        class="model-btn"
        :class="{ open: geoOpen }"
        :aria-expanded="geoOpen"
        aria-haspopup="listbox"
        @click="geoOpen = !geoOpen"
      >
        <span class="model-name">{{ modelName }}</span>
        <!-- Chevrons up/down selector icon -->
        <svg class="model-chevron" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="2 3.5 5 1 8 3.5"/>
          <polyline points="2 6.5 5 9 8 6.5"/>
        </svg>
      </button>

      <span v-if="!isLoading" class="model-stat">{{ vertexCount.toLocaleString() }} vertices</span>
      <a
        v-if="isLambo && !isLoading"
        class="model-attr"
        href="https://sketchfab.com/3d-models/lamborghini-aventador-888e37a3641d4f7b94bc1a39396e2441"
        target="_blank"
        rel="noopener noreferrer"
        title="Lamborghini Aventador by Arion Digital — CC BY 4.0"
      >CC BY · Arion Digital</a>

      <!-- Geometry dropdown -->
      <Transition name="geo-drop">
        <MenuPanel
          v-if="geoOpen"
          class="geo-dropdown"
          :sections="geoMenuGroups"
          :active-id="geometry"
          :listbox="true"
          :aria-label="'Select geometry'"
          @select="selectGeo($event as GeometryType)"
        />
      </Transition>

    </div>
    <div class="nav-end">

      <!-- 3-segment color mode pill: auto | light | dark -->
      <div id="color-mode-pill" class="mode-pill" role="group" aria-label="Color mode">
        <button
          title="Auto (device)"
          aria-label="Auto (device)"
          :class="{ active: colorMode.preference === 'system' }"
          @click="setMode('system')"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7 1.5 A5.5 5.5 0 0 1 7 12.5 Z" fill="currentColor"/>
          </svg>
        </button>
        <button
          title="Light"
          aria-label="Light"
          :class="{ active: colorMode.preference === 'light' }"
          @click="setMode('light')"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="2.5" stroke="currentColor" stroke-width="1.4"/>
            <line x1="7" y1="1"    x2="7"    y2="2.5"  stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            <line x1="7" y1="11.5" x2="7"    y2="13"   stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            <line x1="1" y1="7"    x2="2.5"  y2="7"    stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            <line x1="11.5" y1="7" x2="13"   y2="7"    stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            <line x1="2.93" y1="2.93"  x2="4"     y2="4"     stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            <line x1="10"   y1="10"    x2="11.07" y2="11.07" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            <line x1="11.07" y1="2.93" x2="10"    y2="4"     stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            <line x1="4"    y1="10"    x2="2.93"  y2="11.07" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
        </button>
        <button
          title="Dark"
          aria-label="Dark"
          :class="{ active: colorMode.preference === 'dark' }"
          @click="setMode('dark')"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 2 a3.5 3.5 0 0 0 5 5 A5 5 0 1 1 7 2Z" fill="currentColor" stroke="none"/>
          </svg>
        </button>
      </div>

      <button class="icon-btn" aria-label="Open guide" @click="showOnboarding = true">?</button>

    </div>
  </nav>
</template>

<style scoped>
.nav {
  flex-shrink: 0;
  height: var(--nav-height);
  z-index: 35;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px 0 20px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
}

/* Left cluster: picker button + stats */
.nav-start {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* Model picker button */
.model-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  margin: -5px 4px -5px -10px;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  color: inherit;
  transition: background var(--duration-fast);
}

.model-btn:hover,
.model-btn.open {
  background: var(--color-bg-hover);
}

.model-name {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text);
}

.model-chevron {
  color: var(--color-text-muted);
  flex-shrink: 0;
  transition: color var(--duration-fast);
}

.model-btn:hover .model-chevron,
.model-btn.open .model-chevron {
  color: var(--color-text);
}

.model-stat {
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
}

.model-attr {
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
  text-decoration: none;
}

.model-attr::before {
  content: '·';
  margin-right: var(--space-2);
}

.model-attr:hover {
  color: var(--color-text);
}

/* Geometry dropdown */
.geo-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: -5px;
  min-width: 160px;
  z-index: 50;
}

/* Dropdown transition */
.geo-drop-enter-active {
  transition: opacity var(--duration-base) var(--ease-out),
              transform var(--duration-base) var(--ease-out);
}

.geo-drop-leave-active {
  transition: opacity var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-out);
}

.geo-drop-enter-from,
.geo-drop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Right cluster */
.nav-end {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

/* Segmented pill */
.mode-pill {
  display: flex;
  align-items: center;
  height: 26px;
  border: 1px solid var(--color-border);
  border-radius: 99px;
  overflow: hidden;
}

.mode-pill button {
  width: 28px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition: all var(--duration-slow);
}

.mode-pill button + button {
  border-left: 1px solid var(--color-border);
}

.mode-pill button.active {
  background: var(--color-bg-active);
  color: var(--color-active-text);
}

.mode-pill button:not(.active):hover {
  background: var(--color-bg-hover);
  color: var(--color-text);
  transition: none;
}

/* Help button */
.icon-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-slow);
}

.icon-btn:hover {
  color: var(--color-text);
  background: var(--color-bg-hover);
  transition: none;
}
</style>
