export const getRgbaValues = rgbaString =>
  rgbaString.replace(/[a-z\(\)\s]/gi, "").split(",")

export const getHexaValues = hexString =>
  hexString.match(/[A-F]{2}|[A-F]\d{1}|\d{2}|\d[A-F]/gi)

export const isValidRgba = rgba => {
  let [r, g, b, a = 1] = rgba

  let isValidLengthRange = rgba.length === 3 || rgba.length === 4
  let isValidColorRange = [r, g, b].every(v => v >= 0 && v <= 255)
  let isValidAlphaRange = rgba.length === 3 || (a >= 0 && a <= 1)

  return isValidLengthRange && isValidColorRange && isValidAlphaRange
}

//Credit : https://github.com/Qix-/color-convert
export const rgbToHSV = rgb => {
  let rdif
  let gdif
  let bdif
  let h
  let s

  const r = rgb[0] / 255
  const g = rgb[1] / 255
  const b = rgb[2] / 255
  const v = Math.max(r, g, b)
  const diff = v - Math.min(r, g, b)
  const diffc = function(c) {
    return (v - c) / 6 / diff + 1 / 2
  }

  if (diff === 0) {
    h = 0
    s = 0
  } else {
    s = diff / v
    rdif = diffc(r)
    gdif = diffc(g)
    bdif = diffc(b)

    if (r === v) {
      h = bdif - gdif
    } else if (g === v) {
      h = 1 / 3 + rdif - bdif
    } else if (b === v) {
      h = 2 / 3 + gdif - rdif
    }

    if (h < 0) {
      h += 1
    } else if (h > 1) {
      h -= 1
    }
  }

  const hsvResult = [h * 360, s * 100, v * 100].map(v => v.toFixed(0))
  return hsvResult
}

//Credit : https://github.com/Qix-/color-convert
export const hsvToRgb = hsv => {
  const h = hsv[0] / 60
  const s = hsv[1] / 100
  let v = hsv[2] / 100
  const hi = Math.floor(h) % 6

  const f = h - Math.floor(h)
  const p = 255 * v * (1 - s)
  const q = 255 * v * (1 - s * f)
  const t = 255 * v * (1 - s * (1 - f))
  v *= 255

  switch (hi) {
    case 0:
      return [v, t, p]
    case 1:
      return [q, v, p]
    case 2:
      return [p, v, t]
    case 3:
      return [p, q, v]
    case 4:
      return [t, p, v]
    case 5:
      return [v, p, q]
  }
}

//Credit : https://github.com/Qix-/color-convert
export const hsvToHSL = hsv => {
  const h = hsv[0]
  const s = hsv[1] / 100
  const v = hsv[2] / 100
  const vmin = Math.max(v, 0.01)
  let sl
  let l

  l = (2 - s) * v
  const lmin = (2 - s) * vmin
  sl = s * vmin
  sl /= lmin <= 1 ? lmin : 2 - lmin
  sl = sl || 0
  l /= 2

  return [h, sl * 100, l * 100]
}
