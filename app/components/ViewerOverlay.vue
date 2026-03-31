<script setup lang="ts">
import { computed } from 'vue'
import { useViewer, geometryOptions } from '~/composables/useViewer'
const { geometry, vertexCount, isLoading } = useViewer()
const modelName = computed(() => geometryOptions.find(o => o.id === geometry.value)?.label ?? '')
</script>

<template>
  <div class="overlay">
    <p class="product-name">
      {{ modelName }}
      <span v-if="!isLoading" class="stat">&nbsp;·&nbsp;{{ vertexCount.toLocaleString() }} vertices</span>
    </p>
    <p class="hint">Drag to orbit&nbsp;&nbsp;·&nbsp;&nbsp;Scroll to zoom</p>
  </div>

  <Transition name="loader">
    <div v-if="isLoading" class="loader-wrap">
      <div class="loader-bg" />
      <div class="spinner" />
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: calc(var(--portfolio-nav-height, 28px) + var(--nav-height) + var(--space-6));
  right: var(--space-8);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-1);
  pointer-events: none;
  padding: var(--space-2) var(--space-3);
  background: color-mix(in srgb, var(--color-surface-2) 80%, transparent);
  backdrop-filter: blur(8px);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
}

.product-name {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text);
  display: flex;
  align-items: baseline;
  gap: 0;
  text-shadow: 0 1px 3px rgb(0 0 0 / 25%);
}

.hint {
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
  text-shadow: 0 1px 3px rgb(0 0 0 / 25%);
}

.stat {
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.04em;
  text-transform: none;
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

.loader-bg {
  position: absolute;
  inset: 0;
  background: var(--color-surface);
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
  transition: opacity var(--duration-base) var(--ease-out);
}

.loader-leave-active {
  transition: opacity var(--duration-slow) var(--ease-out);
}

.loader-enter-from,
.loader-leave-to {
  opacity: 0;
}
</style>
