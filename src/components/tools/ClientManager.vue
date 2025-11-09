<script setup lang="ts">
import { ref, watch } from 'vue'

type Client = { id: string; name: string; email: string; company: string }
const key = 'caia_clients_v1'
const clients = ref<Client[]>([])
const load = () => {
  try {
    clients.value = JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    clients.value = []
  }
}
const save = () => localStorage.setItem(key, JSON.stringify(clients.value))
load()
watch(clients, save, { deep: true })

const form = ref<Client>({ id: '', name: '', email: '', company: '' })
const add = () => {
  if (!form.value.name) return
  clients.value.unshift({ ...form.value, id: crypto.randomUUID() })
  form.value = { id: '', name: '', email: '', company: '' }
}
const removeItem = (id: string) => (clients.value = clients.value.filter((c) => c.id !== id))
</script>

<template>
  <div class="space-y-6">
    <div class="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
      <input v-model="form.name" placeholder="Name" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      <input v-model="form.email" type="email" placeholder="Email" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      <input v-model="form.company" placeholder="Company" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
      <button class="rounded-full bg-gradient-to-br from-brand to-brand-accent px-4 py-2 text-sm font-medium text-white shadow-glow" @click="add">Add</button>
    </div>
    <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
      <table class="w-full text-left text-sm text-slate-300">
        <thead class="text-slate-400">
          <tr>
            <th class="py-2">Name</th>
            <th class="py-2">Email</th>
            <th class="py-2">Company</th>
            <th class="py-2 w-10"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in clients" :key="c.id" class="border-t border-white/5">
            <td class="py-2">{{ c.name }}</td>
            <td class="py-2">{{ c.email }}</td>
            <td class="py-2">{{ c.company }}</td>
            <td class="py-2 text-right"><button class="text-xs text-red-300" @click="removeItem(c.id)">Remove</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


