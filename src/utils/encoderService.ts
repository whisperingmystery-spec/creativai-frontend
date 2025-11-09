import type { ImageDataLike } from './types'
import { canvasToBlob } from './imageProcessing'

let jpegEncoderPromise: Promise<any> | null = null
let webpEncoderPromise: Promise<any> | null = null
let avifEncoderPromise: Promise<any> | null = null

const loadJpegEncoder = async () => {
  if (!jpegEncoderPromise) {
    jpegEncoderPromise = import('@jsquash/jpeg').then((mod) => mod.encode)
  }
  return jpegEncoderPromise
}

const loadWebpEncoder = async () => {
  if (!webpEncoderPromise) {
    webpEncoderPromise = import('@jsquash/webp').then((mod) => mod.encode)
  }
  return webpEncoderPromise
}

const loadAvifEncoder = async () => {
  if (!avifEncoderPromise) {
    avifEncoderPromise = import('@jsquash/avif').then((mod) => mod.encode)
  }
  return avifEncoderPromise
}

export interface EncodeOptions {
  quality: number
  effort?: number
}

const clampQuality = (value: number) => Math.min(0.95, Math.max(0.03, value))

export const encodeAdvanced = async (
  imageData: ImageDataLike,
  format: string,
  options: EncodeOptions
) => {
  const q = clampQuality(options.quality)

  if (format.includes('jpeg') || format.includes('jpg')) {
    const encode = await loadJpegEncoder()
    const result = await encode(imageData, {
      quality: Math.round(q * 100),
      chromaSubsampling: '4:4:4'
    })
    return new Blob([result], { type: 'image/jpeg' })
  }

  if (format.includes('webp')) {
    const encode = await loadWebpEncoder()
    const result = await encode(imageData, {
      quality: Math.round(q * 100),
      effort: 4
    })
    return new Blob([result], { type: 'image/webp' })
  }

  if (format.includes('avif')) {
    const encode = await loadAvifEncoder()
    const result = await encode(imageData, {
      quality: Math.round(q * 100),
      speed: 6
    })
    return new Blob([result], { type: 'image/avif' })
  }

  // PNG fallback: use Canvas-based approach for now
  const canvas = document.createElement('canvas')
  canvas.width = imageData.width
  canvas.height = imageData.height
  const ctx = canvas.getContext('2d')
  ctx.putImageData(imageData as ImageData, 0, 0)
  return canvasToBlob(canvas, 'image/png', 1)
}
