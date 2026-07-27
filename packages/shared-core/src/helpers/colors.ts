export const normaliseSafeCssColor = (color?: string) => {
  if (color == null || color.trim() === "") {
    return undefined
  }
  const trimmed = color.trim()
  if (trimmed.includes(";") || /\burl\s*\(/i.test(trimmed)) {
    throw new Error("Color is invalid.")
  }
  return trimmed
}
