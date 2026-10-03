<script setup lang="ts">
// Toolbar rail button: icon-only look when the rail is collapsed, icon + label when expanded.
// The label is always rendered and faded with CSS. Mounting/unmounting it would swap the
// button between its "icon + label" and "icon only" padding, which makes the icon jump.
// Single root (UButton) so reka-ui triggers (UPopover etc.) can fall through attrs onto it.
defineProps<{
  icon: string
  label: string
  active?: boolean
}>()

const { labelsExpanded } = useViewer()
</script>

<template>
  <UButton
    :icon="icon"
    :label="label"
    :title="label"
    :aria-label="label"
    :color="active ? 'primary' : 'neutral'"
    :variant="active ? 'soft' : 'ghost'"
    block
    class="rail-btn"
    :class="{ expanded: labelsExpanded }"
  />
</template>

<style scoped>
/* Button padding (10px) + icon (20px) = 40px = collapsed rail inner width, so the
   icon sits in the same spot collapsed and expanded and the hover fill is symmetric. */
.rail-btn {
  justify-content: flex-start;
  overflow: hidden;
}

.rail-btn :deep([data-slot="label"]) {
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.rail-btn.expanded :deep([data-slot="label"]) {
  opacity: 1;
  transition-duration: var(--duration-base);
  transition-delay: var(--duration-fast);
}
</style>
