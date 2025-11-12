import { readLocal, writeLocal } from '@/utils/persist'
import { ensureExchangeRates, type ExchangeRateMap } from '@/utils/tools/importPricing'
import type { CurrencyCode } from '@/utils/currency'

interface ExchangeRateCacheEntry {
  base: CurrencyCode
  rates: ExchangeRateMap
  fetchedAt: number
}

const STORAGE_KEY = 'import-tool:exchange-rates'
const CACHE_TTL_MS = 1000 * 60 * 60 * 6 // 6 hours
const API_ENDPOINT = 'https://open.er-api.com/v6/latest/'

const readCache = (): ExchangeRateCacheEntry | null => {
  return readLocal<ExchangeRateCacheEntry | null>(STORAGE_KEY, null)
}

const writeCache = (entry: ExchangeRateCacheEntry): void => {
  writeLocal(STORAGE_KEY, entry)
}

const normalizeRates = (base: CurrencyCode, data: Record<string, number>): ExchangeRateMap => {
  const normalized: Partial<ExchangeRateMap> = {}
  Object.entries(data).forEach(([code, value]) => {
    const currency = code as CurrencyCode
    if (typeof value === 'number' && value > 0) {
      normalized[currency] = value
    }
  })
  // Always ensure base currency is set to 1
  normalized[base] = 1
  return ensureExchangeRates(normalized)
}

const shouldRefresh = (entry: ExchangeRateCacheEntry | null, base: CurrencyCode, forceRefresh: boolean): boolean => {
  if (!entry) return true
  if (entry.base !== base) return true
  if (forceRefresh) return true
  return Date.now() - entry.fetchedAt > CACHE_TTL_MS
}

export const fetchExchangeRates = async (
  base: CurrencyCode = 'USD',
  forceRefresh = false
): Promise<ExchangeRateMap> => {
  const cached = readCache()
  if (!shouldRefresh(cached, base, forceRefresh)) {
    return ensureExchangeRates(cached?.rates)
  }

  try {
    const response = await fetch(`${API_ENDPOINT}${base}`)
    if (!response.ok) throw new Error(`Exchange rate fetch failed with status ${response.status}`)
    const payload = await response.json()
    if (payload?.result !== 'success' || !payload?.rates) throw new Error('Invalid exchange rate payload')

    const rates = normalizeRates(base, payload.rates)
    writeCache({ base, rates, fetchedAt: Date.now() })
    return rates
  } catch {
    return ensureExchangeRates()
  }
}

export const getCachedExchangeRates = (): ExchangeRateMap => {
  const cached = readCache()
  return ensureExchangeRates(cached?.rates)
}

