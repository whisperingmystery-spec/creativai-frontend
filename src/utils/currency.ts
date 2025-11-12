export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'JPY'

const currencyLocales: Record<CurrencyCode, string> = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  AUD: 'en-AU',
  CAD: 'en-CA',
  JPY: 'ja-JP'
}

export const formatCurrency = (value: number, code: CurrencyCode) => {
  const locale = currencyLocales[code] || 'en-US'
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: code, maximumFractionDigits: 2 }).format(value)
  } catch {
    // Fallback
    const symbol = getCurrencySymbol(code)
    return `${symbol} ${value.toFixed(2)}`
  }
}

export const supportedCurrencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY']

const symbols: Record<CurrencyCode, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AUD: 'A$',
  CAD: 'C$',
  JPY: '¥'
}

export const getCurrencySymbol = (code: CurrencyCode): string => {
  return symbols[code] || code
}

export const isSupportedCurrency = (code: string): code is CurrencyCode => {
  return supportedCurrencies.includes(code as CurrencyCode)
}


