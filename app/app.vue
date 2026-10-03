<script setup lang="ts">
import { PortfolioNav } from '@immx2/portfolio-nav'
</script>

<template>
  <UApp>
    <div class="app-shell">
      <NuxtRouteAnnouncer />
      <PortfolioNav current="showcase-01" />
      <div class="page-slot">
        <NuxtPage />
      </div>
    </div>
  </UApp>
</template>

<style>
.app-shell {
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-slot {
  flex: 1;
  min-height: 0;
}
</style>
