import { Input } from '@/components/ui/input'

type Props = {
  value: string
  onChange: (value: string) => void
  invalid?: boolean
}

const Amount = ({ value, onChange, invalid }: Props) => (
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

export default Amount
