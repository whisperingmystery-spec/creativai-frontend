<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import DragDropZone from '@/components/layout/DragDropZone.vue'
import { loadImage, drawToCanvas, canvasToImageData, convertImage, formatBytes } from '@/utils/imageProcessing'
import { encodeAdvanced } from '@/utils/encoderService'

const file = ref(null)
const originalUrl = ref('')
const convertedUrl = ref('')
const originalSize = ref(0)
const convertedSize = ref(0)
const targetFormat = ref('image/png')
const isProcessing = ref(false)
const error = ref('')
const useAdvanced = ref(true)

const handleError = (message) => {
  error.value = message
  setTimeout(() => {
    error.value = ''
  }, 4000)
}

const reset = () => {
  file.value = null
  originalSize.value = 0
  convertedSize.value = 0
  if (originalUrl.value) URL.revokeObjectURL(originalUrl.value)
  if (convertedUrl.value) URL.revokeObjectURL(convertedUrl.value)
  originalUrl.value = ''
  convertedUrl.value = ''
}

const processFile = async () => {
  if (!file.value) return
  try {
    isProcessing.value = true
    error.value = ''
    if (originalUrl.value) URL.revokeObjectURL(originalUrl.value)
    if (convertedUrl.value) URL.revokeObjectURL(convertedUrl.value)
    const image = await loadImage(file.value)
    const canvas = drawToCanvas(image)
    originalUrl.value = URL.createObjectURL(file.value)
    originalSize.value = file.value.size
    if (useAdvanced.value) {
      const imageData = canvasToImageData(canvas)
      const blob = await encodeAdvanced(imageData, targetFormat.value, { quality: 0.85, effort: 4 })
      convertedUrl.value = URL.createObjectURL(blob)
      convertedSize.value = blob.size
    } else {
      if (targetFormat.value === 'image/avif') {
        handleError('AVIF requires advanced encoding. Enable advanced mode to continue.')
        useAdvanced.value = true
        return
      }
      const result = await convertImage(file.value, targetFormat.value)
      convertedUrl.value = URL.createObjectURL(result.blob)
      convertedSize.value = result.optimizedSize
    }
  } catch (err) {
    console.error(err)
    handleError('Unable to convert image. Please try another file.')
  } finally {
    isProcessing.value = false
  }
}

const onFileSelected = (selectedFile) => {
  reset()
  file.value = selectedFile
  processFile()
}

watch([targetFormat, useAdvanced], () => {
  if (file.value) processFile()
})

const downloadConverted = () => {
  if (!convertedUrl.value) return
  const extension = targetFormat.value.split('/')[1]
  const link = document.createElement('a')
  link.href = convertedUrl.value
  link.download = `caia-converted.${extension}`
  link.click()
}

onBeforeUnmount(() => {
  if (originalUrl.value) URL.revokeObjectURL(originalUrl.value)
  if (convertedUrl.value) URL.revokeObjectURL(convertedUrl.value)
})
</script>

<template>
  <div class="space-y-10">
    <div class="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div class="space-y-6">
        <h2 class="text-3xl font-semibold text-slate-100 md:text-4xl">Format Converter</h2>
        <p class="text-sm text-slate-400 md:text-base">
          Convert between PNG, JPG, and WebP instantly. Keep your originals pristine while exporting the format you need.
        </p>
        <label class="flex items-center gap-3 text-xs font-medium text-slate-300">
          <input type="checkbox" class="h-4 w-4 rounded border border-white/20 bg-slate-900/50" v-model="useAdvanced" />
          Use advanced encoder (JSquash)
        </label>
        <DragDropZone label="Drop image to convert" @file-selected="onFileSelected" @error="handleError" />
        <div class="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6" v-if="file">
          <label class="text-sm font-medium text-slate-200">Select format</label>
          <select
            class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            v-model="targetFormat"
          >
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/webp">WebP</option>
            <option value="image/avif">AVIF (beta)</option>
          </select>
        </div>
        <p v-if="error" class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{{ error }}</p>
      </div>

      <div class="space-y-6">
        <div class="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>Original format</span>
            <span class="font-medium text-slate-100">{{ file ? file.type.split('/')[1].toUpperCase() : '—' }}</span>
          </div>
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>Target format</span>
            <span class="font-medium text-slate-100">{{ targetFormat.split('/')[1].toUpperCase() }}</span>
          </div>
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>Original size</span>
            <span class="font-medium text-slate-100">{{ originalSize ? formatBytes(originalSize) : '—' }}</span>
          </div>
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>Converted size</span>
            <span class="font-medium text-emerald-400">{{ convertedSize ? formatBytes(convertedSize) : '—' }}</span>
          </div>
        </div>

        <div class="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <p class="text-xs uppercase tracking-[0.28em] text-slate-500">Original</p>
              <div class="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                <img v-if="originalUrl" :src="originalUrl" alt="Original preview" class="w-full rounded-xl object-contain" />
                <div v-else class="flex h-40 items-center justify-center text-sm text-slate-500">No file yet</div>
              </div>
            </div>
            <div class="space-y-2">
              <p class="text-xs uppercase tracking-[0.28em] text-slate-500">Converted</p>
              <div class="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                <div v-if="isProcessing" class="flex h-40 items-center justify-center text-sm text-slate-400">Processing…</div>
                <img v-else-if="convertedUrl" :src="convertedUrl" alt="Converted preview" class="w-full rounded-xl object-contain" />
                <div v-else class="flex h-40 items-center justify-center text-sm text-slate-500">No preview yet</div>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full bg-brand px-5 py-2 text-sm font-medium text-white shadow-glow transition hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!convertedUrl"
              @click="downloadConverted"
            >
              Download converted
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full border  border-slate-700/70 px-5 py-2 text-sm font-medium text-slate-200 transition hover:border-brand-accent hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              :disabled="!file"
              @click="reset"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
