import { afterEach, describe, expect, it, vi } from "vitest"
import { uuid } from "./helpers"

describe("uuid", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("uses crypto.getRandomValues when available", () => {
    const getRandomValues = vi.fn((array: Uint8Array) => {
      array[0] = 0xab
      return array
    })

    vi.stubGlobal("crypto", { getRandomValues })

    expect(uuid()).toMatch(/^c[a-f0-9]{12}4[a-f0-9]{3}[89ab][a-f0-9]{15}$/)
    expect(getRandomValues).toHaveBeenCalled()
  })

  it("falls back to Math.random when crypto is unavailable", () => {
    vi.stubGlobal("crypto", undefined)
    vi.spyOn(Math, "random").mockReturnValue(0)

    expect(uuid()).toMatch(/^c[a-f0-9]{12}4[a-f0-9]{3}[89ab][a-f0-9]{15}$/)
    expect(Math.random).toHaveBeenCalled()
  })
})
