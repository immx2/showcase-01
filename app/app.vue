<script setup lang="ts">
import { PortfolioNav } from '@immx2/portfolio-nav'
</script>

<template>
  <UApp>
    <div class="flex h-dvh flex-col overflow-hidden">
      <NuxtRouteAnnouncer />
      <PortfolioNav current="showcase-01" />
      <div class="min-h-0 flex-1">
        <NuxtPage />
      </div>
    </div>
  </UApp>
</template>
