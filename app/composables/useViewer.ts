import { ref, computed } from 'vue'

export type GeometryType = 'icosahedron' | 'sphere' | 'torusKnot' | 'box' | 'octahedron' | 'lamborghini'

export type Hotspot = {
  id: string
  label: string
  description: string
  position: [number, number, number]
}

export type HotspotScreenPos = {
  id: string
  x: number    // 0–100 %
  y: number    // 0–100 %
  behind: boolean
}
export type LightPreset = 'studio' | 'dramatic' | 'soft' | 'cold'
export type EnvPresetId = 'none' | 'sunset' | 'studio' | 'forest' | 'night'

// --- Light presets ---
type LightConfig = {
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
export type GeometryOption = {
  id: GeometryType
  label: string
}

export type GeometryGroup = {
  label: string
  options: GeometryOption[]
}

export const geometryGroups: GeometryGroup[] = [
  {
    label: 'Primitives',
    options: [
      { id: 'box',         label: 'Box' },
      { id: 'icosahedron', label: 'Icosahedron' },
      { id: 'octahedron',  label: 'Octahedron' },
      { id: 'sphere',      label: 'Sphere' },
      { id: 'torusKnot',  label: 'Torus Knot' },
    ],
  },
  {
    label: 'Models',
    options: [
      { id: 'lamborghini', label: 'Lamborghini' },
    ],
  },
]

// Flat list kept for anything that needs it (e.g. vertex counting switch)
export const geometryOptions: GeometryOption[] = geometryGroups.flatMap(g => g.options)

// --- Hotspot data (world-space; model normalised to max(x,y)=2.8, scale≈0.976, y-offset≈-0.435) ---
export const lamboHotspots: Hotspot[] = [
  {
    id: 'engine',
    label: 'V10 Engine',
    description: '5.2L naturally aspirated — 610 hp, 560 Nm',
    position: [0, 0.59, -2.15],
  },
  {
    id: 'wing',
    label: 'Active Rear Wing',
    description: 'Adaptive aero adjusts drag for grip and top speed',
    position: [0, 0.93, -2.44],
  },
  {
    id: 'intakes',
    label: 'Hex Air Intakes',
    description: 'Hexagonal side scoops channel air to the mid-engine',
    position: [1.56, 0.34, -0.39],
  },
  {
    id: 'roof',
    label: 'Carbon Fibre Shell',
    description: 'Forged composite monocoque — 1,422 kg dry weight',
    position: [0.20, 0.93, 0.68],
  },
]

// --- Material presets ---
export type MaterialPreset = {
  id: string
  label: string
  color: string
  metalness: number
  roughness: number
}

export const materialPresets: MaterialPreset[] = [
  { id: 'chrome',   label: 'Chrome',        color: '#c8c8cc', metalness: 1.0, roughness: 0.05 },
  { id: 'matte',    label: 'Matte Black',   color: '#1a1a1a', metalness: 0.3, roughness: 0.90 },
  { id: 'brushed',  label: 'Brushed Steel', color: '#b0b4bc', metalness: 0.9, roughness: 0.35 },
  { id: 'gloss',    label: 'Gloss Red',     color: '#c41e2a', metalness: 0.1, roughness: 0.05 },
  { id: 'ceramic',  label: 'Ceramic',       color: '#f0ede8', metalness: 0.0, roughness: 0.30 },
]

// --- Environment presets ---
export type EnvPreset = {
  id: EnvPresetId
  label: string
  // Gradient hint shown in the chip swatch (CSS linear-gradient or solid color)
  swatch: string
  // Poly Haven 2k HDR. Empty string = no environment.
  url: string
}

export const envPresets: EnvPreset[] = [
  {
    id: 'none',
    label: 'None',
    swatch: 'linear-gradient(135deg, #e8e7e3 50%, #d8d7d2 50%)',
    url: '',
  },
  {
    id: 'sunset',
    label: 'Sunset',
    swatch: 'linear-gradient(135deg, #f5a623, #e8441a)',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/venice_sunset_2k.hdr',
  },
  {
    id: 'studio',
    label: 'Studio',
    swatch: 'linear-gradient(135deg, #d0d0d0, #888888)',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/studio_small_09_2k.hdr',
  },
  {
    id: 'forest',
    label: 'Forest',
    swatch: 'linear-gradient(135deg, #4a7c59, #2d5016)',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/forest_slope_2k.hdr',
  },
  {
    id: 'night',
    label: 'Night',
    swatch: 'linear-gradient(135deg, #1a2a4a, #0a0e1a)',
    url: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/moonlit_golf_2k.hdr',
  },
]

// --- Shared reactive state (module-level = singleton) ---
const geometry    = ref<GeometryType>('icosahedron')
const color       = ref('#c8c8cc')
const metalness   = ref(1.0)
const roughness   = ref(0.05)
const wireframe   = ref(false)
const autoRotate  = ref(true)
const lightPreset = ref<LightPreset>('studio')
const vertexCount = ref(0)
const isLoading   = ref(false)
const splashModelReady = ref<boolean>(geometry.value !== 'lamborghini')
const splashEnvReady   = ref(false)
const splashDone       = computed(() => splashModelReady.value && splashEnvReady.value)
const envPreset             = ref<EnvPresetId>('sunset')
const showOnboarding        = ref(false)
const hotspotsVisible       = ref(true)
const labelsExpanded        = ref(false)
const hotspotScreenPositions = ref<HotspotScreenPos[]>([])

// Derived: true whenever an HDR is selected (used by materials for envMapIntensity)
const envEnabled = computed(() => envPreset.value !== 'none')

// Set by ViewerScene once the canvas is ready; called by ViewerControls screenshot button
const screenshotFn = ref<(() => void) | null>(null)

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
  isLoading,
  splashModelReady,
  splashEnvReady,
  splashDone,
  envPreset,
  envEnabled,
  screenshotFn,
  showOnboarding,
  hotspotsVisible,
  hotspotScreenPositions,
  labelsExpanded,
})
