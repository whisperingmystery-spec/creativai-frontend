<script setup lang="ts">
import { ref, computed, watch } from 'vue'

type Entry = { id: string; date: string; project: string; hours: number; rate: number }
const key = 'caia_timesheet_v1'
const entries = ref<Entry[]>([])
const form = ref<Entry>({ id: '', date: new Date().toISOString().slice(0, 10), project: '', hours: 1, rate: 50 })

const load = () => {
  try {
    entries.value = JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    entries.value = []
  }
}
const save = () => localStorage.setItem(key, JSON.stringify(entries.value))
load()
watch(entries, save, { deep: true })

const add = () => {
  if (!form.value.project) return
  entries.value.unshift({ ...form.value, id: crypto.randomUUID() })
  form.value = { id: '', date: new Date().toISOString().slice(0, 10), project: '', hours: 1, rate: 50 }
}
const removeItem = (id: string) => (entries.value = entries.value.filter((e) => e.id !== id))
const totalHours = computed(() => entries.value.reduce((s, e) => s + (e.hours || 0), 0))
const totalAmount = computed(() => entries.value.reduce((s, e) => s + (e.hours || 0) * (e.rate || 0), 0))
</script>

<template>
  <div class="space-y-6">
    <div class="grid gap-3 sm:grid-cols-[1fr_2fr_1fr_1fr_auto]">
      <input v-model="form.date" type="date" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      <input v-model="form.project" placeholder="Project" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      <input v-model.number="form.hours" type="number" min="0" step="0.25" placeholder="Hours" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      <input v-model.number="form.rate" type="number" min="0" step="1" placeholder="Rate" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      <button class="rounded-full bg-gradient-to-br from-brand to-brand-accent px-4 py-2 text-sm font-medium text-white shadow-glow" @click="add">Add</button>
    </div>

    <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
      <table class="w-full text-left text-sm text-slate-300">
        <thead class="text-slate-400">
          <tr>
            <th class="py-2">Date</th>
            <th class="py-2">Project</th>
            <th class="py-2">Hours</th>
            <th class="py-2">Rate</th>
            <th class="py-2">Amount</th>
            <th class="py-2 w-10"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in entries" :key="e.id" class="border-t border-white/5">
            <td class="py-2">{{ e.date }}</td>
            <td class="py-2">{{ e.project }}</td>
            <td class="py-2">{{ e.hours }}</td>
            <td class="py-2">{{ e.rate.toFixed(2) }}</td>
            <td class="py-2">{{ (e.hours * e.rate).toFixed(2) }}</td>
            <td class="py-2 text-right"><button class="text-xs text-red-300" @click="removeItem(e.id)">Remove</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div class="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm">
        <div class="text-slate-400">Total hours</div>
        <div class="text-2xl font-semibold text-slate-100">{{ totalHours.toFixed(2) }}</div>
      </div>
      <div class="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm">
        <div class="text-slate-400">Total amount</div>
        <div class="text-2xl font-semibold text-slate-100">{{ totalAmount.toFixed(2) }}</div>
      </div>
    </div>
  </div>
</template>


