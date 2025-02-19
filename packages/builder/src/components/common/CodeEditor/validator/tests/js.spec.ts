import { validateJsTemplate } from "../js"
import { CodeValidator } from "@/types"

describe("js validator", () => {
  it("validates valid code", () => {
    const text = "return 7"
    const validators = {}

    const result = validateJsTemplate(text, validators)
    expect(result).toEqual([])
  })

  it("does not validate runtime errors", () => {
    const text = "return a"
    const validators = {}

    const result = validateJsTemplate(text, validators)
    expect(result).toEqual([])
  })

  it("validates multiline code", () => {
    const text = "const foo='bar'\nreturn 123"
    const validators = {}

    const result = validateJsTemplate(text, validators)
    expect(result).toEqual([])
  })

  describe("helpers", () => {
    const validators: CodeValidator = {
      helperFunction: {
        arguments: ["a", "b", "c"],
      },
    }

    it("validates helpers with valid params", () => {
      const text = "return helpers.helperFunction(1, 99, 'a')"

      const result = validateJsTemplate(text, validators)
      expect(result).toHaveLength(0)
    })

    it("throws on too few params", () => {
      const text = "return helpers.helperFunction(100)"

      const result = validateJsTemplate(text, validators)
      expect(result).toEqual([
        {
          from: 7,
          message: `Function "helperFunction" expects 3 parameters (a, b, c), but got 1.`,
          severity: "error",
          to: 34,
        },
      ])
    })

    it("throws on too many params", () => {
      const text = "return helpers.helperFunction( 1, 99, 'a', 100)"

      const result = validateJsTemplate(text, validators)
      expect(result).toEqual([
        {
          from: 7,
          message: `Function "helperFunction" expects 3 parameters (a, b, c), but got 4.`,
          severity: "error",
          to: 47,
        },
      ])
    })
  })
})
