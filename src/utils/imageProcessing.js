export const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

export const drawToCanvas = (image) => {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0)
  return canvas
}

export const canvasToBlob = (canvas, type, quality = 1) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Canvas conversion failed'))
      },
      type,
      quality
    )
  })

export const canvasToImageData = (canvas) => {
  const ctx = canvas.getContext('2d')
  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

export const compressImage = async (file, quality = 0.85, typeOverride) => {
  const originalSize = file.size
  const image = await loadImage(file)
  const canvas = drawToCanvas(image)
  const mimeType = typeOverride ?? file.type
  const blob = await canvasToBlob(canvas, mimeType, quality)
  return {
    blob,
    originalSize,
    optimizedSize: blob.size,
    quality
  }
}

export const convertImage = async (file, targetFormat = 'image/png', quality = 0.95) => {
  const image = await loadImage(file)
  const canvas = drawToCanvas(image)
  const blob = await canvasToBlob(canvas, targetFormat, quality)
  return {
    blob,
    originalSize: file.size,
    optimizedSize: blob.size,
    targetFormat
  }
}

export const losslessOptimize = async (file) => {
  const image = await loadImage(file)
  const canvas = drawToCanvas(image)
  let mimeType = file.type
  if (mimeType === 'image/jpeg') {
    mimeType = 'image/webp'
  }
  const blob = await canvasToBlob(canvas, mimeType, 1)
  return {
    blob,
    originalSize: file.size,
    optimizedSize: blob.size,
    mimeType
  }
}

export const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes)) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let idx = 0
  let value = bytes
  while (value >= 1024 && idx < units.length - 1) {
    value /= 1024
    idx += 1
  }
  return `${value.toFixed(value < 10 && idx > 0 ? 2 : 0)} ${units[idx]}`
}
