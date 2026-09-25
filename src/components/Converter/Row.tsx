import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const Row = ({ children }: Props) => <div className="flex flex-col gap-2 sm:flex-row">{children}</div>

export default Row
