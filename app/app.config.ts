// Single source of truth for the color theme.
// `primary` is the accent (active states, focus rings, CTA). `neutral` tints all chrome.
// Any Tailwind palette name works: https://ui.nuxt.com/docs/getting-started/theme/design-system
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'neutral',
      neutral: 'stone',
    },
  },
})
