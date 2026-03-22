<script setup lang="ts">
import { useViewer } from '~/composables/useViewer'
const { vertexCount, isLoading } = useViewer()
</script>

<template>
  <div class="overlay">
    <p class="product-name">Object 001</p>
    <p class="hint">Drag to orbit&nbsp;&nbsp;·&nbsp;&nbsp;Scroll to zoom</p>
    <p class="stat">{{ vertexCount.toLocaleString() }} vertices</p>
  </div>

  <Transition name="loader">
    <div v-if="isLoading" class="loader-wrap">
      <div class="spinner" />
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: calc(var(--nav-height) + var(--space-6));
  left: var(--space-8);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.product-name {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text);
}

.hint {
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
}

.stat {
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}

.loader-wrap {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  pointer-events: none;
}

.spinner {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-text-muted);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loader-enter-active {
  transition: opacity var(--duration-base) var(--ease-out),
              transform var(--duration-base) var(--ease-out);
}

.loader-leave-active {
  transition: opacity var(--duration-slow) var(--ease-out),
              transform var(--duration-slow) var(--ease-out);
}

.loader-enter-from,
.loader-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
