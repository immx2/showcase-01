<script setup lang="ts">
defineProps<{
  items: { id: string, label: string, swatch?: string }[]
  activeId?: string // undefined = no selection tracking
}>()

const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <div class="preset-list">
    <UButton
      v-for="item in items"
      :key="item.id"
      :color="activeId === item.id ? 'primary' : 'neutral'"
      :variant="activeId === item.id ? 'soft' : 'ghost'"
      :aria-pressed="activeId !== undefined ? activeId === item.id : undefined"
      block
      class="preset"
      @click="emit('select', item.id)"
    >
      <span v-if="item.swatch !== undefined" class="swatch" :style="{ background: item.swatch }" aria-hidden="true" />
      {{ item.label }}
    </UButton>
  </div>
</template>

<style scoped>
.preset-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.preset {
  justify-content: flex-start;
}

.swatch {
  width: 24px;
  height: 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--ui-border-accented);
  flex-shrink: 0;
}
</style>
