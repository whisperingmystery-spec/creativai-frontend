<script setup lang="ts">
import { ref, computed } from 'vue'

const amount = ref<number | null>(100)
const state = ref('CA')

// Approximate average combined state+local sales tax rates (illustrative)
const rates: Record<string, number> = {
  AL: 9.24, AK: 1.76, AZ: 8.40, AR: 9.47, CA: 8.82, CO: 7.77, CT: 6.35, DE: 0, FL: 7.02, GA: 7.40,
  HI: 4.44, ID: 6.03, IL: 8.82, IN: 7.00, IA: 6.94, KS: 8.68, KY: 6.00, LA: 9.55, ME: 5.50, MD: 6.00,
  MA: 6.25, MI: 6.00, MN: 7.49, MS: 7.07, MO: 8.33, MT: 0, NE: 6.95, NV: 8.23, NH: 0, NJ: 6.60,
  NM: 7.84, NY: 8.52, NC: 6.98, ND: 6.98, OH: 7.24, OK: 8.98, OR: 0, PA: 6.34, RI: 7.00, SC: 7.50,
  SD: 6.40, TN: 9.55, TX: 8.20, UT: 7.19, VT: 6.24, VA: 5.75, WA: 9.38, WV: 6.55, WI: 5.43, WY: 5.36,
  DC: 6.00
}
const states = Object.keys(rates)

const taxRate = computed(() => (rates[state.value] ?? 0) / 100)
const tax = computed(() => +(((amount.value || 0) * taxRate.value).toFixed(2)))
const total = computed(() => +(((amount.value || 0) + tax.value).toFixed(2)))
</script>

<template>
  <div class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-3">
      <div class="grid gap-2">
        <label class="text-sm text-slate-300">Amount</label>
        <input v-model.number="amount" type="number" min="0" step="0.01" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      </div>
      <div class="grid gap-2">
        <label class="text-sm text-slate-300">State</label>
        <select v-model="state" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100">
          <option v-for="s in states" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      <div class="grid gap-2">
        <label class="text-sm text-slate-300">Rate</label>
        <input :value="(rates[state] ?? 0).toFixed(2) + '%'" disabled class="rounded-2xl border border-white/10 bg-slate-900/40 px-3 py-2 text-sm text-slate-400" />
      </div>
    </div>
    <div class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm">
        <div class="text-slate-400">Tax</div>
        <div class="text-2xl font-semibold text-slate-100">{{ tax.toFixed(2) }}</div>
      </div>
      <div class="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm">
        <div class="text-slate-400">Total</div>
        <div class="text-2xl font-semibold text-slate-100">{{ total.toFixed(2) }}</div>
      </div>
    </div>
    <p class="text-xs text-slate-500">
      Rates are approximations of average combined state and local sales tax; confirm with your local authority.
    </p>
  </div>
</template>


