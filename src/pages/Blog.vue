<script setup>
import { extractMetaFromDraft } from '@/utils/markdown'

// Import raw markdown drafts from src/blog
const modules = import.meta.glob('@/blog/*.md', { as: 'raw', eager: true })
const posts = Object.entries(modules).map(([path, raw]) => {
  const meta = extractMetaFromDraft(raw)
  return {
    ...meta,
    href: `/blog/${meta.slug}`
  }
})
// Sort by updated desc if available
posts.sort((a, b) => (b.updated || '').localeCompare(a.updated || ''))
</script>

<template>
  <div class="flex flex-col gap-16">
    <section class="space-y-6 text-center">
      <span class="inline-flex items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-brand/20 to-brand-accent/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-300">
        Insights
      </span>
      <h1 class="text-4xl font-semibold text-slate-100 md:text-5xl">CAIA Blog</h1>
      <p class="mx-auto max-w-2xl text-base text-slate-400 md:text-lg">
        Strategy, performance, and creativity tips for teams scaling design production with AI tooling.
      </p>
    </section>

    <section class="space-y-8">
      <h2 class="text-lg font-semibold uppercase tracking-[0.3em] text-slate-500">Latest highlights</h2>
      <div class="grid gap-6 md:grid-cols-3">
        <article
          v-for="post in posts"
          :key="post.slug"
          class="group relative flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/40 p-6 transition hover:border-brand-accent/40"
        >
          <div class="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-gradient-to-br from-brand/10 to-brand-accent/10"></div>
          <div class="space-y-2">
            <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Updated · {{ post.updated || '—' }}</p>
            <h3 class="text-xl font-semibold text-slate-100">{{ post.title }}</h3>
          </div>
          <p class="flex-1 text-sm text-slate-400">{{ post.excerpt }}</p>
          <a
            :href="post.href"
            class="inline-flex items-center gap-2 text-sm font-medium text-brand-accent transition hover:gap-3"
          >
            Read article
            <span aria-hidden="true">→</span>
          </a>
        </article>
      </div>
    </section>

    <section class="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center text-slate-400">
      <h2 class="mt-0 text-3xl font-semibold text-slate-100 md:text-4xl">Explore more</h2>
      <p class="mx-auto mt-4 max-w-2xl text-sm md:text-base">
        Looking for practical how‑tos? Try our <a href="/tools" class="text-brand-accent">Tools Hub</a> or generate a <a href="/tools/qr-code-generator" class="text-brand-accent">free QR code</a> to power your next campaign.
      </p>
    </section>
  </div>
</template>

