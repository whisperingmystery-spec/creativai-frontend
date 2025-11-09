<script setup lang="ts">
import { ref, computed } from 'vue'

const revenue = ref<number | null>(100000)
const cogs = ref<number | null>(40000)
const operatingExpenses = ref<number | null>(30000)
const otherIncome = ref<number | null>(0)
const otherExpenses = ref<number | null>(0)

const grossProfit = computed(() => +(Math.max(0, (revenue.value || 0) - (cogs.value || 0))).toFixed(2))
const operatingProfit = computed(() => +(grossProfit.value - (operatingExpenses.value || 0)).toFixed(2))
const netProfit = computed(() => +(operatingProfit.value + (otherIncome.value || 0) - (otherExpenses.value || 0)).toFixed(2))
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-2">
    <div class="space-y-4">
      <div class="grid gap-2">
        <label class="text-sm text-slate-300">Revenue</label>
        <input v-model.number="revenue" type="number" min="0" step="0.01" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      </div>
      <div class="grid gap-2">
        <label class="text-sm text-slate-300">Cost of Goods Sold (COGS)</label>
        <input v-model.number="cogs" type="number" min="0" step="0.01" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      </div>
      <div class="grid gap-2">
        <label class="text-sm text-slate-300">Operating Expenses</label>
        <input v-model.number="operatingExpenses" type="number" min="0" step="0.01" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      </div>
      <div class="grid gap-2">
        <label class="text-sm text-slate-300">Other Income</label>
        <input v-model.number="otherIncome" type="number" min="0" step="0.01" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      </div>
      <div class="grid gap-2">
        <label class="text-sm text-slate-300">Other Expenses</label>
        <input v-model.number="otherExpenses" type="number" min="0" step="0.01" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      </div>
    </div>
    <div class="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
      <div class="flex items-center justify-between text-sm text-slate-400">
        <span>Gross Profit</span>
        <span class="text-lg font-semibold text-slate-100">{{ grossProfit }}</span>
      </div>
      <div class="flex items-center justify-between text-sm text-slate-400">
        <span>Operating Profit</span>
        <span class="text-lg font-semibold text-slate-100">{{ operatingProfit }}</span>
      </div>
      <div class="flex items-center justify-between text-sm text-slate-400">
        <span>Net Profit</span>
        <span class="text-lg font-semibold text-slate-100">{{ netProfit }}</span>
      </div>
    </div>
  </div>
</template>


