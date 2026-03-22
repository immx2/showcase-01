// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },
  modules: ['@tresjs/nuxt', '@nuxt/fonts'],
  tres: {
    devtools: true,
  },
  css: ['~/assets/styles/main.css'],
  fonts: {
    families: [{ name: 'Inter', provider: 'google' }],
  },
})
