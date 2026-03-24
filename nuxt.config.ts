// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },
  modules: ['@tresjs/nuxt', '@nuxt/fonts', '@nuxtjs/color-mode'],
  colorMode: {
    dataValue: 'color-mode',
    storageKey: 'showcase-color-mode',
    classSuffix: '',
  },
  app: {
    head: {
      script: [{
        key: 'color-pref-init',
        innerHTML: `(function(){try{var p=localStorage.getItem('showcase-color-mode')||'system';document.documentElement.setAttribute('data-color-pref',p)}catch(e){}})()`,
      }],
    },
  },
  tres: {
    devtools: true,
  },
  css: ['~/assets/styles/main.css'],
  fonts: {
    families: [{ name: 'Inter', provider: 'google' }],
  },
  vite: {
    optimizeDeps: {
      include: [
        'three',
        'three/examples/jsm/loaders/HDRLoader.js',
      ],
    },
  },
})
