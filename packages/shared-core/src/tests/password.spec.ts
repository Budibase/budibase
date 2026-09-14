import type { PasswordPolicy } from "@budibase/types"
import { validatePasswordPolicy } from "../password"

const policy: PasswordPolicy = {
  minLength: 8,
  maxLength: 20,
  regex: "(?=.*[A-Z])(?=.*[0-9]).+",
  regexErrorMessage: "Use an uppercase letter and a number.",
}

describe("validatePasswordPolicy", () => {
  it("validates length before the custom regex", () => {
    expect(validatePasswordPolicy({ password: "short", policy })).toEqual({
      valid: false,
      error: "Password invalid. Minimum 8 characters.",
    })
  })

  it("requires the whole password to match", () => {
    expect(
      validatePasswordPolicy({
        password: "xValid123y",
        policy: {
          ...policy,
          regex: "Valid123",
          regexErrorMessage: "Use the configured password.",
        },
      })
    ).toEqual({
      valid: false,
      error: "Use the configured password.",
    })
  })

  it("returns the configured regex error", () => {
    expect(
      validatePasswordPolicy({ password: "lowercaseonly", policy })
    ).toEqual({
      valid: false,
      error: "Use an uppercase letter and a number.",
    })
  })

  it("can exempt a temporary password from the regex", () => {
    expect(
      validatePasswordPolicy({
        password: "temporarypassword",
        policy,
        enforceRegex: false,
      })
    ).toEqual({ valid: true })
  })
})
