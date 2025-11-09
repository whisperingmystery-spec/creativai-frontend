<script setup>
import { onBeforeUnmount, ref } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: 'Drag & drop image'
  },
  acceptedFormats: {
    type: Array,
    default: () => ['image/jpeg', 'image/png', 'image/webp']
  },
  maxSizeMb: {
    type: Number,
    default: 25
  }
})

const emit = defineEmits(['file-selected', 'error'])

const inputRef = ref(null)
const isDragging = ref(false)

const validateFile = (file) => {
  if (!props.acceptedFormats.includes(file.type)) {
    emit('error', `Unsupported format. Use JPG, PNG, or WebP.`)
    return false
  }
  if (file.size > props.maxSizeMb * 1024 * 1024) {
    emit('error', `File too large. Limit ${props.maxSizeMb} MB.`)
    return false
  }
  return true
}

const handleFiles = (files) => {
  const file = files?.[0]
  if (!file) return
  if (!validateFile(file)) return
  emit('file-selected', file)
}

const handleDrop = (event) => {
  event.preventDefault()
  event.stopPropagation()
  isDragging.value = false
  handleFiles(event.dataTransfer.files)
}

const handleDragOver = (event) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleBrowse = () => {
  inputRef.value?.click()
}

const handleChange = (event) => {
  handleFiles(event.target.files)
  event.target.value = ''
}

onBeforeUnmount(() => {
  if (inputRef.value) {
    inputRef.value.value = ''
  }
})
</script>

<template>
  <div
    class="relative flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/5 px-6 py-12 text-center transition hover:border-brand-accent/60 hover:bg-white/10"
    :class="isDragging ? 'border-brand-accent/80 bg-white/10' : ''"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <input
      ref="inputRef"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      class="hidden"
      @change="handleChange"
    />
    <div class="space-y-3">
      <p class="text-sm uppercase tracking-[0.28em] text-slate-400">{{ label }}</p>
      <p class="text-sm text-slate-500">
        JPG, PNG, WebP · Max {{ maxSizeMb }} MB
      </p>
      <button
        type="button"
        class="mt-4 inline-flex items-center justify-center rounded-full border border-slate-700/70 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-brand-accent hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        @click="handleBrowse"
      >
        Browse files
      </button>
    </div>
  </div>
</template>

