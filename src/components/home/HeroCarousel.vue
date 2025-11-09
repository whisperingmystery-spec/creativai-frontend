<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { gsap } from 'gsap'

type Slide = {
  id: string
  title: string
  summary: string
  to: any // RouterLocation
  badge?: string
}

const props = defineProps<{
  slides: Slide[]
  intervalMs?: number
}>()

const current = ref(0)
const isHover = ref(false)
const containerRef = ref<HTMLElement | null>(null)
let timer: number | undefined

const next = () => {
  if (!props.slides?.length) return
  current.value = (current.value + 1) % props.slides.length
}
const prev = () => {
  if (!props.slides?.length) return
  current.value = (current.value - 1 + props.slides.length) % props.slides.length
}

const start = () => {
  stop()
  timer = window.setInterval(() => {
    if (!isHover.value) next()
  }, props.intervalMs ?? 4000)
}
const stop = () => {
  if (timer) {
    window.clearInterval(timer)
    timer = undefined
  }
}

// Transition animation
watch(current, (_val, _old, onCleanup) => {
  const el = containerRef.value
  if (!el) return
  const cards = el.querySelectorAll('[data-hero-card]')
  cards.forEach((c, idx) => {
    const isActive = idx === current.value
    gsap.to(c, {
      opacity: isActive ? 1 : 0,
      y: isActive ? 0 : 8,
      duration: 0.4,
      ease: 'power2.out'
    })
  })
  onCleanup(() => {})
})

// Touch swipe
let touchStartX = 0
const onTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0].clientX
}
const onTouchEnd = (e: TouchEvent) => {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) < 30) return
  if (dx < 0) next()
  else prev()
}

onMounted(() => {
  // initialize opacities
  const el = containerRef.value
  if (el) {
    const cards = el.querySelectorAll('[data-hero-card]')
    cards.forEach((c, idx) => {
      gsap.set(c, { opacity: idx === 0 ? 1 : 0, y: idx === 0 ? 0 : 8 })
    })
  }
  start()
})

onBeforeUnmount(() => stop())
</script>

<template>
  <section
    class="relative overflow-visible px-2 sm:px-0"
    ref="containerRef"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!-- Slides (transparent, full-bleed) -->
    <div class="relative min-h-[260px] sm:min-h-[320px]">
      <div
        v-for="(slide, idx) in slides"
        :key="slide.id"
        data-hero-card
        class="absolute inset-0 grid gap-6 sm:grid-cols-[1.25fr_0.75fr] md:gap-10"
        :aria-hidden="current !== idx"
      >
        <div class="flex flex-col justify-center gap-4">
          <span v-if="slide.badge" class="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
            {{ slide.badge }}
          </span>
          <h2 class="text-3xl font-semibold leading-tight text-slate-100 sm:text-4xl md:text-5xl">
            {{ slide.title }}
          </h2>
          <p class="max-w-2xl text-base text-slate-400 md:text-lg">
            {{ slide.summary }}
          </p>
          <div class="mt-2 flex flex-wrap gap-3">
            <RouterLink
              :to="slide.to"
              class="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-accent px-6 py-3 text-sm font-medium text-white shadow-glow transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              Use this tool
            </RouterLink>
          </div>
        </div>
        <!-- Minimal visual accent: gradient glows (no card) -->
        <div class="relative hidden sm:block">
          <div class="absolute -right-8 top-6 h-40 w-40 rounded-full bg-brand/20 blur-3xl md:h-56 md:w-56"></div>
          <div class="absolute right-6 top-16 h-28 w-28 rounded-2xl bg-gradient-to-br from-brand/20 to-brand-accent/20 ring-1 ring-white/10 md:h-40 md:w-40"></div>
        </div>
      </div>
    </div>

    <!-- Controls (ghost) -->
    <div class="mt-6 flex items-center justify-between">
      <div class="flex gap-2">
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-slate-200/80 hover:border-brand-accent hover:text-brand-accent"
          @click="prev"
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-slate-200/80 hover:border-brand-accent hover:text-brand-accent"
          @click="next"
          aria-label="Next"
        >
          ›
        </button>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-for="(slide, idx) in slides"
          :key="slide.id"
          type="button"
          class="h-1.5 w-4 rounded-full transition"
          :class="idx === current ? 'bg-brand-accent' : 'bg-white/20 hover:bg-white/40'"
          @click="current = idx"
          :aria-label="`Go to slide ${idx+1}`"
        />
      </div>
    </div>
  </section>
</template>


