<script setup lang="ts">
import { useViewer } from '~/composables/useViewer'
const { vertexCount } = useViewer()
</script>

<template>
  <div class="overlay">
    <p class="product-name">Object 001</p>
    <p class="hint">Drag to orbit&nbsp;&nbsp;·&nbsp;&nbsp;Scroll to zoom</p>
    <p class="stat">{{ vertexCount.toLocaleString() }} vertices</p>
  </div>
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
</style>
