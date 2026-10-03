<script setup lang="ts">
const { splashDone } = useViewer()
</script>

<template>
  <Transition leave-active-class="transition-opacity duration-400 ease-snappy" leave-to-class="opacity-0">
    <div v-if="!splashDone" class="fixed inset-0 z-200 flex items-center justify-center bg-default" role="status" aria-label="Loading 3D scene">
      <div class="animate-[spin_8s_linear_infinite] text-dimmed" aria-hidden="true">
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
