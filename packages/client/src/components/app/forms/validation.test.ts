// @vitest-environment jsdom
import { describe, expect, it } from "vitest"
import { FieldType, type UIFieldValidationRule } from "@budibase/types"
import { createValidatorFromConstraints } from "./validation"

describe("form validation", () => {
  const createUrlValidator = (rule?: Partial<UIFieldValidationRule>) => {
    const rules: UIFieldValidationRule[] = [
      {
        type: FieldType.STRING,
        constraint: "url",
        error: "Invalid URL",
        ...rule,
      },
    ]

    return createValidatorFromConstraints(null, rules, "website", undefined)
  }

  it("accepts valid URLs", () => {
    const validator = createUrlValidator()

    expect(validator("https://budibase.com")).toBeNull()
    expect(validator("http://budibase.com/pricing")).toBeNull()
    expect(validator("www.google.com")).toBeNull()
    expect(validator("http://localhost:10000")).toBeNull()
    expect(validator("http://192.168.0.1/path")).toBeNull()
    expect(validator("http://[2001:db8::1]/path")).toBeNull()
    expect(validator("https://example.com/path%5Csegment")).toBeNull()
  })

  it("rejects invalid URLs while leaving empty values to other rules", () => {
    const validator = createUrlValidator()

    expect(validator("javascript:alert(1)")).toBe("Invalid URL")
    expect(validator("mailto:test@example.com")).toBe("Invalid URL")
    expect(validator("ftp://example.com")).toBe("Invalid URL")
    expect(validator("https://www.g?&^%&^%&^%.com")).toBe("Invalid URL")
    expect(validator("https://example.com\\path")).toBe("Invalid URL")
    expect(
      validator(
        "//////\\\\\\\\\\\\\\\\///////////////\\\\\\\\\\\\\\\\///www.google.com"
      )
    ).toBe("Invalid URL")
    expect(validator("not a url")).toBe("Invalid URL")
    expect(validator("")).toBeNull()
    expect(validator(null)).toBeNull()
  })

  it("respects custom URL protocol restrictions", () => {
    const httpsValidator = createUrlValidator({ value: ["https"] })
    const httpValidator = createUrlValidator({ value: ["http"] })
    const ftpValidator = createUrlValidator({ value: ["ftp"] })
    const mailtoValidator = createUrlValidator({ value: ["mailto"] })

    expect(httpsValidator("https://budibase.com")).toBeNull()
    expect(httpsValidator("www.google.com")).toBeNull()
    expect(httpsValidator("http://budibase.com")).toBe("Invalid URL")

    expect(httpValidator("www.google.com")).toBe("Invalid URL")

    expect(ftpValidator("ftp://example.com")).toBeNull()
    expect(ftpValidator("https://example.com")).toBe("Invalid URL")

    expect(mailtoValidator("mailto:test@example.com")).toBeNull()
    expect(
      mailtoValidator("mailto:test@example.com?subject=Hello&body=World")
    ).toBeNull()
    expect(mailtoValidator("test@example.com")).toBe("Invalid URL")
    expect(mailtoValidator("https://example.com")).toBe("Invalid URL")
  })

  it("accepts valid email addresses", () => {
    const rules: UIFieldValidationRule[] = [
      {
        type: FieldType.STRING,
        constraint: "email",
        error: "Invalid email address",
      },
    ]

    const validator = createValidatorFromConstraints(
      null,
      rules,
      "email",
      undefined
    )

    expect(validator("user@example.com")).toBeNull()
    expect(validator("user.name+tag@example.co.uk")).toBeNull()
  })

  it("rejects invalid email addresses while leaving empty values to other rules", () => {
    const rules: UIFieldValidationRule[] = [
      {
        type: FieldType.STRING,
        constraint: "email",
        error: "Invalid email address",
      },
    ]

    const validator = createValidatorFromConstraints(
      null,
      rules,
      "email",
      undefined
    )

    expect(validator("example.com")).toBe("Invalid email address")
    expect(validator("user@example")).toBe("Invalid email address")
    expect(validator("user name@example.com")).toBe("Invalid email address")
    expect(validator("@example.com")).toBe("Invalid email address")
    expect(validator("")).toBeNull()
    expect(validator(null)).toBeNull()
  })
})
