import type { Conversion } from '@/api/currencyBeacon'
import { formatAmount } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useConverterCurrencies } from './context'

type Props = {
  result?: Conversion
  outdated?: boolean
}

const Summary = ({ result, outdated }: Props) => {
  const currencies = useConverterCurrencies()
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

export default Summary
