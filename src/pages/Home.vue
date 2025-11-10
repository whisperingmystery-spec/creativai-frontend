<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import AnimatedHero from '@/components/home/AnimatedHero.vue'
import ToolsIntroBlock from '@/components/home/ToolsIntroBlock.vue'

const heroStats = [
  { label: 'Avg. savings per image', value: '72%', detail: 'without losing clarity' },
  { label: 'Tools live today', value: '4', detail: 'more rolling out monthly' },
  { label: 'Processing speed', value: '<150ms', detail: 'client-side canvas render' }
]

const featuredTools = [
  {
    title: 'Image Compressor',
    description: 'Reduce PNG, JPG, WEBP, and GIF file sizes by up to 80% without quality loss. Everything runs locally in your browser—no uploads.',
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
  }
]

const benefits = [
  {
    title: 'Client-side first',
    copy: 'Everything renders in-browser using the Canvas API so assets never leave your device.'
  },
  {
    title: 'GSAP powered UI',
    copy: 'Polished motion design keeps the experience silky at 60 FPS on desktop and mobile.'
  },
  {
    title: 'Supabase Auth ready',
    copy: 'Passwordless sign-in and dashboards ship next, keeping your account data secure.'
  },
  {
    title: 'Agency scale built-in',
    copy: 'Organize brand kits, presets, and workflows built for high-volume creative teams.'
  }
]

const workflowSteps = [
  {
    step: 'Upload',
    copy: 'Drag & drop images or select from your library. We validate formats and file size instantly.'
  },
  {
    step: 'Fine-tune',
    copy: 'Use precision sliders, presets, and overlays to land on the perfect balance of size and quality.'
  },
  {
    step: 'Launch',
    copy: 'Export optimized assets in one click or sync to your CMS, all without leaving the browser.'
  }
]

const testimonials = [
  {
    quote:
      'CreatiVAI cut our campaign asset weight by half while keeping the photography razor sharp. The polish rivals any native app we have used.',
    author: 'Priya Memon',
    role: 'Creative Director, Northbeam Studio'
  },
  {
    quote: 'The drag-and-drop experience feels like a premium Mac app. Our team ships landing pages twice as fast now.',
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
    summary: 'Shrink PNG, JPG, WEBP, and GIF files by up to 80% with zero quality loss. All processing happens locally—no uploads, no waiting.',
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
    summary: 'Project SIP growth with expense ratios, inflation, and optional lump sums—output ready to share.',
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
    summary: 'Flip text between Title Case, snake_case, camelCase, and more instantly—no manual editing.',
    to: { name: 'text-case-converter' }
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

    <section class="rounded-[32px] border border-white/10 bg-white/5 p-8 sm:p-10">
      <div class="grid gap-6 sm:grid-cols-3">
        <div
          v-for="stat in heroStats"
          :key="stat.label"
          class="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/40 p-6 text-center"
        >
          <p class="text-sm uppercase tracking-[0.3em] text-slate-400">{{ stat.label }}</p>
          <p class="mt-3 text-3xl font-semibold text-slate-100">{{ stat.value }}</p>
          <p class="mt-1 text-sm text-slate-500">{{ stat.detail }}</p>
        </div>
      </div>
    </section>

    <section class="space-y-12">
      <div class="flex flex-col gap-4 text-center">
        <h2 class="text-3xl font-semibold text-slate-100 md:text-4xl">Tools launching with CAIA</h2>
        <p class="mx-auto max-w-2xl text-base text-slate-400 md:text-lg">
          The platform focuses on premium image optimization with more AI-assisted tools on deck. Hereʼs what you can use first.
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
      <div class="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/40 to-slate-800/30 p-6 text-center text-sm text-slate-300">
        Looking for more? <RouterLink class="font-semibold text-brand-accent hover:underline" :to="{ name: 'tools' }">Explore all CAIA tools →</RouterLink>
      </div>
    </section>

    <section class="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
      <div class="space-y-6">
        <h2 class="text-3xl font-semibold text-slate-100 md:text-4xl">Workflow built for agencies</h2>
        <p class="text-base text-slate-400 md:text-lg">
          CAIA keeps complex tasks approachable. From drag-and-drop uploads to AI-assisted cleanups, the UI guides your team at every step.
        </p>
        <ul class="space-y-6">
          <li
            v-for="item in benefits"
            :key="item.title"
            class="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-6"
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
      </div>

      <div class="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h3 class="text-sm uppercase tracking-[0.28em] text-slate-400">Three-step workflow</h3>
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
      <h2 class="text-3xl font-semibold text-slate-100 md:text-4xl">People are already shipping with CAIA</h2>
        <p class="text-base text-slate-400 md:text-lg">
          Teams in SaaS, eCommerce, and creative agencies are reducing asset weight, improving page speed, and presenting flawless visuals.
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
      <h2 class="text-3xl font-semibold md:text-4xl">Ready to unlock premium creative tooling?</h2>
      <p class="mx-auto mt-4 max-w-2xl text-base text-slate-200 md:text-lg">
        Sign up to get early access to the CreatiVAI Agency dashboard. We’ll notify you the moment Supabase auth goes live and new tools launch.
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

