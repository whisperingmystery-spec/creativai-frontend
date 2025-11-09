<template>
  <div class="space-y-12">
    <header class="space-y-4 text-center md:text-left">
      <span class="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-300">
        Design Tools
      </span>
      <h1 class="text-4xl font-semibold text-slate-100 md:text-5xl">QR Code Generator</h1>
      <p class="max-w-3xl text-base text-slate-400 md:text-lg">
        Create QR codes for links, text, phone, email, or an image. Live preview and one‑click PNG download. All processing stays on your device.
      </p>
    </header>

    <QRCodeGenerator />
  </div>
</template>

<script setup>
import QRCodeGenerator from '@/components/tools/QRCodeGenerator.vue'
</script>
