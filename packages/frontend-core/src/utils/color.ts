const hue2rgb = (p: number, q: number, t: number): number => {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

/**
 * Given a CSS background color string (hsla, hsl, #rrggbb, #rgb), returns
 * "#1d1d1d" or "#ffffff" depending on which provides better contrast.
 * Returns null for unrecognised formats.
 */
export const getContrastTextColor = (bgColor: string): string | null => {
  if (!bgColor) return null
  let r: number | undefined, g: number | undefined, b: number | undefined
  let a = 1

  const hslaMatch = bgColor.match(
    /hsla?\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%(?:,\s*(\d+(?:\.\d+)?))?\)/
  )
  if (hslaMatch) {
    const h = parseFloat(hslaMatch[1]) / 360
    const s = parseFloat(hslaMatch[2]) / 100
    const l = parseFloat(hslaMatch[3]) / 100
    a = hslaMatch[4] != null ? parseFloat(hslaMatch[4]) : 1
    if (s === 0) {
      r = g = b = l
    } else {
      const q2 = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p2 = 2 * l - q2
      r = hue2rgb(p2, q2, h + 1 / 3)
      g = hue2rgb(p2, q2, h)
      b = hue2rgb(p2, q2, h - 1 / 3)
    }
  }

  const hexMatch = bgColor.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  if (hexMatch) {
    r = parseInt(hexMatch[1], 16) / 255
    g = parseInt(hexMatch[2], 16) / 255
    b = parseInt(hexMatch[3], 16) / 255
    a = 1
  }

  const shortHexMatch = bgColor.match(/^#([a-f\d])([a-f\d])([a-f\d])$/i)
  if (shortHexMatch) {
    r = parseInt(shortHexMatch[1] + shortHexMatch[1], 16) / 255
    g = parseInt(shortHexMatch[2] + shortHexMatch[2], 16) / 255
    b = parseInt(shortHexMatch[3] + shortHexMatch[3], 16) / 255
    a = 1
  }

  if (r == null || g == null || b == null) return null

  // Blend with white to account for transparency
  r = r * a + (1 - a)
  g = g * a + (1 - a)
  b = b * a + (1 - a)

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  const luminance =
    0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)

  return luminance > 0.179 ? "#1d1d1d" : "#ffffff"
}
