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
  <Transition name="hs-fade">
    <div
      v-if="geometry === 'lamborghini' && !isLoading && hotspotsVisible"
      class="hotspots-layer"
      aria-hidden="true"
    >
      <div
        v-for="pos in hotspotScreenPositions"
        :key="pos.id"
        class="hotspot"
        :class="{ behind: pos.behind }"
        :style="{ left: `${pos.x}%`, top: `${pos.y}%` }"
      >
        <div class="pin">
          <span class="pulse" />
        </div>
        <div class="card" :class="cardSide(pos.x)">
          <span class="card-label">{{ hotspotMeta(pos.id)?.label }}</span>
          <span class="card-desc">{{ hotspotMeta(pos.id)?.description }}</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.hotspots-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* Individual hotspot — centred on its projected point */
.hotspot {
  position: absolute;
  transform: translate(-50%, -50%);
  pointer-events: auto;
  transition: opacity var(--duration-base) var(--ease-out);
}

.hotspot.behind {
  opacity: 0;
  pointer-events: none;
}

/* Dot */
.pin {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  border: 1.5px solid rgba(0, 0, 0, 0.18);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.18);
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease-out),
              background var(--duration-fast);
}

.hotspot:hover .pin {
  transform: scale(1.3);
  background: #fff;
}

/* Pulsing ring */
.pulse {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.55);
  animation: hs-pulse 2.4s ease-out infinite;
}

@keyframes hs-pulse {
  0%   { transform: scale(1);   opacity: 0.8; }
  100% { transform: scale(2.8); opacity: 0; }
}

/* Hover card */
.card {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding: var(--space-2) var(--space-3);
  min-width: 158px;
  max-width: 210px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 3px;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.card.right { left:  calc(100% + 10px); }
.card.left  { right: calc(100% + 10px); }

.hotspot:hover .card {
  opacity: 1;
}

.card-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
}

.card-desc {
  font-size: 11px;
  line-height: 1.45;
  color: var(--color-text-muted);
}

/* Layer fade-in/out when toggled or geometry switches */
.hs-fade-enter-active { transition: opacity var(--duration-base) var(--ease-out); }
.hs-fade-leave-active { transition: opacity var(--duration-fast) var(--ease-out); }
.hs-fade-enter-from,
.hs-fade-leave-to     { opacity: 0; }
</style>
