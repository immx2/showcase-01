<script setup lang="ts">
defineProps<{
  label: string
  value: string
}>()
</script>

<template>
  <div class="flex items-baseline justify-between">
    <AppPanelLabel>{{ label }}</AppPanelLabel>
    <span class="text-[11px] text-muted tabular-nums">{{ value }}</span>
  </div>
</template>
