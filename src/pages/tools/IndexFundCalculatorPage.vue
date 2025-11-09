<template>
  <div class="space-y-12">
    <header class="space-y-4 text-center md:text-left">
      <span class="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-300">
        Finance
      </span>
      <h1 class="text-4xl font-semibold text-slate-100 md:text-5xl">Index Fund Calculator</h1>
      <p class="max-w-3xl text-base text-slate-400 md:text-lg">Project corpus for lump‑sum + SIP with expense ratio and tracking difference.</p>
    </header>
    <IndexFundCalculator />
  </div>
</template>

<script setup>
import IndexFundCalculator from '@/components/tools/IndexFundCalculator.vue'
</script>


