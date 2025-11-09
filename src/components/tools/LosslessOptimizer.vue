<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import DragDropZone from '@/components/layout/DragDropZone.vue'
import { loadImage, drawToCanvas, canvasToImageData, losslessOptimize, formatBytes } from '@/utils/imageProcessing'
import { encodeAdvanced } from '@/utils/encoderService'

let upngPromise: Promise<any> | null = null
const loadUpng = async () => {
  if (!upngPromise) {
    upngPromise = import('upng-js').then((mod) => (mod as any).default || mod)
  }
  return upngPromise
}

const file = ref(null)
const originalUrl = ref('')
const optimizedUrl = ref('')
const originalSize = ref(0)
const optimizedSize = ref(0)
const mimeType = ref('')
const isProcessing = ref(false)
const error = ref('')
const useAdvanced = ref(true)
const paletteSize = ref(128)

const reduction = computed(() => {
  if (!originalSize.value || !optimizedSize.value) return 0
  return Math.max(0, 1 - optimizedSize.value / originalSize.value)
})

const isPNG = computed(() => file.value?.type.includes('png'))

const handleError = (message) => {
  error.value = message
  setTimeout(() => {
    error.value = ''
  }, 4000)
}

const reset = () => {
  if (originalUrl.value) URL.revokeObjectURL(originalUrl.value)
  if (optimizedUrl.value) URL.revokeObjectURL(optimizedUrl.value)
  file.value = null
  originalUrl.value = ''
  optimizedUrl.value = ''
  originalSize.value = 0
  optimizedSize.value = 0
  mimeType.value = ''
}

const processFile = async () => {
  if (!file.value) return
  try {
    isProcessing.value = true
    if (originalUrl.value) URL.revokeObjectURL(originalUrl.value)
    if (optimizedUrl.value) URL.revokeObjectURL(optimizedUrl.value)
    const image = await loadImage(file.value)
    const canvas = drawToCanvas(image)
    originalUrl.value = URL.createObjectURL(file.value)
    originalSize.value = file.value.size
    if (useAdvanced.value) {
      const imageData = canvasToImageData(canvas)
      let blob
      if (isPNG.value) {
        const UPNG = await loadUpng()
        const rgba = new Uint8Array(imageData.data)
        const encoded = UPNG.encode([rgba.buffer], imageData.width, imageData.height, 256, undefined, undefined, paletteSize.value)
        blob = new Blob([encoded], { type: 'image/png' })
        mimeType.value = 'image/png'
      } else {
        blob = await encodeAdvanced(imageData, 'image/webp', {
          quality: 0.95,
          effort: 5
        })
        mimeType.value = 'image/webp'
      }
      optimizedUrl.value = URL.createObjectURL(blob)
      optimizedSize.value = blob.size
    } else {
      const result = await losslessOptimize(file.value)
      optimizedUrl.value = URL.createObjectURL(result.blob)
      optimizedSize.value = result.optimizedSize
      mimeType.value = result.mimeType
    }
  } catch (err) {
    console.error(err)
    handleError('Unable to optimize image. Please try a different file.')
  } finally {
    isProcessing.value = false
  }
}

const onFileSelected = (selectedFile) => {
  reset()
  file.value = selectedFile
  processFile()
}

watch(useAdvanced, () => {
  if (file.value) processFile()
})

watch(paletteSize, () => {
  if (file.value && isPNG.value && useAdvanced.value) processFile()
})

const downloadOptimized = () => {
  if (!optimizedUrl.value) return
  const extension = mimeType.value.split('/')[1]
  const link = document.createElement('a')
  link.href = optimizedUrl.value
  link.download = `caia-lossless.${extension}`
  link.click()
}

onBeforeUnmount(() => {
  if (originalUrl.value) URL.revokeObjectURL(originalUrl.value)
  if (optimizedUrl.value) URL.revokeObjectURL(optimizedUrl.value)
})
</script>

<template>
  <div class="space-y-10">
    <div class="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div class="space-y-6">
        <h2 class="text-3xl font-semibold text-slate-100 md:text-4xl">Lossless Optimizer</h2>
        <p class="text-sm text-slate-400 md:text-base">
          Squeeze file size while preserving visual fidelity. Ideal for logos, UI sprites, or brand-critical assets.
        </p>
        <label class="flex items-center gap-3 text-xs font-medium text-slate-300">
          <input type="checkbox" class="h-4 w-4 rounded border border-white/20 bg-slate-900/50" v-model="useAdvanced" />
          Use advanced optimization (palette reduction / WebP lossless)
        </label>
        <div v-if="useAdvanced && isPNG" class="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <label class="flex items-center justify-between text-xs font-medium text-slate-200">
            Palette size
            <span>{{ paletteSize }} colors</span>
          </label>
          <input
            type="range"
            min="16"
            max="256"
            step="16"
            :value="paletteSize"
            class="w-full accent-brand"
            @input="paletteSize = Number($event.target.value)"
          />
          <p class="text-[11px] text-slate-400">Lower palette sizes save more bytes but may reduce subtle gradients.</p>
        </div>
        <DragDropZone label="Drop image for lossless optimize" @file-selected="onFileSelected" @error="handleError" />
        <p v-if="error" class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{{ error }}</p>
      </div>

      <div class="space-y-6">
        <div class="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>Original size</span>
            <span class="font-medium text-slate-100">{{ originalSize ? formatBytes(originalSize) : '—' }}</span>
          </div>
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>Optimized size</span>
            <span class="font-medium text-emerald-400">{{ optimizedSize ? formatBytes(optimizedSize) : '—' }}</span>
          </div>
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>Output format</span>
            <span class="font-medium text-slate-100">{{ mimeType ? mimeType.split('/')[1].toUpperCase() : '—' }}</span>
          </div>
          <div class="flex items-center justify-between text-xs uppercase tracking-[0.32em] text-emerald-300">
            <span>Saved</span>
            <span>{{ optimizedSize ? `${(reduction * 100).toFixed(1)}%` : '—' }}</span>
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
              <p class="text-xs uppercase tracking-[0.28em] text-slate-500">Optimized</p>
              <div class="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                <div v-if="isProcessing" class="flex h-40 items-center justify-center text-sm text-slate-400">Processing…</div>
                <img v-else-if="optimizedUrl" :src="optimizedUrl" alt="Optimized preview" class="w-full rounded-xl object-contain" />
                <div v-else class="flex h-40 items-center justify-center text-sm text-slate-500">No preview yet</div>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full bg-brand px-5 py-2 text-sm font-medium text-white shadow-glow transition hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!optimizedUrl"
              @click="downloadOptimized"
            >
              Download optimized
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full border border-slate-700/70 px-5 py-2 text-sm font-medium text-slate-200 transition hover:border-brand-accent hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
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
