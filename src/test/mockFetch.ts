import { vi } from 'vitest'

export const currenciesResponse = {
  meta: { code: 200 },
  response: [
    { id: 1, name: 'US Dollar', short_code: 'USD', code: '840', precision: 2, symbol: '$' },
    { id: 2, name: 'Euro', short_code: 'EUR', code: '978', precision: 2, symbol: '€' },
    { id: 3, name: 'Polish Zloty', short_code: 'PLN', code: '985', precision: 2, symbol: 'zł' },
  ],
}

export const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

export const mockApi = ({ rate = 2, currenciesStatus = 200, convertStatus = 200 } = {}) => {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = new URL(input.toString())

    if (url.pathname.endsWith('/currencies')) {
      return currenciesStatus === 200
        ? jsonResponse(currenciesResponse)
        : jsonResponse({ meta: { code: currenciesStatus, error_detail: 'Invalid API key' } }, currenciesStatus)
    }

    if (convertStatus !== 200) {
      return jsonResponse({ meta: { code: convertStatus, error_detail: 'Rate limit exceeded' } }, convertStatus)
    }

    const amount = Number(url.searchParams.get('amount'))
    return jsonResponse({
      meta: { code: 200 },
      response: { from: url.searchParams.get('from'), to: url.searchParams.get('to'), amount, value: amount * rate },
      value: -1,
    })
  })

  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

export const requestedUrls = (fetchMock: ReturnType<typeof mockApi>, path: string) =>
  fetchMock.mock.calls.map(([input]) => new URL(input.toString())).filter((url) => url.pathname.endsWith(path))
