<script setup lang="ts">
// Toolbar rail button: icon-only look when the rail is collapsed, icon + label when expanded.
// The label is always rendered and faded with the `ui.label` slot classes. Mounting/unmounting it would swap the
// button between its "icon + label" and "icon only" padding, which makes the icon jump.
// Button padding (10px) + icon (20px) = 40px = collapsed rail inner width, so the icon sits in
// the same spot collapsed and expanded.
// The tooltip is only enabled while the rail is collapsed, because the label is hidden then.
// Attrs from reka-ui triggers (UPopover etc.) are forwarded to the UButton, not to the UTooltip.
defineOptions({ inheritAttrs: false })

defineProps<{
  icon: string
  label: string
  active?: boolean
}>()

const { labelsExpanded } = useViewer()
</script>

<template>
  <UTooltip :text="label" :disabled="labelsExpanded" :content="{ side: 'right' }">
    <UButton
      v-bind="$attrs"
      :icon="icon"
      :label="label"
      :aria-label="label"
      :color="active ? 'primary' : 'neutral'"
      :variant="active ? 'soft' : 'ghost'"
      block
      class="justify-start overflow-hidden font-normal"
      :ui="{ label: ['transition-opacity ease-snappy', labelsExpanded ? 'opacity-100 delay-120 duration-220' : 'opacity-0 duration-120'] }"
    />
  </UTooltip>
</template>
