<script setup lang="ts">
import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'showcase-01:onboarding-seen'
const visible = ref(false)

onMounted(() => {
  // TODO: re-enable localStorage check once testing is done:
  // if (!localStorage.getItem(STORAGE_KEY)) { visible.value = true }
  visible.value = true
})

function dismiss() {
  // TODO: re-enable once testing is done: localStorage.setItem(STORAGE_KEY, '1')
  visible.value = false
}
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" class="backdrop" @click.self="dismiss" role="dialog" aria-modal="true" aria-label="Welcome tutorial">
      <div class="card">
        <p class="eyebrow">Interactive 3D Viewer</p>
        <h1 class="title">Explore every angle</h1>
        <p class="subtitle">Rotate, zoom, and customise any model in real time.</p>

        <ul class="tips">
          <li class="tip">
            <span class="tip-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 3a7 7 0 1 1-4.95 2.05"/>
                <polyline points="7 1 10 3 8 6"/>
              </svg>
            </span>
            <span>
              <strong>Drag</strong> anywhere on the canvas to orbit the model
            </span>
          </li>
          <li class="tip">
            <span class="tip-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="9" r="6"/>
                <line x1="9" y1="6.5" x2="9" y2="11.5"/>
                <line x1="6.5" y1="9" x2="11.5" y2="9"/>
                <line x1="13.5" y1="13.5" x2="17" y2="17"/>
              </svg>
            </span>
            <span>
              <strong>Scroll</strong> to zoom in and out
            </span>
          </li>
          <li class="tip">
            <span class="tip-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="4" y1="6" x2="10" y2="6"/>
                <line x1="4" y1="10" x2="16" y2="10"/>
                <line x1="4" y1="14" x2="13" y2="14"/>
                <circle cx="13" cy="6" r="2"/>
                <circle cx="16" cy="14" r="2"/>
              </svg>
            </span>
            <span>
              <strong>Toolbar</strong> on the left — swap geometry, materials, lighting &amp; environment
            </span>
          </li>
          <li class="tip">
            <span class="tip-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="6" width="16" height="11" rx="2"/>
                <circle cx="10" cy="11.5" r="3"/>
                <path d="M7 6l1.5-2.5h3L13 6"/>
              </svg>
            </span>
            <span>
              <strong>Camera</strong> button saves a screenshot of your scene
            </span>
          </li>
          <li class="tip">
            <span class="tip-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="7 5 11 10 7 15"/>
              </svg>
            </span>
            <span>
              <strong>Expand</strong> at the bottom of the toolbar reveals labels for each button
            </span>
          </li>
        </ul>

        <button class="cta" @click="dismiss">
          Start Exploring
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <line x1="2" y1="7" x2="12" y2="7"/>
            <polyline points="8 3 12 7 8 11"/>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(17, 17, 16, 0.45);
  backdrop-filter: blur(4px);
  padding: var(--space-4);
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8) var(--space-8);
  max-width: 420px;
  width: 100%;
  box-shadow: 0 8px 40px rgba(17, 17, 16, 0.12);
}

.eyebrow {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin: 0 0 var(--space-2);
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--space-2);
  line-height: 1.2;
}

.subtitle {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin: 0 0 var(--space-6);
  line-height: 1.5;
}

.tips {
  list-style: none;
  margin: 0 0 var(--space-8);
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.tip {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  font-size: 0.875rem;
  color: var(--color-text);
  line-height: 1.45;
}

.tip strong {
  font-weight: 600;
}

.tip-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  margin-top: -2px;
}

.cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--color-text);
  color: var(--color-surface);
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.cta:hover {
  opacity: 0.85;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--duration-slow) var(--ease-out);
}

.fade-enter-active .card,
.fade-leave-active .card {
  transition: transform var(--duration-slow) var(--ease-out);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-from .card {
  transform: translateY(12px);
}

.fade-leave-to .card {
  transform: translateY(-8px);
}
</style>
