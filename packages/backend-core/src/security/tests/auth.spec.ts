import { generator } from "../../../tests"
import { PASSWORD_MAX_LENGTH, validatePassword } from "../auth"

describe("auth", () => {
  describe("validatePassword", () => {
    it("a valid password returns successful", () => {
      expect(validatePassword("password")).toEqual({ valid: true })
    })

    it.each([
      ["undefined", undefined],
      ["null", null],
      ["empty", ""],
    ])("%s returns unsuccessful", (_, password) => {
      expect(validatePassword(password as string)).toEqual({
        valid: false,
        error: "Password invalid. Minimum eight characters.",
      })
    })

    it.each([
      generator.word({ length: PASSWORD_MAX_LENGTH }),
      generator.paragraph().substring(0, PASSWORD_MAX_LENGTH),
    ])(
      `can use passwords up to ${PASSWORD_MAX_LENGTH} characters in length`,
      password => {
        expect(validatePassword(password as string)).toEqual({
          valid: true,
        })
      }
    )

    it.each([
      generator.word({ length: PASSWORD_MAX_LENGTH + 1 }),
      generator.paragraph().substring(0, PASSWORD_MAX_LENGTH + 1),
    ])("limit password length", password => {
      expect(validatePassword(password as string)).toEqual({
        valid: false,
        error: "Password invalid. Maximum 512 characters.",
      })
    })
  })
})
