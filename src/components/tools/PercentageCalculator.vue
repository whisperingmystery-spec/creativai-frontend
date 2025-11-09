<script setup lang="ts">
import { computed, ref } from 'vue'

type Mode = 'of' | 'whatPercent' | 'change' | 'increaseBy'

const mode = ref<Mode>('of')

// Inputs
const percent = ref<number | null>(null)
const numberY = ref<number | null>(null)
const partX = ref<number | null>(null)
const wholeY = ref<number | null>(null)
const oldValue = ref<number | null>(null)
const newValue = ref<number | null>(null)
const baseValue = ref<number | null>(null)
const byPercent = ref<number | null>(null)

const result = computed(() => {
  switch (mode.value) {
    case 'of':
      if (percent.value == null || numberY.value == null) return null
      return (percent.value / 100) * numberY.value
    case 'whatPercent':
      if (partX.value == null || wholeY.value == null || wholeY.value === 0) return null
      return (partX.value / wholeY.value) * 100
    case 'change':
      if (oldValue.value == null || newValue.value == null || oldValue.value === 0) return null
      return ((newValue.value - oldValue.value) / oldValue.value) * 100
    case 'increaseBy':
      if (baseValue.value == null || byPercent.value == null) return null
      return baseValue.value * (1 + byPercent.value / 100)
    default:
      return null
  }
})

const formula = computed(() => {
  switch (mode.value) {
    case 'of':
      return 'Result = (X% / 100) × Y'
    case 'whatPercent':
      return 'Result = (Part ÷ Whole) × 100'
    case 'change':
      return 'Result = ((New − Old) ÷ Old) × 100'
    case 'increaseBy':
      return 'Result = Value × (1 + %/100)'
    default:
      return ''
  }
})

const clearAll = () => {
  percent.value = numberY.value = partX.value = wholeY.value = oldValue.value = newValue.value = baseValue.value = byPercent.value = null
}
</script>

<template>
  <div class="space-y-8">
    <nav class="flex flex-wrap gap-2">
      <button
        class="rounded-2xl px-4 py-2 text-sm font-medium transition"
        :class="mode==='of' ? 'bg-brand text-white shadow-glow' : 'text-slate-300 hover:text-brand-accent'"
        @click="mode='of'"
      >
        What is X% of Y?
      </button>
      <button
        class="rounded-2xl px-4 py-2 text-sm font-medium transition"
        :class="mode==='whatPercent' ? 'bg-brand text-white shadow-glow' : 'text-slate-300 hover:text-brand-accent'"
        @click="mode='whatPercent'"
      >
        X is what % of Y?
      </button>
      <button
        class="rounded-2xl px-4 py-2 text-sm font-medium transition"
        :class="mode==='change' ? 'bg-brand text-white shadow-glow' : 'text-slate-300 hover:text-brand-accent'"
        @click="mode='change'"
      >
        % increase/decrease
      </button>
      <button
        class="rounded-2xl px-4 py-2 text-sm font-medium transition"
        :class="mode==='increaseBy' ? 'bg-brand text-white shadow-glow' : 'text-slate-300 hover:text-brand-accent'"
        @click="mode='increaseBy'"
      >
        Increase/decrease by %
      </button>
    </nav>

    <div class="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div class="space-y-6">
        <!-- Mode forms -->
        <div v-if="mode==='of'" class="grid gap-4 sm:grid-cols-2">
          <div class="grid gap-2">
            <label class="text-sm text-slate-300">X (%)</label>
            <input type="number" v-model.number="percent" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm text-slate-300">Y</label>
            <input type="number" v-model.number="numberY" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
          </div>
        </div>

        <div v-else-if="mode==='whatPercent'" class="grid gap-4 sm:grid-cols-2">
          <div class="grid gap-2">
            <label class="text-sm text-slate-300">Part (X)</label>
            <input type="number" v-model.number="partX" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm text-slate-300">Whole (Y)</label>
            <input type="number" v-model.number="wholeY" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
          </div>
        </div>

        <div v-else-if="mode==='change'" class="grid gap-4 sm:grid-cols-2">
          <div class="grid gap-2">
            <label class="text-sm text-slate-300">Old value</label>
            <input type="number" v-model.number="oldValue" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm text-slate-300">New value</label>
            <input type="number" v-model.number="newValue" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
          </div>
        </div>

        <div v-else class="grid gap-4 sm:grid-cols-2">
          <div class="grid gap-2">
            <label class="text-sm text-slate-300">Value</label>
            <input type="number" v-model.number="baseValue" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm text-slate-300">By (%)</label>
            <input type="number" v-model.number="byPercent" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
          </div>
        </div>

        <button class="rounded-full border border-slate-700/70 px-5 py-2 text-sm text-slate-200" @click="clearAll">Clear</button>
      </div>

      <div class="space-y-6">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div class="mb-2 text-xs uppercase tracking-[0.28em] text-slate-400">Result</div>
          <div class="min-h-[2.25rem] text-lg font-semibold text-slate-100">
            {{ result ?? '—' }}
          </div>
        </div>
        <div class="text-xs text-slate-400">Formula: {{ formula }}</div>
      </div>
    </div>
  </div>
</template>


