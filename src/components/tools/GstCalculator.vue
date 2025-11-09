<script setup lang="ts">
import { ref, computed } from 'vue'

const amount = ref<number | null>(1000)
const rate = ref<number | null>(18)
const mode = ref<'add' | 'remove'>('add') // add GST to base or remove from gross

const result = computed(() => {
  const a = amount.value || 0
  const r = (rate.value || 0) / 100
  if (mode.value === 'add') {
    const tax = +(a * r).toFixed(2)
    const total = +(a + tax).toFixed(2)
    return { base: a, tax, total }
  } else {
    const base = +(a / (1 + r)).toFixed(2)
    const tax = +(a - base).toFixed(2)
    return { base, tax, total: a }
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-3">
      <div class="grid gap-2">
        <label class="text-sm text-slate-300">Amount</label>
        <input v-model.number="amount" type="number" min="0" step="0.01" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      </div>
      <div class="grid gap-2">
        <label class="text-sm text-slate-300">GST rate (%)</label>
        <input v-model.number="rate" type="number" min="0" step="0.01" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      </div>
      <div class="grid gap-2">
        <label class="text-sm text-slate-300">Mode</label>
        <select v-model="mode" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100">
          <option value="add">Add GST to Base</option>
          <option value="remove">Remove GST from Gross</option>
        </select>
      </div>
    </div>
    <div class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm">
        <div class="text-slate-400">Base</div>
        <div class="text-2xl font-semibold text-slate-100">{{ result.base.toFixed(2) }}</div>
      </div>
      <div class="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm">
        <div class="text-slate-400">GST</div>
        <div class="text-2xl font-semibold text-slate-100">{{ result.tax.toFixed(2) }}</div>
      </div>
      <div class="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm">
        <div class="text-slate-400">Total</div>
        <div class="text-2xl font-semibold text-slate-100">{{ result.total.toFixed(2) }}</div>
      </div>
    </div>
  </div>
</template>


