import { useState } from 'react'
import type { CurrencyCode } from '@/api/currencyBeacon'
import { useConversion, useCurrencies } from '@/api/queries'
import { Button } from '@/components/ui/button'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import Converter from '@/components/Converter'

const parseAmount = (value: string) => {
  if (value.trim() === '') return null
  const amount = Number(value)
  return Number.isFinite(amount) && amount >= 0 ? amount : null
}

const CurrencyConverter = () => {
  const [from, setFrom] = useState<CurrencyCode>('USD')
  const [to, setTo] = useState<CurrencyCode>('EUR')
  const [amount, setAmount] = useState('1')

  const debouncedAmount = useDebouncedValue(amount, 400)
  const parsedAmount = parseAmount(debouncedAmount)
  const amountInvalid = amount.trim() !== '' && parseAmount(amount) === null

  const currencies = useCurrencies()
  const conversion = useConversion(from, to, parsedAmount)

  if (currencies.isPending) {
    return <p className="text-muted-foreground">Loading...</p>
  }

  if (currencies.isError) {
    return (
      <div role="alert" className="space-y-2 text-destructive">
        <p>Couldn't load currencies. {currencies.error.message}</p>
        <Button variant="outline" onClick={() => currencies.refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  const result = parsedAmount !== null ? conversion.data : undefined
  const outdated = conversion.isPlaceholderData || amount !== debouncedAmount

  return (
    <Converter currencies={currencies.data}>
      <Converter.Summary result={result} outdated={outdated} />

      <Converter.Row>
        <Converter.Amount value={amount} onChange={setAmount} invalid={amountInvalid} />
        <Converter.Currency label="From currency" value={from} onChange={setFrom} />
      </Converter.Row>

      <Converter.Swap
        onClick={() => {
          setFrom(to)
          setTo(from)
        }}
      />

      <Converter.Row>
        <Converter.Result result={result} outdated={outdated} />
        <Converter.Currency label="To currency" value={to} onChange={setTo} />
      </Converter.Row>

      {amountInvalid && <Converter.Error>Enter a valid amount</Converter.Error>}
      {conversion.isError && <Converter.Error>Couldn't convert. {conversion.error.message}</Converter.Error>}
    </Converter>
  )
}

export default CurrencyConverter
