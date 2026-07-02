/**
 * Converts a hex color to HSL format with transparency for consistent theme blending.
 * Normalizes saturation to 90% and lightness to 75% to match default color behavior.
 * E.g., "#FF5733" becomes "hsla(9, 90%, 75%, 0.3)"
 * Returns the input unchanged if it's not a valid hex color.
 */
export const hexToHsla = (hex: string): string => {
  if (!hex || !hex.startsWith("#")) return hex

  // Parse hex to RGB
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  // Convert RGB to HSL (just need hue; saturation/lightness will be normalized)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0

  if (max !== min) {
    const d = max - min
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  const hDeg = Math.round(h * 360)

  // Normalize saturation and lightness to match default colors
  return `hsla(${hDeg}, 90%, 75%, 0.3)`
}
