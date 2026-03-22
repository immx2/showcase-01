<script setup lang="ts">
// Static overlay — product label + interaction hint
</script>

<template>
  <div class="overlay">
    <p class="product-name">Object 001</p>
    <p class="hint">Drag to orbit&nbsp;&nbsp;·&nbsp;&nbsp;Scroll to zoom</p>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  bottom: var(--space-8);
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
</style>
