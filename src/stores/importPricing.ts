import { computed, reactive, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import {
  DEFAULT_COST_ASSUMPTIONS,
  DEFAULT_MARKUP_SCENARIOS,
  DEFAULT_RETAIL_CURRENCIES,
  DEFAULT_EXCHANGE_RATES,
  SAMPLE_PRODUCTS,
  SUPPORTED_RETAIL_CURRENCIES,
  aggregateTotalInvestment,
  buildComparisonSnapshot,
  buildHistoryEntry,
  calculateScenario,
  cloneProducts,
  createCustomMarkup,
  deriveProfitQualityBadge,
  generateMarkupId,
  getBestMarkupForCurrency,
  mergeMarkups,
  parseBulkCsvRow,
  type ComparisonScenario,
  type ExchangeRateMap,
  type ImportCostAssumptions,
  type ImportProductInput,
  type MarkupScenario,
  type ProductHistoryEntry,
  type ProductTemplate
} from '@/utils/tools/importPricing'
import { readLocal, writeLocal } from '@/utils/persist'
import type { CurrencyCode } from '@/utils/currency'
import { fetchExchangeRates, getCachedExchangeRates } from '@/services/exchangeRates'

interface PersistedState {
  products: ImportProductInput[]
  assumptions: ImportCostAssumptions
  customMarkups: MarkupScenario[]
  retailCurrencies: CurrencyCode[]
  exchangeRates: ExchangeRateMap
  lastRateSync: string | null
  favorites: ImportProductInput[]
  templates: ProductTemplate[]
  history: ProductHistoryEntry[]
  comparisons: ComparisonScenario[]
}

const STORAGE_KEY = 'import-tool:state-v1'
const HISTORY_LIMIT = 200

const loadPersistedState = (): PersistedState => {
  const fallback: PersistedState = {
    products: cloneProducts(SAMPLE_PRODUCTS),
    assumptions: { ...DEFAULT_COST_ASSUMPTIONS },
    customMarkups: [],
    retailCurrencies: [...DEFAULT_RETAIL_CURRENCIES],
    exchangeRates: { ...DEFAULT_EXCHANGE_RATES },
    lastRateSync: null,
    favorites: [],
    templates: [],
    history: [],
    comparisons: []
  }
  return readLocal<PersistedState>(STORAGE_KEY, fallback)
}

const persistState = (state: PersistedState) => {
  writeLocal(STORAGE_KEY, state)
}

const createProductId = () => `prod-${Math.random().toString(36).slice(2, 10)}`

export const useImportPricingStore = defineStore('importPricing', () => {
  const persisted = reactive(loadPersistedState())

  const products = ref<ImportProductInput[]>(persisted.products)
  const assumptions = ref<ImportCostAssumptions>({ ...persisted.assumptions })
  const customMarkups = ref<MarkupScenario[]>(persisted.customMarkups || [])
  const retailCurrencies = ref<CurrencyCode[]>(
    persisted.retailCurrencies && persisted.retailCurrencies.length ? persisted.retailCurrencies : [...DEFAULT_RETAIL_CURRENCIES]
  )
  const exchangeRates = ref<ExchangeRateMap>(persisted.exchangeRates || { ...DEFAULT_EXCHANGE_RATES })
  const lastRateSync = ref<string | null>(persisted.lastRateSync || null)
  const favorites = ref<ImportProductInput[]>(persisted.favorites || [])
  const templates = ref<ProductTemplate[]>(persisted.templates || [])
  const history = ref<ProductHistoryEntry[]>(persisted.history || [])
  const comparisons = ref<ComparisonScenario[]>(persisted.comparisons || [])
  const syncingRates = ref(false)

  const allMarkups = computed<MarkupScenario[]>(() => mergeMarkups(DEFAULT_MARKUP_SCENARIOS, customMarkups.value))

  const scenarioResult = computed(() =>
    calculateScenario(products.value, assumptions.value, allMarkups.value, exchangeRates.value, retailCurrencies.value)
  )

  const totalInvestment = computed(() => aggregateTotalInvestment(scenarioResult.value.costs))

  const bestMarkups = computed(() => {
    return retailCurrencies.value.reduce<Record<CurrencyCode, ReturnType<typeof getBestMarkupForCurrency> | null>>((acc, code) => {
      acc[code] = getBestMarkupForCurrency(scenarioResult.value.projections, code)
      return acc
    }, {} as Record<CurrencyCode, ReturnType<typeof getBestMarkupForCurrency> | null>)
  })

  const comparisonSnapshots = computed(() =>
    comparisons.value.map((item) => buildComparisonSnapshot(item, exchangeRates.value))
  )

  const priceHistoryByProduct = computed<Record<string, ProductHistoryEntry[]>>(() => {
    return history.value.reduce<Record<string, ProductHistoryEntry[]>>((acc, entry) => {
      if (!acc[entry.productId]) acc[entry.productId] = []
      acc[entry.productId].push(entry)
      return acc
    }, {})
  })

  watch(
    () => ({
      products: products.value,
      assumptions: assumptions.value,
      customMarkups: customMarkups.value,
      retailCurrencies: retailCurrencies.value,
      exchangeRates: exchangeRates.value,
      lastRateSync: lastRateSync.value,
      favorites: favorites.value,
      templates: templates.value,
      history: history.value,
      comparisons: comparisons.value
    }),
    (next) => {
      persistState({
        products: cloneProducts(next.products),
        assumptions: { ...next.assumptions },
        customMarkups: [...next.customMarkups],
        retailCurrencies: [...next.retailCurrencies],
        exchangeRates: { ...next.exchangeRates },
        lastRateSync: next.lastRateSync,
        favorites: cloneProducts(next.favorites),
        templates: next.templates.map((tpl) => ({ ...tpl, products: cloneProducts(tpl.products) })),
        history: [...next.history],
        comparisons: next.comparisons.map((item) => ({
          ...item,
          products: cloneProducts(item.products),
          assumptions: { ...item.assumptions }
        }))
      })
    },
    { deep: true }
  )

  const addProduct = (payload?: Partial<ImportProductInput>) => {
    const base: ImportProductInput = {
      id: createProductId(),
      name: payload?.name || 'New Product',
      description: payload?.description,
      unitPrice: payload?.unitPrice ?? 1,
      quantity: payload?.quantity ?? 10,
      supplierCurrency: payload?.supplierCurrency || 'USD',
      shippingPerUnit: payload?.shippingPerUnit,
      shippingCurrency: payload?.shippingCurrency,
      notes: payload?.notes,
      tags: payload?.tags ? [...payload.tags] : []
    }
    products.value = [...products.value, base]
  }

  const updateProduct = (id: string, patch: Partial<ImportProductInput>) => {
    products.value = products.value.map((product) =>
      product.id === id ? { ...product, ...patch, lastUpdated: new Date().toISOString() } : product
    )
  }

  const removeProduct = (id: string) => {
    products.value = products.value.filter((product) => product.id !== id)
  }

  const duplicateProduct = (id: string) => {
    const target = products.value.find((product) => product.id === id)
    if (!target) return
    const copy: ImportProductInput = {
      ...target,
      id: createProductId(),
      name: `${target.name} (Copy)`,
      lastUpdated: new Date().toISOString()
    }
    products.value = [...products.value, copy]
  }

  const clearProducts = () => {
    products.value = []
  }

  const addProductsBulk = (items: ImportProductInput[]) => {
    if (!items.length) return
    products.value = [...products.value, ...items.map((item) => ({ ...item, id: createProductId() }))]
  }

  const importFromCsvRows = (rows: Record<string, string>[]) => {
    const parsed = rows.map((row) => parseBulkCsvRow(row))
    addProductsBulk(parsed)
    return parsed.length
  }

  const setAssumptions = (patch: Partial<ImportCostAssumptions>) => {
    assumptions.value = { ...assumptions.value, ...patch }
  }

  const resetAssumptions = () => {
    assumptions.value = { ...DEFAULT_COST_ASSUMPTIONS, baseCurrency: assumptions.value.baseCurrency }
  }

  const setBaseCurrency = (currency: CurrencyCode) => {
    assumptions.value = { ...assumptions.value, baseCurrency: currency }
    if (!retailCurrencies.value.includes(currency)) {
      retailCurrencies.value = [...retailCurrencies.value, currency]
    }
  }

  const setRetailCurrencies = (currencies: CurrencyCode[]) => {
    const sanitized = Array.from(
      new Set(
        currencies.filter((code) => SUPPORTED_RETAIL_CURRENCIES.includes(code))
      )
    )
    retailCurrencies.value = sanitized.length ? sanitized : [...DEFAULT_RETAIL_CURRENCIES]
  }

  const addRetailCurrency = (currency: CurrencyCode) => {
    if (!SUPPORTED_RETAIL_CURRENCIES.includes(currency)) return
    if (retailCurrencies.value.includes(currency)) return
    retailCurrencies.value = [...retailCurrencies.value, currency]
  }

  const removeRetailCurrency = (currency: CurrencyCode) => {
    retailCurrencies.value = retailCurrencies.value.filter((code) => code !== currency)
    if (!retailCurrencies.value.length) {
      retailCurrencies.value = [...DEFAULT_RETAIL_CURRENCIES]
    }
  }

  const upsertCustomMarkup = (percentage: number) => {
    const normalized = Math.max(0, percentage)
    const id = generateMarkupId(normalized)
    const existing = customMarkups.value.find((item) => item.id === id)
    if (existing) {
      existing.percentage = normalized
      existing.label = `${(normalized * 100).toFixed(0)}%`
      return
    }
    customMarkups.value = [
      ...customMarkups.value,
      createCustomMarkup(normalized)
    ]
  }

  const removeCustomMarkup = (id: string) => {
    customMarkups.value = customMarkups.value.filter((item) => item.id !== id)
  }

  const resetCustomMarkups = () => {
    customMarkups.value = []
  }

  const addFavoriteProduct = (product: ImportProductInput) => {
    if (favorites.value.some((fav) => fav.name === product.name && fav.unitPrice === product.unitPrice)) return
    favorites.value = [
      ...favorites.value,
      { ...product, id: createProductId(), lastUpdated: new Date().toISOString() }
    ]
  }

  const removeFavoriteProduct = (id: string) => {
    favorites.value = favorites.value.filter((fav) => fav.id !== id)
  }

  const addFavoriteToCurrent = (id: string) => {
    const favorite = favorites.value.find((fav) => fav.id === id)
    if (!favorite) return
    addProduct({ ...favorite })
  }

  const saveTemplate = (name: string, description?: string) => {
    const timestamp = new Date().toISOString()
    const template: ProductTemplate = {
      id: `tpl-${Math.random().toString(36).slice(2, 10)}`,
      name,
      description,
      products: cloneProducts(products.value),
      assumptions: { ...assumptions.value },
      markups: [...customMarkups.value],
      createdAt: timestamp,
      updatedAt: timestamp
    }
    templates.value = [...templates.value, template]
    return template.id
  }

  const updateTemplate = (id: string, patch: Partial<ProductTemplate>) => {
    templates.value = templates.value.map((tpl) =>
      tpl.id === id
        ? {
            ...tpl,
            ...patch,
            products: patch.products ? cloneProducts(patch.products) : tpl.products,
            assumptions: patch.assumptions ? { ...patch.assumptions } : tpl.assumptions,
            markups: patch.markups ? [...patch.markups] : tpl.markups,
            updatedAt: new Date().toISOString()
          }
        : tpl
    )
  }

  const deleteTemplate = (id: string) => {
    templates.value = templates.value.filter((tpl) => tpl.id !== id)
  }

  const applyTemplate = (id: string, mode: 'replace' | 'merge' = 'replace') => {
    const template = templates.value.find((tpl) => tpl.id === id)
    if (!template) return
    if (mode === 'replace') {
      products.value = cloneProducts(template.products)
    } else {
      products.value = [...products.value, ...cloneProducts(template.products)]
    }
    assumptions.value = { ...template.assumptions }
    customMarkups.value = [...template.markups]
  }

  const recordHistory = (notes?: string) => {
    const snapshots = scenarioResult.value.costs.map((cost) => {
      const product = products.value.find((item) => item.id === cost.productId)
      if (!product) return null
      return buildHistoryEntry(product, cost, undefined, notes)
    }).filter(Boolean) as ProductHistoryEntry[]

    const merged = [...snapshots, ...history.value].slice(0, HISTORY_LIMIT)
    history.value = merged
    return snapshots
  }

  const clearHistory = () => {
    history.value = []
  }

  const createComparisonScenario = (name: string, description?: string) => {
    const scenario: ComparisonScenario = {
      id: `cmp-${Math.random().toString(36).slice(2, 10)}`,
      name,
      description,
      products: cloneProducts(products.value),
      assumptions: { ...assumptions.value },
      notes: undefined,
      createdAt: new Date().toISOString()
    }
    comparisons.value = [...comparisons.value, scenario]
    return scenario.id
  }

  const updateComparisonScenario = (id: string, patch: Partial<ComparisonScenario>) => {
    comparisons.value = comparisons.value.map((item) =>
      item.id === id
        ? {
            ...item,
            ...patch,
            products: patch.products ? cloneProducts(patch.products) : item.products,
            assumptions: patch.assumptions ? { ...patch.assumptions } : item.assumptions
          }
        : item
    )
  }

  const deleteComparisonScenario = (id: string) => {
    comparisons.value = comparisons.value.filter((item) => item.id !== id)
  }

  const applyComparisonScenario = (id: string) => {
    const scenario = comparisons.value.find((item) => item.id === id)
    if (!scenario) return
    products.value = cloneProducts(scenario.products)
    assumptions.value = { ...scenario.assumptions }
  }

  const refreshExchangeRates = async (force = false) => {
    if (syncingRates.value) return
    syncingRates.value = true
    try {
      const rates = await fetchExchangeRates('USD', force)
      exchangeRates.value = { ...rates }
      lastRateSync.value = new Date().toISOString()
    } finally {
      syncingRates.value = false
    }
  }

  const loadCachedRates = () => {
    exchangeRates.value = getCachedExchangeRates()
  }

  const resetExchangeRates = () => {
    exchangeRates.value = { ...DEFAULT_EXCHANGE_RATES }
    lastRateSync.value = null
  }

  const setExchangeRate = (code: CurrencyCode, value: number) => {
    if (value <= 0 || !Number.isFinite(value)) return
    exchangeRates.value = { ...exchangeRates.value, [code]: value }
  }

  const resetAll = () => {
    products.value = cloneProducts(SAMPLE_PRODUCTS)
    assumptions.value = { ...DEFAULT_COST_ASSUMPTIONS }
    customMarkups.value = []
    retailCurrencies.value = [...DEFAULT_RETAIL_CURRENCIES]
    exchangeRates.value = { ...DEFAULT_EXCHANGE_RATES }
    lastRateSync.value = null
    favorites.value = []
    templates.value = []
    history.value = []
    comparisons.value = []
  }

  const resetToDefaults = () => {
    resetAll()
  }

  const removeAllData = () => {
    writeLocal(STORAGE_KEY, {
      products: [],
      assumptions: { ...DEFAULT_COST_ASSUMPTIONS },
      customMarkups: [],
      retailCurrencies: [...DEFAULT_RETAIL_CURRENCIES],
      exchangeRates: { ...DEFAULT_EXCHANGE_RATES },
      lastRateSync: null,
      favorites: [],
      templates: [],
      history: [],
      comparisons: []
    })
    resetAll()
  }

  const profitBadges = computed(() =>
    scenarioResult.value.projections.map((projection) => ({
      markupId: projection.markupId,
      retailCurrency: projection.retailCurrency,
      badge: deriveProfitQualityBadge(projection.profitMarginPercent)
    }))
  )

  return {
    products,
    assumptions,
    allMarkups,
    customMarkups,
    retailCurrencies,
    exchangeRates,
    lastRateSync,
    favorites,
    templates,
    history,
    comparisons,
    syncingRates,
    scenarioResult,
    totalInvestment,
    bestMarkups,
    comparisonSnapshots,
    priceHistoryByProduct,
    profitBadges,
    addProduct,
    updateProduct,
    removeProduct,
    duplicateProduct,
    clearProducts,
    addProductsBulk,
    importFromCsvRows,
    setAssumptions,
    resetAssumptions,
    setBaseCurrency,
    setRetailCurrencies,
    addRetailCurrency,
    removeRetailCurrency,
    upsertCustomMarkup,
    removeCustomMarkup,
    resetCustomMarkups,
    addFavoriteProduct,
    removeFavoriteProduct,
    addFavoriteToCurrent,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
    applyTemplate,
    recordHistory,
    clearHistory,
    createComparisonScenario,
    updateComparisonScenario,
    deleteComparisonScenario,
    applyComparisonScenario,
    refreshExchangeRates,
    loadCachedRates,
    setExchangeRate,
    resetExchangeRates,
    resetAll,
    resetToDefaults,
    removeAllData
  }
})

