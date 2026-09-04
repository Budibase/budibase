import { describe, expect, it } from "vitest"
import { generateTemporaryPassword } from "../password"

describe("generateTemporaryPassword", () => {
  it("uses the default temporary password length when allowed", () => {
    const password = generateTemporaryPassword({
      policy: { minLength: 8, maxLength: 20 },
    })

    expect(password).toHaveLength(12)
    expect(password).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it("respects a higher configured minimum", () => {
    const password = generateTemporaryPassword({
      policy: { minLength: 18, maxLength: 30 },
    })

    expect(password).toHaveLength(18)
  })

  it("respects a configured maximum below the default", () => {
    const password = generateTemporaryPassword({
      policy: { minLength: 6, maxLength: 8 },
    })

    expect(password).toHaveLength(8)
  })
})
