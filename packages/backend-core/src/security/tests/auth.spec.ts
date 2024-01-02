import { validatePassword } from "../auth"

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
  })
})
