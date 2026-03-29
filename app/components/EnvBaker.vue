<script setup lang="ts">
/**
 * Dev-only component. Must live inside <TresCanvas> to access the WebGL renderer.
 * Bakes each env preset's HDR through PMREMGenerator and downloads the result as .exr.
 * Run once via /dev/bake-envmaps, then commit the downloaded files to public/env/.
 */
import { onMounted } from 'vue'
import { useTresContext } from '@tresjs/core'
import * as THREE from 'three'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'
import { EXRExporter } from 'three/examples/jsm/exporters/EXRExporter.js'
import { envPresets } from '~/composables/useViewer'

const { renderer } = useTresContext()

onMounted(async () => {
  const r = renderer.instance as THREE.WebGLRenderer
  const pmrem = new THREE.PMREMGenerator(r)
  pmrem.compileEquirectangularShader()
  const exporter = new EXRExporter()

  const presetsWithUrl = envPresets.filter(p => p.url)
  console.log(`[EnvBaker] Baking ${presetsWithUrl.length} presets…`)

  for (const preset of presetsWithUrl) {
    console.log(`[EnvBaker] Loading ${preset.id} (${preset.url})…`)
    const hdr = await new HDRLoader().loadAsync(preset.url)
    const rt = pmrem.fromEquirectangular(hdr)
    hdr.dispose()

    console.log(`[EnvBaker] ${preset.id} — render target size: ${rt.width}×${rt.height}`)

    const data = await exporter.parse(r, rt)
    rt.dispose()

    triggerDownload(data, `${preset.id}.exr`)
    console.log(`[EnvBaker] ✓ ${preset.id}.exr downloaded`)
  }

  pmrem.dispose()
  console.log('[EnvBaker] Done. Move the downloaded .exr files to public/env/ and commit.')
})

function triggerDownload(data: Uint8Array, filename: string) {
  const blob = new Blob([data.buffer as ArrayBuffer], { type: 'image/x-exr' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}
</script>

<template><slot /></template>
