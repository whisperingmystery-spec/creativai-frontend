<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatCurrency, supportedCurrencies } from '@/utils/currency'
import type { CurrencyCode } from '@/utils/currency'

const principal = ref<number | null>(500000)
const annualRate = ref<number | null>(9.0) // % per annum
const tenureMonths = ref<number | null>(60)
const currency = ref<CurrencyCode>('USD')

const monthlyRate = computed(() => {
  if (!annualRate.value) return 0
  return (annualRate.value / 12) / 100
})

const valid = computed(() => {
  return (principal.value ?? 0) > 0 && (tenureMonths.value ?? 0) > 0 && (annualRate.value ?? 0) >= 0
})

const emi = computed(() => {
  if (!valid.value) return 0
  const P = principal.value as number
  const N = tenureMonths.value as number
  const R = monthlyRate.value
  if (R === 0) return +(P / N).toFixed(2)
  const factor = Math.pow(1 + R, N)
  return +((P * R * factor) / (factor - 1)).toFixed(2)
})

const totalPayment = computed(() => +(emi.value * (tenureMonths.value || 0)).toFixed(2))
const totalInterest = computed(() => +((totalPayment.value - (principal.value || 0)).toFixed(2)))

type Row = { month: number; interest: number; principal: number; balance: number }
const amortization = computed<Row[]>(() => {
  if (!valid.value) return []
  let balance = principal.value as number
  const rows: Row[] = []
  const R = monthlyRate.value
  const N = tenureMonths.value as number
  for (let m = 1; m <= N; m++) {
    const interest = R === 0 ? 0 : +(balance * R).toFixed(2)
    let principalPart = +(emi.value - interest).toFixed(2)
    if (R === 0) principalPart = +(Math.min(balance, emi.value).toFixed(2))
    balance = +(Math.max(0, balance - principalPart).toFixed(2))
    rows.push({ month: m, interest, principal: principalPart, balance })
  }
  return rows
})

const downloadCsv = () => {
  const header = 'Month,Interest,Principal,Balance'
  const lines = amortization.value.map((r) => [r.month, r.interest, r.principal, r.balance].join(','))
  const csv = [header, ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'emi-amortization.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="space-y-8">
    <div class="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div class="space-y-6">
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Currency</label>
          <select v-model="currency" class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100">
            <option v-for="c in supportedCurrencies" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Principal (₹)</label>
          <input type="number" v-model.number="principal" min="1" class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
        </div>
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Annual interest rate (%)</label>
          <input type="number" v-model.number="annualRate" min="0" step="0.01" class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
        </div>
        <div class="grid gap-3">
          <label class="text-sm font-medium text-slate-200">Tenure (months)</label>
          <input type="number" v-model.number="tenureMonths" min="1" class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
        </div>
        <p class="text-xs text-slate-500">
          Formula: EMI = P × R × (1+R)^N / [(1+R)^N − 1], where R = r/12/100. If r = 0 → EMI = P/N.
        </p>
      </div>

      <div class="space-y-6">
        <div class="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>Monthly EMI</span>
            <span class="text-lg font-semibold text-slate-100">{{ formatCurrency(emi, currency) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>Total interest</span>
            <span class="font-medium text-slate-100">{{ formatCurrency(totalInterest, currency) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm text-slate-400">
            <span>Total payment</span>
            <span class="font-medium text-slate-100">{{ formatCurrency(totalPayment, currency) }}</span>
          </div>
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="rounded-full bg-gradient-to-br from-brand to-brand-accent px-5 py-2 text-sm font-medium text-white shadow-glow"
              :disabled="!valid"
              @click="downloadCsv"
            >
              Download amortization CSV
            </button>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div class="mb-3 text-xs uppercase tracking-[0.28em] text-slate-400">Amortization (first 12 months)</div>
          <div class="overflow-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="text-slate-400">
                <tr>
                  <th class="py-2">Month</th>
                  <th class="py-2">Interest</th>
                  <th class="py-2">Principal</th>
                  <th class="py-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in amortization.slice(0, 12)" :key="row.month" class="border-t border-white/5">
                  <td class="py-2">{{ row.month }}</td>
                  <td class="py-2">{{ formatCurrency(row.interest, currency) }}</td>
                  <td class="py-2">{{ formatCurrency(row.principal, currency) }}</td>
                  <td class="py-2">{{ formatCurrency(row.balance, currency) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


