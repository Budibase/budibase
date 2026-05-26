// @vitest-environment jsdom
import { describe, expect, it } from "vitest"
import { FieldType, type UIFieldValidationRule } from "@budibase/types"
import { createValidatorFromConstraints } from "./validation"

describe("form validation", () => {
  it("accepts valid URLs", () => {
    const rules: UIFieldValidationRule[] = [
      {
        type: FieldType.STRING,
        constraint: "url",
        error: "Invalid URL",
      },
    ]

    const validator = createValidatorFromConstraints(
      null,
      rules,
      "website",
      undefined
    )

    expect(validator("https://budibase.com")).toBeNull()
    expect(validator("http://budibase.com/pricing")).toBeNull()
  })

  it("rejects invalid URLs while leaving empty values to other rules", () => {
    const rules: UIFieldValidationRule[] = [
      {
        type: FieldType.STRING,
        constraint: "url",
        error: "Invalid URL",
      },
    ]

    const validator = createValidatorFromConstraints(
      null,
      rules,
      "website",
      undefined
    )

    expect(validator("budibase.com")).toBe("Invalid URL")
    expect(validator("javascript:alert(1)")).toBe("Invalid URL")
    expect(validator("mailto:test@example.com")).toBe("Invalid URL")
    expect(validator("ftp://example.com")).toBe("Invalid URL")
    expect(validator("")).toBeNull()
    expect(validator(null)).toBeNull()
  })
})
