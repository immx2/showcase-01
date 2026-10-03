<script setup lang="ts">
import { useViewer, lamboHotspots } from '~/composables/useViewer'

const { geometry, isLoading, hotspotsVisible, hotspotScreenPositions } = useViewer()

function hotspotMeta(id: string) {
  return lamboHotspots.find(h => h.id === id)
}

// Flip the card to the left when the pin is in the right half of the screen
function cardSide(x: number): 'right' | 'left' {
  return x > 55 ? 'left' : 'right'
}
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-220 ease-snappy"
    leave-active-class="transition-opacity duration-120 ease-snappy"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="geometry === 'lamborghini' && !isLoading && hotspotsVisible"
      class="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      <div
        v-for="pos in hotspotScreenPositions"
        :key="pos.id"
        class="group absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-220 ease-snappy"
        :class="pos.behind ? 'pointer-events-none opacity-0' : 'pointer-events-auto'"
        :style="{ left: `${pos.x}%`, top: `${pos.y}%` }"
      >
        <div class="relative size-2.5 cursor-pointer rounded-full border-[1.5px] border-accented bg-elevated/90 shadow-[0_1px_6px_rgb(0_0_0/18%)] transition duration-120 ease-snappy group-hover:scale-130 group-hover:bg-elevated">
          <span class="absolute -inset-1 animate-hotspot-pulse rounded-full border-[1.5px] border-primary" />
        </div>
        <div
          class="pointer-events-none absolute top-1/2 flex max-w-52 min-w-40 -translate-y-1/2 flex-col gap-[3px] rounded-md border border-accented bg-elevated/95 px-3 py-2 opacity-0 shadow-lg backdrop-blur-[10px] transition-opacity duration-120 ease-snappy group-hover:opacity-100"
          :class="cardSide(pos.x) === 'right' ? 'left-[calc(100%+10px)]' : 'right-[calc(100%+10px)]'"
        >
          <span class="text-xs font-semibold whitespace-nowrap text-highlighted">{{ hotspotMeta(pos.id)?.label }}</span>
          <span class="text-[11px]/snug text-muted">{{ hotspotMeta(pos.id)?.description }}</span>
        </div>
      </div>
    </div>
  </Transition>
</template>
