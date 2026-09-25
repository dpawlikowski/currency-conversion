const BASE_URL = 'https://api.currencybeacon.com/v1'

type Letter =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'
  | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'

export type CurrencyCode = `${Letter}${Letter}${Letter}`

export const isCurrencyCode = (value: string): value is CurrencyCode => /^[A-Z]{3}$/.test(value)

export type Currency = {
  shortCode: CurrencyCode
  name: string
  precision: number
}

type ApiCurrency = {
  name: string
  short_code: string
  precision: number
}

export type Conversion = {
  from: CurrencyCode
  to: CurrencyCode
  amount: number
  value: number
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

type ApiResponse<T> = {
  meta?: { code: number; error_detail?: string }
  response?: T
}

const get = async <T>(path: string, params: Record<string, string>, signal?: AbortSignal): Promise<T> => {
  const apiKey = import.meta.env.VITE_CURRENCY_BEACON_API_KEY
  if (!apiKey) {
    throw new Error('No API key, add VITE_CURRENCY_BEACON_API_KEY to your .env file')
  }

  const query = new URLSearchParams({ ...params, api_key: apiKey })
  const res = await fetch(`${BASE_URL}${path}?${query}`, { signal })
  const body: ApiResponse<T> = await res.json().catch(() => ({}))

  if (!res.ok || !body.response) {
    throw new ApiError(body.meta?.error_detail ?? `Something went wrong (${res.status})`, res.status)
  }
  return body.response
}

export const fetchCurrencies = async (signal?: AbortSignal): Promise<Currency[]> => {
  const data = await get<ApiCurrency[]>('/currencies', { type: 'fiat' }, signal)

  return data
    .filter((c) => isCurrencyCode(c.short_code))
    .map((c) => ({ shortCode: c.short_code as CurrencyCode, name: c.name, precision: c.precision }))
    .sort((a, b) => a.shortCode.localeCompare(b.shortCode))
}

export const convertCurrency = async (
  from: CurrencyCode,
  to: CurrencyCode,
  amount: number,
  signal?: AbortSignal,
): Promise<Conversion> => {
  const data = await get<{ value: number }>('/convert', { from, to, amount: String(amount) }, signal)
  return { from, to, amount, value: data.value }
}
