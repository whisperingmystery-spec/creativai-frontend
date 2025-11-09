<script setup lang="ts">
import { computed, ref } from 'vue'

type Mode = 'gross' | 'operating' | 'net' | 'markup'
const mode = ref<Mode>('gross')

const revenue = ref<number | null>(1000)
const cogs = ref<number | null>(600)
const opex = ref<number | null>(200)
const allExpenses = ref<number | null>(850)
const selling = ref<number | null>(120)
const cost = ref<number | null>(100)

const percent = computed(() => {
  if (mode.value === 'gross') {
    const numerator = (revenue.value || 0) - (cogs.value || 0)
    const denom = revenue.value || 0
    if (denom === 0) return 0
    return +(100 * (numerator / denom)).toFixed(2)
  }
  if (mode.value === 'operating') {
    const numerator = (revenue.value || 0) - (cogs.value || 0) - (opex.value || 0)
    const denom = revenue.value || 0
    if (denom === 0) return 0
    return +(100 * (numerator / denom)).toFixed(2)
  }
  if (mode.value === 'net') {
    const numerator = (revenue.value || 0) - (allExpenses.value || 0)
    const denom = revenue.value || 0
    if (denom === 0) return 0
    return +(100 * (numerator / denom)).toFixed(2)
  }
  // markup
  const numerator = (selling.value || 0) - (cost.value || 0)
  const denom = cost.value || 0
  if (denom === 0) return 0
  return +(100 * (numerator / denom)).toFixed(2)
})
</script>

<template>
  <div class="space-y-8">
    <nav class="flex flex-wrap gap-2">
      <button
        class="rounded-2xl px-4 py-2 text-sm font-medium transition"
        :class="mode==='gross' ? 'bg-gradient-to-br from-brand to-brand-accent text-white shadow-glow' : 'border border-white/10 bg-white/5 text-slate-300 hover:border-brand-accent hover:text-brand-accent'"
        @click="mode='gross'"
      >
        Gross margin
      </button>
      <button
        class="rounded-2xl px-4 py-2 text-sm font-medium transition"
        :class="mode==='operating' ? 'bg-gradient-to-br from-brand to-brand-accent text-white shadow-glow' : 'border border-white/10 bg-white/5 text-slate-300 hover:border-brand-accent hover:text-brand-accent'"
        @click="mode='operating'"
      >
        Operating margin
      </button>
      <button
        class="rounded-2xl px-4 py-2 text-sm font-medium transition"
        :class="mode==='net' ? 'bg-gradient-to-br from-brand to-brand-accent text-white shadow-glow' : 'border border-white/10 bg-white/5 text-slate-300 hover:border-brand-accent hover:text-brand-accent'"
        @click="mode='net'"
      >
        Net margin
      </button>
      <button
        class="rounded-2xl px-4 py-2 text-sm font-medium transition"
        :class="mode==='markup' ? 'bg-gradient-to-br from-brand to-brand-accent text-white shadow-glow' : 'border border-white/10 bg-white/5 text-slate-300 hover:border-brand-accent hover:text-brand-accent'"
        @click="mode='markup'"
      >
        Markup
      </button>
    </nav>

    <div class="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div class="space-y-6">
        <div v-if="mode==='gross'" class="grid gap-4 sm:grid-cols-2">
          <div class="grid gap-2">
            <label class="text-sm text-slate-300">Revenue</label>
            <input type="number" v-model.number="revenue" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
          </div>
        <div class="grid gap-2">
            <label class="text-sm text-slate-300">COGS</label>
            <input type="number" v-model.number="cogs" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
          </div>
        </div>
        <div v-else-if="mode==='operating'" class="grid gap-4 sm:grid-cols-3">
          <div class="grid gap-2">
            <label class="text-sm text-slate-300">Revenue</label>
            <input type="number" v-model.number="revenue" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm text-slate-300">COGS</label>
            <input type="number" v-model.number="cogs" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm text-slate-300">Operating expenses</label>
            <input type="number" v-model.number="opex" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
          </div>
        </div>
        <div v-else-if="mode==='net'" class="grid gap-4 sm:grid-cols-2">
          <div class="grid gap-2">
            <label class="text-sm text-slate-300">Revenue</label>
            <input type="number" v-model.number="revenue" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm text-slate-300">All expenses</label>
            <input type="number" v-model.number="allExpenses" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
          </div>
        </div>
        <div v-else class="grid gap-4 sm:grid-cols-2">
          <div class="grid gap-2">
            <label class="text-sm text-slate-300">Selling price</label>
            <input type="number" v-model.number="selling" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm text-slate-300">Cost</label>
            <input type="number" v-model.number="cost" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
          </div>
        </div>

        <p class="text-xs text-slate-500">
          Gross = (Revenue − COGS)/Revenue, Operating = (Revenue − COGS − OpEx)/Revenue, Net = (Revenue − All)/Revenue, Markup = (Selling − Cost)/Cost. All ×100%.
        </p>
      </div>

      <div class="space-y-6">
        <div class="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>Result</span>
            <span class="text-lg font-semibold text-slate-100">{{ percent }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


