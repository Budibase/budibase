import { generator } from "../../../tests"
import {
  buildPasswordPolicy,
  PASSWORD_MAX_LENGTH,
  validatePassword,
} from "../auth"

describe("auth", () => {
  describe("validatePassword", () => {
    it("a valid password returns successful", () => {
      expect(validatePassword({ password: "password123!" })).toEqual({
        valid: true,
      })
    })

    it.each([
      ["undefined", undefined],
      ["null", null],
      ["empty", ""],
    ])("%s returns unsuccessful", (_, password) => {
      expect(validatePassword({ password: password as string })).toEqual({
        valid: false,
        error: "Password invalid. Minimum 12 characters.",
      })
    })

    it.each([
      generator.word({ length: PASSWORD_MAX_LENGTH }),
      generator.paragraph().substring(0, PASSWORD_MAX_LENGTH),
    ])(`can use passwords up to 512 characters in length`, password => {
      expect(validatePassword({ password })).toEqual({
        valid: true,
      })
    })

    it.each([
      generator.word({ length: PASSWORD_MAX_LENGTH + 1 }),
      generator
        .paragraph({ sentences: 50 })
        .substring(0, PASSWORD_MAX_LENGTH + 1),
    ])(
      `passwords cannot have more than ${PASSWORD_MAX_LENGTH} characters`,
      password => {
        expect(validatePassword({ password })).toEqual({
          valid: false,
          error: "Password invalid. Maximum 512 characters.",
        })
      }
    )
  })

  describe("buildPasswordPolicy", () => {
    it("builds an optional custom policy", () => {
      expect(
        buildPasswordPolicy({
          minLength: "14",
          maxLength: "100",
          regex: "(?=.*[A-Z])(?=.*[0-9]).+",
          regexErrorMessage: "Use an uppercase letter and a number.",
        })
      ).toEqual({
        minLength: 14,
        maxLength: 100,
        regex: "(?=.*[A-Z])(?=.*[0-9]).+",
        regexErrorMessage: "Use an uppercase letter and a number.",
      })
    })

    it.each([
      [
        { regex: ".+" },
        "PASSWORD_REGEX and PASSWORD_REGEX_ERROR_MESSAGE must be configured together.",
      ],
      [
        { regex: "[", regexErrorMessage: "Invalid" },
        "PASSWORD_REGEX must be a valid JavaScript expression.",
      ],
      [
        { regex: "(a+)+", regexErrorMessage: "Invalid" },
        "PASSWORD_REGEX must not contain unsafe expressions.",
      ],
    ])("rejects invalid configuration", (input, error) => {
      expect(() => buildPasswordPolicy(input)).toThrow(error)
    })
  })
})
