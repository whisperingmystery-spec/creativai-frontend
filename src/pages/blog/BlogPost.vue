<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { basicMarkdownToHtml, extractMetaFromDraft } from '@/utils/markdown'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const modules = import.meta.glob('@/blog/*.md', { as: 'raw', eager: true })
const entries = Object.entries(modules).map(([path, raw]) => {
  const meta = extractMetaFromDraft(raw as string)
  return { path, raw: raw as string, ...meta }
})

const post = computed(() => entries.find((e) => e.slug === slug.value))
const html = computed(() => (post.value ? basicMarkdownToHtml(post.value.raw) : '<p>Not found.</p>'))
const jsonLd = computed(() => post.value?.jsonLd || '')

let jsonLdEl: HTMLScriptElement | null = null

const injectJsonLd = () => {
  if (!jsonLd.value) return
  if (jsonLdEl && jsonLdEl.parentNode) jsonLdEl.parentNode.removeChild(jsonLdEl)
  jsonLdEl = document.createElement('script')
  jsonLdEl.type = 'application/ld+json'
  jsonLdEl.textContent = jsonLd.value
  document.head.appendChild(jsonLdEl)
}

onMounted(() => {
  if (post.value) document.title = `${post.value.title} · CAIA Blog`
  injectJsonLd()
})

watch(jsonLd, () => injectJsonLd())

onBeforeUnmount(() => {
  if (jsonLdEl && jsonLdEl.parentNode) jsonLdEl.parentNode.removeChild(jsonLdEl)
  jsonLdEl = null
})
</script>

<template>
  <div class="flex flex-col gap-12">
    <header class="space-y-3 text-center">
      <span class="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-300">
        Blog
      </span>
      <h1 class="text-3xl font-semibold text-slate-100 md:text-4xl">{{ post?.title || 'Article' }}</h1>
      <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Last updated · {{ post?.updated || '—' }}</p>
    </header>

    <article class="prose prose-invert max-w-none prose-headings:text-slate-100 prose-p:text-slate-300 prose-a:text-brand-accent prose-strong:text-slate-100">
      <div v-html="html"></div>
    </article>

    <section class="rounded-[24px] border border-white/10 bg-white/5 p-6">
      <p class="text-sm text-slate-400">
        Helpful links:
        <a href="/tools" class="text-brand-accent">Tools Hub</a> ·
        <a href="/tools/qr-code-generator" class="text-brand-accent">QR Code Generator</a> ·
        <a href="/blog" class="text-brand-accent">All articles</a>
      </p>
    </section>
  </div>
</template>


