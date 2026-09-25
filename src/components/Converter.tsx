import { createContext, useContext, type ReactNode } from 'react'
import { ArrowUpDown } from 'lucide-react'
import type { Conversion, Currency, CurrencyCode } from '@/api/currencyBeacon'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

const CurrenciesContext = createContext<Currency[]>([])

const formatAmount = (value: number, precision = 2) =>
  value.toLocaleString(undefined, { maximumFractionDigits: precision })

const Converter = ({ currencies, children }: { currencies: Currency[]; children: ReactNode }) => (
  <CurrenciesContext.Provider value={currencies}>
    <Card>
      <CardContent className="flex flex-col gap-3">{children}</CardContent>
    </Card>
  </CurrenciesContext.Provider>
)

const Summary = ({ result, outdated }: { result?: Conversion; outdated?: boolean }) => {
  const currencies = useContext(CurrenciesContext)
  const from = currencies.find((c) => c.shortCode === result?.from)
  const to = currencies.find((c) => c.shortCode === result?.to)

  return (
    <div className={cn('mb-2 min-h-16', outdated && 'opacity-50')} aria-live="polite">
      {result && (
        <>
          <p className="text-muted-foreground">
            {formatAmount(result.amount, from?.precision)} {from?.name} equals
          </p>
          <p className="text-3xl">
            {formatAmount(result.value, to?.precision)} {to?.name}
          </p>
        </>
      )}
    </div>
  )
}

const Row = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col gap-2 sm:flex-row">{children}</div>
)

type AmountProps = {
  value: string
  onChange: (value: string) => void
  invalid?: boolean
}

const Amount = ({ value, onChange, invalid }: AmountProps) => (
  <Input
    aria-label="Amount"
    type="number"
    inputMode="decimal"
    min="0"
    step="any"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    aria-invalid={invalid}
    className="sm:flex-1"
  />
)

const Result = ({ result, outdated }: { result?: Conversion; outdated?: boolean }) => {
  const currencies = useContext(CurrenciesContext)
  const precision = currencies.find((c) => c.shortCode === result?.to)?.precision

  return (
    <Input
      aria-label="Converted amount"
      readOnly
      value={result ? formatAmount(result.value, precision) : ''}
      className={cn('sm:flex-1', outdated && 'text-muted-foreground')}
    />
  )
}

type CurrencySelectProps = {
  label: string
  value: CurrencyCode
  onChange: (code: CurrencyCode) => void
}

const CurrencySelect = ({ label, value, onChange }: CurrencySelectProps) => {
  const currencies = useContext(CurrenciesContext)

  return (
    <Select value={value} onValueChange={(code) => onChange(code as CurrencyCode)}>
      <SelectTrigger aria-label={label} className="w-full sm:w-64">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((c) => (
          <SelectItem key={c.shortCode} value={c.shortCode}>
            {c.name} ({c.shortCode})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const Swap = ({ onClick }: { onClick: () => void }) => (
  <Button
    type="button"
    variant="outline"
    size="icon"
    className="self-center"
    onClick={onClick}
    aria-label="Swap currencies"
  >
    <ArrowUpDown />
  </Button>
)

const ErrorMessage = ({ children }: { children: ReactNode }) => (
  <p role="alert" className="text-sm text-destructive">
    {children}
  </p>
)

Converter.Summary = Summary
Converter.Row = Row
Converter.Amount = Amount
Converter.Result = Result
Converter.Currency = CurrencySelect
Converter.Swap = Swap
Converter.Error = ErrorMessage

export default Converter
