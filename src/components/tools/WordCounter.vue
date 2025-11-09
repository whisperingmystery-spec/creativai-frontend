<script setup lang="ts">
import { computed, ref } from 'vue'

const text = ref<string>('')

const words = computed(() => (text.value.trim() ? text.value.trim().split(/\s+/).filter(Boolean).length : 0))
const charsWith = computed(() => text.value.length)
const charsWithout = computed(() => text.value.replace(/\s+/g, '').length)
const sentences = computed(() => {
  const s = text.value.trim().match(/[^.!?]+[.!?]*/g)
  return s ? s.length : 0
})
const paragraphs = computed(() => {
  const p = text.value.trim().split(/\n\s*\n/).filter((blk) => blk.trim().length > 0)
  return text.value.trim() ? p.length : 0
})
const readingTimeMin = computed(() => {
  const minutes = words.value / 200
  return minutes < 1 ? '< 1' : Math.ceil(minutes).toString()
})

const clearAll = () => (text.value = '')
const pasteFromClipboard = async () => {
  const content = await navigator.clipboard.readText()
  text.value = content
}
const copyStats = async () => {
  const lines = [
    `Words: ${words.value}`,
    `Characters (with spaces): ${charsWith.value}`,
    `Characters (without spaces): ${charsWithout.value}`,
    `Sentences: ${sentences.value}`,
    `Paragraphs: ${paragraphs.value}`,
    `Reading time: ${readingTimeMin.value} min`
  ].join('\n')
  await navigator.clipboard.writeText(lines)
}
</script>

<template>
  <div class="space-y-8">
    <div class="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div class="space-y-6">
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Text</label>
          <textarea
            v-model="text"
            rows="10"
            placeholder="Type or paste text here…"
            class="w-full rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>
        <div class="flex items-center gap-3">
          <button class="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white shadow-glow" @click="pasteFromClipboard">
            Paste from clipboard
          </button>
          <button class="rounded-full border border-slate-700/70 px-5 py-2 text-sm text-slate-200" @click="clearAll">Clear all</button>
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div class="mb-3 text-xs uppercase tracking-[0.28em] text-slate-400">Stats</div>
          <ul class="space-y-2 text-sm text-slate-300">
            <li class="flex items-center justify-between"><span>Words</span><span class="text-slate-100">{{ words }}</span></li>
            <li class="flex items-center justify-between"><span>Characters (with spaces)</span><span class="text-slate-100">{{ charsWith }}</span></li>
            <li class="flex items-center justify-between"><span>Characters (without spaces)</span><span class="text-slate-100">{{ charsWithout }}</span></li>
            <li class="flex items-center justify-between"><span>Sentences</span><span class="text-slate-100">{{ sentences }}</span></li>
            <li class="flex items-center justify-between"><span>Paragraphs</span><span class="text-slate-100">{{ paragraphs }}</span></li>
            <li class="flex items-center justify-between"><span>Reading time</span><span class="text-slate-100">{{ readingTimeMin }} min</span></li>
          </ul>
        </div>
        <button class="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white shadow-glow" @click="copyStats">
          Copy stats
        </button>
      </div>
    </div>
  </div>
</template>


