import { getColorFormat, convertToHSVA, convertHsvaToFormat } from "./utils"

describe("convertToHSVA - convert to hsva from format", () => {
  test("convert from hexa", () => {
    expect(convertToHSVA("#f222d382", "hex")).toEqual([309, 86, 95, 0.51])
  })

  test("convert from hex", () => {
    expect(convertToHSVA("#f222d3", "hex")).toEqual([309, 86, 95, 1])
  })

  test("convert from rgba", () => {
    expect(convertToHSVA("rgba(242, 34, 211, 1)", "rgb")).toEqual([
      309,
      86,
      95,
      1,
    ])
  })

  test("convert from rgb", () => {
    expect(convertToHSVA("rgb(150, 80, 255)", "rgb")).toEqual([264, 69, 100, 1])
  })

  test("convert from from hsl", () => {
    expect(convertToHSVA("hsl(264, 100%, 65.7%)", "hsl")).toEqual([
      264,
      68.6,
      100,
      1,
    ])
  })

  test("convert from from hsla", () => {
    expect(convertToHSVA("hsla(264, 100%, 65.7%, 0.51)", "hsl")).toEqual([
      264,
      68.6,
      100,
      0.51,
    ])
  })
})

describe("convertHsvaToFormat - convert from hsva to format", () => {
  test("Convert to hexa", () => {
    expect(convertHsvaToFormat([264, 68.63, 100, 0.5], "hex")).toBe("#9650ff80")
  })

  test("Convert to rgba", () => {
    expect(convertHsvaToFormat([264, 68.63, 100, 0.75], "rgb")).toBe(
      "rgba(150,80,255,0.75)"
    )
  })

  test("Convert to hsla", () => {
    expect(convertHsvaToFormat([264, 68.63, 100, 1], "hsl")).toBe(
      "hsla(264,100,65.7,1)"
    )
  })
})

describe("Get Color Format", () => {
  test("Testing valid hex string", () => {
    expect(getColorFormat("#FFF")).toBe("hex")
  })

  test("Testing invalid hex string", () => {
    expect(getColorFormat("#FFZ")).toBeUndefined()
  })

  test("Testing valid hex with alpha", () => {
    expect(getColorFormat("#FF00BB80")).toBe("hex")
  })

  test("Test valid rgb value", () => {
    expect(getColorFormat("RGB(255, 20, 50)")).toBe("rgb")
  })

  test("Testing invalid rgb value", () => {
    expect(getColorFormat("rgb(255, 0)")).toBeUndefined()
  })

  test("Testing rgb value with alpha", () => {
    expect(getColorFormat("rgba(255, 0, 50, 0.5)")).toBe("rgb")
  })

  test("Testing rgb value with incorrectly provided alpha", () => {
    expect(getColorFormat("rgb(255, 0, 50, 0.5)")).toBeUndefined()
  })

  test("Testing invalid hsl value", () => {
    expect(getColorFormat("hsla(255, 0)")).toBeUndefined()
  })

  test("Testing hsla value with alpha", () => {
    expect(getColorFormat("hsla(150, 60, 50, 0.5)")).toBe("hsl")
  })

  test("Testing hsl value with incorrectly provided alpha", () => {
    expect(getColorFormat("hsl(150, 0, 50, 0.5)")).toBeUndefined()
  })

  test("Testing out of bounds hsl", () => {
    expect(getColorFormat("hsl(375, 0, 50)")).toBeUndefined()
  })
})
