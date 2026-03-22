import { ref, computed } from 'vue'

export type GeometryType = 'icosahedron' | 'sphere' | 'torusKnot' | 'box' | 'octahedron' | 'lamborghini'
export type LightPreset = 'studio' | 'dramatic' | 'soft' | 'cold'

// --- Light presets ---
interface LightConfig {
  ambient: number
  key: { pos: [number, number, number]; intensity: number; color: string }
  fill: { pos: [number, number, number]; intensity: number; color: string }
  rim: { pos: [number, number, number]; intensity: number; color: string }
}

export const lightPresets: Record<LightPreset, LightConfig> = {
  studio: {
    ambient: 1.0,
    key:  { pos: [5, 6, 4],   intensity: 2.5, color: '#ffffff' },
    fill: { pos: [-4, 2, -3], intensity: 0.8, color: '#c8d4e0' },
    rim:  { pos: [0, -4, 2],  intensity: 0.4, color: '#e8e0d0' },
  },
  dramatic: {
    ambient: 0.2,
    key:  { pos: [8, 8, 2],   intensity: 4.5, color: '#fff8f0' },
    fill: { pos: [-3, -1, -4], intensity: 0.3, color: '#1a2040' },
    rim:  { pos: [0, 5, -5],  intensity: 1.5, color: '#6080ff' },
  },
  soft: {
    ambient: 2.0,
    key:  { pos: [3, 4, 3],  intensity: 1.2, color: '#fff5e8' },
    fill: { pos: [-3, 2, 1], intensity: 1.0, color: '#e8f0f8' },
    rim:  { pos: [0, -2, 2], intensity: 0.6, color: '#f8f0e8' },
  },
  cold: {
    ambient: 0.5,
    key:  { pos: [0, 8, 0],    intensity: 3.5, color: '#a0c8ff' },
    fill: { pos: [4, 0, 4],   intensity: 0.6, color: '#c0d8ff' },
    rim:  { pos: [-4, -2, -2], intensity: 0.8, color: '#ffffff' },
  },
}

// --- Geometry options ---
export interface GeometryOption {
  id: GeometryType
  label: string
}

export const geometryOptions: GeometryOption[] = [
  { id: 'icosahedron',  label: 'Ico' },
  { id: 'sphere',       label: 'Sphere' },
  { id: 'torusKnot',    label: 'Knot' },
  { id: 'box',          label: 'Box' },
  { id: 'octahedron',   label: 'Octa' },
  { id: 'lamborghini',  label: 'Lambo' },
]

// --- Shared reactive state (module-level = singleton) ---
const geometry    = ref<GeometryType>('icosahedron')
const color       = ref('#c8c6be')
const metalness   = ref(0.4)
const roughness   = ref(0.35)
const wireframe   = ref(false)
const autoRotate  = ref(true)
const lightPreset = ref<LightPreset>('studio')
const vertexCount = ref(0)

const lightConfig = computed(() => lightPresets[lightPreset.value])

export const useViewer = () => ({
  geometry,
  color,
  metalness,
  roughness,
  wireframe,
  autoRotate,
  lightPreset,
  lightConfig,
  vertexCount,
})
