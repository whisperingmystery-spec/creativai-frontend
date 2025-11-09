<template>
  <div class="space-y-12">
    <header class="space-y-4 text-center md:text-left">
      <span class="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-300">
        Tool
      </span>
      <h1 class="text-4xl font-semibold text-slate-100 md:text-5xl">Lossless Optimizer</h1>
      <p class="max-w-2xl text-base text-slate-400 md:text-lg">
        Preserve pixel-perfect quality while trimming file size. Ideal for icons, logos, and UI elements.
      </p>
    </header>
    <LosslessOptimizer />
  </div>
</template>

<script setup>
import LosslessOptimizer from '@/components/tools/LosslessOptimizer.vue'
</script>
