<script setup lang="ts">
if (!import.meta.dev) throw createError({ statusCode: 404 })

const baking = ref(false)
</script>

<template>
  <div class="bake-page">
    <h1>Env Map Baker</h1>
    <p>Open the browser console to see progress. Files will download automatically.</p>
    <button v-if="!baking" class="go-btn" @click="baking = true">Bake</button>
    <p v-else class="status">Baking… check the console.</p>
    <TresCanvas>
      <EnvBaker v-if="baking" />
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

.go-btn {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  font-family: monospace;
  font-size: 1rem;
  background: #333;
  color: #eee;
  border: 1px solid #555;
  border-radius: 4px;
  cursor: pointer;
}

.go-btn:hover {
  background: #444;
}

.status {
  margin-top: 1rem;
  color: #aaa;
}
</style>
