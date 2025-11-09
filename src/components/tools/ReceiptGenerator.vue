<script setup lang="ts">
import { ref, computed } from 'vue'

type Item = { description: string; qty: number; price: number; amount: number }
const businessName = ref('')
const businessAddress = ref('')
const clientName = ref('')
const clientEmail = ref('')
const invoiceNo = ref('')
const date = ref<string>(new Date().toISOString().slice(0, 10))
const taxRate = ref<number | null>(0)
const items = ref<Item[]>([{ description: '', qty: 1, price: 0, amount: 0 }])

const subtotal = computed(() => items.value.reduce((s, it) => s + (it.qty || 0) * (it.price || 0), 0))
const tax = computed(() => +(((taxRate.value || 0) / 100) * subtotal.value).toFixed(2))
const total = computed(() => +(subtotal.value + tax.value).toFixed(2))

const addItem = () => items.value.push({ description: '', qty: 1, price: 0, amount: 0 })
const removeItem = (idx: number) => items.value.splice(idx, 1)
const printReceipt = () => window.print()
</script>

<template>
  <div class="space-y-8">
    <div class="grid gap-6 lg:grid-cols-2">
      <div class="space-y-4">
        <div class="grid gap-2">
          <label class="text-sm text-slate-300">Business name</label>
          <input v-model="businessName" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
        </div>
        <div class="grid gap-2">
          <label class="text-sm text-slate-300">Business address</label>
          <textarea v-model="businessAddress" rows="3" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"></textarea>
        </div>
        <div class="grid gap-2">
          <label class="text-sm text-slate-300">Client name</label>
          <input v-model="clientName" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
        </div>
        <div class="grid gap-2">
          <label class="text-sm text-slate-300">Client email</label>
          <input v-model="clientEmail" type="email" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
        </div>
        <div class="grid gap-2 sm:grid-cols-3">
          <div class="grid gap-2">
            <label class="text-sm text-slate-300">Invoice #</label>
            <input v-model="invoiceNo" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm text-slate-300">Date</label>
            <input v-model="date" type="date" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm text-slate-300">Tax (%)</label>
            <input v-model.number="taxRate" type="number" min="0" step="0.01" class="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100" />
          </div>
        </div>
      </div>

      <div class="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 print:border-0 print:bg-transparent">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-lg font-semibold text-slate-100">{{ businessName || 'Business Name' }}</p>
            <p class="text-xs text-slate-400 whitespace-pre-line">{{ businessAddress || 'Address' }}</p>
          </div>
          <div class="text-right text-xs text-slate-400">
            <p>Invoice # {{ invoiceNo || '0001' }}</p>
            <p>{{ date }}</p>
          </div>
        </div>
        <div class="rounded-2xl border border-white/10">
          <table class="w-full text-left text-sm text-slate-300">
            <thead class="text-slate-400">
              <tr>
                <th class="p-3">Description</th>
                <th class="p-3 w-20">Qty</th>
                <th class="p-3 w-32">Price</th>
                <th class="p-3 w-32">Amount</th>
                <th class="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, idx) in items" :key="idx" class="border-t border-white/10">
                <td class="p-3">
                  <input v-model="it.description" placeholder="Item description" class="w-full rounded-xl border border-white/10 bg-slate-900/60 px-2 py-1 text-xs text-slate-100" />
                </td>
                <td class="p-3"><input v-model.number="it.qty" type="number" min="0" class="w-full rounded-xl border border-white/10 bg-slate-900/60 px-2 py-1 text-xs text-slate-100" /></td>
                <td class="p-3"><input v-model.number="it.price" type="number" min="0" step="0.01" class="w-full rounded-xl border border-white/10 bg-slate-900/60 px-2 py-1 text-xs text-slate-100" /></td>
                <td class="p-3 text-slate-200">{{ ((it.qty || 0) * (it.price || 0)).toFixed(2) }}</td>
                <td class="p-3 text-right">
                  <button type="button" class="text-xs text-slate-400 hover:text-red-300" @click="removeItem(idx)">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-between">
          <button type="button" class="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200" @click="addItem">Add item</button>
          <div class="w-64 space-y-2 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Subtotal</span>
              <span class="text-slate-100">{{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Tax</span>
              <span class="text-slate-100">{{ tax.toFixed(2) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Total</span>
              <span class="text-lg font-semibold text-slate-100">{{ total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        <div class="text-xs text-slate-400">
          Bill to: <span class="text-slate-100">{{ clientName || 'Client Name' }}</span> · {{ clientEmail || 'client@email.com' }}
        </div>
        <div class="flex justify-end">
          <button type="button" class="rounded-full bg-gradient-to-br from-brand to-brand-accent px-5 py-2 text-sm font-medium text-white shadow-glow" @click="printReceipt">
            Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


