/// <reference lib="webworker" />

import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'

interface Request { id: string; url: string }
interface Response {
  id: string
  buffer: ArrayBuffer
  width: number
  height: number
  type: number
  format: number
  colorSpace: string
  flipY: boolean
}
interface ErrorResponse { id: string; error: string }

addEventListener('message', async (e: MessageEvent<Request>) => {
  const { id, url } = e.data
  try {
    const tex = await new HDRLoader().loadAsync(url)
    const buffer = tex.image.data!.buffer as ArrayBuffer
    const msg: Response = {
      id,
      buffer,
      width: tex.image.width,
      height: tex.image.height,
      type: tex.type,
      format: tex.format,
      colorSpace: tex.colorSpace,
      flipY: tex.flipY,
    }
    postMessage(msg, [buffer])
  }
  catch (err) {
    const msg: ErrorResponse = { id, error: String(err) }
    postMessage(msg)
  }
})
