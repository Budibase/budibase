export interface FormattedToolName {
  full: string
  primary: string
  secondary?: string
}

const humanizeSegment = (value: string): string =>
  value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, letter => letter.toUpperCase())

const splitReadableName = (value: string) => {
  const lastDotIndex = value.lastIndexOf(".")
  if (lastDotIndex <= 0 || lastDotIndex >= value.length - 1) {
    return {
      primary: humanizeSegment(value),
    }
  }

  const primary = value.slice(0, lastDotIndex).trim()
  const secondary = humanizeSegment(value.slice(lastDotIndex + 1))
  return {
    primary,
    ...(secondary ? { secondary } : {}),
  }
}

export const formatToolName = (
  rawName: string,
  readableName?: string
): FormattedToolName => {
  const { primary, secondary } = readableName
    ? splitReadableName(readableName)
    : { primary: humanizeSegment(rawName) }

  return {
    primary,
    ...(secondary ? { secondary } : {}),
    full: secondary ? `${primary} - ${secondary}` : primary,
  }
}
