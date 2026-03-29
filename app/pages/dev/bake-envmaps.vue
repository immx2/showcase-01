<script setup lang="ts">
if (!import.meta.dev) throw createError({ statusCode: 404 })
</script>

<template>
  <div class="bake-page">
    <h1>Env Map Baker</h1>
    <p>Open the browser console to see progress. Files will download automatically.</p>
    <TresCanvas>
      <EnvBaker />
    </TresCanvas>
  </div>
</template>

<style scoped>
.bake-page {
  padding: 2rem;
  font-family: monospace;
  background: #1a1a1a;
  color: #eee;
  min-height: 100vh;
}

h1 {
  margin: 0 0 0.5rem;
}
</style>
