import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const ErrorMessage = ({ children }: Props) => (
  <p role="alert" className="text-sm text-destructive">
    {children}
  </p>
)

export default ErrorMessage
