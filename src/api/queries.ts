import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { convertCurrency, fetchCurrencies, type CurrencyCode } from './currencyBeacon'

export const useCurrencies = () =>
  useQuery({
    queryKey: ['currencies'],
    queryFn: ({ signal }) => fetchCurrencies(signal),
    staleTime: Infinity,
  })

export const useConversion = (from: CurrencyCode, to: CurrencyCode, amount: number | null) =>
  useQuery({
    queryKey: ['convert', from, to, amount],
    queryFn: ({ signal }) => convertCurrency(from, to, amount!, signal),
    enabled: amount !== null,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  })
