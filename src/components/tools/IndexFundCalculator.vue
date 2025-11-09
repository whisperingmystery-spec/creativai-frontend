<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatCurrency } from '@/utils/currency'
import type { CurrencyCode } from '@/utils/currency'

const lump = ref<number | null>(100000)
const monthly = ref<number | null>(5000)
const years = ref<number | null>(10)
const annualRate = ref<number | null>(12)
const expenseRatio = ref<number | null>(0.2)
const trackingDiff = ref<number | null>(0.0)
const currency = ref<CurrencyCode>('USD')

const monthlyRate = computed(() => {
  const net = (annualRate.value || 0) - (expenseRatio.value || 0) - (trackingDiff.value || 0)
  return (net / 12) / 100
})

const nMonths = computed(() => (years.value || 0) * 12)

const fvLump = computed(() => {
  const L = lump.value || 0
  const R = monthlyRate.value
  const N = nMonths.value
  return +(L * Math.pow(1 + R, N)).toFixed(2)
})

const fvSip = computed(() => {
  const M = monthly.value || 0
  const R = monthlyRate.value
  const N = nMonths.value
  if (R === 0) return +(M * N).toFixed(2)
  return +(M * (Math.pow(1 + R, N) - 1) / R * (1 + R)).toFixed(2)
})

const fvTotal = computed(() => +(fvLump.value + fvSip.value).toFixed(2))
const invested = computed(() => +(((lump.value || 0) + (monthly.value || 0) * nMonths.value).toFixed(2)))
const gain = computed(() => +(fvTotal.value - invested.value).toFixed(2))

const annualRateNet = computed(() => Math.pow(1 + monthlyRate.value, 12) - 1)
type YearRow = { year: number; start: number; contribution: number; interest: number; end: number }
const table = computed<YearRow[]>(() => {
  const rows: YearRow[] = []
  let balance = lump.value || 0
  const yearly = (monthly.value || 0) * 12
  const rA = annualRateNet.value
  const n = years.value || 0
  for (let y = 1; y <= n; y++) {
    const start = balance
    // contributions across year; approximate interest on average balance + half-year contributions
    const interest = (start + yearly / 2) * rA
    balance = start + yearly + interest
    rows.push({
      year: y,
      start: +start.toFixed(2),
      contribution: +yearly.toFixed(2),
      interest: +interest.toFixed(2),
      end: +balance.toFixed(2)
    })
  }
  return rows
})

const cagr = computed(() => {
  const n = years.value || 0
  if (n <= 0 || invested.value <= 0) return 0
  return +(Math.pow(fvTotal.value / invested.value, 1 / n) - 1).toFixed(4)
})

const downloadCsv = () => {
  const header = 'Year,Start,Contribution,Interest,End'
  const lines = table.value.map((r) => [r.year, r.start, r.contribution, r.interest, r.end].join(','))
  const csv = [header, ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'index-fund-yearly.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="space-y-8">
    <div class="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div class="space-y-6">
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Initial lump‑sum (₹)</label>
          <input type="number" v-model.number="lump" min="0" class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
        </div>
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Monthly contribution (₹)</label>
          <input type="number" v-model.number="monthly" min="0" class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
        </div>
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Horizon (years)</label>
          <input type="number" v-model.number="years" min="1" class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
        </div>
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Expected annual return (%)</label>
          <input type="number" v-model.number="annualRate" min="0" step="0.01" class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
        </div>
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Expense ratio (annual, %) (optional)</label>
          <input type="number" v-model.number="expenseRatio" min="0" step="0.01" class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
        </div>
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Tracking difference (annual, %) (optional)</label>
          <input type="number" v-model.number="trackingDiff" min="0" step="0.01" class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
        </div>
        <p class="text-xs text-slate-500">
          Engine: net monthly R = (r − er − td)/12/100. Lump‑sum FV = L(1+R)^(12n). SIP FV as standard. CAGR = (FV/Invested)^(1/n) − 1.
        </p>
      </div>

      <div class="space-y-6">
        <div class="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>Total invested</span>
            <span class="font-medium text-slate-100">{{ formatCurrency(invested, currency) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>Final corpus</span>
            <span class="text-lg font-semibold text-slate-100">{{ formatCurrency(fvTotal, currency) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>Gains</span>
            <span class="font-medium text-emerald-300">{{ formatCurrency(gain, currency) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>CAGR</span>
            <span class="font-medium text-slate-100">{{ (cagr * 100).toFixed(2) }}%</span>
          </div>
          <div class="flex items-center gap-3">
            <button type="button" class="rounded-full bg-gradient-to-br from-brand to-brand-accent px-5 py-2 text-sm font-medium text-white shadow-glow" @click="downloadCsv">
              Download yearly CSV
            </button>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div class="mb-3 text-xs uppercase tracking-[0.28em] text-slate-400">Year-by-year (approx.)</div>
          <div class="overflow-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="text-slate-400">
                <tr>
                  <th class="py-2">Year</th>
                  <th class="py-2">Start</th>
                  <th class="py-2">Contribution</th>
                  <th class="py-2">Interest</th>
                  <th class="py-2">End</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in table" :key="row.year" class="border-t border-white/5">
                  <td class="py-2">{{ row.year }}</td>
                  <td class="py-2">₹ {{ row.start.toLocaleString() }}</td>
                  <td class="py-2">₹ {{ row.contribution.toLocaleString() }}</td>
                  <td class="py-2">₹ {{ row.interest.toLocaleString() }}</td>
                  <td class="py-2">₹ {{ row.end.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


