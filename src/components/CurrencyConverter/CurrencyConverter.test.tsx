import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { mockApi, requestedUrls } from '@/test/mockFetch'
import { renderWithClient } from '@/test/render'
import CurrencyConverter from './CurrencyConverter'

const convertedAmount = () => screen.getByLabelText('Converted amount')
const fromSelect = () => screen.getByRole('combobox', { name: 'From currency' })
const toSelect = () => screen.getByRole('combobox', { name: 'To currency' })

describe('CurrencyConverter', () => {
  it('converts 1 USD to EUR on start', async () => {
    mockApi({ rate: 2 })
    renderWithClient(<CurrencyConverter />)

    await waitFor(() => expect(convertedAmount()).toHaveValue('2'))
    expect(fromSelect()).toHaveTextContent('US Dollar (USD)')
    expect(toSelect()).toHaveTextContent('Euro (EUR)')
    expect(screen.getByText(/1 US Dollar equals/)).toBeInTheDocument()
  })

  it('converts to the picked currency', async () => {
    const fetchMock = mockApi()
    const user = userEvent.setup()
    renderWithClient(<CurrencyConverter />)

    await user.click(await screen.findByRole('combobox', { name: 'To currency' }))
    expect(screen.getAllByRole('option')).toHaveLength(3)
    await user.click(screen.getByRole('option', { name: 'Polish Zloty (PLN)' }))

    expect(toSelect()).toHaveTextContent('Polish Zloty (PLN)')
    await waitFor(() => expect(requestedUrls(fetchMock, '/convert').at(-1)?.searchParams.get('to')).toBe('PLN'))
  })

  it('waits until the user stops typing', async () => {
    const fetchMock = mockApi({ rate: 2 })
    const user = userEvent.setup()
    renderWithClient(<CurrencyConverter />)

    const amount = await screen.findByLabelText('Amount')
    await waitFor(() => expect(convertedAmount()).toHaveValue('2'))

    await user.clear(amount)
    await user.type(amount, '150')

    await waitFor(() => expect(convertedAmount()).toHaveValue('300'))
    const amounts = requestedUrls(fetchMock, '/convert').map((url) => url.searchParams.get('amount'))
    expect(amounts).toEqual(['1', '150'])
  })

  it('swaps currencies', async () => {
    mockApi()
    const user = userEvent.setup()
    renderWithClient(<CurrencyConverter />)

    await user.click(await screen.findByRole('button', { name: 'Swap currencies' }))

    expect(fromSelect()).toHaveTextContent('EUR')
    expect(toSelect()).toHaveTextContent('USD')
  })

  it('shows an error when convert fails', async () => {
    mockApi({ convertStatus: 429 })
    renderWithClient(<CurrencyConverter />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Rate limit exceeded')
    expect(convertedAmount()).toHaveValue('')
  })

  it('shows an error for a negative amount', async () => {
    mockApi()
    const user = userEvent.setup()
    renderWithClient(<CurrencyConverter />)

    const amount = await screen.findByLabelText('Amount')
    await user.clear(amount)
    await user.type(amount, '-3')

    expect(screen.getByText('Enter a valid amount')).toBeInTheDocument()
  })

  it('can retry when currencies fail to load', async () => {
    mockApi({ currenciesStatus: 401 })
    const user = userEvent.setup()
    renderWithClient(<CurrencyConverter />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid API key')

    mockApi()
    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(await screen.findByRole('combobox', { name: 'From currency' })).toBeInTheDocument()
  })
})
