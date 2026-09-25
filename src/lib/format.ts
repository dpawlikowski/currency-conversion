export const formatAmount = (value: number, precision = 2) =>
  value.toLocaleString(undefined, { maximumFractionDigits: precision })
