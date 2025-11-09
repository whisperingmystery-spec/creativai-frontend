<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatCurrency, supportedCurrencies } from '@/utils/currency'
import type { CurrencyCode } from '@/utils/currency'

const monthly = ref<number | null>(10000)
const annualRate = ref<number | null>(12)
const years = ref<number | null>(10)
const lump = ref<number | null>(0)
const expenseRatio = ref<number | null>(0) // annual %
const currency = ref<CurrencyCode>('USD')

const monthlyRate = computed(() => {
  const r = (annualRate.value || 0) - (expenseRatio.value || 0)
  return (r / 12) / 100
})

const nMonths = computed(() => (years.value || 0) * 12)

const fvSip = computed(() => {
  const M = monthly.value || 0
  const R = monthlyRate.value
  const N = nMonths.value
  if (R === 0) return +(M * N).toFixed(2)
  return +(M * (Math.pow(1 + R, N) - 1) / R * (1 + R)).toFixed(2)
})

const fvLump = computed(() => {
  const L = lump.value || 0
  const R = monthlyRate.value
  const N = nMonths.value
  return +(L * Math.pow(1 + R, N)).toFixed(2)
})

const fvTotal = computed(() => +(fvSip.value + fvLump.value).toFixed(2))
const invested = computed(() => +(((monthly.value || 0) * nMonths.value + (lump.value || 0)).toFixed(2)))
const gain = computed(() => +(fvTotal.value - invested.value).toFixed(2))
const cagr = computed(() => {
  const n = years.value || 0
  if (n <= 0 || invested.value <= 0) return 0
  return +(Math.pow(fvTotal.value / invested.value, 1 / n) - 1).toFixed(4)
})
</script>

<template>
  <div class="space-y-8">
    <div class="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div class="space-y-6">
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Monthly contribution (₹)</label>
          <input type="number" v-model.number="monthly" min="0" class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
        </div>
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Expected annual return (%)</label>
          <input type="number" v-model.number="annualRate" min="0" step="0.01" class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
        </div>
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Tenure (years)</label>
          <input type="number" v-model.number="years" min="1" class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
        </div>
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Lump‑sum (optional) (₹)</label>
          <input type="number" v-model.number="lump" min="0" class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
        </div>
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Expense ratio (annual, %) (optional)</label>
          <input type="number" v-model.number="expenseRatio" min="0" step="0.01" class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
        </div>
        <p class="text-xs text-slate-500">
          Formula: FV = M × ((1+R)^(12n) − 1)/R × (1+R); R = r/12/100 (net of expense ratio). CAGR = (FV/Invested)^(1/n) − 1.
        </p>
      </div>

      <div class="space-y-6">
        <div class="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>Total invested</span>
            <span class="font-medium text-slate-100">{{ formatCurrency(invested, currency) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>Estimated corpus (FV)</span>
            <span class="text-lg font-semibold text-slate-100">{{ formatCurrency(fvTotal, currency) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>Estimated gain</span>
            <span class="font-medium text-emerald-300">{{ formatCurrency(gain, currency) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>CAGR</span>
            <span class="font-medium text-slate-100">{{ (cagr * 100).toFixed(2) }}%</span>
          </div>
        </div>
        <p class="text-xs text-slate-500">
          Note: XIRR is most accurate for dated cashflows; displayed CAGR is an approximation for planning.
        </p>
      </div>
    </div>
  </div>
</template>


