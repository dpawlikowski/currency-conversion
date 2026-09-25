import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  onClick: () => void
}

const SwapButton = ({ onClick }: Props) => (
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

export default SwapButton
