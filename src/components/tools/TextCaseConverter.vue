<script setup lang="ts">
import { computed, ref } from 'vue'

const text = ref<string>('')
const result = ref<string>('')

const wordCount = computed(() => (result.value || text.value).trim().split(/\s+/).filter(Boolean).length)
const charWithSpaces = computed(() => (result.value || text.value).length)
const charWithoutSpaces = computed(() => (result.value || text.value).replace(/\s+/g, '').length)

const toUpper = () => (result.value = (text.value || '').toUpperCase())
const toLower = () => (result.value = (text.value || '').toLowerCase())
const toTitle = () =>
  (result.value = (text.value || '')
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase()))
const toSentence = () =>
  (result.value = (text.value || '')
    .toLowerCase()
    .replace(/(^\\s*\\w|[\\.\\!\\?]\\s*\\w)/g, (m) => m.toUpperCase()))
const toAlternate = () => {
  const src = text.value || ''
  let out = ''
  for (let i = 0; i < src.length; i++) out += i % 2 === 0 ? src[i].toLowerCase() : src[i].toUpperCase()
  result.value = out
}
const toCamel = () => {
  const parts = (text.value || '').toLowerCase().split(/[^a-zA-Z0-9]+/).filter(Boolean)
  if (!parts.length) return (result.value = '')
  result.value = parts[0] + parts.slice(1).map((p) => p[0].toUpperCase() + p.slice(1)).join('')
}
const toSnake = () =>
  (result.value = (text.value || '').trim().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase())
const toScreamingSnake = () =>
  (result.value = (text.value || '').trim().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toUpperCase())

const copy = async () => {
  const val = result.value || text.value
  if (!val) return
  await navigator.clipboard.writeText(val)
}

const clearAll = () => {
  text.value = ''
  result.value = ''
}
</script>

<template>
  <div class="space-y-8">
    <div class="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div class="space-y-6">
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Input</label>
          <textarea
            v-model="text"
            rows="8"
            placeholder="Paste or type your text…"
            class="w-full rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>
        <div class="flex flex-wrap gap-2">
          <button class="rounded-full bg-brand px-4 py-2 text-xs font-medium text-white" @click="toUpper">UPPERCASE</button>
          <button class="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-200" @click="toLower">lowercase</button>
          <button class="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-200" @click="toTitle">Title Case</button>
          <button class="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-200" @click="toSentence">Sentence case</button>
          <button class="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-200" @click="toAlternate">aLtErNaTe CaSe</button>
          <button class="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-200" @click="toCamel">CamelCase</button>
          <button class="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-200" @click="toSnake">snake_case</button>
          <button class="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-200" @click="toScreamingSnake">SCREAMING_SNAKE_CASE</button>
        </div>
      </div>
      <div class="space-y-6">
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Result</label>
          <textarea
            :value="result || text"
            readonly
            rows="8"
            class="w-full rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-100"
          />
        </div>
        <div class="flex items-center gap-3">
          <button class="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white shadow-glow" @click="copy">Copy result</button>
          <button class="rounded-full border border-slate-700/70 px-5 py-2 text-sm text-slate-200" @click="clearAll">Clear</button>
        </div>
        <div class="text-xs text-slate-400">
          Words: <span class="text-slate-200">{{ wordCount }}</span> •
          Chars (with spaces): <span class="text-slate-200">{{ charWithSpaces }}</span> •
          Chars (no spaces): <span class="text-slate-200">{{ charWithoutSpaces }}</span>
        </div>
      </div>
    </div>
  </div>
</template>


