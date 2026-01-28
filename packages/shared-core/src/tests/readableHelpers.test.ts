import { formatBytes } from "../helpers"

describe("formatBytes", () => {
  it("handles undefined and zero", () => {
    expect(formatBytes(undefined)).toBe("0B")
    expect(formatBytes(0)).toBe("0B")
  })

  it("formats bytes without units", () => {
    expect(formatBytes(500)).toBe("500B")
    expect(formatBytes("900")).toBe("900B")
  })

  it("formats kilobytes with one decimal when under 10", () => {
    expect(formatBytes(1024)).toBe("1.0KB")
    expect(formatBytes(1536)).toBe("1.5KB")
  })

  it("formats kilobytes without decimals at 10 or above", () => {
    expect(formatBytes(10 * 1024)).toBe("10KB")
    expect(formatBytes(11 * 1024)).toBe("11KB")
  })

  it("formats higher units and supports spacers", () => {
    expect(formatBytes(1024 * 1024)).toBe("1.0MB")
    expect(formatBytes(1024 * 1024 * 1024, " ")).toBe("1.0 GB")
  })

  it("caps at the largest unit", () => {
    const yottabyte = 1024 ** 8
    expect(formatBytes(yottabyte)).toBe("1.0YB")
    expect(formatBytes(yottabyte * 1024)).toBe("1024YB")
  })
})
