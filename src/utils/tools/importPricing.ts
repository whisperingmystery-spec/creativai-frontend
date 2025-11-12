import { formatCurrency, supportedCurrencies, type CurrencyCode } from '@/utils/currency'

export type ExchangeRateMap = Record<CurrencyCode, number>

export interface ImportProductInput {
  id: string
  name: string
  description?: string
  unitPrice: number
  quantity: number
  supplierCurrency: CurrencyCode
  tags?: string[]
  sku?: string
  notes?: string
  shippingPerUnit?: number
  shippingCurrency?: CurrencyCode
  customsPercentOverride?: number
  importTaxPercentOverride?: number
  leadDays?: number
  lastUpdated?: string
}

export interface ImportCostAssumptions {
  shippingPerUnit: number
  shippingCurrency: CurrencyCode
  customsPercent: number
  importTaxPercent: number
  insurancePercent?: number
  miscPerUnit?: number
  miscCurrency?: CurrencyCode
  baseCurrency: CurrencyCode
  applyOverrides?: boolean
}

export interface MarkupScenario {
  id: string
  label: string
  percentage: number
  isCustom?: boolean
  colorToken?: 'success' | 'warning' | 'danger' | 'info'
}

export interface ProductCostBreakdown {
  productId: string
  productName: string
  quantity: number
  baseCurrency: CurrencyCode
  supplierCurrency: CurrencyCode
  unitPriceOriginal: number
  unitPriceInBase: number
  shippingPerUnit: number
  shippingPerUnitBase: number
  customsPerUnit: number
  customsPerUnitBase: number
  taxesPerUnit: number
  taxesPerUnitBase: number
  insurancePerUnit: number
  insurancePerUnitBase: number
  miscPerUnit: number
  miscPerUnitBase: number
  totalPerUnit: number
  totalPerUnitBase: number
  totalCostOriginal: number
  totalCostBase: number
}

export interface RetailPricingResult {
  productId: string
  markupId: string
  markupLabel: string
  markupPercent: number
  retailCurrency: CurrencyCode
  retailPricePerUnit: number
  profitPerUnit: number
  totalRevenue: number
  totalProfit: number
  profitMarginPercent: number
  formatted?: {
    retailPrice: string
    profitPerUnit: string
    totalRevenue: string
    totalProfit: string
    profitMargin: string
  }
}

export interface ProfitProjectionSummary {
  markupId: string
  markupLabel: string
  markupPercent: number
  totalUnits: number
  totalRevenue: number
  totalCost: number
  totalProfit: number
  profitMarginPercent: number
  retailCurrency: CurrencyCode
}

export interface ProductHistoryEntry {
  id: string
  productId: string
  timestamp: string
  productName?: string
  unitPrice: number
  quantity: number
  landedCostPerUnit: number
  landedCostCurrency: CurrencyCode
  notes?: string
}

export interface ProductTemplate {
  id: string
  name: string
  description?: string
  products: ImportProductInput[]
  assumptions: ImportCostAssumptions
  markups: MarkupScenario[]
  createdAt: string
  updatedAt: string
}

export interface ComparisonScenario {
  id: string
  name: string
  description?: string
  products: ImportProductInput[]
  assumptions: ImportCostAssumptions
  notes?: string
  createdAt: string
}

export const DEFAULT_EXCHANGE_RATES: ExchangeRateMap = {
  USD: 1,
  INR: 83.0,
  EUR: 0.92,
  GBP: 0.8,
  AUD: 1.52,
  CAD: 1.36,
  JPY: 151.0
}

export const DEFAULT_COST_ASSUMPTIONS: ImportCostAssumptions = {
  shippingPerUnit: 0.1,
  shippingCurrency: 'USD',
  customsPercent: 10,
  importTaxPercent: 5,
  insurancePercent: 0,
  miscPerUnit: 0,
  miscCurrency: 'USD',
  baseCurrency: 'INR'
}

export const DEFAULT_MARKUP_SCENARIOS: MarkupScenario[] = [
  { id: 'markup-150', label: '150%', percentage: 1.5, colorToken: 'warning' },
  { id: 'markup-200', label: '200%', percentage: 2, colorToken: 'info' },
  { id: 'markup-250', label: '250%', percentage: 2.5, colorToken: 'success' },
  { id: 'markup-300', label: '300%', percentage: 3, colorToken: 'success' }
]

export const SAMPLE_PRODUCTS: ImportProductInput[] = [
  {
    id: 'sample-1',
    name: 'Luxury Cotton Towel (40x40cm, 800gsm)',
    description: 'Premium bath towel imported from Turkey',
    unitPrice: 3.8,
    quantity: 200,
    supplierCurrency: 'USD',
    shippingPerUnit: 0.12,
    tags: ['textiles', 'bath']
  },
  {
    id: 'sample-2',
    name: 'Aromatherapy Scented Candle',
    unitPrice: 2.1,
    quantity: 150,
    supplierCurrency: 'USD',
    shippingPerUnit: 0.08,
    tags: ['home-fragrance']
  }
]

const round2 = (value: number): number => (Number.isFinite(value) ? Math.round(value * 100) / 100 : 0)

const clampRate = (value: number | undefined, fallback: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return fallback
  return value
}

export const ensureExchangeRates = (override?: Partial<ExchangeRateMap>): ExchangeRateMap => {
  const merged: ExchangeRateMap = { ...DEFAULT_EXCHANGE_RATES, ...(override || {}) }
  supportedCurrencies.forEach((code) => {
    if (typeof merged[code] !== 'number' || merged[code] <= 0) {
      merged[code] = DEFAULT_EXCHANGE_RATES[code] ?? 1
    }
  })
  return merged
}

export const convertCurrency = (
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: ExchangeRateMap
): number => {
  if (!Number.isFinite(amount)) return 0
  if (from === to) return round2(amount)
  const safeRates = ensureExchangeRates(rates)
  const fromRate = safeRates[from]
  const toRate = safeRates[to]
  if (!fromRate || !toRate) return round2(amount)
  const amountInUsd = from === 'USD' ? amount : amount / fromRate
  const converted = to === 'USD' ? amountInUsd : amountInUsd * toRate
  return round2(converted)
}

export const resolveShippingPerUnit = (product: ImportProductInput, assumptions: ImportCostAssumptions): number => {
  if (typeof product.shippingPerUnit === 'number') return clampRate(product.shippingPerUnit, assumptions.shippingPerUnit)
  return clampRate(assumptions.shippingPerUnit, 0)
}

export const resolveShippingCurrency = (product: ImportProductInput, assumptions: ImportCostAssumptions): CurrencyCode => {
  return product.shippingCurrency || assumptions.shippingCurrency || product.supplierCurrency
}

export const resolveCustomsPercent = (product: ImportProductInput, assumptions: ImportCostAssumptions): number => {
  if (assumptions.applyOverrides && typeof product.customsPercentOverride === 'number') {
    return clampRate(product.customsPercentOverride, assumptions.customsPercent)
  }
  return clampRate(assumptions.customsPercent, 0)
}

export const resolveTaxPercent = (product: ImportProductInput, assumptions: ImportCostAssumptions): number => {
  if (assumptions.applyOverrides && typeof product.importTaxPercentOverride === 'number') {
    return clampRate(product.importTaxPercentOverride, assumptions.importTaxPercent)
  }
  return clampRate(assumptions.importTaxPercent, 0)
}

export const calculateProductCost = (
  product: ImportProductInput,
  assumptions: ImportCostAssumptions,
  rates: ExchangeRateMap
): ProductCostBreakdown => {
  const baseCurrency = assumptions.baseCurrency
  const unitPrice = clampRate(product.unitPrice, 0)
  const quantity = Math.max(0, Math.floor(product.quantity))
  const shippingPerUnit = resolveShippingPerUnit(product, assumptions)
  const customsPercent = resolveCustomsPercent(product, assumptions)
  const importTaxPercent = resolveTaxPercent(product, assumptions)
  const insurancePercent = clampRate(assumptions.insurancePercent, 0)
  const miscPerUnit = clampRate(assumptions.miscPerUnit, 0)

  const customsPerUnit = round2(unitPrice * (customsPercent / 100))
  const taxesPerUnit = round2(unitPrice * (importTaxPercent / 100))
  const insurancePerUnit = round2(unitPrice * (insurancePercent / 100))

  const shippingCurrency = resolveShippingCurrency(product, assumptions)
  const miscCurrency = assumptions.miscCurrency || assumptions.shippingCurrency || product.supplierCurrency

  const unitPriceBase = convertCurrency(unitPrice, product.supplierCurrency, baseCurrency, rates)
  const shippingBase = convertCurrency(shippingPerUnit, shippingCurrency, baseCurrency, rates)
  const customsBase = convertCurrency(customsPerUnit, product.supplierCurrency, baseCurrency, rates)
  const taxesBase = convertCurrency(taxesPerUnit, product.supplierCurrency, baseCurrency, rates)
  const insuranceBase = convertCurrency(insurancePerUnit, product.supplierCurrency, baseCurrency, rates)
  const miscBase = convertCurrency(miscPerUnit, miscCurrency, baseCurrency, rates)

  const totalPerUnitOriginal = round2(unitPrice + shippingPerUnit + customsPerUnit + taxesPerUnit + insurancePerUnit + miscPerUnit)
  const totalPerUnitBase = round2(unitPriceBase + shippingBase + customsBase + taxesBase + insuranceBase + miscBase)

  return {
    productId: product.id,
    productName: product.name,
    quantity,
    baseCurrency,
    supplierCurrency: product.supplierCurrency,
    unitPriceOriginal: unitPrice,
    unitPriceInBase: unitPriceBase,
    shippingPerUnit,
    shippingPerUnitBase: shippingBase,
    customsPerUnit,
    customsPerUnitBase: customsBase,
    taxesPerUnit,
    taxesPerUnitBase: taxesBase,
    insurancePerUnit,
    insurancePerUnitBase: insuranceBase,
    miscPerUnit,
    miscPerUnitBase: miscBase,
    totalPerUnit: totalPerUnitOriginal,
    totalPerUnitBase,
    totalCostOriginal: round2(totalPerUnitOriginal * quantity),
    totalCostBase: round2(totalPerUnitBase * quantity)
  }
}

export const calculateAllProductCosts = (
  products: ImportProductInput[],
  assumptions: ImportCostAssumptions,
  rates: ExchangeRateMap
): ProductCostBreakdown[] => {
  return products.map((product) => calculateProductCost(product, assumptions, rates))
}

export const aggregateTotalInvestment = (costs: ProductCostBreakdown[]): number => {
  return round2(costs.reduce((acc, product) => acc + (product.totalCostBase || 0), 0))
}

export const determineProfitColor = (profitMarginPercent: number): 'danger' | 'warning' | 'success' => {
  if (profitMarginPercent >= 35) return 'success'
  if (profitMarginPercent >= 20) return 'warning'
  return 'danger'
}

export const calculateRetailForMarkup = (
  cost: ProductCostBreakdown,
  markup: MarkupScenario,
  rates: ExchangeRateMap,
  retailCurrency: CurrencyCode
): RetailPricingResult => {
  const totalCostPerUnitBase = cost.totalPerUnitBase
  const costPerUnitRetailCurrency = convertCurrency(totalCostPerUnitBase, cost.baseCurrency, retailCurrency, rates)
  const multiplier = 1 + markup.percentage
  const retailPricePerUnit = round2(costPerUnitRetailCurrency * multiplier)
  const profitPerUnit = round2(retailPricePerUnit - costPerUnitRetailCurrency)
  const totalRevenue = round2(retailPricePerUnit * cost.quantity)
  const totalProfit = round2(profitPerUnit * cost.quantity)
  const profitMarginPercent = totalRevenue === 0 ? 0 : round2((totalProfit / totalRevenue) * 100)

  return {
    productId: cost.productId,
    markupId: markup.id,
    markupLabel: markup.label,
    markupPercent: markup.percentage,
    retailCurrency,
    retailPricePerUnit,
    profitPerUnit,
    totalRevenue,
    totalProfit,
    profitMarginPercent,
    formatted: {
      retailPrice: formatCurrency(retailPricePerUnit, retailCurrency),
      profitPerUnit: formatCurrency(profitPerUnit, retailCurrency),
      totalRevenue: formatCurrency(totalRevenue, retailCurrency),
      totalProfit: formatCurrency(totalProfit, retailCurrency),
      profitMargin: `${profitMarginPercent.toFixed(2)}%`
    }
  }
}

export const calculateRetailResults = (
  costs: ProductCostBreakdown[],
  markups: MarkupScenario[],
  rates: ExchangeRateMap,
  retailCurrencies: CurrencyCode[]
): RetailPricingResult[] => {
  const scenarios: RetailPricingResult[] = []
  costs.forEach((cost) => {
    markups.forEach((markup) => {
      retailCurrencies.forEach((currency) => {
        scenarios.push(calculateRetailForMarkup(cost, markup, rates, currency))
      })
    })
  })
  return scenarios
}

export const summarizeProjections = (
  retailResults: RetailPricingResult[],
  baseCurrency: CurrencyCode,
  rates: ExchangeRateMap
): ProfitProjectionSummary[] => {
  const grouped = new Map<string, ProfitProjectionSummary>()
  retailResults.forEach((result) => {
    const key = `${result.markupId}-${result.retailCurrency}`
    const existing = grouped.get(key)
    const totalCost = result.totalRevenue - result.totalProfit
    if (!existing) {
      grouped.set(key, {
        markupId: result.markupId,
        markupLabel: result.markupLabel,
        markupPercent: result.markupPercent,
        totalUnits: result.totalRevenue === 0 ? 0 : Math.round(result.totalRevenue / (result.retailPricePerUnit || 1)),
        totalRevenue: result.totalRevenue,
        totalCost,
        totalProfit: result.totalProfit,
        profitMarginPercent: result.profitMarginPercent,
        retailCurrency: result.retailCurrency
      })
    } else {
      existing.totalRevenue = round2(existing.totalRevenue + result.totalRevenue)
      existing.totalProfit = round2(existing.totalProfit + result.totalProfit)
      existing.totalCost = round2(existing.totalCost + totalCost)
      existing.totalUnits += Math.round(result.totalRevenue / (result.retailPricePerUnit || 1))
      existing.profitMarginPercent =
        existing.totalRevenue === 0 ? 0 : round2((existing.totalProfit / existing.totalRevenue) * 100)
    }
  })
  return Array.from(grouped.values()).sort((a, b) => b.profitMarginPercent - a.profitMarginPercent)
}

export const buildComparisonSnapshot = (
  comparison: ComparisonScenario,
  rates: ExchangeRateMap
) => {
  const costs = calculateAllProductCosts(comparison.products, comparison.assumptions, rates)
  const totalInvestment = aggregateTotalInvestment(costs)
  return {
    id: comparison.id,
    name: comparison.name,
    description: comparison.description,
    totalInvestment,
    baseCurrency: comparison.assumptions.baseCurrency,
    products: costs
  }
}

export const buildHistoryEntry = (
  product: ImportProductInput,
  cost: ProductCostBreakdown,
  timestamp: string = new Date().toISOString(),
  notes?: string
): ProductHistoryEntry => {
  return {
    id: `${product.id}-${timestamp}`,
    productId: product.id,
    productName: product.name,
    timestamp,
    unitPrice: product.unitPrice,
    quantity: product.quantity,
    landedCostPerUnit: cost.totalPerUnitBase,
    landedCostCurrency: cost.baseCurrency,
    notes
  }
}

export const calculateScenario = (
  products: ImportProductInput[],
  assumptions: ImportCostAssumptions,
  markups: MarkupScenario[],
  rates: ExchangeRateMap,
  retailCurrencies: CurrencyCode[]
) => {
  const costs = calculateAllProductCosts(products, assumptions, rates)
  const retailResults = calculateRetailResults(costs, markups, rates, retailCurrencies)
  const projections = summarizeProjections(retailResults, assumptions.baseCurrency, rates)
  const totalInvestment = aggregateTotalInvestment(costs)
  return {
    costs,
    retailResults,
    projections,
    totalInvestment
  }
}

export const DEFAULT_RETAIL_CURRENCIES: CurrencyCode[] = ['INR']

export const SUPPORTED_RETAIL_CURRENCIES: CurrencyCode[] = Array.from(
  new Set<CurrencyCode>(['INR', 'USD', 'EUR', 'GBP', 'AUD'])
)

export const getBestMarkupForCurrency = (
  projections: ProfitProjectionSummary[],
  currency: CurrencyCode
): ProfitProjectionSummary | null => {
  const filtered = projections.filter((p) => p.retailCurrency === currency)
  if (!filtered.length) return null
  return filtered.reduce((best, current) => {
    if (!best) return current
    if (current.profitMarginPercent > best.profitMarginPercent) return current
    if (current.totalProfit > best.totalProfit) return current
    return best
  }, filtered[0] as ProfitProjectionSummary)
}

export const validateProductInput = (product: ImportProductInput): string[] => {
  const errors: string[] = []
  if (!product.name?.trim()) errors.push('Product name is required')
  if (!Number.isFinite(product.unitPrice) || product.unitPrice <= 0) errors.push('Unit price must be greater than zero')
  if (!Number.isFinite(product.quantity) || product.quantity <= 0) errors.push('Quantity must be greater than zero')
  return errors
}

export const validateAssumptions = (assumptions: ImportCostAssumptions): string[] => {
  const errors: string[] = []
  if (!supportedCurrencies.includes(assumptions.baseCurrency)) errors.push('Base currency is not supported')
  if (assumptions.customsPercent < 0 || assumptions.customsPercent > 100) errors.push('Customs duty must be 0 - 100%')
  if (assumptions.importTaxPercent < 0 || assumptions.importTaxPercent > 100) errors.push('Import tax must be 0 - 100%')
  return errors
}

export const generateMarkupId = (percentage: number): string => {
  const sanitized = Math.round(percentage * 100)
  return `markup-${sanitized}`
}

export const createCustomMarkup = (percentage: number): MarkupScenario => {
  const pct = Math.max(0, percentage)
  return {
    id: generateMarkupId(pct),
    label: `${(pct * 100).toFixed(0)}%`,
    percentage: pct,
    isCustom: true,
    colorToken: pct >= 2.5 ? 'success' : pct >= 1.5 ? 'warning' : 'danger'
  }
}

export const cloneProducts = (products: ImportProductInput[]): ImportProductInput[] => {
  return products.map((product) => ({ ...product, lastUpdated: product.lastUpdated || new Date().toISOString() }))
}

export const mergeMarkups = (
  defaults: MarkupScenario[],
  custom: MarkupScenario[]
): MarkupScenario[] => {
  const map = new Map<string, MarkupScenario>()
  defaults.forEach((item) => map.set(item.id, item))
  custom.forEach((item) => map.set(item.id, item))
  return Array.from(map.values()).sort((a, b) => a.percentage - b.percentage)
}

export const deriveProfitQualityBadge = (profitMarginPercent: number): 'Low Margin' | 'Moderate Margin' | 'High Margin' => {
  if (profitMarginPercent >= 40) return 'High Margin'
  if (profitMarginPercent >= 20) return 'Moderate Margin'
  return 'Low Margin'
}

export const computeBulkUploadTemplate = () => {
  return [
    ['name', 'unitPrice', 'quantity', 'supplierCurrency', 'shippingPerUnit', 'shippingCurrency', 'notes'].join(','),
    ['Example Product', '5.25', '100', 'USD', '0.1', 'USD', 'Optional notes'].join(',')
  ].join('\n')
}

export const parseBulkCsvRow = (row: Record<string, string>): ImportProductInput => {
  const randomId = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10)
  const id = `bulk-${randomId}`
  const supplierCurrency = (row.supplierCurrency?.toUpperCase() as CurrencyCode) || 'USD'
  return {
    id,
    name: row.name?.trim() || `Product ${id.slice(-4)}`,
    unitPrice: parseFloat(row.unitPrice || '0'),
    quantity: parseInt(row.quantity || '0', 10),
    supplierCurrency: supportedCurrencies.includes(supplierCurrency) ? supplierCurrency : 'USD',
    shippingPerUnit: parseFloat(row.shippingPerUnit || '0'),
    shippingCurrency: (row.shippingCurrency?.toUpperCase() as CurrencyCode) || supplierCurrency,
    notes: row.notes
  }
}

