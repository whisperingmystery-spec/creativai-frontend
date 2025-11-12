<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useImportPricingStore } from '@/stores/importPricing'
import { supportedCurrencies, type CurrencyCode, formatCurrency } from '@/utils/currency'
import {
  SUPPORTED_RETAIL_CURRENCIES,
  computeBulkUploadTemplate,
  convertCurrency,
  type ImportProductInput
} from '@/utils/tools/importPricing'

const store = useImportPricingStore()
const {
  products,
  assumptions,
  allMarkups,
  retailCurrencies,
  exchangeRates,
  scenarioResult,
  totalInvestment,
  bestMarkups,
  syncingRates,
  lastRateSync,
  profitBadges,
  favorites,
  templates,
  history,
  comparisonSnapshots,
  priceHistoryByProduct
} = storeToRefs(store)

const targetMarket = ref('India')
const customMarkupInput = ref<number | null>(null)
const activeRetailCurrency = ref<CurrencyCode>('INR')
const expandedAssumptions = ref(true)
const templateName = ref('')
const templateDescription = ref('')
const comparisonName = ref('')
const comparisonDescription = ref('')
const bulkImportMessage = ref('')
const bulkImportError = ref('')
const bulkInputRef = ref<HTMLInputElement | null>(null)
const exportStatus = ref<string | null>(null)
const exportError = ref<string | null>(null)
const exportingPdf = ref(false)
const dashboardCurrency = ref<CurrencyCode>('INR')

const supplierCurrencyOptions = supportedCurrencies

const availableDashboardCurrencies = computed<CurrencyCode[]>(() => {
  const set = new Set<CurrencyCode>([assumptions.value.baseCurrency, ...retailCurrencies.value])
  return Array.from(set)
})

onMounted(() => {
  store.loadCachedRates()
  if (!retailCurrencies.value.includes(assumptions.value.baseCurrency)) {
    store.addRetailCurrency(assumptions.value.baseCurrency)
  }
  activeRetailCurrency.value = assumptions.value.baseCurrency
  dashboardCurrency.value = assumptions.value.baseCurrency
})

watch(
  () => assumptions.value.baseCurrency,
  (next) => {
    if (!retailCurrencies.value.includes(next)) {
      store.addRetailCurrency(next)
    }
    activeRetailCurrency.value = next
    if (!availableDashboardCurrencies.value.includes(dashboardCurrency.value)) {
      dashboardCurrency.value = next
    }
  }
)

watch(
  () => retailCurrencies.value,
  (list) => {
    if (!list.includes(activeRetailCurrency.value)) {
      activeRetailCurrency.value = list[0] || assumptions.value.baseCurrency
    }
    if (!availableDashboardCurrencies.value.includes(dashboardCurrency.value)) {
      dashboardCurrency.value = availableDashboardCurrencies.value[0]
    }
  }
)

watch(
  () => activeRetailCurrency.value,
  (next) => {
    if (availableDashboardCurrencies.value.includes(next)) {
      dashboardCurrency.value = next
    }
  }
)

const usdRateForBase = computed({
  get: () => exchangeRates.value[assumptions.value.baseCurrency] ?? 1,
  set: (value: number) => {
    if (!Number.isFinite(value) || value <= 0) return
    store.setExchangeRate(assumptions.value.baseCurrency, value)
  }
})

const totalUnits = computed(() => products.value.reduce((sum, product) => sum + (Number(product.quantity) || 0), 0))

const retailResultsForActiveCurrency = computed(() =>
  scenarioResult.value.retailResults.filter((result) => result.retailCurrency === activeRetailCurrency.value)
)

const profitBadgeMap = computed<Record<string, string>>(() => {
  const map: Record<string, string> = {}
  profitBadges.value.forEach((badge) => {
    map[`${badge.markupId}-${badge.retailCurrency}`] = badge.badge
  })
  return map
})

const markupDisplayPercent = (markup: number) => (markup * 100).toFixed(0)

const marginClass = (margin: number) => {
  if (margin >= 40) return 'text-emerald-400'
  if (margin >= 20) return 'text-amber-300'
  return 'text-rose-400'
}

const formatPercent = (value: number) => `${value.toFixed(2)}%`

const handleProductUpdate = (product: ImportProductInput, field: keyof ImportProductInput, value: string | number) => {
  if (typeof value === 'string') {
    store.updateProduct(product.id, { [field]: value } as Partial<ImportProductInput>)
    return
  }
  const numeric = Number.isFinite(value) ? Number(value) : 0
  store.updateProduct(product.id, { [field]: numeric < 0 ? 0 : numeric } as Partial<ImportProductInput>)
}

const handleQuantityInput = (product: ImportProductInput, raw: string) => {
  const parsed = parseInt(raw, 10)
  handleProductUpdate(product, 'quantity', Number.isFinite(parsed) && parsed > 0 ? parsed : 0)
}

const handleNumberInput = (product: ImportProductInput, field: keyof ImportProductInput, raw: string) => {
  const parsed = parseFloat(raw)
  const safe = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
  handleProductUpdate(product, field, safe)
}

const handleAssumptionInput = (field: keyof typeof assumptions.value, raw: string) => {
  const parsed = parseFloat(raw)
  const safe = Number.isFinite(parsed) ? Math.max(0, parsed) : assumptions.value[field]
  store.setAssumptions({ [field]: safe } as Partial<typeof assumptions.value>)
}

const handleCustomMarkupAdd = () => {
  if (customMarkupInput.value === null) return
  const normalized = customMarkupInput.value / 100
  if (!Number.isFinite(normalized) || normalized <= 0) return
  store.upsertCustomMarkup(normalized)
  customMarkupInput.value = null
}

const removeMarkup = (id: string) => {
  if (DEFAULT_MARKUP_IDS.has(id)) return
  store.removeCustomMarkup(id)
}

const DEFAULT_MARKUP_IDS = new Set(['markup-150', 'markup-200', 'markup-250', 'markup-300'])

const selectRetailCurrency = (code: CurrencyCode) => {
  activeRetailCurrency.value = code
}

const availableRetailCurrencyOptions = computed(() =>
  SUPPORTED_RETAIL_CURRENCIES.filter((code) => !retailCurrencies.value.includes(code))
)

const addRetailCurrency = (code: CurrencyCode) => {
  store.addRetailCurrency(code)
  activeRetailCurrency.value = code
}

const handleAddRetailCurrency = (event: Event) => {
  const select = event.target as HTMLSelectElement
  const code = select.value as CurrencyCode
  if (!code) return
  addRetailCurrency(code)
  select.value = ''
}

const removeRetailCurrency = (code: CurrencyCode) => {
  if (code === assumptions.value.baseCurrency) return
  store.removeRetailCurrency(code)
}

const toggleAssumptions = () => {
  expandedAssumptions.value = !expandedAssumptions.value
}

const baseCurrencyLabel = computed(() => assumptions.value.baseCurrency)

const handleAddProduct = () => {
  store.addProduct()
}

const handleClearProducts = () => {
  store.clearProducts()
}

const handleResetDefaults = () => {
  store.resetToDefaults()
}

const handleRefreshRates = () => {
  store.refreshExchangeRates(true)
}

const handleCopySummary = async () => {
  const projection = scenarioResult.value.projections.find(
    (item) => item.retailCurrency === activeRetailCurrency.value
  )
  const summaryLines = [
    `Import Cost & Pricing Summary (${baseCurrencyLabel.value})`,
    `Products: ${products.value.length}`,
    `Units: ${totalUnits.value}`,
    `Total Investment: ${formatCurrency(totalInvestment.value, assumptions.value.baseCurrency)}`,
    projection
      ? `Best Markup (${markupDisplayPercent(projection.markupPercent)}%): Margin ${projection.profitMarginPercent.toFixed(
          2
        )}% | Profit ${formatCurrency(projection.totalProfit, projection.retailCurrency)}`
      : 'No projection available'
  ]
  try {
    await navigator.clipboard.writeText(summaryLines.join('\n'))
  } catch {
    // ignore clipboard errors
  }
}

const resetExportFeedback = () => {
  exportStatus.value = null
  exportError.value = null
}

const toCsvRow = (values: Array<string | number>) =>
  values
    .map((value) => {
      const text = typeof value === 'number' ? value.toString() : value
      return `"${text.replace(/"/g, '""')}"`
    })
    .join(',')

const buildCsvContent = () => {
  const rows: string[] = []
  rows.push('Summary')
  rows.push(toCsvRow(['Generated At', new Date().toISOString()]))
  rows.push(toCsvRow(['Target Market', targetMarket.value]))
  rows.push(toCsvRow(['Base Currency', assumptions.value.baseCurrency]))
  rows.push(toCsvRow(['Total Products', products.value.length]))
  rows.push(toCsvRow(['Total Units', totalUnits.value]))
  rows.push(toCsvRow(['Total Investment', formatCurrency(totalInvestment.value, assumptions.value.baseCurrency)]))
  rows.push('')

  rows.push('Product Breakdown')
  rows.push(
    toCsvRow([
      'Product',
      'Supplier Currency',
      'Unit Price (Supplier)',
      `Unit Price (${assumptions.value.baseCurrency})`,
      `Shipping (${assumptions.value.baseCurrency})`,
      `Customs (${assumptions.value.baseCurrency})`,
      `Taxes (${assumptions.value.baseCurrency})`,
      `Total / Unit (${assumptions.value.baseCurrency})`,
      `Total Landed (${assumptions.value.baseCurrency})`,
      'Quantity'
    ])
  )
  scenarioResult.value.costs.forEach((cost) => {
    rows.push(
      toCsvRow([
        cost.productName,
        cost.supplierCurrency,
        cost.unitPriceOriginal.toFixed(2),
        cost.unitPriceInBase.toFixed(2),
        cost.shippingPerUnitBase.toFixed(2),
        cost.customsPerUnitBase.toFixed(2),
        cost.taxesPerUnitBase.toFixed(2),
        cost.totalPerUnitBase.toFixed(2),
        cost.totalCostBase.toFixed(2),
        cost.quantity
      ])
    )
  })

  rows.push('')
  rows.push('Profit Projections')
  rows.push(toCsvRow(['Markup', 'Retail Currency', 'Total Revenue', 'Total Profit', 'Margin %']))
  scenarioResult.value.projections.forEach((projection) => {
    rows.push(
      toCsvRow([
        projection.markupLabel,
        projection.retailCurrency,
        projection.totalRevenue.toFixed(2),
        projection.totalProfit.toFixed(2),
        projection.profitMarginPercent.toFixed(2)
      ])
    )
  })

  return rows.join('\n')
}

const sanitizePdfText = (value: string) => value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')

const buildPdfLines = () => {
  const lines: string[] = []
  lines.push('Import Cost & Retail Pricing Report')
  lines.push(`Generated: ${new Date().toLocaleString()}`)
  lines.push(`Target market: ${targetMarket.value}`)
  lines.push(`Base currency: ${assumptions.value.baseCurrency}`)
  lines.push(`Total investment: ${formatCurrency(totalInvestment.value, assumptions.value.baseCurrency)}`)
  lines.push(`Total units: ${totalUnits.value}`)
  lines.push('')
  lines.push('Product Breakdown')
  scenarioResult.value.costs.forEach((cost) => {
    lines.push(`- ${cost.productName} (${cost.quantity} units)`) // product headline
    lines.push(
      `  Landed/unit: ${formatCurrency(cost.totalPerUnitBase, cost.baseCurrency)} | Total: ${formatCurrency(cost.totalCostBase, cost.baseCurrency)}`
    )
  })
  lines.push('')
  lines.push('Profit Projections')
  scenarioResult.value.projections.forEach((projection) => {
    lines.push(`- ${projection.markupLabel} (${projection.retailCurrency}) — Margin ${projection.profitMarginPercent.toFixed(2)}%`)
    lines.push(
      `  Revenue: ${formatCurrency(projection.totalRevenue, projection.retailCurrency)} | Profit: ${formatCurrency(projection.totalProfit, projection.retailCurrency)}`
    )
  })
  const best = bestMarkups.value[activeRetailCurrency.value]
  if (best) {
    lines.push('')
    lines.push(
      `Best Margin: ${best.markupLabel} in ${best.retailCurrency} (${best.profitMarginPercent.toFixed(2)}% margin, ${formatCurrency(best.totalProfit, best.retailCurrency)} profit)`
    )
  }
  return lines
}

const buildPdfBlob = () => {
  const lines = buildPdfLines()
  const encoder = new TextEncoder()
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
    textOps.push('(No data) Tj')
  }
  const contentStream = ['BT', '/F1 12 Tf', '16 TL', '1 0 0 1 72 720 Tm', ...textOps, 'ET'].join('\n')
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

const handleExportCsv = () => {
  resetExportFeedback()
  try {
    const content = buildCsvContent()
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
    link.setAttribute('download', 'import-pricing-calculation.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
    exportStatus.value = 'CSV exported successfully.'
  } catch (error) {
    exportError.value = error instanceof Error ? error.message : 'Failed to export CSV.'
  }
}

const handleExportPdf = () => {
  resetExportFeedback()
  exportingPdf.value = true
  try {
    const blob = buildPdfBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'import-pricing-report.pdf')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    exportStatus.value = 'PDF exported successfully.'
  } catch (error) {
    exportError.value = error instanceof Error ? error.message : 'Failed to export PDF.'
  } finally {
    exportingPdf.value = false
  }
}

const handleSaveTemplate = () => {
  const name = templateName.value.trim()
  if (!name) return
  store.saveTemplate(name, templateDescription.value.trim() || undefined)
  templateName.value = ''
  templateDescription.value = ''
}

const handleApplyTemplate = (id: string, mode: 'replace' | 'merge') => {
  store.applyTemplate(id, mode)
}

const handleDeleteTemplate = (id: string) => {
  store.deleteTemplate(id)
}

const handleCreateComparison = () => {
  const name = comparisonName.value.trim() || `Scenario ${new Date().toLocaleDateString()}`
  store.createComparisonScenario(name, comparisonDescription.value.trim() || undefined)
  comparisonName.value = ''
  comparisonDescription.value = ''
}

const handleDeleteComparison = (id: string) => {
  store.deleteComparisonScenario(id)
}

const handleApplyComparison = (id: string) => {
  store.applyComparisonScenario(id)
}

const handleAddFavorite = (product: ImportProductInput) => {
  store.addFavoriteProduct(product)
}

const productIsFavorited = (product: ImportProductInput) =>
  favorites.value.some((fav) => fav.name === product.name && fav.unitPrice === product.unitPrice)

const handleUseFavorite = (id: string) => {
  store.addFavoriteToCurrent(id)
}

const handleRemoveFavorite = (id: string) => {
  store.removeFavoriteProduct(id)
}

const handleRecordSnapshot = () => {
  store.recordHistory()
}

const handleClearHistory = () => {
  store.clearHistory()
}

const downloadBulkTemplate = () => {
  const content = computeBulkUploadTemplate()
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'import-products-template.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const parseCsvText = (text: string) => {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length)
  if (!lines.length) return []
  const headers = lines[0].split(',').map((header) => header.trim())
  return lines.slice(1).map((line) => {
    const cells = line.split(',').map((cell) => cell.trim())
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = cells[index] || ''
      return acc
    }, {})
  })
}

const handleBulkUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  bulkImportMessage.value = ''
  bulkImportError.value = ''

  try {
    const text = await file.text()
    const rows = parseCsvText(text)
    if (!rows.length) {
      bulkImportError.value = 'CSV file is empty.'
  } else {
      const added = store.importFromCsvRows(rows)
      bulkImportMessage.value = `Imported ${added} products from CSV.`
    }
  } catch (error) {
    bulkImportError.value = error instanceof Error ? error.message : 'Failed to parse CSV file.'
  } finally {
    if (bulkInputRef.value) bulkInputRef.value.value = ''
  }
}

const formattedHistory = computed(() =>
  history.value.map((entry) => {
    const current = products.value.find((product) => product.id === entry.productId)
    return {
      ...entry,
      date: new Date(entry.timestamp).toLocaleString(),
      label: entry.productName || current?.name || entry.productId
    }
  })
)

const historyForProduct = (productId: string) => priceHistoryByProduct.value[productId] || []

const dashboardCosts = computed(() => {
  const currency = dashboardCurrency.value
  const rates = exchangeRates.value
  return scenarioResult.value.costs.map((cost) => {
    const convertBase = (value: number, from: CurrencyCode = cost.baseCurrency) =>
      convertCurrency(value, from, currency, rates)

    const perUnit = {
      product: convertBase(cost.unitPriceInBase, cost.baseCurrency),
      shipping: convertBase(cost.shippingPerUnitBase, cost.baseCurrency),
      customs: convertBase(cost.customsPerUnitBase, cost.baseCurrency),
      taxes: convertBase(cost.taxesPerUnitBase, cost.baseCurrency)
    }
    const totals = {
      product: convertBase(cost.unitPriceInBase * cost.quantity, cost.baseCurrency),
      shipping: convertBase(cost.shippingPerUnitBase * cost.quantity, cost.baseCurrency),
      customs: convertBase(cost.customsPerUnitBase * cost.quantity, cost.baseCurrency),
      taxes: convertBase(cost.taxesPerUnitBase * cost.quantity, cost.baseCurrency)
    }
    const totalValue = convertBase(cost.totalCostBase, cost.baseCurrency)
    const perUnitTotal = convertBase(cost.totalPerUnitBase, cost.baseCurrency)
    const segmentTotal = totalValue || 0

    const segments = [
      { key: 'product', label: 'Product', value: totals.product, percent: segmentTotal ? +(100 * (totals.product / segmentTotal)).toFixed(2) : 0, class: 'bg-brand/80' },
      { key: 'shipping', label: 'Shipping', value: totals.shipping, percent: segmentTotal ? +(100 * (totals.shipping / segmentTotal)).toFixed(2) : 0, class: 'bg-emerald-500/70' },
      { key: 'customs', label: 'Customs', value: totals.customs, percent: segmentTotal ? +(100 * (totals.customs / segmentTotal)).toFixed(2) : 0, class: 'bg-amber-400/80' },
      { key: 'taxes', label: 'Taxes', value: totals.taxes, percent: segmentTotal ? +(100 * (totals.taxes / segmentTotal)).toFixed(2) : 0, class: 'bg-rose-400/70' }
    ]

      return {
      productId: cost.productId,
      name: cost.productName,
      quantity: cost.quantity,
      baseCurrency: cost.baseCurrency,
      perUnit: {
        ...perUnit,
        total: perUnitTotal
      },
      totals: {
        ...totals,
        total: totalValue
      },
      segments: segments.filter((segment) => segment.value > 0)
      }
    })
})

const aggregateCharges = computed(() => {
  return dashboardCosts.value.reduce(
    (acc, item) => {
      acc.product += item.totals.product
      acc.shipping += item.totals.shipping
      acc.customs += item.totals.customs
      acc.taxes += item.totals.taxes
      acc.total += item.totals.total
      acc.units += item.quantity
      return acc
    },
    { product: 0, shipping: 0, customs: 0, taxes: 0, total: 0, units: 0 }
  )
})

const chargeSegments = computed(() => {
  const aggregate = aggregateCharges.value
  const total = aggregate.total || 0
  return [
    { key: 'product', label: 'Product Cost', value: aggregate.product, percent: total ? +(100 * (aggregate.product / total)).toFixed(2) : 0, class: 'bg-brand/80' },
    { key: 'shipping', label: 'Shipping', value: aggregate.shipping, percent: total ? +(100 * (aggregate.shipping / total)).toFixed(2) : 0, class: 'bg-emerald-500/70' },
    { key: 'customs', label: 'Customs Duty', value: aggregate.customs, percent: total ? +(100 * (aggregate.customs / total)).toFixed(2) : 0, class: 'bg-amber-400/80' },
    { key: 'taxes', label: 'Import Taxes', value: aggregate.taxes, percent: total ? +(100 * (aggregate.taxes / total)).toFixed(2) : 0, class: 'bg-rose-400/70' }
  ].filter((segment) => segment.value > 0)
})

const dashboardScenarioCards = computed(() => {
  return scenarioResult.value.projections
    .filter((projection) => projection.retailCurrency === dashboardCurrency.value)
    .map((projection) => ({
      markupId: projection.markupId,
      label: projection.markupLabel,
      profitMargin: projection.profitMarginPercent,
      totalRevenue: projection.totalRevenue,
      totalProfit: projection.totalProfit,
      totalCost: projection.totalCost,
      totalUnits: projection.totalUnits
    }))
})

const bestScenarioCard = computed(() => {
  const cards = dashboardScenarioCards.value
  if (!cards.length) return null
  return cards.reduce((best, current) => {
    if (!best) return current
    if (current.profitMargin > best.profitMargin) return current
    if (current.profitMargin === best.profitMargin && current.totalProfit > best.totalProfit) return current
    return best
  }, cards[0])
})

const productScenarioMatrix = computed(() => {
  const grouped = new Map<string, typeof scenarioResult.value.retailResults>()
  scenarioResult.value.retailResults.forEach((entry) => {
    if (entry.retailCurrency !== dashboardCurrency.value) return
    if (!grouped.has(entry.productId)) {
      grouped.set(entry.productId, [])
    }
    grouped.get(entry.productId)!.push(entry)
  })
  grouped.forEach((entries) => entries.sort((a, b) => a.markupPercent - b.markupPercent))
  return grouped
})

const productDashboardRows = computed(() => {
  return dashboardCosts.value.map((cost) => ({
    ...cost,
    scenarios: productScenarioMatrix.value.get(cost.productId) || []
  }))
})

const hasDashboardData = computed(() => aggregateCharges.value.total > 0)

const summaryCards = computed(() => {
  const aggregate = aggregateCharges.value
  const best = bestScenarioCard.value
  const combinedDuties = aggregate.shipping + aggregate.customs + aggregate.taxes
  const total = aggregate.total || 1
  return [
    {
      key: 'total',
      title: 'Total Landed Cost',
      value: formatCurrency(aggregate.total, dashboardCurrency.value),
      detail: `${aggregate.units} units`
    },
    {
      key: 'product-share',
      title: 'Product Cost Share',
      value: `${((aggregate.product / total) * 100 || 0).toFixed(1)}%`,
      detail: formatCurrency(aggregate.product, dashboardCurrency.value)
    },
    {
      key: 'duties-share',
      title: 'Shipping & Duties',
      value: `${((combinedDuties / total) * 100 || 0).toFixed(1)}%`,
      detail: formatCurrency(combinedDuties, dashboardCurrency.value)
    },
    {
      key: 'best-margin',
      title: best ? `${best.label} Margin` : 'Best Margin',
      value: best ? `${best.profitMargin.toFixed(1)}%` : '0%',
      detail: best ? formatCurrency(best.totalProfit, dashboardCurrency.value) : 'Awaiting data'
    }
  ]
})

</script>

<template>
  <div class="space-y-12">
    <!-- Dashboard Visualization -->
    <section class="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20">
      <header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="space-y-2">
          <h2 class="text-2xl font-semibold text-slate-100">Import Cost Dashboard</h2>
        <p class="text-sm text-slate-400">
            Visualize landed costs, markup performance, and per-product profit in real time.
        </p>
        </div>
      <div class="flex flex-wrap items-center gap-3">
          <label class="text-xs uppercase tracking-[0.3em] text-slate-400">Display currency</label>
          <select
            v-model="dashboardCurrency"
            class="rounded-2xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          >
            <option v-for="code in availableDashboardCurrencies" :key="code" :value="code">
              {{ code }}
            </option>
          </select>
        </div>
      </header>

      <div v-if="hasDashboardData" class="space-y-6">
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="card in summaryCards"
            :key="card.key"
            class="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
          >
            <p class="text-xs uppercase tracking-[0.3em] text-slate-400">{{ card.title }}</p>
            <p class="mt-2 text-2xl font-semibold text-slate-100">{{ card.value }}</p>
            <p class="text-xs text-slate-500">{{ card.detail }}</p>
          </article>
        </div>

        <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <header class="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 class="text-sm font-semibold text-slate-200">Cost Breakdown</h3>
              <p class="text-xs text-slate-400">Shares of landed cost across product, freight, customs, and taxes.</p>
            </div>
            <p class="text-xs text-slate-400">{{ formatCurrency(aggregateCharges.total, dashboardCurrency) }}</p>
          </header>
          <div class="mt-4 space-y-4">
            <div class="flex h-3 w-full overflow-hidden rounded-full border border-white/10 bg-white/5">
              <span
                v-for="segment in chargeSegments"
                :key="segment.key"
                class="h-full"
                :class="segment.class"
                :style="{ width: `${segment.percent}%` }"
                :title="`${segment.label}: ${segment.percent.toFixed(1)}%`"
              ></span>
            </div>
            <dl class="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <div v-for="segment in chargeSegments" :key="`legend-${segment.key}`" class="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <dt class="text-xs uppercase tracking-[0.3em] text-slate-400">{{ segment.label }}</dt>
                <dd class="text-sm font-semibold text-slate-100">{{ formatCurrency(segment.value, dashboardCurrency) }}</dd>
                <p class="text-[11px] text-slate-500">{{ segment.percent.toFixed(1) }}%</p>
              </div>
            </dl>
          </div>
        </div>

        <div class="space-y-3">
          <header class="flex flex-col gap-1">
            <h3 class="text-sm font-semibold text-slate-200">Markup Scenarios</h3>
            <p class="text-xs text-slate-400">Marginal performance across each markup in {{ dashboardCurrency }}.</p>
          </header>
          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="scenario in dashboardScenarioCards"
              :key="`scenario-${scenario.markupId}`"
              class="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
            >
              <div class="flex items-center justify-between">
                <h4 class="text-base font-semibold text-slate-100">{{ scenario.label }}</h4>
                <span class="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
                  {{ scenario.totalUnits }} units
                </span>
              </div>
              <p class="mt-2 text-xl font-semibold" :class="marginClass(scenario.profitMargin)">
                {{ scenario.profitMargin.toFixed(1) }}% margin
              </p>
              <div class="mt-3 grid gap-2 text-xs text-slate-400">
                <div class="flex items-center justify-between">
                  <span>Total revenue</span>
                  <span class="font-medium text-slate-200">{{ formatCurrency(scenario.totalRevenue, dashboardCurrency) }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span>Total profit</span>
                  <span class="font-medium text-slate-200">{{ formatCurrency(scenario.totalProfit, dashboardCurrency) }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span>Total cost</span>
                  <span>{{ formatCurrency(scenario.totalCost, dashboardCurrency) }}</span>
                </div>
              </div>
              <p
                v-if="bestScenarioCard && bestScenarioCard.markupId === scenario.markupId"
                class="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-300"
              >
                <span aria-hidden="true">★</span> Best performing markup
              </p>
            </article>
          </div>
        </div>

        <div class="space-y-3">
          <header class="flex flex-col gap-1">
            <h3 class="text-sm font-semibold text-slate-200">Per Product Insights</h3>
            <p class="text-xs text-slate-400">Landed cost mix and profit outcomes for each SKU.</p>
          </header>
          <div class="grid gap-4 lg:grid-cols-2">
            <article
              v-for="product in productDashboardRows"
              :key="`product-dashboard-${product.productId}`"
              class="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4"
            >
              <div class="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <h4 class="text-base font-semibold text-slate-100">{{ product.name }}</h4>
                  <p class="text-xs uppercase tracking-[0.3em] text-slate-400">{{ product.quantity }} units</p>
                </div>
                <div class="flex items-center gap-2 text-xs text-slate-400">
                  <span>Landed / unit</span>
                  <span class="text-sm font-semibold text-slate-100">{{ formatCurrency(product.perUnit.total, dashboardCurrency) }}</span>
                </div>
              </div>

              <div class="space-y-3">
                <div class="flex h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/5">
                  <span
                    v-for="segment in product.segments"
                    :key="segment.key"
                    class="h-full"
                    :class="segment.class"
                    :style="{ width: `${segment.percent}%` }"
                    :title="`${segment.label}: ${segment.percent.toFixed(1)}%`
                    "
                  ></span>
                </div>
                <dl class="grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
                  <div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <dt>Product</dt>
                    <dd class="text-slate-200">{{ formatCurrency(product.perUnit.product, dashboardCurrency) }}</dd>
                  </div>
                  <div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <dt>Shipping</dt>
                    <dd class="text-slate-200">{{ formatCurrency(product.perUnit.shipping, dashboardCurrency) }}</dd>
                  </div>
                  <div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <dt>Customs</dt>
                    <dd class="text-slate-200">{{ formatCurrency(product.perUnit.customs, dashboardCurrency) }}</dd>
                  </div>
                  <div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <dt>Taxes</dt>
                    <dd class="text-slate-200">{{ formatCurrency(product.perUnit.taxes, dashboardCurrency) }}</dd>
                  </div>
                </dl>
              </div>

              <div class="space-y-2">
                <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Markup projections</p>
                <div v-if="product.scenarios.length" class="space-y-2">
                  <div
                    v-for="scenario in product.scenarios"
                    :key="`${product.productId}-${scenario.markupId}`"
                    class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300"
                  >
                    <div class="flex items-center gap-2 text-slate-200">
                      <span class="font-semibold text-slate-100">{{ scenario.markupLabel }}</span>
                      <span class="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-400">
                        {{ scenario.formatted?.retailPrice || formatCurrency(scenario.retailPricePerUnit, scenario.retailCurrency) }}
                      </span>
                    </div>
                    <div class="text-right">
                      <p :class="marginClass(scenario.profitMarginPercent)">{{ scenario.profitMarginPercent.toFixed(1) }}%</p>
                      <p class="text-[11px] text-slate-400">Profit {{ scenario.formatted?.profitPerUnit || formatCurrency(scenario.profitPerUnit, scenario.retailCurrency) }}</p>
                    </div>
                  </div>
                </div>
                <p v-else class="rounded-xl border border-dashed border-white/15 bg-slate-900/40 px-3 py-2 text-[11px] text-slate-500">
                  Add markup data to see detailed projections.
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>

      <div v-else class="rounded-2xl border border-dashed border-white/15 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
        <p class="font-medium text-slate-200">Visualize your landed costs and margins</p>
        <p class="mt-2">Add supplier pricing, freight, and markup data to activate the live dashboard.</p>
      </div>
    </section>

    <!-- Product Input Section -->
    <section class="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20">
      <header class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-slate-100">Product Selection</h2>
        <p class="text-sm text-slate-400">
            Add every product variant you plan to import. Adjust supplier currency, unit cost, and order quantity.
        </p>
        </div>
        <div class="flex flex-wrap gap-2">
        <button
          type="button"
            class="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-brand-accent hover:text-brand-accent"
            @click="handleResetDefaults"
        >
            Reset to defaults
        </button>
        <button
          type="button"
            class="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-brand-accent hover:text-brand-accent"
            @click="handleClearProducts"
        >
            Clear list
        </button>
        <button
          type="button"
            class="rounded-2xl bg-gradient-to-br from-brand to-brand-accent px-4 py-2 text-sm font-medium text-white shadow-glow transition hover:shadow-lg"
            @click="handleAddProduct"
        >
            Add product
        </button>
      </div>
      </header>

      <div class="space-y-4">
        <div
          v-for="product in products"
          :key="product.id"
          class="grid gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:grid-cols-[2fr,repeat(5,minmax(0,1fr)),auto]"
        >
          <div class="flex flex-col gap-2">
            <label class="text-xs uppercase tracking-[0.2em] text-slate-400">Product name</label>
            <input
              :value="product.name"
              class="rounded-2xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="e.g., 40x40cm, 800gsm"
              @input="handleProductUpdate(product, 'name', ($event.target as HTMLInputElement).value)"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs uppercase tracking-[0.2em] text-slate-400">Supplier currency</label>
            <select
              :value="product.supplierCurrency"
              class="rounded-2xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              @change="handleProductUpdate(product, 'supplierCurrency', ($event.target as HTMLSelectElement).value)"
            >
              <option v-for="code in supplierCurrencyOptions" :key="code" :value="code">{{ code }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs uppercase tracking-[0.2em] text-slate-400">Unit price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              :value="product.unitPrice"
              class="rounded-2xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              @input="handleNumberInput(product, 'unitPrice', ($event.target as HTMLInputElement).value)"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs uppercase tracking-[0.2em] text-slate-400">Quantity</label>
            <input
              type="number"
              min="1"
              step="1"
              :value="product.quantity"
              class="rounded-2xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              @input="handleQuantityInput(product, ($event.target as HTMLInputElement).value)"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs uppercase tracking-[0.2em] text-slate-400">Shipping / unit</label>
            <input
              type="number"
              min="0"
              step="0.01"
              :value="product.shippingPerUnit ?? ''"
              class="rounded-2xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="Override"
              @input="handleNumberInput(product, 'shippingPerUnit', ($event.target as HTMLInputElement).value)"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs uppercase tracking-[0.2em] text-slate-400">Shipping currency</label>
            <select
              :value="product.shippingCurrency || product.supplierCurrency"
              class="rounded-2xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              @change="handleProductUpdate(product, 'shippingCurrency', ($event.target as HTMLSelectElement).value)"
            >
              <option v-for="code in supplierCurrencyOptions" :key="code" :value="code">{{ code }}</option>
            </select>
          </div>
          <div class="flex items-start justify-end">
            <div class="flex flex-col items-end gap-2">
            <button
              type="button"
                class="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.28em] text-slate-300 transition hover:border-emerald-400/70 hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="!product.name?.trim() || productIsFavorited(product)"
                @click="handleAddFavorite(product)"
            >
              Save to library
            </button>
            <button
              type="button"
                class="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.28em] text-slate-300 transition hover:border-rose-400/80 hover:text-rose-300"
                @click="store.removeProduct(product.id)"
            >
                Remove
            </button>
          </div>
        </div>
          <details class="md:col-span-full rounded-2xl border border-dashed border-white/15 bg-slate-900/40 p-4">
            <summary class="cursor-pointer text-xs uppercase tracking-[0.28em] text-slate-400">
              Advanced options
            </summary>
            <div class="mt-4 grid gap-4 md:grid-cols-4">
              <div class="flex flex-col gap-2">
                <label class="text-xs uppercase tracking-[0.2em] text-slate-400">Customs override %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  :value="product.customsPercentOverride ?? ''"
                  class="rounded-2xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  placeholder="Use global"
                  @input="handleNumberInput(product, 'customsPercentOverride', ($event.target as HTMLInputElement).value)"
                />
      </div>
              <div class="flex flex-col gap-2">
                <label class="text-xs uppercase tracking-[0.2em] text-slate-400">Import tax override %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  :value="product.importTaxPercentOverride ?? ''"
                  class="rounded-2xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  placeholder="Use global"
                  @input="handleNumberInput(product, 'importTaxPercentOverride', ($event.target as HTMLInputElement).value)"
                />
              </div>
              <div class="flex flex-col gap-2 md:col-span-2">
                <label class="text-xs uppercase tracking-[0.2em] text-slate-400">Notes</label>
                <textarea
                  :value="product.notes || ''"
                  class="h-20 rounded-2xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  placeholder="Add sourcing details, supplier info, lead times…"
                  @input="handleProductUpdate(product, 'notes', ($event.target as HTMLTextAreaElement).value)"
                />
              </div>
            </div>
          </details>
        </div>
        <p v-if="!products.length" class="rounded-2xl border border-dashed border-white/10 bg-slate-900/60 p-6 text-center text-sm text-slate-400">
          No products yet — add at least one to start calculating landed costs and retail pricing.
        </p>
      </div>
    </section>

    <!-- Library & Bulk Upload -->
    <section class="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20">
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <header class="space-y-2">
            <h3 class="text-xl font-semibold text-slate-100">Bulk Upload Products</h3>
            <p class="text-sm text-slate-400">
              Import a list of products via CSV. Include columns:
              <code class="rounded bg-slate-800/70 px-1 py-0.5 text-[11px] text-slate-200">name, unitPrice, quantity, supplierCurrency, shippingPerUnit, shippingCurrency, notes</code>.
            </p>
          </header>
          <div class="space-y-3">
            <input
              ref="bulkInputRef"
              type="file"
              accept=".csv,text/csv"
              class="block w-full cursor-pointer rounded-2xl border border-dashed border-white/20 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              @change="handleBulkUpload"
            />
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-brand-accent hover:text-brand-accent"
                @click="downloadBulkTemplate"
              >
                Download template
              </button>
            </div>
            <p v-if="bulkImportMessage" class="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
              {{ bulkImportMessage }}
            </p>
            <p v-if="bulkImportError" class="rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
              {{ bulkImportError }}
            </p>
          </div>
        </div>

        <div class="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <header class="space-y-2">
            <h3 class="text-xl font-semibold text-slate-100">Product Library</h3>
            <p class="text-sm text-slate-400">
              Save frequently ordered items for quick reuse. Click "Save to library" on any product row. Saved entries appear below.
            </p>
          </header>
          <div v-if="favorites.length" class="space-y-3">
            <article
              v-for="favorite in favorites"
              :key="favorite.id"
              class="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p class="text-base font-semibold text-slate-100">{{ favorite.name }}</p>
                <p class="text-xs uppercase tracking-[0.28em] text-slate-400">
                  {{ formatCurrency(favorite.unitPrice, favorite.supplierCurrency) }} · {{ favorite.quantity }} units
                </p>
                <p v-if="favorite.notes" class="mt-1 text-xs text-slate-400">{{ favorite.notes }}</p>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  type="button"
                  class="rounded-2xl bg-gradient-to-br from-brand to-brand-accent px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:shadow-glow"
                  @click="handleUseFavorite(favorite.id)"
                >
                  Add to calculator
                </button>
                <button
                  type="button"
                  class="rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.28em] text-slate-300 transition hover:border-rose-400/70 hover:text-rose-200"
                  @click="handleRemoveFavorite(favorite.id)"
                >
                  Remove
                </button>
              </div>
            </article>
          </div>
          <p v-else class="rounded-2xl border border-dashed border-white/15 bg-slate-900/50 p-4 text-sm text-slate-400">
            No saved products yet. Save your first favourite using the button in the product table.
          </p>
        </div>
      </div>
    </section>

    <!-- Import Cost Calculator -->
    <section class="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20">
      <header class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-slate-100">Import Cost Assumptions</h2>
          <p class="text-sm text-slate-400">Set your shipping cost, duties, and taxes. All calculations update instantly.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <label class="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-300">
            Base currency
            <select
              :value="assumptions.baseCurrency"
              class="rounded-xl border border-white/10 bg-slate-900 px-3 py-1 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-accent"
              @change="store.setBaseCurrency(($event.target as HTMLSelectElement).value as CurrencyCode)"
            >
              <option v-for="code in supplierCurrencyOptions" :key="code" :value="code">{{ code }}</option>
            </select>
          </label>
        <button
          type="button"
            class="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-brand-accent hover:text-brand-accent"
            @click="toggleAssumptions"
        >
            {{ expandedAssumptions ? 'Hide details' : 'Show details' }}
        </button>
        </div>
      </header>

      <div class="grid gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4 md:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-1">
          <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Total investment</p>
          <p class="text-2xl font-semibold text-slate-100">
            {{ formatCurrency(totalInvestment, assumptions.baseCurrency) }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Total units</p>
          <p class="text-2xl font-semibold text-slate-100">{{ totalUnits }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Exchange rate</p>
          <div class="flex items-center gap-2 text-sm text-slate-300">
            <span>1 USD =</span>
            <input
              type="number"
              min="0"
              step="0.01"
              v-model.number="usdRateForBase"
              class="w-24 rounded-xl border border-white/10 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-accent"
            />
            <span>{{ assumptions.baseCurrency }}</span>
          </div>
        </div>
        <div class="space-y-1">
          <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Rates synced</p>
          <div class="flex items-center gap-2 text-sm text-slate-300">
            <span>{{ lastRateSync ? new Date(lastRateSync).toLocaleString() : 'Not synced' }}</span>
            <button
              type="button"
              class="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-brand-accent hover:text-brand-accent"
              :disabled="syncingRates"
              @click="handleRefreshRates"
            >
              {{ syncingRates ? 'Syncing…' : 'Refresh' }}
            </button>
          </div>
        </div>
      </div>

      <transition name="fade">
        <div v-if="expandedAssumptions" class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div class="flex flex-col gap-2">
            <label class="text-xs uppercase tracking-[0.3em] text-slate-400" title="Cost per unit for freight, shipping, or logistics add-ons applied to every product unless overridden.">
              Shipping cost / unit
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
              :value="assumptions.shippingPerUnit"
              class="rounded-2xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              @input="handleAssumptionInput('shippingPerUnit', ($event.target as HTMLInputElement).value)"
                />
              </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs uppercase tracking-[0.3em] text-slate-400" title="Average customs duty rate applied to the declared unit value.">
                  Customs duty %
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
              :value="assumptions.customsPercent"
              class="rounded-2xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              @input="handleAssumptionInput('customsPercent', ($event.target as HTMLInputElement).value)"
                />
              </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs uppercase tracking-[0.3em] text-slate-400" title="Importer handling fees, GST/VAT equivalents, or other taxes charged on top of customs.">
              Import taxes %
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
              :value="assumptions.importTaxPercent"
              class="rounded-2xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              @input="handleAssumptionInput('importTaxPercent', ($event.target as HTMLInputElement).value)"
                />
              </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs uppercase tracking-[0.3em] text-slate-400" title="Add optional insurance percent to cover marine or cargo protection.">
              Insurance %
                </label>
                <input
                  type="number"
                  min="0"
              max="100"
              step="0.1"
              :value="assumptions.insurancePercent || 0"
              class="rounded-2xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              @input="handleAssumptionInput('insurancePercent', ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
      </transition>
    </section>

    <!-- Landed Cost Breakdown -->
    <section class="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20">
      <header class="space-y-2">
        <h2 class="text-2xl font-semibold text-slate-100">Landed Cost Breakdown</h2>
        <p class="text-sm text-slate-400">Per-product cost structure with shipping, duties, and taxes converted to your base currency.</p>
      </header>

      <div class="overflow-x-auto">
        <table class="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr class="text-left text-xs uppercase tracking-[0.28em] text-slate-400">
              <th class="rounded-l-2xl bg-slate-900/60 px-4 py-3">Product</th>
              <th class="bg-slate-900/60 px-4 py-3">Unit cost</th>
              <th class="bg-slate-900/60 px-4 py-3">Shipping</th>
              <th class="bg-slate-900/60 px-4 py-3">Customs</th>
              <th class="bg-slate-900/60 px-4 py-3">Taxes</th>
              <th class="bg-slate-900/60 px-4 py-3">Total / unit</th>
              <th class="rounded-r-2xl bg-slate-900/60 px-4 py-3">Total landed</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="cost in scenarioResult.costs"
              :key="cost.productId"
              class="text-sm text-slate-200 transition hover:bg-slate-900/40"
            >
              <td class="rounded-l-2xl px-4 py-3">
                <div class="font-medium text-slate-100">{{ cost.productName }}</div>
                <div class="text-xs text-slate-400">{{ cost.quantity }} units</div>
              </td>
              <td class="px-4 py-3">
                <div>{{ formatCurrency(cost.unitPriceOriginal, cost.supplierCurrency) }}</div>
                <div class="text-xs text-slate-400">
                  {{ formatCurrency(cost.unitPriceInBase, cost.baseCurrency) }}
                </div>
              </td>
              <td class="px-4 py-3">
                <div>{{ formatCurrency(cost.shippingPerUnit, cost.supplierCurrency) }}</div>
                <div class="text-xs text-slate-400">
                  {{ formatCurrency(cost.shippingPerUnitBase, cost.baseCurrency) }}
                </div>
              </td>
              <td class="px-4 py-3">
                <div>{{ formatCurrency(cost.customsPerUnit, cost.supplierCurrency) }}</div>
                <div class="text-xs text-slate-400">
                  {{ formatCurrency(cost.customsPerUnitBase, cost.baseCurrency) }}
                </div>
              </td>
              <td class="px-4 py-3">
                <div>{{ formatCurrency(cost.taxesPerUnit, cost.supplierCurrency) }}</div>
                <div class="text-xs text-slate-400">
                  {{ formatCurrency(cost.taxesPerUnitBase, cost.baseCurrency) }}
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="font-semibold text-slate-100">
                  {{ formatCurrency(cost.totalPerUnitBase, cost.baseCurrency) }}
                </div>
                <div class="text-xs text-slate-400">
                  {{ formatCurrency(cost.totalPerUnit, cost.supplierCurrency) }}
                </div>
              </td>
              <td class="rounded-r-2xl px-4 py-3 font-semibold text-slate-100">
                {{ formatCurrency(cost.totalCostBase, cost.baseCurrency) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Retail Pricing Calculator -->
    <section class="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20">
      <header class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-slate-100">Retail Pricing Strategy</h2>
          <p class="text-sm text-slate-400">
            Explore markup presets or add your own to see final retail prices, unit profit, and total profit.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <label class="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-300">
            Target market
          <input
              v-model="targetMarket"
            type="text"
              class="rounded-xl border border-white/10 bg-slate-900 px-3 py-1 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-accent"
          />
          </label>
          <div class="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-300">
            Retail currency
          <div class="flex items-center gap-2">
              <div
                v-for="code in retailCurrencies"
                :key="code"
                class="group relative inline-flex items-center"
              >
            <button
              type="button"
                  class="rounded-xl px-3 py-1 text-xs font-medium transition"
                  :class="code === activeRetailCurrency
                    ? 'bg-gradient-to-br from-brand to-brand-accent text-white shadow-glow'
                    : 'border border-white/10 bg-white/5 text-slate-300 hover:border-brand-accent hover:text-brand-accent'"
                  @click="selectRetailCurrency(code)"
                >
                  {{ code }}
                </button>
                <button
                  v-if="code !== assumptions.baseCurrency"
                  type="button"
                  class="ml-1 hidden rounded-full border border-white/10 bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.3em] text-slate-300 transition group-hover:flex hover:border-rose-400/70 hover:text-rose-200"
                  @click.stop="removeRetailCurrency(code)"
                >
                  ×
            </button>
              </div>
              <select
                v-if="availableRetailCurrencyOptions.length"
                class="rounded-xl border border-dashed border-white/20 bg-slate-900 px-3 py-1 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                @change="handleAddRetailCurrency"
              >
                <option value="">Add currency…</option>
                <option v-for="code in availableRetailCurrencyOptions" :key="code" :value="code">
                  {{ code }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="markup in allMarkups"
          :key="markup.id"
          type="button"
          class="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-brand-accent hover:text-brand-accent"
          :class="DEFAULT_MARKUP_IDS.has(markup.id) ? 'opacity-100' : 'opacity-90 hover:opacity-100'"
        >
          <span>{{ markup.label }}</span>
          <span class="text-xs uppercase tracking-[0.2em] text-slate-400">{{ markupDisplayPercent(markup.percentage) }}%</span>
          <button
            v-if="!DEFAULT_MARKUP_IDS.has(markup.id)"
            type="button"
            class="rounded-full border border-transparent px-2 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-400 transition hover:border-rose-400/60 hover:text-rose-300"
            @click.stop="removeMarkup(markup.id)"
          >
            Remove
          </button>
        </button>
        <div class="flex items-center gap-2 rounded-2xl border border-dashed border-white/20 bg-slate-900/70 px-4 py-2">
          <input
            v-model.number="customMarkupInput"
            type="number"
            min="1"
            step="1"
            placeholder="Custom %"
            class="w-24 rounded-xl border border-white/10 bg-slate-900 px-3 py-1 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-accent"
          />
          <button
            type="button"
            class="rounded-2xl bg-gradient-to-br from-brand to-brand-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:shadow-glow"
            @click="handleCustomMarkupAdd"
          >
            Add
        </button>
        </div>
      </div>

      <div class="space-y-4">
        <div
          v-for="product in products"
          :key="product.id"
          class="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4"
        >
          <div class="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 class="text-lg font-semibold text-slate-100">{{ product.name }}</h3>
              <p class="text-xs uppercase tracking-[0.28em] text-slate-400">
                {{ product.quantity }} units · {{ product.supplierCurrency }}
              </p>
            </div>
            <div class="flex items-center gap-3 text-xs text-slate-400">
              <span>Landed cost / unit:</span>
              <span class="text-sm font-semibold text-slate-100">
                {{
                  formatCurrency(
                    scenarioResult.costs.find((cost) => cost.productId === product.id)?.totalPerUnitBase || 0,
                    assumptions.baseCurrency
                  )
                }}
              </span>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full border-separate border-spacing-y-1 text-sm">
              <thead>
                <tr class="text-xs uppercase tracking-[0.28em] text-slate-400">
                  <th class="rounded-l-xl bg-slate-900/70 px-3 py-2 text-left">Markup</th>
                  <th class="bg-slate-900/70 px-3 py-2 text-right">Retail price / unit</th>
                  <th class="bg-slate-900/70 px-3 py-2 text-right">Profit / unit</th>
                  <th class="bg-slate-900/70 px-3 py-2 text-right">Total revenue</th>
                  <th class="rounded-r-xl bg-slate-900/70 px-3 py-2 text-right">Total profit</th>
            </tr>
          </thead>
              <tbody>
                <tr
                  v-for="result in retailResultsForActiveCurrency.filter((item) => item.productId === product.id)"
                  :key="`${result.productId}-${result.markupId}-${result.retailCurrency}`"
                  class="text-slate-200 transition hover:bg-slate-900/40"
                >
                  <td class="rounded-l-xl px-3 py-2">
                    <div class="font-medium text-slate-100">{{ result.markupLabel }}</div>
                    <div class="text-xs uppercase tracking-[0.28em] text-slate-400">
                      {{ formatPercent(result.profitMarginPercent) }} margin
                </div>
              </td>
                  <td class="px-3 py-2 text-right font-medium text-slate-100">
                    {{ result.formatted?.retailPrice || formatCurrency(result.retailPricePerUnit, result.retailCurrency) }}
              </td>
                  <td class="px-3 py-2 text-right">
                    {{ result.formatted?.profitPerUnit || formatCurrency(result.profitPerUnit, result.retailCurrency) }}
                  </td>
                  <td class="px-3 py-2 text-right">
                    {{ result.formatted?.totalRevenue || formatCurrency(result.totalRevenue, result.retailCurrency) }}
                  </td>
                  <td class="rounded-r-xl px-3 py-2 text-right font-semibold text-slate-100">
                    {{ result.formatted?.totalProfit || formatCurrency(result.totalProfit, result.retailCurrency) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
              </div>
      </div>
    </section>

    <!-- Templates & Comparisons -->
    <section class="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20">
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
              <header class="space-y-2">
            <h3 class="text-xl font-semibold text-slate-100">Saved Templates</h3>
            <p class="text-sm text-slate-400">
              Capture recurring sourcing scenarios (products, assumptions, markups) and reload them anytime.
            </p>
              </header>
          <div class="grid gap-3 md:grid-cols-[2fr,1fr]">
                  <input
              v-model="templateName"
              type="text"
              placeholder="Template name"
              class="rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
                <button
                  type="button"
              class="rounded-2xl bg-gradient-to-br from-brand to-brand-accent px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="!templateName.trim()"
              @click="handleSaveTemplate"
                >
              Save template
                </button>
              </div>
          <textarea
            v-model="templateDescription"
            placeholder="Short description (optional)"
            class="h-20 rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          ></textarea>

          <div v-if="templates.length" class="space-y-3">
            <article
              v-for="template in templates"
              :key="template.id"
              class="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                <p class="text-base font-semibold text-slate-100">{{ template.name }}</p>
                <p class="text-xs uppercase tracking-[0.28em] text-slate-400">
                  {{ template.products.length }} products · Updated {{ new Date(template.updatedAt).toLocaleDateString() }}
                </p>
                <p v-if="template.description" class="mt-1 text-xs text-slate-400">{{ template.description }}</p>
                  </div>
              <div class="flex flex-wrap gap-2">
                    <button
                      type="button"
                  class="rounded-2xl bg-gradient-to-br from-brand to-brand-accent px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:shadow-glow"
                  @click="handleApplyTemplate(template.id, 'replace')"
                    >
                  Load
                    </button>
                    <button
                      type="button"
                  class="rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.28em] text-slate-300 transition hover:border-brand-accent hover:text-brand-accent"
                  @click="handleApplyTemplate(template.id, 'merge')"
                >
                  Merge
                </button>
                <button
                  type="button"
                  class="rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.28em] text-slate-300 transition hover:border-rose-400/70 hover:text-rose-200"
                  @click="handleDeleteTemplate(template.id)"
                >
                  Delete
                    </button>
                  </div>
            </article>
                </div>
          <p v-else class="rounded-2xl border border-dashed border-white/15 bg-slate-900/50 p-4 text-sm text-slate-400">
            No templates saved yet. Configure your scenario, give it a name, and click "Save template".
          </p>
            </div>

        <div class="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <header class="space-y-2">
            <h3 class="text-xl font-semibold text-slate-100">Comparison Scenarios</h3>
            <p class="text-sm text-slate-400">
              Save multiple sourcing strategies to compare investment and profitability side by side.
            </p>
              </header>
          <div class="grid gap-3 md:grid-cols-[2fr,1fr]">
                <input
              v-model="comparisonName"
                  type="text"
              placeholder="Comparison name"
              class="rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
                  <button
                    type="button"
              class="rounded-2xl bg-gradient-to-br from-brand to-brand-accent px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:shadow-lg"
              @click="handleCreateComparison"
                  >
              Save scenario
                  </button>
                </div>
          <textarea
            v-model="comparisonDescription"
            placeholder="Notes (optional)"
            class="h-20 rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          ></textarea>

          <div v-if="comparisonSnapshots.length" class="space-y-3">
            <article
              v-for="snapshot in comparisonSnapshots"
              :key="snapshot.id"
              class="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                <p class="text-base font-semibold text-slate-100">{{ snapshot.name }}</p>
                <p class="text-xs uppercase tracking-[0.28em] text-slate-400">
                  {{ snapshot.products.length }} products · Investment {{ formatCurrency(snapshot.totalInvestment, snapshot.baseCurrency) }}
                </p>
                <p v-if="snapshot.description" class="mt-1 text-xs text-slate-400">{{ snapshot.description }}</p>
                  </div>
              <div class="flex flex-wrap gap-2">
                    <button
                      type="button"
                  class="rounded-2xl bg-gradient-to-br from-brand to-brand-accent px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:shadow-glow"
                  @click="handleApplyComparison(snapshot.id)"
                    >
                  Apply
                    </button>
                    <button
                      type="button"
                  class="rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.28em] text-slate-300 transition hover:border-rose-400/70 hover:text-rose-200"
                  @click="handleDeleteComparison(snapshot.id)"
                    >
                      Delete
                    </button>
                  </div>
            </article>
                </div>
          <p v-else class="rounded-2xl border border-dashed border-white/15 bg-slate-900/50 p-4 text-sm text-slate-400">
            No comparison scenarios saved yet. Snapshot your current setup to start building a portfolio of sourcing options.
          </p>
              </div>
            </div>
    </section>

    <!-- History & Insights -->
    <section class="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20">
      <header class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-slate-100">History & Price Tracking</h2>
          <p class="text-sm text-slate-400">
            Capture landed cost snapshots over time to understand trends, supplier changes, or currency impacts.
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
                <button
                  type="button"
            class="rounded-2xl bg-gradient-to-br from-brand to-brand-accent px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:shadow-lg"
            @click="handleRecordSnapshot"
                >
            Record snapshot
                </button>
                      <button
                        type="button"
            class="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-rose-400/70 hover:text-rose-200"
            :disabled="!history.length"
            @click="handleClearHistory"
                      >
            Clear history
                      </button>
                    </div>
      </header>

      <div class="grid gap-6 lg:grid-cols-2">
        <div class="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <h3 class="text-lg font-semibold text-slate-100">Timeline</h3>
          <ul v-if="formattedHistory.length" class="space-y-3 text-sm text-slate-300">
            <li
              v-for="entry in formattedHistory.slice(0, 10)"
              :key="entry.id"
              class="rounded-2xl border border-white/10 bg-white/5 p-3"
            >
              <div class="flex items-center justify-between">
                <p class="text-sm font-semibold text-slate-100">{{ entry.label }}</p>
                <span class="text-xs text-slate-400">{{ entry.date }}</span>
                  </div>
              <p class="text-xs uppercase tracking-[0.28em] text-slate-400">
                {{ entry.quantity }} units · {{ formatCurrency(entry.landedCostPerUnit, entry.landedCostCurrency) }} per unit
              </p>
            </li>
          </ul>
          <p v-else class="rounded-2xl border border-dashed border-white/15 bg-slate-900/50 p-4 text-sm text-slate-400">
            No snapshots recorded yet. Capture one after adjusting assumptions or currency rates to compare later.
          </p>
                </div>

        <div class="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <h3 class="text-lg font-semibold text-slate-100">Per-Product History</h3>
          <div class="space-y-3 text-sm text-slate-300">
            <div
              v-for="product in products"
              :key="`history-${product.id}`"
              class="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
                    <div class="flex items-center justify-between">
                <p class="text-sm font-semibold text-slate-100">{{ product.name }}</p>
                <span class="text-xs text-slate-400">{{ historyForProduct(product.id).length }} entries</span>
                    </div>
              <ul class="mt-3 space-y-2 text-xs text-slate-400">
                <li
                  v-for="entry in historyForProduct(product.id).slice(0, 4)"
                  :key="entry.id"
                  class="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2"
                >
                  <span>{{ new Date(entry.timestamp).toLocaleDateString() }}</span>
                  <span>{{ formatCurrency(entry.landedCostPerUnit, entry.landedCostCurrency) }}/unit</span>
                </li>
                <li v-if="!historyForProduct(product.id).length" class="text-slate-500">
                  No history yet for this product.
                </li>
              </ul>
                    </div>
                    </div>
                  </div>
                </div>
    </section>

    <!-- Profit Projections -->
    <section class="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20">
      <header class="space-y-2">
        <h2 class="text-2xl font-semibold text-slate-100">Profit Projections</h2>
        <p class="text-sm text-slate-400">
          Combined totals for all products under each markup scenario. Use this to select the most profitable retail strategy.
        </p>
      </header>

      <div class="overflow-x-auto">
        <table class="min-w-full border-separate border-spacing-y-2 text-sm">
          <thead>
            <tr class="text-left text-xs uppercase tracking-[0.28em] text-slate-400">
              <th class="rounded-l-2xl bg-slate-900/60 px-4 py-3">Markup</th>
              <th class="bg-slate-900/60 px-4 py-3 text-right">Total revenue</th>
              <th class="bg-slate-900/60 px-4 py-3 text-right">Total cost</th>
              <th class="bg-slate-900/60 px-4 py-3 text-right">Total profit</th>
              <th class="rounded-r-2xl bg-slate-900/60 px-4 py-3 text-right">Margin</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="projection in scenarioResult.projections.filter((item) => item.retailCurrency === activeRetailCurrency)"
              :key="`${projection.markupId}-${projection.retailCurrency}`"
              class="text-slate-200 transition hover:bg-slate-900/40"
            >
              <td class="rounded-l-2xl px-4 py-3">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-semibold text-slate-100">
                    {{ projection.markupLabel }}
                  </span>
                  <span
                    class="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-300"
                  >
                    {{ profitBadgeMap[`${projection.markupId}-${projection.retailCurrency}`] || 'Margin' }}
                  </span>
                  <span
                    v-if="bestMarkups[activeRetailCurrency]?.markupId === projection.markupId"
                    class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L9 13.414l4.707-4.707z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Best margin
                  </span>
              </div>
                <div class="text-xs uppercase tracking-[0.28em] text-slate-400">{{ projection.totalUnits }} units</div>
              </td>
              <td class="px-4 py-3 text-right font-medium text-slate-100">
                {{ formatCurrency(projection.totalRevenue, projection.retailCurrency) }}
              </td>
              <td class="px-4 py-3 text-right text-slate-200">
                {{ formatCurrency(projection.totalCost, projection.retailCurrency) }}
              </td>
              <td class="px-4 py-3 text-right font-semibold text-slate-100">
                {{ formatCurrency(projection.totalProfit, projection.retailCurrency) }}
              </td>
              <td class="rounded-r-2xl px-4 py-3 text-right font-semibold" :class="marginClass(projection.profitMarginPercent)">
                {{ formatPercent(projection.profitMarginPercent) }}
              </td>
            </tr>
          </tbody>
        </table>
            </div>
    </section>

    <!-- Exports & Share -->
    <section class="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20">
      <header class="space-y-2">
        <h2 class="text-2xl font-semibold text-slate-100">Export & Share</h2>
        <p class="text-sm text-slate-400">Download the calculation or share highlights with your team.</p>
      </header>
      <div class="flex flex-wrap gap-3">
                  <button
                    type="button"
          class="rounded-2xl bg-gradient-to-br from-brand to-brand-accent px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="!products.length"
          @click="handleExportCsv"
                  >
          Download as CSV
                  </button>
                  <button
                    type="button"
          class="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-brand-accent hover:text-brand-accent disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="exportingPdf || !products.length"
          @click="handleExportPdf"
                  >
          {{ exportingPdf ? 'Exporting…' : 'Download as PDF' }}
                  </button>
        <button
          type="button"
          class="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-brand-accent hover:text-brand-accent"
          @click="handleCopySummary"
        >
          Copy summary
        </button>
                  </div>
      <div class="space-y-2 text-xs">
        <p v-if="exportStatus" class="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-emerald-200">
          {{ exportStatus }}
        </p>
        <p v-if="exportError" class="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-rose-200">
          {{ exportError }}
        </p>
                  </div>
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

