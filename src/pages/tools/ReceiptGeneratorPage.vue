<script setup lang="ts">
import ReceiptGenerator from '@/components/tools/ReceiptGenerator.vue'
</script>

<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h1 class="text-3xl font-semibold text-slate-100">Receipt / Invoice Generator</h1>
      <p class="text-sm text-slate-400">Create branded receipts or invoices, add line items and taxes, then print or save as PDF.</p>
    </header>
    <ReceiptGenerator />
  </section>
</template>


