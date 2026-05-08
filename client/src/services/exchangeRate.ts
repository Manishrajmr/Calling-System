import axios from "axios"

const EXCHANGE_API = "https://open.er-api.com/v6/latest/USD"

interface ExchangeRate {
  rate: number
  lastUpdated: Date
}

let cachedRate: ExchangeRate | null = null
let cacheTimeout: ReturnType<typeof setTimeout> | null = null

export const getUSDToINRRate = async (): Promise<number> => {
  // Return cached rate if valid (less than 5 minutes old)
  if (cachedRate && Date.now() - cachedRate.lastUpdated.getTime() < 5 * 60 * 1000) {
    return cachedRate.rate
  }

  try {
    const response = await axios.get(EXCHANGE_API)
    const rate = response.data.rates.INR
    cachedRate = {
      rate,
      lastUpdated: new Date()
    }
    return rate
  } catch (error) {
    // If API fails, return cached rate if available, otherwise fallback to a default
    if (cachedRate) {
      return cachedRate.rate
    }
    console.error("Failed to fetch exchange rate:", error)
    return 83.12 // Fallback rate
  }
}

export const convertUSDToINR = async (usdAmount: number): Promise<{ usd: number; inr: number; rate: number }> => {
  const rate = await getUSDToINRRate()
  return {
    usd: usdAmount,
    inr: usdAmount * rate,
    rate
  }
}

export const clearExchangeRateCache = () => {
  cachedRate = null
  if (cacheTimeout) {
    clearTimeout(cacheTimeout)
    cacheTimeout = null
  }
}
