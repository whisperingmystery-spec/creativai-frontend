<script setup lang="ts">
import { computed, ref } from 'vue'

const length = ref<number>(16)
const includeUpper = ref(true)
const includeLower = ref(true)
const includeNumbers = ref(true)
const includeSymbols = ref(false)
const excludeSimilar = ref(true)

const password = ref<string>('')

const similarChars = '1lI|O0o'
const sets = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?/~'
}

const filteredSet = (s: string) =>
  excludeSimilar.value ? [...s].filter((c) => !similarChars.includes(c)).join('') : s

const pool = computed(() => {
  let p = ''
  if (includeUpper.value) p += filteredSet(sets.upper)
  if (includeLower.value) p += filteredSet(sets.lower)
  if (includeNumbers.value) p += filteredSet(sets.numbers)
  if (includeSymbols.value) p += filteredSet(sets.symbols)
  return p
})

const generate = () => {
  const chars = pool.value
  if (!chars) {
    password.value = ''
    return
  }
  const requiredPools: string[] = []
  if (includeUpper.value) requiredPools.push(filteredSet(sets.upper))
  if (includeLower.value) requiredPools.push(filteredSet(sets.lower))
  if (includeNumbers.value) requiredPools.push(filteredSet(sets.numbers))
  if (includeSymbols.value) requiredPools.push(filteredSet(sets.symbols))

  // Guarantee at least one of each selected group
  const result: string[] = []
  requiredPools.forEach((grp) => {
    const idx = Math.floor(Math.random() * grp.length)
    result.push(grp[idx])
  })
  while (result.length < length.value) {
    const idx = Math.floor(Math.random() * chars.length)
    result.push(chars[idx])
  }
  // Shuffle (Fisher–Yates)
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  password.value = result.join('')
}

const strength = computed(() => {
  let score = 0
  if (length.value >= 12) score += 1
  if (length.value >= 16) score += 1
  const varieties = [includeUpper.value, includeLower.value, includeNumbers.value, includeSymbols.value].filter(Boolean)
    .length
  if (varieties >= 2) score += 1
  if (varieties >= 3) score += 1
  if (varieties === 4) score += 1
  if (excludeSimilar.value) score += 1
  if (score <= 2) return { label: 'Weak', color: 'text-red-300' }
  if (score === 3) return { label: 'Fair', color: 'text-orange-300' }
  if (score === 4) return { label: 'Good', color: 'text-emerald-300' }
  return { label: 'Strong', color: 'text-emerald-300' }
})

const copy = async () => {
  if (!password.value) return
  await navigator.clipboard.writeText(password.value)
}

const downloadTxt = () => {
  if (!password.value) return
  const blob = new Blob([password.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'password.txt'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="space-y-8">
    <div class="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div class="space-y-6">
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Length: {{ length }}</label>
          <input type="range" min="8" max="32" step="1" v-model.number="length" />
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label class="inline-flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" v-model="includeUpper" /> Include UPPERCASE
          </label>
          <label class="inline-flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" v-model="includeLower" /> Include lowercase
          </label>
          <label class="inline-flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" v-model="includeNumbers" /> Include numbers
          </label>
          <label class="inline-flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" v-model="includeSymbols" /> Include symbols
          </label>
          <label class="inline-flex items-center gap-2 text-sm text-slate-300 sm:col-span-2">
            <input type="checkbox" v-model="excludeSimilar" /> Exclude similar characters (1/l, O/0, etc.)
          </label>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white shadow-glow transition hover:bg-brand/90"
            @click="generate"
          >
            Generate
          </button>
          <button
            type="button"
            class="rounded-full border border-slate-700/70 px-5 py-2 text-sm font-medium text-slate-200 transition hover:border-brand-accent hover:text-brand-accent"
            :disabled="!password"
            @click="copy"
          >
            Copy
          </button>
          <button
            type="button"
            class="rounded-full border border-slate-700/70 px-5 py-2 text-sm font-medium text-slate-200 transition hover:border-brand-accent hover:text-brand-accent"
            :disabled="!password"
            @click="downloadTxt"
          >
            Download .txt
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div class="mb-2 text-xs uppercase tracking-[0.28em] text-slate-400">Password</div>
          <div class="min-h-[3rem] break-all rounded-2xl bg-slate-900/60 p-3 text-slate-100">
            {{ password || '—' }}
          </div>
        </div>
        <div class="text-sm">
          <span class="text-slate-400">Strength:</span>
          <span class="ml-2 font-medium" :class="strength.color">{{ strength.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>


