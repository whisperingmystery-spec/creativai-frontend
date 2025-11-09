<script setup lang="ts">
import { ref, computed, watch } from 'vue'

type Expense = { id: string; date: string; category: string; description: string; amount: number }
const key = 'caia_expenses_v1'
const expenses = ref<Expense[]>([])

const load = () => {
  try {
    const raw = localStorage.getItem(key)
    expenses.value = raw ? JSON.parse(raw) : []
  } catch {
    expenses.value = []
  }
}
const save = () => localStorage.setItem(key, JSON.stringify(expenses.value))
load()
watch(expenses, save, { deep: true })

const form = ref<Expense>({ id: '', date: new Date().toISOString().slice(0, 10), category: 'General', description: '', amount: 0 })
const add = () => {
  if (!form.value.description || !form.value.amount) return
  expenses.value.unshift({ ...form.value, id: crypto.randomUUID() })
  form.value = { id: '', date: new Date().toISOString().slice(0, 10), category: 'General', description: '', amount: 0 }
}
const removeItem = (id: string) => (expenses.value = expenses.value.filter((e) => e.id !== id))
const totalMonth = computed(() => {
  const month = (d: string) => d.slice(0, 7)
  const groups: Record<string, number> = {}
  for (const e of expenses.value) {
    const m = month(e.date)
    groups[m] = (groups[m] || 0) + (e.amount || 0)
  }
  return groups
})
</script>

<template>
  <div class="space-y-6">
    <div class="grid gap-3 sm:grid-cols-[1fr_1fr_2fr_1fr_auto]">
      <input v-model="form.date" type="date" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      <input v-model="form.category" placeholder="Category" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      <input v-model="form.description" placeholder="Description" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      <input v-model.number="form.amount" type="number" min="0" step="0.01" placeholder="Amount" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      <button class="rounded-full bg-gradient-to-br from-brand to-brand-accent px-4 py-2 text-sm font-medium text-white shadow-glow" @click="add">Add</button>
    </div>

    <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
      <table class="w-full text-left text-sm text-slate-300">
        <thead class="text-slate-400">
          <tr>
            <th class="py-2">Date</th>
            <th class="py-2">Category</th>
            <th class="py-2">Description</th>
            <th class="py-2">Amount</th>
            <th class="py-2 w-10"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in expenses" :key="e.id" class="border-t border-white/5">
            <td class="py-2">{{ e.date }}</td>
            <td class="py-2">{{ e.category }}</td>
            <td class="py-2">{{ e.description }}</td>
            <td class="py-2">{{ e.amount.toFixed(2) }}</td>
            <td class="py-2 text-right"><button class="text-xs text-red-300" @click="removeItem(e.id)">Remove</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div class="mb-3 text-xs uppercase tracking-[0.28em] text-slate-400">Monthly totals</div>
      <div class="grid gap-3 sm:grid-cols-3">
        <div v-for="(val, month) in totalMonth" :key="month" class="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm">
          <div class="text-slate-400">{{ month }}</div>
          <div class="text-lg font-semibold text-slate-100">{{ (+val).toFixed(2) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>


