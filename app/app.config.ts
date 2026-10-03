// Single source of truth for the color theme.
// `primary` is the accent (active states, focus rings, CTA). `neutral` tints all chrome.
// Any Tailwind palette name works: https://ui.nuxt.com/docs/getting-started/theme/design-system
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'neutral',
      neutral: 'stone',
    },
    button: {
      slots: {
        // Inter centers capitals in the line box, so lowercase text sits ~0.09em low next to icons.
        // A relative offset (no layout change) pulls the label up to meet the icon's center.
        label: 'relative -top-[0.07em]',
      },
    },
  },
})
