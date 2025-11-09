<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import DragDropZone from '@/components/layout/DragDropZone.vue'
import {
  loadImage,
  drawToCanvas,
  canvasToImageData,
  compressImage,
  formatBytes
} from '@/utils/imageProcessing'
import { encodeAdvanced } from '@/utils/encoderService'

const file = ref(null)
const originalUrl = ref('')
const optimizedUrl = ref('')
const quality = ref(0.85)
const originalSize = ref(0)
const optimizedSize = ref(0)
const targetFormat = ref('same')
const targetReduction = ref(0.3)
const syncingReduction = ref(false)
const isProcessing = ref(false)
const error = ref('')
const useAdvanced = ref(true)

const reduction = computed(() => {
  if (!originalSize.value || !optimizedSize.value) return 0
  return 1 - optimizedSize.value / originalSize.value
})

const targetMime = computed(() => {
  if (!file.value) return null
  if (targetFormat.value === 'same') return file.value.type
  return targetFormat.value
})

const reset = () => {
  file.value = null
  originalUrl.value = ''
  optimizedUrl.value = ''
  originalSize.value = 0
  optimizedSize.value = 0
  targetFormat.value = 'same'
  error.value = ''
}

const handleError = (message) => {
  error.value = message
  setTimeout(() => {
    error.value = ''
  }, 4000)
}

const processFile = async () => {
  if (!file.value) return
  try {
    isProcessing.value = true
    error.value = ''
    if (originalUrl.value) URL.revokeObjectURL(originalUrl.value)
    if (optimizedUrl.value) URL.revokeObjectURL(optimizedUrl.value)
    const image = await loadImage(file.value)
    const canvas = drawToCanvas(image)
    const format = targetMime.value ?? file.value.type
    originalUrl.value = URL.createObjectURL(file.value)
    originalSize.value = file.value.size

    if (useAdvanced.value) {
      const imageData = canvasToImageData(canvas)
      const blob = await encodeAdvanced(imageData, format, {
        quality: quality.value,
        effort: 4
      })
      optimizedUrl.value = URL.createObjectURL(blob)
      optimizedSize.value = blob.size
      const savings = Math.max(0, reduction.value)
      if (!syncingReduction.value) {
        targetReduction.value = Math.min(0.9, savings)
      }
      error.value = optimizedSize.value > originalSize.value
        ? 'Heads up: compression increased size. Lower quality or choose another format.'
        : ''
    } else {
      const result = await compressImage(file.value, quality.value, format)
      optimizedUrl.value = URL.createObjectURL(result.blob)
      optimizedSize.value = result.optimizedSize
      const savings = Math.max(0, reduction.value)
      if (!syncingReduction.value) {
        targetReduction.value = Math.min(0.9, savings)
      }
      error.value = optimizedSize.value > originalSize.value
        ? 'Heads up: compression increased size. Lower quality or choose another format.'
        : ''
    }
  } catch (err) {
    console.error(err)
    handleError('Something went wrong while compressing the image.')
  } finally {
    isProcessing.value = false
    syncingReduction.value = false
  }
}

const onFileSelected = (selectedFile) => {
  reset()
  file.value = selectedFile
  processFile()
}

const onQualityChange = (event) => {
  quality.value = event.target.value / 100
  processFile()
}

const onReductionChange = (event) => {
  const value = event.target.value / 100
  syncingReduction.value = true
  targetReduction.value = value
  const mappedQuality = Math.max(0.05, Math.min(0.95, 1 - value))
  quality.value = mappedQuality
  processFile()
}

const downloadOptimized = () => {
  if (!optimizedUrl.value) return
  const mime = targetMime.value ?? file.value.type
  const extension = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg'
  const link = document.createElement('a')
  link.href = optimizedUrl.value
  link.download = `caia-compressed.${extension}`
  link.click()
}

onBeforeUnmount(() => {
  if (originalUrl.value) URL.revokeObjectURL(originalUrl.value)
  if (optimizedUrl.value) URL.revokeObjectURL(optimizedUrl.value)
})

watch(targetFormat, () => {
  if (file.value) processFile()
})

watch(useAdvanced, () => {
  if (file.value) processFile()
})
</script>

<template>
  <div class="space-y-10">
    <div class="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div class="space-y-6">
        <h2 class="text-3xl font-semibold text-slate-100 md:text-4xl">Image Compressor</h2>
        <p class="text-sm text-slate-400 md:text-base">
          Adjust quality between 40 and 95% with real-time previews. Everything runs locally in your browser so assets never leave your device.
        </p>
        <label class="flex items-center gap-3 text-xs font-medium text-slate-300">
          <input
            type="checkbox"
            class="h-4 w-4 rounded border border-white/20 bg-slate-900/50"
            v-model="useAdvanced"
          />
          Use advanced encoder (JSquash)
        </label>
        <DragDropZone label="Drop image to compress" @file-selected="onFileSelected" @error="handleError" />
        <div class="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6" v-if="file">
          <div class="space-y-3">
            <label class="text-sm font-medium text-slate-200">Target savings</label>
            <input
              type="range"
              min="0"
              max="80"
              step="1"
              :value="Math.round(targetReduction * 100)"
              class="w-full accent-brand"
              @input="onReductionChange"
            />
            <p class="text-xs text-slate-400">Desired reduction: {{ Math.round(targetReduction * 100) }}%</p>
          </div>
          <div class="space-y-3">
            <label class="text-sm font-medium text-slate-200">Output format</label>
            <select
              class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              v-model="targetFormat"
            >
              <option value="same">Same as source ({{ file?.type.split('/')[1].toUpperCase() }})</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/webp">WebP</option>
              <option value="image/png">PNG</option>
            </select>
          </div>
          <label class="flex items-center justify-between text-sm font-medium text-slate-200">
            Quality
            <span>{{ Math.round(quality * 100) }}%</span>
          </label>
          <input
            type="range"
            min="40"
            max="95"
            step="1"
            :value="Math.round(quality * 100)"
            class="w-full accent-brand"
            @input="onQualityChange"
          />
        </div>
        <p v-if="error" class="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100">{{ error }}</p>
      </div>

      <div class="space-y-6">
        <div class="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>Original size</span>
            <span class="font-medium text-slate-100">{{ originalSize ? formatBytes(originalSize) : '—' }}</span>
          </div>
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>Compressed size</span>
            <span :class="['font-medium', optimizedSize && optimizedSize <= originalSize ? 'text-emerald-400' : 'text-yellow-300']">
              {{ optimizedSize ? formatBytes(optimizedSize) : '—' }}
            </span>
          </div>
          <div class="flex items-center justify-between text-xs uppercase tracking-[0.32em]" :class="reduction >= 0 ? 'text-emerald-300' : 'text-yellow-300'">
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
              <p class="text-xs uppercase tracking-[0.28em] text-slate-500">Compressed</p>
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
