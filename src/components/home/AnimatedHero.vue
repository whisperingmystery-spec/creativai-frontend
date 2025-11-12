<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { gsap } from 'gsap'

const blockRef = ref<HTMLElement | null>(null)
const headlineRef = ref<HTMLElement | null>(null)
const subRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const blobA = ref<HTMLElement | null>(null)
const blobB = ref<HTMLElement | null>(null)

type Slide = {
  id: string
  title: string
  summary: string
  to: any
  badge?: string
}

const props = defineProps<{
  slides?: Slide[]
  autoplayMs?: number
}>()

const currentIndex = ref(0)
const hasSlides = computed(() => Array.isArray(props.slides) && (props.slides?.length || 0) > 0)
const currentSlide = computed<Slide | null>(() => (hasSlides.value ? props.slides![currentIndex.value] : null))

let rafId = 0
const mouse = { x: 0, y: 0 }
const onMove = (e: MouseEvent) => {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

let intervalId: number | undefined
const startAutoAdvance = () => {
  if (!hasSlides.value) return
  stopAutoAdvance()
  intervalId = window.setInterval(() => {
    if (!props.slides) return
    currentIndex.value = (currentIndex.value + 1) % props.slides.length
  }, Math.max(500, props.autoplayMs ?? 3000)) // default 3s, min guard
}

const stopAutoAdvance = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = undefined
  }
}

const animateParallax = () => {
  const w = window.innerWidth
  const h = window.innerHeight
  const cx = (mouse.x - w / 2) / w
  const cy = (mouse.y - h / 2) / h
  const xA = cx * 16
  const yA = cy * 12
  const xB = -cx * 12
  const yB = -cy * 10
  if (blobA.value) gsap.to(blobA.value, { x: xA, y: yA, rotate: xA, duration: 0.6, ease: 'power2.out' })
  if (blobB.value) gsap.to(blobB.value, { x: xB, y: yB, rotate: xB, duration: 0.6, ease: 'power2.out' })
  rafId = requestAnimationFrame(animateParallax)
}

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from(headlineRef.value, { y: 20, opacity: 0, duration: 0.6 })
    .from(subRef.value, { y: 16, opacity: 0, duration: 0.5 }, '-=0.25')
    .from(ctaRef.value?.children || [], { y: 12, opacity: 0, stagger: 0.06, duration: 0.45 }, '-=0.25')
  // blob idle pulse
  if (blobA.value) gsap.to(blobA.value, { scale: 1.06, yoyo: true, repeat: -1, duration: 3, ease: 'sine.inOut' })
  if (blobB.value) gsap.to(blobB.value, { scale: 0.96, yoyo: true, repeat: -1, duration: 4, ease: 'sine.inOut' })
  window.addEventListener('mousemove', onMove, { passive: true })
  rafId = requestAnimationFrame(animateParallax)
  startAutoAdvance()
})

watch(
  () => props.autoplayMs,
  () => {
    // restart timer if autoplay interval changes
    if (intervalId) {
      startAutoAdvance()
    }
  }
)

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMove)
  cancelAnimationFrame(rafId)
  stopAutoAdvance()
})
</script>

<template>
  <section class="relative overflow-visible flex items-center py-8 md:min-h-[39vh] lg:min-h-[42vh] xl:min-h-[45vh]">
    <!-- Background accents (no card) -->
    <div ref="blobA" class="pointer-events-none absolute -left-12 top-0 h-56 w-56 rounded-full bg-brand/15 blur-3xl sm:h-72 sm:w-72"></div>
    <div ref="blobB" class="pointer-events-none absolute right-0 top-10 h-48 w-48 rounded-full bg-brand-accent/20 blur-3xl sm:right-8 sm:h-64 sm:w-64"></div>

    <div ref="blockRef" class="relative grid gap-10 sm:grid-cols-[1.15fr_1.7fr] sm:items-center w-full">
      <!-- Copy -->
      <div class="space-y-6">
        <h1 ref="headlineRef" class="text-4xl font-semibold leading-tight text-slate-100 md:text-5xl">
          Every day-use tool, in your browser.
        </h1>
        <p ref="subRef" class="max-w-2xl text-base text-slate-400 md:text-lg">
          Compress images, generate passwords, create QR codes, and more - fast, private, and free. No uploads.
        </p>
        <div ref="ctaRef" class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <RouterLink
            :to="{ name: 'tools' }"
            class="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-accent px-6 py-3 text-sm font-medium text-white shadow-glow transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            Open Tools Hub
          </RouterLink>
          <RouterLink
            :to="{ name: 'qr-code-generator' }"
            class="inline-flex items-center justify-center rounded-full border border-slate-700/70 px-6 py-3 text-sm font-medium text-slate-200 transition hover:border-brand-accent hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            Try QR Code Generator
          </RouterLink>
        </div>
        <p class="text-sm font-medium text-slate-300">Private by design - files stay on your device.</p>
        <div class="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-200">
          <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">🔧 100+ daily-use tools</span>
          <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">⚡ Instant, in-browser processing</span>
          <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">💸 Free forever - no watermarks</span>
          <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">🖥️ Works on any device</span>
        </div>
      </div>

      <!-- Featured tools carousel -->
      <div class="relative hidden sm:flex justify-center">
        <div class="absolute inset-0 -z-10 rounded-[36px] bg-gradient-to-br from-white/5 to-white/0 ring-1 ring-white/10"></div>
        <div class="w-full max-w-xl p-6 sm:p-8">
          <div
            class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 min-h-[360px]"
            @mouseenter="stopAutoAdvance"
            @mouseleave="startAutoAdvance"
          >
            <transition name="fade" mode="out-in">
              <RouterLink
                v-if="currentSlide"
                :key="currentSlide.id"
                :to="currentSlide.to"
                class="block space-y-3"
              >
                <span
                  v-if="currentSlide.badge"
                  class="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300"
                >
                  {{ currentSlide.badge }}
                </span>
                <h3 class="text-2xl font-semibold text-slate-100">
                  {{ currentSlide.title }}
                </h3>
                <p class="text-sm text-slate-400">
                  {{ currentSlide.summary }}
                </p>
                <ul class="mt-2 grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
                  <li class="flex items-center gap-2">
                    <span class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-[10px] text-brand">✓</span>
                    No uploads — privacy‑first
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-[10px] text-brand">✓</span>
                    100% free to use
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-[10px] text-brand">✓</span>
                    Instant, in‑browser processing
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-[10px] text-brand">✓</span>
                    Works on any device
                  </li>
                </ul>
                <span class="inline-flex items-center gap-2 text-sm font-medium text-brand-accent">
                  Try {{ currentSlide.title }}
                  <span aria-hidden="true">→</span>
                </span>
              </RouterLink>
              <div v-else key="placeholder" class="h-40 rounded-xl bg-white/5"></div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>

