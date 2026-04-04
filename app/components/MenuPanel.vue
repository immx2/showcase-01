<script lang="ts">
export interface Item {
  id: string
  label: string
  dot?: string    // CSS color → circular 10px dot (e.g. material presets)
  swatch?: string // CSS background → 24×14px rect swatch (e.g. env presets)
}

export interface Section {
  label: string
  items: Item[]
}
</script>

<script setup lang="ts">
defineProps<{
  sections: Section[]
  activeId?: string   // undefined = no selection tracking (e.g. material presets)
  listbox?: boolean   // true → role="listbox" on root, role="option" on items
  ariaLabel?: string  // used with listbox=true
}>()

const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <!-- Single root element; .menu-panel always present, parent adds positioning class via fallthrough -->
  <div
    class="menu-panel"
    :role="listbox ? 'listbox' : undefined"
    :aria-label="listbox ? ariaLabel : undefined"
  >
    <template v-for="section in sections" :key="section.label">
      <span class="section">{{ section.label }}</span>
      <button
        v-for="item in section.items"
        :key="item.id"
        class="item"
        :class="{
          active: activeId !== undefined && activeId === item.id,
          'has-icon': item.dot !== undefined || item.swatch !== undefined,
        }"
        :role="listbox ? 'option' : undefined"
        :aria-selected="listbox ? activeId === item.id : undefined"
        :aria-pressed="!listbox && activeId !== undefined ? activeId === item.id : undefined"
        @click="emit('select', item.id)"
      >
        <span v-if="item.dot !== undefined" class="dot" :style="{ background: item.dot }" aria-hidden="true" />
        <span v-if="item.swatch !== undefined" class="swatch" :style="{ background: item.swatch }" aria-hidden="true" />
        {{ item.label }}
      </button>
    </template>
  </div>
</template>

<style scoped>
.menu-panel {
  position: absolute;
  display: flex;
  flex-direction: column;
  padding: var(--space-2);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: 0 0 20px rgb(0 0 0 / 20%);
}

.section {
  display: block;
  padding: var(--space-1) var(--space-3) var(--space-2);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.item + .section,
.section + .section {
  margin-top: var(--space-1);
  padding-top: var(--space-2);
  border-top: 1px solid var(--color-border-subtle);
}

.item {
  width: 100%;
  height: 34px;
  padding: 0 var(--space-3);
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
}

.item:hover {
  background: var(--color-bg-menu-hover);
  color: var(--color-text);
}

.item.active {
  background: var(--color-bg-active);
  color: var(--color-text);
}

.item.active:hover {
  color: var(--color-text);
  transition: none;
}

.has-icon {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  flex-shrink: 0;
}

.swatch {
  display: inline-block;
  width: 24px;
  height: 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  flex-shrink: 0;
}
</style>
