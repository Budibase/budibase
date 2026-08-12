export const extractOrigin = (value: string): string | null => {
  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

export const extractOriginList = (values: unknown[]) => {
  const origins: string[] = []
  const invalidOrigins: string[] = []
  const seen = new Set<string>()

  for (const entry of values) {
    if (typeof entry !== "string") {
      continue
    }

    const trimmed = entry.trim()
    if (!trimmed) {
      continue
    }

    const origin = extractOrigin(trimmed)
    if (!origin) {
      invalidOrigins.push(trimmed)
      continue
    }

    if (seen.has(origin)) {
      continue
    }

    seen.add(origin)
    origins.push(origin)
  }

  return { origins, invalidOrigins }
}
