<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ImageCompressor from '@/components/tools/ImageCompressor.vue'
import FormatConverter from '@/components/tools/FormatConverter.vue'
import LosslessOptimizer from '@/components/tools/LosslessOptimizer.vue'

const tabs = [
  { id: 'compress', label: 'Compressor', description: 'Reduce size with quality tuning and format control.' },
  { id: 'convert', label: 'Converter', description: 'Switch between PNG, JPG, WebP, or AVIF with precision.' },
  { id: 'optimize', label: 'Optimizer', description: 'Palette reduction and lossless cleanup for brand assets.' }
]

const route = useRoute()
const router = useRouter()

const isValidTab = (value) => tabs.some((tab) => tab.id === value)

const initialTab = isValidTab(route.query.tab) ? route.query.tab : 'compress'
const activeTab = ref(initialTab)

watch(
  () => route.query.tab,
  (newTab) => {
    if (isValidTab(newTab) && newTab !== activeTab.value) {
      activeTab.value = newTab
    }
  }
)

watch(activeTab, (newTab) => {
  router.replace({ query: { ...route.query, tab: newTab } })
})

const activeDescription = computed(() => tabs.find((tab) => tab.id === activeTab.value)?.description ?? '')
</script>

<template>
  <div class="space-y-12">
    <header class="space-y-4 text-center md:text-left">
      <span class="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-300">
        Optimization Suite
      </span>
      <h1 class="text-4xl font-semibold text-slate-100 md:text-5xl">Image Optimization Suite</h1>
      <p class="max-w-3xl text-base text-slate-400 md:text-lg">
        Drag in an asset once and then compress, convert, or palette-optimize without leaving the workspace. Advanced encoders run directly in your browser—no uploads, no limits.
      </p>
    </header>

    <nav class="flex flex-wrap gap-3 rounded-3xl border border-white/10 bg-white/5 p-3 text-sm">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="rounded-2xl px-4 py-2 font-medium transition"
        :class="tab.id === activeTab ? 'bg-brand text-white shadow-glow' : 'text-slate-300 hover:text-brand-accent'"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>

    <p class="text-sm text-slate-400 md:text-base">{{ activeDescription }}</p>

    <div v-if="activeTab === 'compress'">
      <ImageCompressor />
    </div>
    <div v-else-if="activeTab === 'convert'">
      <FormatConverter />
    </div>
    <div v-else>
      <LosslessOptimizer />
    </div>
  </div>
</template>
