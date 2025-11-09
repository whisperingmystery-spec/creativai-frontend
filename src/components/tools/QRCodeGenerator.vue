<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import QRCode from 'qrcode'

const inputType = ref('url') // url | text | phone | email | image
const dataValue = ref('')
const phoneValue = ref('')
const emailValue = ref('')
const imageFile = ref(null)
const imageDataUrl = ref('')
const encodeImageData = ref(false)

const size = ref(300)
const colorDark = ref('#111111')
const error = ref('')
const canvasRef = ref(null)
const overlayImg = ref(null)

const building = ref(false)

const buildQRContent = async () => {
  // Determine text to encode based on input type
  if (inputType.value === 'url') {
    if (!dataValue.value) return ''
    const hasProtocol = /^https?:\/\//i.test(dataValue.value)
    return hasProtocol ? dataValue.value : `https://${dataValue.value}`
  }
  if (inputType.value === 'text') return dataValue.value
  if (inputType.value === 'phone') return phoneValue.value ? `tel:${phoneValue.value}` : ''
  if (inputType.value === 'email') return emailValue.value ? `mailto:${emailValue.value}` : ''
  if (inputType.value === 'image') {
    if (!imageDataUrl.value) return ''
    return encodeImageData.value ? imageDataUrl.value : 'Image embedded in QR'
  }
  return ''
}

const drawQR = async () => {
  await nextTick()
  const canvas = canvasRef.value
  if (!canvas) return
  const text = await buildQRContent()
  if (!text) {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    return
  }
  try {
    building.value = true
    error.value = ''
    canvas.width = size.value
    canvas.height = size.value
    await QRCode.toCanvas(canvas, text, {
      width: size.value,
      margin: 2,
      errorCorrectionLevel: inputType.value === 'image' ? 'H' : 'M',
      color: { dark: colorDark.value, light: '#ffffff' }
    })

    // Draw overlay image in the center if applicable
    if (inputType.value === 'image' && overlayImg.value) {
      const ctx = canvas.getContext('2d')
      const overlayRatio = 0.25 // 25% of the QR size
      const dim = Math.floor(size.value * overlayRatio)
      const x = Math.floor((size.value - dim) / 2)
      const y = Math.floor((size.value - dim) / 2)
      ctx.save()
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(x - 6, y - 6, dim + 12, dim + 12)
      ctx.drawImage(overlayImg.value, x, y, dim, dim)
      ctx.restore()
    }
  } catch (e) {
    error.value = 'Unable to render QR. Try simplifying input or lowering size.'
    // eslint-disable-next-line no-console
    console.error(e)
  } finally {
    building.value = false
  }
}

const onFileChange = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  imageFile.value = file
  const url = URL.createObjectURL(file)
  overlayImg.value = new Image()
  overlayImg.value.onload = async () => {
    // Also build a resized data URL to optionally encode
    const dataUrl = await toDataUrlResized(overlayImg.value, 300, 0.75)
    imageDataUrl.value = dataUrl
    await drawQR()
  }
  overlayImg.value.src = url
}

const toDataUrlResized = (img, max, quality = 0.8) => {
  return new Promise((resolve) => {
    const scale = Math.min(1, max / Math.max(img.width, img.height))
    const w = Math.max(1, Math.round(img.width * scale))
    const h = Math.max(1, Math.round(img.height * scale))
    const c = document.createElement('canvas')
    c.width = w
    c.height = h
    const ctx = c.getContext('2d')
    ctx.drawImage(img, 0, 0, w, h)
    resolve(c.toDataURL('image/jpeg', quality))
  })
}

const downloadPNG = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = 'qr-code.png'
  link.click()
}

watch([inputType, dataValue, phoneValue, emailValue, size, colorDark, encodeImageData], drawQR)

onMounted(drawQR)
</script>

<template>
  <div class="space-y-8">
    <div class="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <!-- Left: Inputs -->
      <div class="space-y-6">
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Input type</label>
          <select
            v-model="inputType"
            class="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          >
            <option value="url">URL / Link</option>
            <option value="text">Plain Text</option>
            <option value="phone">Phone</option>
            <option value="email">Email</option>
            <option value="image">Image Upload</option>
          </select>
        </div>

        <div v-if="inputType === 'url'" class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Website URL</label>
          <input
            v-model="dataValue"
            type="text"
            placeholder="https://example.com"
            class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>

        <div v-else-if="inputType === 'text'" class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Text</label>
          <textarea
            v-model="dataValue"
            rows="3"
            placeholder="Your text here…"
            class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>

        <div v-else-if="inputType === 'phone'" class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Phone number</label>
          <input
            v-model="phoneValue"
            type="tel"
            placeholder="+1 555 000 0000"
            class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>

        <div v-else-if="inputType === 'email'" class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Email address</label>
          <input
            v-model="emailValue"
            type="email"
            placeholder="person@example.com"
            class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>

        <div v-else class="space-y-4">
          <div class="grid gap-3">
            <label class="text-sm font-medium text-slate-200">Upload image</label>
            <input type="file" accept="image/*" @change="onFileChange" />
            <label class="mt-2 inline-flex items-center gap-2 text-xs text-slate-300">
              <input type="checkbox" v-model="encodeImageData" />
              Encode image data in QR (data URL). Small images only.
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="grid gap-3">
            <label class="text-sm font-medium text-slate-200">Size (px)</label>
            <input type="range" min="100" max="500" step="10" v-model="size" />
            <div class="text-xs text-slate-400">{{ size }} px</div>
          </div>
          <div class="grid gap-3">
            <label class="text-sm font-medium text-slate-200">Dark color</label>
            <input type="color" v-model="colorDark" class="h-10 w-20 rounded" />
          </div>
        </div>

        <p v-if="error" class="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-xs text-yellow-100">{{ error }}</p>
      </div>

      <!-- Right: Preview & Download -->
      <div class="space-y-6">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div class="mb-3 text-xs uppercase tracking-[0.28em] text-slate-400">Preview</div>
          <div class="flex items-center justify-center">
            <canvas ref="canvasRef" :width="size" :height="size" class="rounded-xl bg-white" />
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-full bg-brand px-5 py-2 text-sm font-medium text-white shadow-glow transition hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent disabled:opacity-50"
            :disabled="building"
            @click="downloadPNG"
          >
            Download PNG
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
