<script setup lang="ts">
import USSalesTaxCalculator from '@/components/tools/USSalesTaxCalculator.vue'
</script>

<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h1 class="text-3xl font-semibold text-slate-100">US Sales Tax Calculator</h1>
      <p class="text-sm text-slate-400">Calculate estimated sales tax and totals by state (average combined rates).</p>
    </header>
    <USSalesTaxCalculator />
  </section>
</template>


