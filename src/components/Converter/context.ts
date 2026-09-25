import { createContext, useContext } from 'react'
import type { Currency } from '@/api/currencyBeacon'

export const CurrenciesContext = createContext<Currency[]>([])

export const useConverterCurrencies = () => useContext(CurrenciesContext)
