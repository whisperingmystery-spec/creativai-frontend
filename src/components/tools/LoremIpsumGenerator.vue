<script setup lang="ts">
import { ref } from 'vue'

type Mode = 'paragraphs' | 'sentences' | 'words'

const mode = ref<Mode>('paragraphs')
const count = ref<number>(3)
const output = ref<string>('')

const baseWords =
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
    .split(' ')

const randomWord = () => baseWords[Math.floor(Math.random() * baseWords.length)]

const generateWords = (n: number) => {
  const arr = Array.from({ length: n }, () => randomWord())
  const str = arr.join(' ')
  return str.charAt(0).toUpperCase() + str.slice(1) + '.'
}

const generateSentences = (n: number) => {
  return Array.from({ length: n }, () => generateWords(8 + Math.floor(Math.random() * 8))).join(' ')
}

const generateParagraphs = (n: number) => {
  return Array.from({ length: n }, () => generateSentences(3 + Math.floor(Math.random() * 3))).join('\n\n')
}

const generate = () => {
  if (mode.value === 'words') {
    output.value = generateWords(Math.max(1, Math.min(500, count.value)))
  } else if (mode.value === 'sentences') {
    output.value = generateSentences(Math.max(1, Math.min(50, count.value)))
  } else {
    output.value = generateParagraphs(Math.max(1, Math.min(20, count.value)))
  }
}

const copy = async () => {
  if (!output.value) return
  await navigator.clipboard.writeText(output.value)
}

const downloadTxt = () => {
  if (!output.value) return
  const blob = new Blob([output.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'lorem-ipsum.txt'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="space-y-8">
    <div class="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div class="space-y-6">
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Generate</label>
          <div class="flex flex-wrap gap-3">
            <label class="inline-flex items-center gap-2 text-sm text-slate-300">
              <input type="radio" value="paragraphs" v-model="mode" /> Paragraphs
            </label>
            <label class="inline-flex items-center gap-2 text-sm text-slate-300">
              <input type="radio" value="sentences" v-model="mode" /> Sentences
            </label>
            <label class="inline-flex items-center gap-2 text-sm text-slate-300">
              <input type="radio" value="words" v-model="mode" /> Words
            </label>
          </div>
        </div>
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Count</label>
          <input
            type="number"
            v-model.number="count"
            :min="mode==='paragraphs' ? 1 : mode==='sentences' ? 1 : 1"
            :max="mode==='paragraphs' ? 20 : mode==='sentences' ? 50 : 500"
            class="w-40 rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
          />
        </div>
        <button class="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white shadow-glow" @click="generate">Generate</button>
      </div>

      <div class="space-y-4">
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Output</label>
          <textarea
            readonly
            rows="10"
            :value="output"
            class="w-full rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-100"
          />
        </div>
        <div class="flex items-center gap-3">
          <button class="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white shadow-glow" @click="copy">Copy</button>
          <button class="rounded-full border border-slate-700/70 px-5 py-2 text-sm text-slate-200" @click="downloadTxt">Download .txt</button>
        </div>
      </div>
    </div>
  </div>
</template>


