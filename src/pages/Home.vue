<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import AnimatedHero from '@/components/home/AnimatedHero.vue'
import ToolsIntroBlock from '@/components/home/ToolsIntroBlock.vue'

const heroStats = [
  { label: 'Average image savings', value: '72%', detail: 'typical case without losing clarity' },
  { label: 'Live tools', value: '100+', detail: 'and counting every month' },
  { label: 'Experience', value: 'Fast & free', detail: 'no uploads, no waiting' }
]

const featuredTools = [
  {
    title: 'Image Compressor',
    description: 'Reduce PNG, JPG, WEBP, and GIF file sizes by up to 80% without quality loss. Everything runs locally in your browser - no uploads.',
    badge: 'Popular',
    to: { name: 'image-optimization-suite', query: { tab: 'compress' } },
    cta: 'Try Image Compressor'
  },
  {
    title: 'QR Code Generator',
    description: 'Create branded QR codes with custom colors, center logos, and dynamic links. Download print-ready PNG or SVG files instantly.',
    badge: 'Free forever',
    to: { name: 'qr-code-generator' },
    cta: 'Try QR Code Generator'
  },
  {
    title: 'Invoice Creator',
    description: 'Build professional invoices with your branding in under two minutes. Export polished PDFs and track payment status with ease.',
    badge: 'Business favorite',
    to: { name: 'receipt-generator' },
    cta: 'Create an Invoice'
  },
  {
    title: 'Brand Identity Generator',
    description: 'Compose industry-specific palettes, typography, and messaging with live previews and downloadable brand guidelines.',
    badge: 'New',
    to: { name: 'brand-identity-generator' },
    cta: 'Design a Brand System'
  }
]

const additionalTools = [
  {
    title: 'Password Generator',
    description: 'Create cryptographically secure passwords up to 64 characters with one click. Copy or download for your records.',
    badge: 'Security essential',
    to: { name: 'password-generator' },
    cta: 'Generate a Password'
  },
  {
    title: 'Percentage Calculator',
    description: 'Solve percentage math instantly: of, increase, decrease, and tips. Ideal for finance, retail, and schoolwork.',
    badge: 'Math helper',
    to: { name: 'percentage-calculator' },
    cta: 'Calculate Percentages'
  },
  {
    title: 'Word Counter',
    description: 'Count words, characters, sentences, and reading time in real time. Perfect for content, SEO, and UX writing.',
    badge: 'Writer favorite',
    to: { name: 'word-counter' },
    cta: 'Count Words'
  }
]

const benefits = [
  {
    title: 'Client-side first',
    copy: 'Browser-rendered for privacy so assets never leave your device.'
  },
  {
    title: 'GSAP powered UI',
    copy: '60 FPS motion and polish that keeps experiences feeling premium.'
  },
  {
    title: 'Supabase Auth ready',
    copy: 'Passwordless sign-in rolling out next to make onboarding effortless.'
  },
  {
    title: 'Agency scale built-in',
    copy: 'Brand kits, presets, and team workflows ready for scale.'
  }
]

const workflowSteps = [
  {
    step: 'Upload',
    copy: 'Drag, drop, or paste. We validate format and size instantly.'
  },
  {
    step: 'Fine-tune',
    copy: 'Use precise sliders, presets, and live previews to dial in perfection.'
  },
  {
    step: 'Launch',
    copy: 'Export in one click or sync to your CMS without leaving the browser.'
  }
]

const testimonials = [
  {
    quote: 'CAIA cut our campaign asset weight by half while keeping the photography razor sharp.',
    author: 'Priya Memon',
    role: 'Creative Director, Northbeam Studio'
  },
  {
    quote: 'Feels like a premium Mac app. We ship landing pages twice as fast.',
    author: 'Dylan Carter',
    role: 'Head of Growth, Portico Labs'
  }
]

const heroRef = ref<HTMLElement | null>(null)
const statsRef = ref<HTMLElement | null>(null)

const heroSlides = [
  {
    id: 'compress',
    title: 'Image Compressor',
    summary: 'Shrink PNG, JPG, WEBP, and GIF files by up to 80% with zero quality loss. All processing happens locally - no uploads, no waiting.',
    to: { name: 'image-optimization-suite', query: { tab: 'compress' } },
    badge: 'Popular'
  },
  {
    id: 'convert',
    title: 'Format Converter',
    summary: 'Convert between JPG, PNG, WEBP, and AVIF instantly. Keep fidelity while preparing assets for any platform.',
    to: { name: 'image-optimization-suite', query: { tab: 'convert' } },
    badge: 'New'
  },
  {
    id: 'optimize',
    title: 'Lossless Optimizer',
    summary: 'Clean PNG palettes, strip metadata, and deliver pixel-perfect assets that stay lightweight.',
    to: { name: 'image-optimization-suite', query: { tab: 'optimize' } }
  },
  {
    id: 'qr',
    title: 'QR Code Generator',
    summary: 'Create branded QR codes with colors, logos, and dynamic tracking links in seconds.',
    to: { name: 'qr-code-generator' }
  },
  {
    id: 'sip',
    title: 'SIP Calculator',
    summary: 'Project SIP growth with expense ratios, inflation, and optional lump sums - output ready to share.',
    to: { name: 'sip-calculator' }
  },
  {
    id: 'emi',
    title: 'EMI Calculator',
    summary: 'Calculate EMI, total interest, and export full amortization schedules with one click.',
    to: { name: 'emi-calculator' }
  },
  {
    id: 'case',
    title: 'Text Case Converter',
    summary: 'Flip text between Title Case, snake_case, camelCase, and more instantly - no manual editing.',
    to: { name: 'text-case-converter' }
  },
  {
    id: 'brand',
    title: 'Brand Identity Generator',
    summary: 'Generate color palettes, typography, and PDF guidelines tailored to your industry in seconds.',
    to: { name: 'brand-identity-generator' },
    badge: 'New'
  }
]

onMounted(() => {
  if (heroRef.value) {
    gsap.from(heroRef.value.children, { opacity: 0, y: 14, stagger: 0.08, duration: 0.6, ease: 'power2.out' })
  }
  if (statsRef.value) {
    gsap.from(statsRef.value.children, { opacity: 0, y: 10, stagger: 0.06, delay: 0.2, duration: 0.5, ease: 'power2.out' })
  }
})
</script>

<template>
  <div class="flex flex-col gap-24">
    <AnimatedHero :slides="heroSlides" />
    <ToolsIntroBlock />

    <section class="space-y-6">
      <div class="text-center">
        <h2 class="text-3xl font-semibold text-slate-100 md:text-4xl">Built for speed.</h2>
      </div>
      <div class="rounded-[32px] border border-white/10 bg-gradient-to-br from-brand/10 to-brand-accent/10 p-8 sm:p-10">
        <div class="grid gap-6 sm:grid-cols-3">
          <div
            v-for="stat in heroStats"
            :key="stat.label"
            class="rounded-2xl border border-white/10 bg-slate-800/40 p-6 text-center transition hover:scale-[1.03] hover:border-brand-accent/40 hover:shadow-glow"
          >
            <p class="text-sm uppercase tracking-widest text-slate-400">{{ stat.label }}</p>
            <p class="mt-3 text-3xl font-semibold text-slate-100">{{ stat.value }}</p>
            <p class="mt-1 text-sm text-slate-200">{{ stat.detail }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-12">
      <div class="flex flex-col gap-4 text-center">
        <h2 class="text-3xl font-semibold text-slate-100 md:text-4xl">Most used tools</h2>
        <p class="mx-auto max-w-2xl text-base text-slate-400 md:text-lg">
          Popular, dependable, and ready in seconds. All free, fast, and secure.
        </p>
      </div>
      <div class="grid gap-6 md:grid-cols-3">
        <article
          v-for="tool in featuredTools"
          :key="tool.title"
          class="group relative flex flex-col gap-5 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/40 p-8 transition hover:border-brand-accent/40"
        >
          <div class="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-gradient-to-br from-brand/10 to-brand-accent/10"></div>
          <span
            class="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300"
          >
            {{ tool.badge }}
          </span>
          <div class="space-y-3">
            <h3 class="text-2xl font-semibold text-slate-100">{{ tool.title }}</h3>
            <p class="text-sm text-slate-400">{{ tool.description }}</p>
          </div>
          <RouterLink
            :to="tool.to"
            class="inline-flex items-center gap-2 text-sm font-medium text-brand-accent transition group-hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-full px-3 py-2 w-fit"
          >
            {{ tool.cta }}
            <span aria-hidden="true">→</span>
          </RouterLink>
        </article>
      </div>
      <div class="grid gap-6 md:grid-cols-3">
        <article
          v-for="tool in additionalTools"
          :key="tool.title"
          class="group relative flex flex-col gap-5 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/40 p-8 transition hover:border-brand-accent/40"
        >
          <div class="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-gradient-to-br from-brand/10 to-brand-accent/10"></div>
          <span class="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">
            {{ tool.badge }}
          </span>
          <div class="space-y-3">
            <h3 class="text-2xl font-semibold text-slate-100">{{ tool.title }}</h3>
            <p class="text-sm text-slate-400">{{ tool.description }}</p>
          </div>
          <RouterLink
            :to="tool.to"
            class="inline-flex items-center gap-2 text-sm font-medium text-brand-accent transition group-hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-full px-3 py-2 w-fit"
          >
            {{ tool.cta }}
            <span aria-hidden="true">→</span>
          </RouterLink>
        </article>
      </div>
      <div class="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/40 to-slate-800/30 p-6 text-center text-sm text-slate-300">
        Looking for more? <RouterLink class="font-semibold text-brand-accent hover:underline" :to="{ name: 'tools' }">Explore all CAIA tools →</RouterLink>
      </div>
    </section>

    <section class="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
      <div class="space-y-6">
        <h2 class="text-3xl font-semibold text-slate-100 md:text-4xl">Automations and AI workflows that move KPIs.</h2>
        <p class="text-base text-slate-400 md:text-lg">
          We design chatbot integrations, AI content systems, voice agents, and end-to-end automations tailored to your stack.
        </p>
        <ul class="space-y-6">
          <li
            v-for="item in benefits"
            :key="item.title"
            class="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 transition transform duration-200 hover:scale-[1.02] hover:shadow-glow hover:border-brand-accent/40 hover:bg-slate-800/60"
          >
            <span class="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
              ✓
            </span>
            <div>
              <h3 class="text-lg font-semibold text-slate-100">{{ item.title }}</h3>
              <p class="mt-2 text-sm text-slate-400">{{ item.copy }}</p>
            </div>
          </li>
        </ul>
        <RouterLink
          :to="{ name: 'contact' }"
          class="inline-flex w-fit items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-accent px-6 py-3 text-sm font-medium text-white shadow-glow transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          Get a free blueprint (we'll send a 1-page plan)
        </RouterLink>
      </div>

      <div class="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h3 class="text-sm uppercase tracking-[0.28em] text-slate-400">Three steps. Ship faster.</h3>
        <ol class="mt-6 space-y-6">
          <li
            v-for="(step, index) in workflowSteps"
            :key="step.step"
            class="flex gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-6"
          >
            <span class="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
              {{ index + 1 }}
            </span>
            <div>
              <h4 class="text-base font-semibold text-slate-100">{{ step.step }}</h4>
              <p class="mt-2 text-sm text-slate-400">{{ step.copy }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="grid gap-8 rounded-[32px] border border-white/10 bg-white/5 p-8 sm:p-12 lg:grid-cols-2">
      <div class="space-y-6">
        <h2 class="text-3xl font-semibold text-slate-100 md:text-4xl">Teams that rely on CAIA</h2>
        <p class="text-base text-slate-400 md:text-lg">
          From SaaS to eCommerce, creative teams trust CAIA to lighten assets, accelerate production, and maintain polish.
        </p>
      </div>
      <div class="space-y-6">
        <figure
          v-for="testimonial in testimonials"
          :key="testimonial.author"
          class="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/40 p-6"
        >
          <blockquote class="text-sm text-slate-300">“{{ testimonial.quote }}”</blockquote>
          <figcaption class="mt-4 text-xs uppercase tracking-[0.3em] text-slate-500">
            {{ testimonial.author }} · {{ testimonial.role }}
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="rounded-[32px] border border-white/10 bg-gradient-to-br from-brand/15 to-brand-accent/10 p-10 text-center text-slate-100">
      <h2 class="text-3xl font-semibold md:text-4xl">Ready for premium creative tooling?</h2>
      <p class="mx-auto mt-4 max-w-2xl text-base text-slate-200 md:text-lg">
        Sign up for early access to the CAIA dashboard. We will notify you when Supabase Auth goes live and new tools drop.
      </p>
      <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <a
          href="/auth/sign-up"
          class="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          Join the waitlist
        </a>
        <a
          href="/tools"
          class="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          Browse all tools
        </a>
      </div>
    </section>
  </div>
</template>

