import type { CurrencyCode } from '@/api/currencyBeacon'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useConverterCurrencies } from './context'

type Props = {
  label: string
  value: CurrencyCode
  onChange: (code: CurrencyCode) => void
}

const CurrencySelect = ({ label, value, onChange }: Props) => {
  const currencies = useConverterCurrencies()

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

export default CurrencySelect
