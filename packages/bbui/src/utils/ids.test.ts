import { describe, expect, it } from "vitest"
import { generateId } from "./ids"

const ID_PATTERN = /^[0-9a-zA-Z_-]+$/

describe("generateId", () => {
  it("uses the configured length and character set", () => {
    const ids = Array.from({ length: 100 }, generateId)

    expect(ids.every(id => id.length === 9)).toBe(true)
    expect(ids.every(id => ID_PATTERN.test(id))).toBe(true)
  })
})
