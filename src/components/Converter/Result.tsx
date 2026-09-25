import type { Conversion } from '@/api/currencyBeacon'
import { Input } from '@/components/ui/input'
import { formatAmount } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useConverterCurrencies } from './context'

type Props = {
  result?: Conversion
  outdated?: boolean
}

const Result = ({ result, outdated }: Props) => {
  const currencies = useConverterCurrencies()
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

export default Result
