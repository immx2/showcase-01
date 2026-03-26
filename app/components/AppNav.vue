<script setup lang="ts">
import { computed } from 'vue'
import { geometryOptions } from '~/composables/useViewer'

const { showOnboarding, geometry, vertexCount, isLoading } = useViewer()
const isLambo = computed(() => geometry.value === 'lamborghini')
const colorMode = useColorMode()

const modelName = computed(() => geometryOptions.find(o => o.id === geometry.value)?.label ?? '')

function setMode(pref: 'system' | 'light' | 'dark') {
  colorMode.preference = pref
  document.documentElement.setAttribute('data-color-pref', pref)
}
</script>

<template>
  <nav class="nav">
    <div class="nav-start">
      <span class="model-name">{{ modelName }}</span>
      <span v-if="!isLoading" class="model-stat">{{ vertexCount.toLocaleString() }} verts</span>
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

      <!-- 3-segment color mode pill: auto | light | dark -->
      <div id="color-mode-pill" class="mode-pill" role="group" aria-label="Color mode">
        <button
          title="Auto (device)"
          aria-label="Auto (device)"
          @click="setMode('system')"
        >
          <!-- Half-circle: left half filled = dark, right = light -->
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7 1.5 A5.5 5.5 0 0 1 7 12.5 Z" fill="currentColor"/>
          </svg>
        </button>
        <button
          title="Light"
          aria-label="Light"
          @click="setMode('light')"
        >
          <!-- Sun -->
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
          @click="setMode('dark')"
        >
          <!-- Crescent moon — outer circle centered at (7,7) r=5 -->
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
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px 0 20px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
}

.nav-start {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
}

.model-name {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text);
}

.model-stat {
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}

.model-attr {
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
  text-decoration: none;
  opacity: 0.6;
  transition: opacity var(--duration-fast);
}

.model-attr::before {
  content: '·';
  margin-right: var(--space-2);
}

.model-attr:hover {
  opacity: 1;
}

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
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition: background var(--duration-fast), color var(--duration-fast);
}

.mode-pill button + button {
  border-left: 1px solid var(--color-border);
}

.mode-pill button:not(.active):hover {
  background: var(--color-surface-2);
  color: var(--color-text);
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
  transition: color var(--duration-fast), border-color var(--duration-fast);
}

.icon-btn:hover {
  color: var(--color-text);
  border-color: var(--color-text-muted);
}
</style>
