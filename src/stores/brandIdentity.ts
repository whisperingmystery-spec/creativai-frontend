import { computed, reactive, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import {
  colorPalettes,
  typographyScales,
  generateBrandIdentity,
  type BrandIdentityInput,
  type BrandIndustry,
  type GeneratedBrandIdentity,
  findPaletteById,
  findTypographyById,
  buildGuidelineSummary,
  industryPresets
} from '@/utils/tools/brandIdentity'
import { readLocal, writeLocal } from '@/utils/persist'

export interface IdentityState {
  brandName: string
  industry: BrandIndustry
  tone: BrandIdentityInput['tone']
  keywords: string[]
  paletteId?: string
  typographyId?: string
}

export interface StoredIdentity {
  input: IdentityState
  identity: GeneratedBrandIdentity
  createdAt: string
  updatedAt: string
  summary: string
}

interface PersistedState {
  current: IdentityState
  history: StoredIdentity[]
  favorites: StoredIdentity[]
}

const STORAGE_KEY = 'brand-identity:state'
const HISTORY_LIMIT = 20

const defaultState = (): IdentityState => ({
  brandName: 'Nova Commerce',
  industry: 'ecommerce',
  tone: 'modern',
  keywords: ['conversion', 'trust', 'experience'],
  paletteId: 'ecommerce-playful',
  typographyId: 'modern-sans'
})

const loadPersistedState = (): PersistedState => {
  return (
    readLocal<PersistedState>(STORAGE_KEY, {
      current: defaultState(),
      history: [],
      favorites: []
    }) || {
      current: defaultState(),
      history: [],
      favorites: []
    }
  )
}

export const useBrandIdentityStore = defineStore('brandIdentity', () => {
  const persisted = reactive(loadPersistedState())
  const currentInput = ref<IdentityState>({ ...persisted.current })
  const previewIdentity = ref<GeneratedBrandIdentity | null>(null)
  const isGenerating = ref(false)

  const availablePalettes = computed(() => colorPalettes)
  const availableTypography = computed(() => typographyScales)
  const availableIndustries = computed(() => industryPresets.map((preset) => preset.industry))

  const activePalette = computed(() => findPaletteById(currentInput.value.paletteId) || colorPalettes[0])
  const activeTypography = computed(() => findTypographyById(currentInput.value.typographyId) || typographyScales[0])

  const activeIdentity = computed<GeneratedBrandIdentity>(() => {
    if (previewIdentity.value) return previewIdentity.value
    return generateBrandIdentity({
      brandName: currentInput.value.brandName,
      industry: currentInput.value.industry,
      tone: currentInput.value.tone,
      keywords: currentInput.value.keywords,
      paletteId: currentInput.value.paletteId,
      typographyId: currentInput.value.typographyId
    })
  })

  const history = computed(() => persisted.history)
  const favorites = computed(() => persisted.favorites)

  const persistState = () => {
    writeLocal<PersistedState>(STORAGE_KEY, {
      current: currentInput.value,
      history: persisted.history,
      favorites: persisted.favorites
    })
  }

  watch(
    currentInput,
    (next) => {
      previewIdentity.value = null
      persisted.current = { ...next }
      persistState()
    },
    { deep: true }
  )

  const setBrandName = (name: string) => {
    currentInput.value.brandName = name.trim().length ? name.trim() : 'Untitled Brand'
  }

  const setIndustry = (industry: BrandIndustry) => {
    currentInput.value.industry = industry
    const preset = industryPresets.find((item) => item.industry === industry)
    if (preset?.palettes?.length && !preset.palettes.includes(currentInput.value.paletteId || '')) {
      currentInput.value.paletteId = preset.palettes[0]
    }
    if (preset?.typography?.length && !preset.typography.includes(currentInput.value.typographyId || '')) {
      currentInput.value.typographyId = preset.typography[0]
    }
  }

  const setTone = (tone: IdentityState['tone']) => {
    currentInput.value.tone = tone
  }

  const setKeywords = (keywords: string[]) => {
    currentInput.value.keywords = keywords.filter((keyword) => keyword.trim().length).map((keyword) => keyword.trim())
  }

  const setPalette = (paletteId: string) => {
    currentInput.value.paletteId = paletteId
  }

  const setTypography = (typographyId: string) => {
    currentInput.value.typographyId = typographyId
  }

  const generatePreview = () => {
    isGenerating.value = true
    try {
      previewIdentity.value = generateBrandIdentity({
        brandName: currentInput.value.brandName,
        industry: currentInput.value.industry,
        tone: currentInput.value.tone,
        keywords: currentInput.value.keywords,
        paletteId: currentInput.value.paletteId,
        typographyId: currentInput.value.typographyId
      })
      return previewIdentity.value
    } finally {
      isGenerating.value = false
    }
  }

  const saveHistory = (identity: GeneratedBrandIdentity) => {
    const timestamp = new Date().toISOString()
    const entry: StoredIdentity = {
      input: { ...currentInput.value },
      identity,
      createdAt: timestamp,
      updatedAt: timestamp,
      summary: buildGuidelineSummary(identity)
    }
    persisted.history.unshift(entry)
    persisted.history = persisted.history.slice(0, HISTORY_LIMIT)
    persistState()
  }

  const saveFavorite = (identity: GeneratedBrandIdentity) => {
    const timestamp = new Date().toISOString()
    const entry: StoredIdentity = {
      input: { ...currentInput.value },
      identity,
      createdAt: timestamp,
      updatedAt: timestamp,
      summary: buildGuidelineSummary(identity)
    }
    persisted.favorites.unshift(entry)
    persistState()
  }

  const removeFavorite = (summary: string) => {
    persisted.favorites = persisted.favorites.filter((item) => item.summary !== summary)
    persistState()
  }

  const applyIdentity = (stored: StoredIdentity) => {
    currentInput.value = { ...stored.input }
    previewIdentity.value = stored.identity
  }

  const clearHistory = () => {
    persisted.history = []
    persistState()
  }

  return {
    currentInput,
    availablePalettes,
    availableTypography,
    availableIndustries,
    activePalette,
    activeTypography,
    activeIdentity,
    history,
    favorites,
    isGenerating,
    setBrandName,
    setIndustry,
    setTone,
    setKeywords,
    setPalette,
    setTypography,
    generatePreview,
    saveHistory,
    saveFavorite,
    removeFavorite,
    applyIdentity,
    clearHistory
  }
})



