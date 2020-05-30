import {
  getHexaValues,
  getRgbaValues,
  hsvToHSL,
  isValidRgba,
  rgbToHSV,
  hsvToRgb,
} from "./utils"

export class HSVAColor {
  h = 0
  s = 0
  v = 0
  a = 1

  constructor(color) {
    if (color.startsWith("#")) {
      let [rHex, gHex, bHex, aHex] = getHexaValues(color)
      this.hexaToHSVA([rHex, gHex, bHex], aHex)
    } else if (color.startsWith("rgb")) {
      let rgba = getRgbaValues(color)
      this.rgbaToHSVA(rgba)
    }
  }

  setHSVA([h, s, v, a]) {
    this.h = h
    this.s = s
    this.v = v
    this.a = a
  }

  getHSLA() {
    const [h, s, l] = hsvToHSL([this.h, this.s, this.v])
    return `hsla(${h}, ${s}, ${l}, ${this.a})`
  }

  hexaToHSVA(hex, alpha = "FF") {
    const rgba = hex
      .map(v => parseInt(v, 16))
      .concat((parseInt(alpha, 16) / 255).toFixed(1))
    this.rgbaToHSVA(rgba)
  }

  rgbaToHSVA(rgba) {
    if (isValidRgba(rgba)) {
      const [r, g, b, a = "1"] = rgba
      let hsv = rgbToHSV([r, g, b])
      this.setHSVA([...hsv, a])
    }
  }

  hsvaToHexa() {
    const [r, g, b, a] = this.hsvaToRgba()
    const hexa = [r, g, b]
      .map(v => v.toString(16))
      .concat((a * 255).toFixed(1).toString(16))
    return hexa
  }

  hsvaToRgba() {
    const { h, s, v, a } = this
    let rgb = hsvToRgb([h, s, v])
    return [...rgb, a]
  }
}
