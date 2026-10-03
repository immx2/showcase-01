<script setup lang="ts">
defineProps<{
  items: { id: string, label: string, swatch?: string }[]
  activeId?: string // undefined = no selection tracking
}>()

const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <div class="flex flex-col gap-0.5">
    <UButton
      v-for="item in items"
      :key="item.id"
      :color="activeId === item.id ? 'primary' : 'neutral'"
      :variant="activeId === item.id ? 'soft' : 'ghost'"
      :aria-pressed="activeId !== undefined ? activeId === item.id : undefined"
      block
      class="justify-start"
      @click="emit('select', item.id)"
    >
      <span v-if="item.swatch !== undefined" class="h-3.5 w-6 shrink-0 rounded-sm border border-accented" :style="{ background: item.swatch }" aria-hidden="true" />
      {{ item.label }}
    </UButton>
  </div>
</template>
