import { ref, computed } from 'vue'

export type ColorMode = 'auto' | 'light' | 'dark'

export const STORAGE_KEY = 'showcase-color-mode'
const CYCLE: ColorMode[] = ['auto', 'light', 'dark']

// Module-level singleton
const mode = ref<ColorMode>('auto')

// Resolve 'auto' against the OS preference; always returns a concrete value
function resolvedScheme(m: ColorMode): 'light' | 'dark' {
  if (m !== 'auto') return m
  return import.meta.client && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

// Always sets data-color-mode to "light" or "dark" — no absent-attribute state.
// This keeps CSS to 2 rules (:root light default + [data-color-mode="dark"]).
function applyMode(m: ColorMode) {
  if (!import.meta.client) return
  document.documentElement.setAttribute('data-color-mode', resolvedScheme(m))
  localStorage.setItem(STORAGE_KEY, m)
}

// Listen for OS preference changes and re-apply when in auto mode
if (import.meta.client) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (mode.value === 'auto') applyMode('auto')
  })
}

export function useColorMode() {
  const isDark = computed(() => resolvedScheme(mode.value) === 'dark')

  function setMode(m: ColorMode) {
    mode.value = m
    applyMode(m)
  }

  function cycleMode() {
    setMode(CYCLE[(CYCLE.indexOf(mode.value) + 1) % CYCLE.length])
  }

  function initMode() {
    if (!import.meta.client) return
    const stored = localStorage.getItem(STORAGE_KEY) as ColorMode | null
    const initial = stored && CYCLE.includes(stored) ? stored : 'auto'
    mode.value = initial
    applyMode(initial)
  }

  return { mode, isDark, setMode, cycleMode, initMode }
}
