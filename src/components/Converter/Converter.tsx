import type { ReactNode } from 'react'
import type { Currency } from '@/api/currencyBeacon'
import { Card, CardContent } from '@/components/ui/card'
import Amount from './Amount'
import { CurrenciesContext } from './context'
import CurrencySelect from './CurrencySelect'
import ErrorMessage from './ErrorMessage'
import Result from './Result'
import Row from './Row'
import Summary from './Summary'
import SwapButton from './SwapButton'

type Props = {
  currencies: Currency[]
  children: ReactNode
}

const Converter = ({ currencies, children }: Props) => (
  <CurrenciesContext.Provider value={currencies}>
    <Card>
      <CardContent className="flex flex-col gap-3">{children}</CardContent>
    </Card>
  </CurrenciesContext.Provider>
)

Converter.Summary = Summary
Converter.Row = Row
Converter.Amount = Amount
Converter.Result = Result
Converter.Currency = CurrencySelect
Converter.Swap = SwapButton
Converter.Error = ErrorMessage

export default Converter
