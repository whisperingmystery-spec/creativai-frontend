<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

// High-level categories for quick scan
const chips = [
  { id: 'all', label: 'All' },
  { id: 'images', label: 'Images' },
  { id: 'documents', label: 'Documents' },
  { id: 'units', label: 'Measurement & Units' },
  { id: 'finance', label: 'Finance' }
]

// Catalog — add more tools as we grow
const toolCatalog = [
  // Images
  {
    id: 'compressor',
    name: 'Compress Image',
    summary: 'Shrink images while preserving clarity.',
    category: 'images',
    icon: '🗜️',
    route: { name: 'image-optimization-suite', query: { tab: 'compress' } },
    badge: 'Available'
  },
  {
    id: 'converter',
    name: 'Format Converter',
    summary: 'Convert PNG ↔ JPG ↔ WebP ↔ AVIF.',
    category: 'images',
    icon: '🔁',
    route: { name: 'image-optimization-suite', query: { tab: 'convert' } },
    badge: 'Available'
  },
  {
    id: 'optimizer',
    name: 'Lossless Optimizer',
    summary: 'Palette reduction / lossless clean‑up.',
    category: 'images',
    icon: '✨',
    route: { name: 'image-optimization-suite', query: { tab: 'optimize' } },
    badge: 'Beta'
  },
  // Documents
  {
    id: 'pdf-compress',
    name: 'Compress PDF',
    summary: 'Reduce PDF size for faster sharing.',
    category: 'documents',
    icon: '📄',
    route: { name: 'tools' },
    badge: 'Coming soon'
  },
  {
    id: 'pdf-merge',
    name: 'Merge PDF',
    summary: 'Combine multiple PDFs into one.',
    category: 'documents',
    icon: '➕',
    route: { name: 'tools' },
    badge: 'Planned'
  },
  // Units (placeholders)
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    summary: 'px ↔ mm ↔ in; DPI aware conversions.',
    category: 'units',
    icon: '📏',
    route: { name: 'tools' },
    badge: 'Planned'
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    summary: 'Links, text, phone, email, or image with logo overlay.',
    category: 'images',
    icon: '🔳',
    route: { name: 'qr-code-generator' },
    badge: 'New'
  },
  // Documents utilities
  {
    id: 'text-case',
    name: 'Text Case Converter',
    summary: 'UPPERCASE, lowercase, Title, Sentence, snake_case, etc.',
    category: 'documents',
    icon: '🔤',
    route: { name: 'text-case-converter' },
    badge: 'New'
  },
  {
    id: 'word-counter',
    name: 'Word & Character Counter',
    summary: 'Words, chars, sentences, paragraphs, reading time.',
    category: 'documents',
    icon: '📝',
    route: { name: 'word-counter' },
    badge: 'New'
  },
  {
    id: 'lorem',
    name: 'Lorem Ipsum Generator',
    summary: 'Paragraphs, sentences, or words. Copy / download.',
    category: 'documents',
    icon: '📚',
    route: { name: 'lorem-ipsum' },
    badge: 'New'
  },
  // Units / utilities
  {
    id: 'password',
    name: 'Password Generator',
    summary: 'Strong, customizable passwords with copy/download.',
    category: 'units',
    icon: '🔒',
    route: { name: 'password-generator' },
    badge: 'New'
  },
  {
    id: 'percent',
    name: 'Percentage Calculator',
    summary: 'What is X% of Y, % change, and more.',
    category: 'units',
    icon: '➗',
    route: { name: 'percentage-calculator' },
    badge: 'New'
  },
  {
    id: 'age',
    name: 'Age Calculator',
    summary: 'Exact age, next birthday, totals in days/weeks/hours.',
    category: 'units',
    route: { name: 'age-calculator' },
    badge: 'New'
  },
  // Finance
  {
    id: 'emi',
    name: 'EMI Calculator',
    summary: 'Monthly EMI, total interest, amortization schedule.',
    category: 'finance',
    route: { name: 'emi-calculator' },
    badge: 'New'
  },
  {
    id: 'sip',
    name: 'SIP Calculator',
    summary: 'Corpus for monthly SIP plus optional lump‑sum.',
    category: 'finance',
    route: { name: 'sip-calculator' },
    badge: 'New'
  },
  {
    id: 'profit',
    name: 'Profit Calculator',
    summary: 'Gross/Operating/Net margins or Markup.',
    category: 'finance',
    route: { name: 'profit-calculator' },
    badge: 'New'
  },
  {
    id: 'index',
    name: 'Index Fund Calculator',
    summary: 'Projection with expense ratio and tracking difference.',
    category: 'finance',
    route: { name: 'index-fund-calculator' },
    badge: 'New'
  }
]

const activeChip = ref('all')
const query = ref('')
const filteredTools = computed(() => {
  const q = query.value.trim().toLowerCase()
  return toolCatalog.filter((t) => {
    const inCat = activeChip.value === 'all' || t.category === activeChip.value
    const match = !q || t.name.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q)
    return inCat && match
  })
})

const groupedByCategory = computed(() => {
  const order = [
    { id: 'images', label: 'Images' },
    { id: 'documents', label: 'Documents' },
    { id: 'units', label: 'Measurement & Units' }
  ]
  return order.map((c) => ({ ...c, tools: toolCatalog.filter((t) => t.category === c.id) }))
})

// Lightweight blog highlights (could be replaced with real data later)
const blogHighlights = [
  {
    title: 'Design ops playbook for AI-assisted production',
    excerpt: 'A framework for layering CAIA tools into content pipelines without disrupting approvals.',
    date: 'Dec 18, 2025'
  },
  {
    title: 'Compression strategies that keep hero imagery immaculate',
    excerpt: 'How premium funnels balance clarity with speed, plus benchmark data from recent launches.',
    date: 'Jan 12, 2026'
  },
  {
    title: 'Case study: Cutting 3.8GB of assets to 780MB',
    excerpt: 'See how a studio re-launched across seven markets with zero visual trade-offs.',
    date: 'Nov 04, 2025'
  }
]
</script>

<template>
  <div class="flex flex-col gap-12">
    <section class="space-y-8 text-center">
      <span
        class="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-300"
      >
        Product lineup
      </span>
      <h1 class="text-4xl font-semibold leading-tight text-slate-100 md:text-5xl">
        A premium suite for elevating every image
      </h1>
      <p class="mx-auto max-w-2xl text-base text-slate-400 md:text-lg">
        CAIA tools are purpose-built for design and growth teams who demand speed, reliability, and polish. Mix
        and match modules as your workflow scales.
      </p>
      <p class="mx-auto max-w-xl text-sm text-slate-500 md:text-base">
        All tools launch free in public beta. Upgrade only when you want automation, teams, and white-label options.
      </p>
      <div class="mt-4">
        <RouterLink
          :to="{ name: 'tools' }"
          class="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-accent px-6 py-3 text-sm font-medium text-white shadow-glow transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          Browse all tools
        </RouterLink>
      </div>
    </section>

    <!-- Category chips + search -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <nav class="flex flex-wrap gap-2">
        <button
          v-for="c in chips"
          :key="c.id"
          type="button"
          class="rounded-2xl px-4 py-2 text-sm font-medium transition"
          :class="activeChip === c.id
            ? 'bg-gradient-to-br from-brand to-brand-accent text-white shadow-glow'
            : 'border border-white/10 bg-white/5 text-slate-300 hover:border-brand-accent hover:text-brand-accent'"
          @click="activeChip = c.id"
        >
          {{ c.label }}
        </button>
      </nav>
      <div class="relative w-full sm:w-80">
        <input
          v-model="query"
          type="text"
          placeholder="Search tools…"
          class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
        />
      </div>
    </div>

    <!-- Visual tool cards -->
    <section class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <RouterLink
        v-for="tool in filteredTools"
        :key="tool.id"
        :to="tool.route"
        class="group relative flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/40 p-6 transition hover:border-brand-accent/40 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-brand-accent"
      >
        <div
          class="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          :class="tool.category === 'images'
            ? 'bg-gradient-to-br from-brand/10 to-brand-accent/10'
            : tool.category === 'documents'
            ? 'bg-gradient-to-br from-emerald-400/10 to-cyan-400/10'
            : 'bg-gradient-to-br from-fuchsia-400/10 to-violet-400/10'"
        ></div>
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <svg v-if="tool.id==='compressor'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-width="1.5" d="M4 7h16M7 4v16m10-3H7m10-6H7" />
              </svg>
              <svg v-else-if="tool.id==='converter'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-width="1.5" d="M4 7h9l-2-2m2 12H6l2 2M20 12h-9l2 2m-2-8h7l-2-2" />
              </svg>
              <svg v-else-if="tool.id==='optimizer'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-width="1.5" d="M12 3v4m0 10v4m-5.66-14.66l2.83 2.83m5.66 5.66 2.83 2.83M3 12h4m10 0h4m-14.66 5.66 2.83-2.83m5.66-5.66 2.83-2.83" />
              </svg>
              <svg v-else-if="tool.id==='qr-generator'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5 text-brand-accent" fill="currentColor">
                <rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><path d="M15 15h2v2h-2zM19 15h2v6h-6v-2h4z"/>
              </svg>
              <svg v-else-if="tool.id==='text-case'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-width="1.5" d="M4 17l4-10h2l4 10m-2-5H6m10 5V7h4" />
              </svg>
              <svg v-else-if="tool.id==='word-counter'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-width="1.5" d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" />
              </svg>
              <svg v-else-if="tool.id==='lorem'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-width="1.5" d="M4 6h12v14H4zM16 10h4v10h-4z" />
              </svg>
              <svg v-else-if="tool.id==='password'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-fuchsia-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="11" width="18" height="9" rx="2" stroke-width="1.5"/><path stroke-width="1.5" d="M7 11V8a5 5 0 0110 0v3" />
              </svg>
              <svg v-else-if="tool.id==='percent'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-fuchsia-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-width="1.5" d="M19 5L5 19" /><circle cx="7" cy="7" r="2" stroke-width="1.5"/><circle cx="17" cy="17" r="2" stroke-width="1.5"/>
              </svg>
              <svg v-else-if="tool.id==='age'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-fuchsia-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke-width="1.5"/><path stroke-width="1.5" d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <svg v-else-if="tool.id==='emi'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-width="1.5" d="M3 7h18M7 7v12m10-12v12M7 14h10" />
              </svg>
              <svg v-else-if="tool.id==='sip'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-width="1.5" d="M4 18V6m16 12V6M4 12h16M8 8v8m4-6v6m4-4v4" />
              </svg>
              <svg v-else-if="tool.id==='profit'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-width="1.5" d="M4 20h16M4 14l4-4 3 3 5-5 4 4" />
              </svg>
              <svg v-else-if="tool.id==='index'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-width="1.5" d="M4 20h16M6 16l3-3 3 2 5-6" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="9" stroke-width="1.5"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-100">{{ tool.name }}</h3>
          </div>
          <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">
            {{ tool.badge }}
          </span>
        </div>
        <p class="text-sm text-slate-400">{{ tool.summary }}</p>
        <div class="flex items-center gap-3 text-xs text-slate-400">
          <span class="rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-white/0 px-2 py-1">{{ tool.category }}</span>
        </div>
        <span class="inline-flex items-center gap-2 text-sm font-medium text-brand-accent transition group-hover:gap-3">
          Open tool <span aria-hidden="true">→</span>
        </span>
      </RouterLink>
    </section>

    <!-- Highlights from Blog -->
    <section class="space-y-12">
      <div class="flex flex-col gap-4 text-center">
        <h2 class="text-3xl font-semibold text-slate-100 md:text-4xl">From the blog</h2>
        <p class="mx-auto max-w-2xl text-base text-slate-400 md:text-lg">
          Latest insights and guides for getting the most from CAIA tools.
        </p>
      </div>
      <div class="grid gap-6 md:grid-cols-3">
        <article
          v-for="post in blogHighlights"
          :key="post.title"
          class="group relative flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/40 p-6 transition hover:border-brand-accent/40"
        >
          <div class="space-y-2">
            <p class="text-xs uppercase tracking-[0.3em] text-slate-500">{{ post.date }}</p>
            <h3 class="text-xl font-semibold text-slate-100">{{ post.title }}</h3>
          </div>
          <p class="flex-1 text-sm text-slate-400">{{ post.excerpt }}</p>
          <RouterLink :to="{ name: 'blog' }" class="inline-flex items-center gap-2 text-sm font-medium text-brand-accent transition group-hover:gap-3">
            Read article <span aria-hidden="true">→</span>
          </RouterLink>
        </article>
      </div>
    </section>

    <section class="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center">
      <h2 class="text-3xl font-semibold text-slate-100 md:text-4xl">Need something bespoke?</h2>
      <p class="mx-auto mt-4 max-w-2xl text-base text-slate-400 md:text-lg">
        CAIA Labs partners with agencies to deliver private instances, custom AI workflows, and enterprise support. Tell us what you need and we’ll build the roadmap together.
      </p>
      <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <a
          href="/contact"
          class="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-medium text-white shadow-glow transition hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          Talk to sales
        </a>
        <a
          href="mailto:partners@creativaiagency.com"
          class="inline-flex items-center justify-center rounded-full border border-slate-700/70 px-6 py-3 text-sm font-medium text-slate-200 transition hover:border-brand-accent hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          partners@creativaiagency.com
        </a>
      </div>
    </section>
  </div>
</template>

