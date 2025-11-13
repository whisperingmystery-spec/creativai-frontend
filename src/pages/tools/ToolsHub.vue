<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const chips = [
  { id: 'all', label: 'All' },
  { id: 'images', label: 'Images' },
  { id: 'documents', label: 'Documents' },
  { id: 'units', label: 'Measurement & Units' },
  { id: 'design', label: 'Design' },
  { id: 'ai', label: 'AI Enhancements' },
  { id: 'brand', label: 'Brand Systems' },
  { id: 'utilities', label: 'Utilities' },
  { id: 'finance', label: 'Finance' },
  { id: 'business', label: 'Business' },
  { id: 'ecommerce', label: 'E-commerce' }
]

const tools = [
  {
    id: 'brand-identity-generator',
    name: 'Brand Identity Generator',
    summary: 'Build color palettes, typography, and guidelines tailored to your industry.',
    tags: ['ecommerce', 'business', 'brand'],
    badge: 'New',
    route: { name: 'brand-identity-generator' }
  },
  {
    id: 'import-cost-pricing',
    name: 'Import Cost & Retail Pricing',
    summary: 'Landed cost breakdowns, markup presets, and profit projections for imported goods.',
    tags: ['ecommerce', 'business'],
    badge: 'New',
    route: { name: 'import-cost-pricing' }
  },
  {
    id: 'compressor',
    name: 'Compress Image',
    summary: 'Reduce file size while preserving clarity.',
    tags: ['images'],
    badge: 'Available',
    route: { name: 'image-optimization-suite', query: { tab: 'compress' } }
  },
  {
    id: 'converter',
    name: 'Format Converter',
    summary: 'Convert between PNG, JPG, WebP, and AVIF.',
    tags: ['images'],
    badge: 'Available',
    route: { name: 'image-optimization-suite', query: { tab: 'convert' } }
  },
  {
    id: 'optimizer',
    name: 'Lossless Optimizer',
    summary: 'Palette reduction and WebP lossless for assets.',
    tags: ['images'],
    badge: 'Beta',
    route: { name: 'image-optimization-suite', query: { tab: 'optimize' } }
  },
  {
    id: 'qr',
    name: 'QR Code Generator',
    summary: 'Generate QR for links, text, phone, email, or image with logo overlay.',
    tags: ['design'],
    badge: 'New',
    route: { name: 'qr-code-generator' }
  },
  {
    id: 'password',
    name: 'Password Generator',
    summary: 'Strong, customizable passwords with copy and download.',
    tags: ['utilities'],
    badge: 'New',
    route: { name: 'password-generator' }
  },
  {
    id: 'text-case',
    name: 'Text Case Converter',
    summary: 'UPPERCASE, lowercase, Title, Sentence, snake_case, and more.',
    tags: ['documents'],
    badge: 'New',
    route: { name: 'text-case-converter' }
  },
  {
    id: 'word-counter',
    name: 'Word & Character Counter',
    summary: 'Real-time counts for words, characters, sentences, paragraphs.',
    tags: ['documents'],
    badge: 'New',
    route: { name: 'word-counter' }
  },
  {
    id: 'lorem',
    name: 'Lorem Ipsum Generator',
    summary: 'Generate paragraphs, sentences, or words. Copy or download.',
    tags: ['documents'],
    badge: 'New',
    route: { name: 'lorem-ipsum' }
  },
  {
    id: 'percent',
    name: 'Percentage Calculator',
    summary: 'What is X% of Y, % change, and more.',
    tags: ['units'],
    badge: 'New',
    route: { name: 'percentage-calculator' }
  },
  {
    id: 'age',
    name: 'Age Calculator',
    summary: 'Exact age, next birthday, and totals in days/weeks/hours.',
    tags: ['units'],
    badge: 'New',
    route: { name: 'age-calculator' }
  },
  {
    id: 'emi',
    name: 'EMI Calculator',
    summary: 'Monthly EMI, total interest, and amortization schedule.',
    tags: ['finance'],
    badge: 'New',
    route: { name: 'emi-calculator' }
  },
  {
    id: 'sip',
    name: 'SIP Calculator',
    summary: 'Future value for monthly SIP plus optional lump-sum.',
    tags: ['finance'],
    badge: 'New',
    route: { name: 'sip-calculator' }
  },
  {
    id: 'profit',
    name: 'Profit Calculator',
    summary: 'Gross/Operating/Net margins or Markup.',
    tags: ['finance'],
    badge: 'New',
    route: { name: 'profit-calculator' }
  },
  {
    id: 'index',
    name: 'Index Fund Calculator',
    summary: 'Corpus projection with expense ratio and tracking difference.',
    tags: ['finance'],
    badge: 'New',
    route: { name: 'index-fund-calculator' }
  },
  // Business category (coming soon)
  {
    id: 'receipt-generator',
    name: 'Receipt / Invoice Generator',
    summary: 'Create downloadable invoices and receipts with taxes.',
    tags: ['business'],
    badge: 'New',
    route: { name: 'receipt-generator' }
  },
  {
    id: 'estimate-quote',
    name: 'Estimate / Quote',
    summary: 'Build professional estimates and quotes — print or export.',
    tags: ['business'],
    badge: 'New',
    route: { name: 'estimate-quote' }
  },
  {
    id: 'expense-tracker',
    name: 'Expense Tracker',
    summary: 'Track categories and amounts; monthly totals.',
    tags: ['business'],
    badge: 'New',
    route: { name: 'expense-tracker' }
  },
  {
    id: 'timesheet-hours',
    name: 'Timesheet / Hours',
    summary: 'Log hours and rates per project with totals.',
    tags: ['business'],
    badge: 'New',
    route: { name: 'timesheet-hours' }
  },
  {
    id: 'business-dashboard',
    name: 'Business Dashboard',
    summary: 'Revenue, expenses and profit overview (from local data).',
    tags: ['business'],
    badge: 'New',
    route: { name: 'business-dashboard' }
  },
  {
    id: 'client-manager',
    name: 'Client Manager',
    summary: 'Store client contacts, projects and documents in one place.',
    tags: ['business'],
    badge: 'New',
    route: { name: 'client-manager' }
  },
  {
    id: 'gst-calculator',
    name: 'GST Calculator',
    summary: 'Accurate GST addition/removal and quick breakdown.',
    tags: ['business'],
    badge: 'New',
    route: { name: 'gst-calculator' }
  },
  {
    id: 'pl-statement',
    name: 'P&L Statement',
    summary: 'Generate profit & loss statements for any period.',
    tags: ['business'],
    badge: 'New',
    route: { name: 'pl-statement' }
  },
  {
    id: 'us-sales-tax',
    name: 'US Sales Tax Calculator',
    summary: 'Estimate sales tax and totals by state (avg combined rates).',
    tags: ['business'],
    badge: 'New',
    route: { name: 'us-sales-tax' }
  }
]

const route = useRoute()
const activeChip = ref((route.query.cat as string) || 'all')
const query = ref('')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return tools.filter((t) => {
    const inCategory = activeChip.value === 'all' || t.tags.includes(activeChip.value)
    const match = !q || t.name.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q)
    return inCategory && match
  })
})

watch(
  () => route.query.cat,
  (val) => {
    if (typeof val === 'string') {
      activeChip.value = val
    } else if (!val) {
      activeChip.value = 'all'
    }
  }
)
</script>

<template>
  <div class="space-y-10">
    <header class="space-y-4 text-center md:text-left">
      <span class="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-300">
        Tools Hub
      </span>
      <h1 class="text-4xl font-semibold text-slate-100 md:text-5xl">All Tools</h1>
      <p class="max-w-3xl text-base text-slate-400 md:text-lg">
        Browse Images, Documents, Measurement & Units, Finance, Business, and more. Everything runs 100% in your browser.
      </p>
    </header>

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

    <section class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <RouterLink
        v-for="tool in filtered"
        :key="tool.id"
        :to="tool.route"
        class="group relative flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/40 p-6 transition hover:border-brand-accent/40 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-brand-accent"
      >
        <div
          class="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          :class="tool.tags.includes('images')
            ? 'bg-gradient-to-br from-brand/10 to-brand-accent/10'
            : tool.tags.includes('documents')
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
              <svg v-else-if="tool.id==='qr'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5 text-brand-accent" fill="currentColor">
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
        <span class="inline-flex items-center gap-2 text-sm font-medium text-brand-accent transition group-hover:gap-3">
          Open tool <span aria-hidden="true">→</span>
        </span>
      </RouterLink>
    </section>
  </div>
</template>
