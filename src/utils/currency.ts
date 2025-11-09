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
    const symbol = code === 'INR' ? '₹' : code === 'USD' ? '$' : code === 'EUR' ? '€' : code === 'GBP' ? '£' : ''
    return `${symbol} ${value.toFixed(2)}`
  }
}

export const supportedCurrencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY']


