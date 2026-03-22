<script setup lang="ts">
// No props needed
</script>

<template>
  <nav class="nav">
    <span class="brand">showcase-01</span>
    <a href="http://localhost:3000" class="back-link" target="_blank" rel="noopener">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M8.5 2.5L4 7l4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Portfolio
    </a>
  </nav>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-8);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
}

.brand {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--color-text);
}

.back-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 12px;
  color: var(--color-text-muted);
  transition: color var(--duration-fast);
}

.back-link:hover {
  color: var(--color-text);
}
</style>
