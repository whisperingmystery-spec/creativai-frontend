<script setup lang="ts">
import { RouterLink } from 'vue-router'

const chips = [
  { id: 'all', label: 'All' },
  { id: 'images', label: 'Images' },
  { id: 'documents', label: 'Documents' },
  { id: 'units', label: 'Measurement & Units' },
  { id: 'finance', label: 'Finance' },
  { id: 'design', label: 'Design' },
  { id: 'ai', label: 'AI Enhancements' }
]
</script>

<template>
  <section class="space-y-6 text-center">
    <h2 class="px-2 text-3xl font-semibold leading-tight text-slate-100 md:text-5xl">
      Private, secure, and free to use
    </h2>
    <p class="mx-auto max-w-3xl px-2 text-base text-slate-400 md:text-lg">
      100% secure. No data stored. Trusted by 100,000+ creators worldwide.
    </p>
    <div class="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-200">
      <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">🔧 100+ daily‑use tools</span>
      <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">📦 Everything you need in one place</span>
      <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">⚡ Fast and free to use</span>
    </div>
  </section>
</template>


