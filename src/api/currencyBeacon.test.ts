import { describe, expect, it, vi } from 'vitest'
import { currenciesResponse, jsonResponse, mockApi, requestedUrls } from '../test/mockFetch'
import { convertCurrency, fetchCurrencies } from './currencyBeacon'

describe('fetchCurrencies', () => {
  it('maps and sorts currencies', async () => {
    const fetchMock = mockApi()

    const currencies = await fetchCurrencies()

    expect(currencies.map((c) => c.shortCode)).toEqual(['EUR', 'PLN', 'USD'])
    expect(currencies[2]).toEqual({ shortCode: 'USD', name: 'US Dollar', precision: 2 })
    expect(requestedUrls(fetchMock, '/currencies')[0].searchParams.get('api_key')).toBe('test-key')
  })

  it('skips currencies with a wrong code', async () => {
    const list = [
      ...currenciesResponse.response,
      { id: 9, name: 'Empty', short_code: '', code: '000', precision: 2, symbol: '' },
      { id: 10, name: 'Lowercase', short_code: 'abc', code: '001', precision: 2, symbol: '' },
    ]
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({ ...currenciesResponse, response: list })))

    const currencies = await fetchCurrencies()

    expect(currencies.map((c) => c.shortCode)).toEqual(['EUR', 'PLN', 'USD'])
  })

  it('throws the error message from the api', async () => {
    mockApi({ currenciesStatus: 401 })

    await expect(fetchCurrencies()).rejects.toMatchObject({ message: 'Invalid API key', status: 401 })
  })

  it('throws when there is no api key', async () => {
    vi.stubEnv('VITE_CURRENCY_BEACON_API_KEY', '')
    const fetchMock = mockApi()

    await expect(fetchCurrencies()).rejects.toThrow(/No API key/)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('convertCurrency', () => {
  it('returns the converted value', async () => {
    const fetchMock = mockApi({ rate: 4 })

    await expect(convertCurrency('USD', 'PLN', 10)).resolves.toEqual({ from: 'USD', to: 'PLN', amount: 10, value: 40 })

    const [url] = requestedUrls(fetchMock, '/convert')
    expect(Object.fromEntries(url.searchParams)).toMatchObject({ from: 'USD', to: 'PLN', amount: '10' })
  })
})
