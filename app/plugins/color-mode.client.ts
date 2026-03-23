/**
 * Runs before hydration. Reads the stored color mode from localStorage,
 * resolves "auto" against the OS preference, and sets data-color-mode on
 * <html> immediately — preventing a flash of the wrong theme on page load.
 */
import { defineNuxtPlugin } from '#app'
import { useColorMode, STORAGE_KEY } from '~/composables/useColorMode'

export default defineNuxtPlugin(() => {
  const stored = localStorage.getItem(STORAGE_KEY) ?? 'auto'
  const resolved =
    stored === 'dark'  ? 'dark' :
    stored === 'light' ? 'light' :
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

  document.documentElement.setAttribute('data-color-mode', resolved)

  // Sync the reactive ref so the rest of the app is in agreement
  const { initMode } = useColorMode()
  initMode()
})
