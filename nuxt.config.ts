// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@tresjs/nuxt', '@vueuse/nuxt', '@nuxt/eslint', '@vercel/analytics', '@vercel/speed-insights'],
  devServer: {
    port: 3001,
  },
  colorMode: {
    storageKey: 'showcase-color-mode',
  },
  app: {
    head: {
      meta: [{ name: 'darkreader-lock', content: 'true' }],
    },
  },
  tres: {
    devtools: true,
  },
  css: [
    '~/assets/styles/main.css',
    '~/assets/styles/global.css',
  ],
  fonts: {
    families: [{ name: 'Inter', provider: 'google' }],
  },
  vite: {
    optimizeDeps: {
      include: [
        'three',
        'three/examples/jsm/loaders/HDRLoader.js',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@tresjs/core',
        '@tresjs/cientos',
        '@immx2/portfolio-nav',
      ]
    }
  }
})