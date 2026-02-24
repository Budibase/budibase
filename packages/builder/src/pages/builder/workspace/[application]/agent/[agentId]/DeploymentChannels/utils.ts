export const toOptionalValue = (value: string) => {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export const toOptionalIdleTimeout = (value: number) => {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined
  }
  return Math.floor(parsed)
}
