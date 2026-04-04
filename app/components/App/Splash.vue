<script setup lang="ts">
const { splashDone } = useViewer()
</script>

<template>
  <Transition name="splash">
    <div v-if="!splashDone" class="splash" role="status" aria-label="Loading 3D scene">
      <div class="icon" aria-hidden="true">
        <svg
          viewBox="0 0 48 48"
          width="56"
          height="56"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <!-- Hexagon (icosahedron projection) -->
          <polygon points="24,3 43,13.5 43,34.5 24,45 5,34.5 5,13.5" stroke-width="1.5" />
          <!-- Internal cross-lines -->
          <line x1="24" y1="3"    x2="24" y2="45"   stroke-width="1" />
          <line x1="5"  y1="13.5" x2="43" y2="34.5" stroke-width="1" />
          <line x1="43" y1="13.5" x2="5"  y2="34.5" stroke-width="1" />
        </svg>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
}

.icon {
  color: var(--color-text-muted);
  animation: spin 8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Leave only — splash is present on first paint, no need to fade in */
.splash-leave-active {
  transition: opacity var(--duration-slow) var(--ease-out);
}

.splash-leave-to {
  opacity: 0;
}
</style>
