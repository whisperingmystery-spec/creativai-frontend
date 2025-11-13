<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useBrandIdentityStore } from '@/stores/brandIdentity'
import {
  colorPalettes,
  typographyScales,
  formatSwatch,
  summarizeTypography,
  buildGuidelineSummary
} from '@/utils/tools/brandIdentity'
import type { GeneratedBrandIdentity } from '@/utils/tools/brandIdentity'

const store = useBrandIdentityStore()
const {
  currentInput,
  activeIdentity,
  activePalette,
  activeTypography,
  history,
  favorites,
  availableIndustries,
  isGenerating
} = storeToRefs(store)

const keywordDraft = ref(currentInput.value.keywords.join(', '))
const showPaletteGrid = ref(true)
const showGuidelines = ref(true)
const previewHeroBackground = computed(() =>
  activePalette.value.swatches.find((swatch) => swatch.role === 'background')?.hex || '#FFFFFF'
)
const previewPrimaryColor = computed(() => activePalette.value.swatches.find((swatch) => swatch.role === 'primary')?.hex || '#000000')
const previewAccentColor = computed(() => activePalette.value.swatches.find((swatch) => swatch.role === 'accent')?.hex || '#FF5555')

const toneOptions: Array<{ label: string; value: (typeof currentInput.value.tone) }> = [
  { label: 'Modern', value: 'modern' },
  { label: 'Playful', value: 'playful' },
  { label: 'Premium', value: 'premium' },
  { label: 'Minimal', value: 'minimal' },
  { label: 'Friendly', value: 'friendly' }
]

const keywordExamples: Record<string, string[]> = {
  modern: ['innovation', 'growth', 'clean design'],
  playful: ['delight', 'memorable', 'bold'],
  premium: ['bespoke', 'luxury', 'heritage'],
  minimal: ['understated', 'clarity', 'precision'],
  friendly: ['human', 'supportive', 'accessibility']
}

const keywordPlaceholder = computed(() => keywordExamples[currentInput.value.tone]?.join(', ') || 'values, mission, promise')

const paletteCards = computed(() => colorPalettes)
const typographyCards = computed(() => typographyScales)

watch(
  () => currentInput.value.keywords,
  (next) => {
    keywordDraft.value = next.join(', ')
  }
)

const syncKeywords = () => {
  const parsed = keywordDraft.value
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean)
  store.setKeywords(parsed)
}

const handleToneChange = (value: typeof currentInput.value.tone) => {
  store.setTone(value)
  if (!keywordDraft.value.trim().length) {
    keywordDraft.value = keywordPlaceholder.value
    syncKeywords()
  }
}

const handlePreview = () => {
  const identity = store.generatePreview()
  store.saveHistory(identity)
}

const handleSaveFavorite = () => {
  store.saveFavorite(activeIdentity.value)
}

const handleApplyIdentity = (summary: string, source: 'history' | 'favorite') => {
  const list = source === 'history' ? history.value : favorites.value
  const entry = list.find((item) => item.summary === summary)
  if (entry) {
    store.applyIdentity(entry)
  }
}

const handleRemoveFavorite = (summary: string) => {
  store.removeFavorite(summary)
}

const resetKeywordsToExamples = () => {
  keywordDraft.value = keywordPlaceholder.value
  syncKeywords()
}

const previewCTAColor = computed(() => previewAccentColor.value)
const previewContrastColor = computed(() => (previewHeroBackground.value.startsWith('#0') ? '#F5F7FA' : '#0B1120'))

const previewCards = computed(() => [
  {
    title: 'Tone & headline',
    description: activeIdentity.value.messaging[0]?.body || 'Define your core message.'
  },
  {
    title: 'Palette summary',
    description: activePalette.value.swatches
      .filter((swatch) => ['primary', 'secondary', 'accent'].includes(swatch.role))
      .map(formatSwatch)
      .join(' · ')
  },
  {
    title: 'Typography stack',
    description: summarizeTypography(activeTypography.value)
  }
])

const guidelineSummary = computed(() => buildGuidelineSummary(activeIdentity.value))

const exportingGuidelines = ref(false)
const guidelineStatus = ref<string | null>(null)
const guidelineError = ref<string | null>(null)

const sanitizePdfText = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')

const buildGuidelineLines = (identity: GeneratedBrandIdentity): string[] => {
  const lines: string[] = []
  lines.push(`${identity.brandName} — Brand Identity Guidelines`)
  lines.push(`Industry: ${identity.industry}`)
  lines.push(`Tone: ${identity.tone}`)
  lines.push(`Keywords: ${identity.keywords.join(', ') || 'Define brand values'}`)
  lines.push('')
  lines.push('Color Palette')
  identity.palette.swatches.forEach((swatch) => {
    lines.push(`• ${swatch.name} (${swatch.role}) — ${swatch.hex.toUpperCase()}`)
  })
  lines.push('')
  lines.push('Typography Stack')
  lines.push(`Heading: ${identity.typography.heading}`)
  lines.push(`Subheading: ${identity.typography.subheading}`)
  lines.push(`Body: ${identity.typography.body}`)
  if (identity.typography.supporting) {
    lines.push(`Supporting: ${identity.typography.supporting}`)
  }
  lines.push('')
  lines.push('Messaging Guidelines')
  identity.messaging.forEach((item) => lines.push(`${item.title}: ${item.body}`))
  lines.push('')
  lines.push('Usage Rules')
  identity.usage.forEach((item) => lines.push(`${item.title}: ${item.body}`))
  lines.push('')
  lines.push('Summary')
  lines.push(guidelineSummary.value)
  return lines
}

const buildGuidelinePdf = (identity: GeneratedBrandIdentity): Blob => {
  const lines = buildGuidelineLines(identity)
  const textOps: string[] = []
  lines.forEach((line, index) => {
    const sanitized = sanitizePdfText(line)
    if (index === 0) {
      textOps.push(`(${sanitized}) Tj`)
    } else {
      textOps.push(`T* (${sanitized}) Tj`)
    }
  })
  if (!textOps.length) {
    textOps.push('(No Data) Tj')
  }
  const contentStream = ['BT', '/F1 11 Tf', '16 TL', '1 0 0 1 64 720 Tm', ...textOps, 'ET'].join('\n')
  const encoder = new TextEncoder()
  const contentBytes = encoder.encode(contentStream)

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${contentBytes.length} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n'
  ]

  const header = '%PDF-1.3\n'
  let body = ''
  const offsets: number[] = []
  let offset = header.length
  objects.forEach((obj) => {
    offsets.push(offset)
    body += obj
    offset += obj.length
  })

  let xref = 'xref\n'
  xref += `0 ${objects.length + 1}\n`
  xref += '0000000000 65535 f \n'
  offsets.forEach((off) => {
    xref += `${off.toString().padStart(10, '0')} 00000 n \n`
  })

  const startXref = header.length + body.length
  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF`
  const pdfString = header + body + xref + trailer
  return new Blob([pdfString], { type: 'application/pdf' })
}

const downloadGuidelines = () => {
  guidelineStatus.value = null
  guidelineError.value = null
  exportingGuidelines.value = true
  try {
    const blob = buildGuidelinePdf(activeIdentity.value)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${activeIdentity.value.brandName.replace(/\s+/g, '-').toLowerCase()}-brand-guidelines.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    guidelineStatus.value = 'Brand guidelines downloaded.'
  } catch (error) {
    guidelineError.value = error instanceof Error ? error.message : 'Failed to export guidelines.'
  } finally {
    exportingGuidelines.value = false
  }
}

onMounted(() => {
  store.generatePreview()
})
</script>

<template>
  <div class="space-y-12">
    <!-- Header -->
    <section class="space-y-4 text-center md:text-left">
      <span class="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-300">
        Brand Systems
      </span>
      <h1 class="text-4xl font-semibold text-slate-100 md:text-5xl">Brand Identity Generator</h1>
      <p class="max-w-3xl text-base text-slate-400 md:text-lg">
        Explore industry-specific palettes, typography, and voice guidance with a live preview and downloadable brand guidelines.
      </p>
    </section>

    <section class="grid gap-8 lg:grid-cols-[420px,1fr]">
      <!-- Controls -->
      <aside class="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20">
        <header class="space-y-2">
          <h2 class="text-xl font-semibold text-slate-100">Brand inputs</h2>
          <p class="text-sm text-slate-400">Adjust brand attributes to instantly refresh colors, typography, and tone.</p>
        </header>

        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-xs uppercase tracking-[0.3em] text-slate-400">Brand name</label>
            <input
              :value="currentInput.brandName"
              type="text"
              class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="Your brand"
              @input="store.setBrandName(($event.target as HTMLInputElement).value)"
            />
          </div>

          <div class="space-y-2">
            <label class="text-xs uppercase tracking-[0.3em] text-slate-400">Industry</label>
            <select
              :value="currentInput.industry"
              class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              @change="store.setIndustry(($event.target as HTMLSelectElement).value as typeof currentInput.industry)"
            >
              <option v-for="industry in availableIndustries" :key="industry" :value="industry">{{ industry.replace('-', ' ') }}</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-xs uppercase tracking-[0.3em] text-slate-400">Tone</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="option in toneOptions"
                :key="option.value"
                type="button"
                class="rounded-2xl px-3 py-2 text-sm font-medium transition"
                :class="currentInput.tone === option.value
                  ? 'bg-gradient-to-br from-brand to-brand-accent text-white shadow-glow'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:border-brand-accent hover:text-brand-accent'"
                @click="handleToneChange(option.value)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
              Keywords & values
              <button type="button" class="text-[10px] font-semibold text-brand-accent" @click="resetKeywordsToExamples">Use examples</button>
            </label>
            <textarea
              v-model="keywordDraft"
              rows="3"
              class="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              :placeholder="keywordPlaceholder"
              @blur="syncKeywords"
              @keydown.enter.prevent="syncKeywords"
            ></textarea>
            <p class="text-[11px] text-slate-500">Separate keywords with commas to define your messaging themes.</p>
          </div>
        </div>

        <div class="space-y-4">
          <header class="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
            <span>Color palette</span>
            <button type="button" class="text-[10px] text-brand-accent" @click="showPaletteGrid = !showPaletteGrid">
              {{ showPaletteGrid ? 'Hide' : 'Show' }} palettes
            </button>
          </header>
          <transition name="fade">
            <div v-if="showPaletteGrid" class="grid gap-3">
              <button
                v-for="palette in paletteCards"
                :key="palette.id"
                type="button"
                class="flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition"
                :class="currentInput.paletteId === palette.id
                  ? 'border-brand/60 bg-brand/10 text-slate-100 shadow-glow'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-brand-accent hover:text-brand-accent'"
                @click="store.setPalette(palette.id)"
              >
                <div>
                  <p class="font-semibold">{{ palette.title }}</p>
                  <p class="text-xs text-slate-400">{{ palette.description }}</p>
                </div>
                <div class="flex items-center gap-1">
                  <span
                    v-for="swatch in palette.swatches.filter((swatch) => ['primary', 'secondary', 'accent'].includes(swatch.role))"
                    :key="`${palette.id}-${swatch.hex}`"
                    class="h-6 w-6 rounded-full border border-white/10"
                    :style="{ backgroundColor: swatch.hex }"
                    :title="formatSwatch(swatch)"
                  ></span>
                </div>
              </button>
            </div>
          </transition>
        </div>

        <div class="space-y-4">
          <header class="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
            <span>Typography</span>
          </header>
          <div class="space-y-2">
            <button
              v-for="scale in typographyCards"
              :key="scale.id"
              type="button"
              class="w-full rounded-2xl border px-4 py-3 text-left text-sm transition"
              :class="currentInput.typographyId === scale.id
                ? 'border-brand/60 bg-brand/10 text-slate-100 shadow-glow'
                : 'border-white/10 bg-white/5 text-slate-300 hover:border-brand-accent hover:text-brand-accent'"
              @click="store.setTypography(scale.id)"
            >
              <p class="font-semibold text-slate-100">{{ scale.title }}</p>
              <p class="text-xs text-slate-400">{{ scale.description }}</p>
              <p class="mt-1 text-[11px] text-slate-500">{{ summarizeTypography(scale) }}</p>
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-2 border-t border-white/10 pt-4 sm:flex-row">
          <button
            type="button"
            class="flex-1 rounded-2xl bg-gradient-to-br from-brand to-brand-accent px-4 py-3 text-sm font-semibold text-white shadow-glow transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isGenerating"
            @click="handlePreview"
          >
            {{ isGenerating ? 'Generating…' : 'Refresh identity' }}
          </button>
          <button
            type="button"
            class="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-brand-accent hover:text-brand-accent"
            @click="handleSaveFavorite"
          >
            Save to favorites
          </button>
        </div>
      </aside>

      <!-- Preview & Guidelines -->
      <section class="space-y-8">
        <div class="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20">
          <header class="space-y-2">
            <h2 class="text-xl font-semibold text-slate-100">Live brand preview</h2>
            <p class="text-sm text-slate-400">See your brand identity applied in hero sections, UI components, and messaging.</p>
          </header>

          <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr),320px]">
            <div class="space-y-6">
              <div
                class="relative overflow-hidden rounded-3xl border border-white/10 p-8 text-left shadow-inner"
                :style="{ background: previewHeroBackground }"
              >
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="text-xs uppercase tracking-[0.4em]" :style="{ color: previewContrastColor }">Brand preview</p>
                    <h3 class="mt-2 text-3xl font-semibold" :style="{ color: previewContrastColor }">
                      {{ activeIdentity.brandName }}
                    </h3>
                  </div>
                  <div class="flex items-center gap-2">
                    <span
                      v-for="swatch in activePalette.swatches"
                      :key="swatch.hex"
                      class="h-6 w-6 rounded-full border border-white/10"
                      :style="{ backgroundColor: swatch.hex }"
                      :title="formatSwatch(swatch)"
                    ></span>
                  </div>
                </div>
                <p class="mt-4 max-w-xl text-sm" :style="{ color: previewContrastColor, opacity: 0.85 }">
                  {{ previewCards[0]?.description }}
                </p>
                <div class="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    class="rounded-full px-5 py-2 text-sm font-semibold shadow-lg shadow-black/20 transition hover:-translate-y-0.5"
                    :style="{ backgroundColor: previewCTAColor, color: previewContrastColor.startsWith('#0') ? '#050A18' : '#050A18' }"
                  >
                    Start with {{ activeIdentity.brandName }}
                  </button>
                  <button
                    type="button"
                    class="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-slate-100 transition hover:border-brand-accent hover:text-brand-accent"
                  >
                    Explore features
                  </button>
                </div>
              </div>

              <div class="grid gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-5 lg:grid-cols-2">
                <div>
                  <h4 class="text-sm font-semibold text-slate-200">Palette distribution</h4>
                  <p class="text-xs text-slate-400">Primary, secondary, and accent usage guidelines.</p>
                  <div class="mt-3 space-y-2">
                    <div
                      v-for="swatch in activePalette.swatches.filter((swatch) => ['primary', 'secondary', 'accent'].includes(swatch.role))"
                      :key="`dist-${swatch.hex}`"
                      class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200"
                    >
                      <div class="flex items-center gap-2">
                        <span class="h-6 w-6 rounded-full border border-white/10" :style="{ backgroundColor: swatch.hex }"></span>
                        <span>{{ swatch.name }}</span>
                      </div>
                      <span class="text-slate-400">{{ swatch.role }}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 class="text-sm font-semibold text-slate-200">Type hierarchy</h4>
                  <p class="text-xs text-slate-400">Use these pairings across headings, UI elements, and long-form content.</p>
                  <div class="mt-3 space-y-2 text-xs text-slate-200">
                    <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <p class="text-[11px] uppercase tracking-[0.3em] text-slate-400">Headings</p>
                      <p>{{ activeTypography.heading }}</p>
                    </div>
                    <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <p class="text-[11px] uppercase tracking-[0.3em] text-slate-400">Subheadings</p>
                      <p>{{ activeTypography.subheading }}</p>
                    </div>
                    <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <p class="text-[11px] uppercase tracking-[0.3em] text-slate-400">Body</p>
                      <p>{{ activeTypography.body }}</p>
                    </div>
                    <div v-if="activeTypography.supporting" class="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <p class="text-[11px] uppercase tracking-[0.3em] text-slate-400">Supporting</p>
                      <p>{{ activeTypography.supporting }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside class="space-y-4 rounded-3xl border border-white/10 bg-slate-900/60 p-5">
              <header class="space-y-1">
                <h3 class="text-sm font-semibold text-slate-200">Brand cards</h3>
                <p class="text-xs text-slate-400">Quick summary of your brand choices.</p>
              </header>
              <div class="space-y-3">
                <article
                  v-for="card in previewCards"
                  :key="card.title"
                  class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left"
                >
                  <h4 class="text-sm font-semibold text-slate-200">{{ card.title }}</h4>
                  <p class="text-xs text-slate-400">{{ card.description }}</p>
                </article>
              </div>

              <div class="space-y-2 border-t border-white/10 pt-4 text-xs text-slate-400">
                <h4 class="text-[11px] uppercase tracking-[0.3em] text-slate-500">Keyword themes</h4>
                <p>{{ activeIdentity.keywords.join(', ') }}</p>
              </div>
            </aside>
          </div>
        </div>

        <section class="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20">
          <header class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-xl font-semibold text-slate-100">Brand guidelines</h2>
              <p class="text-sm text-slate-400">
                Core messaging, usage notes, and accessibility considerations for your new identity.
              </p>
            </div>
            <div class="flex flex-col items-start gap-2 text-xs text-slate-400 md:items-end">
              <div class="flex flex-wrap items-center justify-end gap-2">
                <span>{{ guidelineSummary }}</span>
                <button
                  type="button"
                  class="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-100 transition hover:border-brand-accent hover:text-brand-accent disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="exportingGuidelines"
                  @click="downloadGuidelines"
                >
                  {{ exportingGuidelines ? 'Preparing…' : 'Download PDF' }}
                </button>
              </div>
              <p v-if="guidelineStatus" class="text-[11px] text-emerald-300">{{ guidelineStatus }}</p>
              <p v-if="guidelineError" class="text-[11px] text-rose-300">{{ guidelineError }}</p>
            </div>
          </header>

          <div class="grid gap-4 md:grid-cols-2">
            <article
              v-for="guideline in activeIdentity.messaging"
              :key="`messaging-${guideline.title}`"
              class="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-300"
            >
              <h3 class="text-sm font-semibold text-slate-100">{{ guideline.title }}</h3>
              <p class="text-xs text-slate-400">{{ guideline.body }}</p>
            </article>
          </div>

          <transition name="fade">
            <div v-if="showGuidelines" class="grid gap-4 md:grid-cols-3">
              <article
                v-for="usecase in activeIdentity.usage"
                :key="`usage-${usecase.title}`"
                class="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-300"
              >
                <h3 class="text-sm font-semibold text-slate-100">{{ usecase.title }}</h3>
                <p class="text-xs text-slate-400">{{ usecase.body }}</p>
              </article>
            </div>
          </transition>
        </section>

        <section class="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20">
          <header class="space-y-1">
            <h2 class="text-xl font-semibold text-slate-100">History & favorites</h2>
            <p class="text-sm text-slate-400">Revisit previous explorations or pin identities to your favorites.</p>
          </header>

          <div class="grid gap-4 lg:grid-cols-2">
            <div class="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold text-slate-200">Recent history</h3>
                <button
                  type="button"
                  class="text-[11px] uppercase tracking-[0.3em] text-brand-accent"
                  @click="store.clearHistory"
                >
                  Clear
                </button>
              </div>
              <ul class="space-y-2 text-xs text-slate-400">
                <li
                  v-for="entry in history"
                  :key="entry.createdAt"
                  class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                >
                  <div>
                    <p class="text-sm font-semibold text-slate-100">{{ entry.input.brandName }}</p>
                    <p class="text-[11px] text-slate-500">{{ entry.summary }}</p>
                  </div>
                  <button
                    type="button"
                    class="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-300 hover:border-brand-accent hover:text-brand-accent"
                    @click="handleApplyIdentity(entry.summary, 'history')"
                  >
                    Apply
                  </button>
                </li>
                <li v-if="!history.length" class="text-[11px] text-slate-500">
                  Generate a new identity to populate history.
                </li>
              </ul>
            </div>

            <div class="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <h3 class="text-sm font-semibold text-slate-200">Favorites</h3>
              <ul class="space-y-2 text-xs text-slate-400">
                <li
                  v-for="favorite in favorites"
                  :key="favorite.createdAt"
                  class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                >
                  <div>
                    <p class="text-sm font-semibold text-slate-100">{{ favorite.input.brandName }}</p>
                    <p class="text-[11px] text-slate-500">{{ favorite.summary }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      class="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-300 hover:border-brand-accent hover:text-brand-accent"
                      @click="handleApplyIdentity(favorite.summary, 'favorite')"
                    >
                      Apply
                    </button>
                    <button
                      type="button"
                      class="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-rose-300 hover:border-rose-400 hover:text-rose-200"
                      @click="handleRemoveFavorite(favorite.summary)"
                    >
                      Remove
                    </button>
                  </div>
                </li>
                <li v-if="!favorites.length" class="text-[11px] text-slate-500">
                  Save an identity to quickly revisit it later.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </section>
    </section>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>



