<script setup lang="ts">
if (!import.meta.dev) throw createError({ statusCode: 404 })

const baking = ref(false)
</script>

<template>
  <div class="min-h-screen bg-default p-8 font-mono text-default">
    <h1 class="mb-2 text-xl font-semibold">Env Map Baker</h1>
    <p>Open the browser console to see progress. Files will download automatically.</p>
    <UButton v-if="!baking" label="Bake" class="mt-4" @click="baking = true" />
    <p v-else class="mt-4 text-muted">Baking… check the console.</p>
    <TresCanvas>
      <EnvBaker v-if="baking" />
    </TresCanvas>
  </div>
</template>
