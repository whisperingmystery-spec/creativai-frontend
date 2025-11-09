<script setup lang="ts">
import ExpenseTracker from '@/components/tools/ExpenseTracker.vue'
</script>

<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h1 class="text-3xl font-semibold text-slate-100">Expense Tracker</h1>
      <p class="text-sm text-slate-400">Log expenses with categories and dates. Data is stored locally in your browser.</p>
    </header>
    <ExpenseTracker />
  </section>
</template>


