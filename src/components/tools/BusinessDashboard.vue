<script setup lang="ts">
import { computed } from 'vue'

type Expense = { amount: number; date: string }
type Entry = { hours: number; rate: number; date: string }

const readJson = <T>(key: string, fallback: T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) || '') as T
  } catch {
    return fallback
  }
}

const expenses = computed<Expense[]>(() => readJson<Expense[]>('caia_expenses_v1', []))
const timesheet = computed<Entry[]>(() => readJson<Entry[]>('caia_timesheet_v1', []))

const totalExpenses = computed(() => expenses.value.reduce((s, e) => s + (e.amount || 0), 0))
const totalRevenue = computed(() => timesheet.value.reduce((s, e) => s + (e.hours || 0) * (e.rate || 0), 0))
const profit = computed(() => totalRevenue.value - totalExpenses.value)
</script>

<template>
  <div class="grid gap-6 sm:grid-cols-3">
    <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div class="text-sm text-slate-400">Revenue (timesheet)</div>
      <div class="mt-2 text-2xl font-semibold text-slate-100">{{ totalRevenue.toFixed(2) }}</div>
    </div>
    <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div class="text-sm text-slate-400">Expenses</div>
      <div class="mt-2 text-2xl font-semibold text-slate-100">{{ totalExpenses.toFixed(2) }}</div>
    </div>
    <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div class="text-sm text-slate-400">Profit</div>
      <div class="mt-2 text-2xl font-semibold text-slate-100">{{ profit.toFixed(2) }}</div>
    </div>
  </div>
</template>


