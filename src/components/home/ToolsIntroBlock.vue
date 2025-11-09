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
      Private, secure — and free to use
    </h2>
    <p class="mx-auto max-w-3xl px-2 text-base text-slate-400 md:text-lg">
      Runs entirely in your browser, so files never leave your device. Trusted by 100,000+ creators and teams.
    </p>
  </section>
</template>


