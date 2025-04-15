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

  it("allows return not being on the last line", () => {
    const text = "const foo='bar'\nreturn 123\nconsole.log(foo)"
    const validators = {}

    const result = validateJsTemplate(text, validators)
    expect(result).toEqual([])
  })

  it("throws on missing return", () => {
    const text = "const foo='bar'\nbar='foo'"
    const validators = {}

    const result = validateJsTemplate(text, validators)
    expect(result).toEqual([
      {
        from: 0,
        message: "Your code must return a value.",
        severity: "error",
        to: 25,
      },
    ])
  })

  it("checks that returns are at top level", () => {
    const text = `
    function call(){
      return 1
    }`
    const validators = {}

    const result = validateJsTemplate(text, validators)
    expect(result).toEqual([
      {
        from: 0,
        message: "Your code must return a value.",
        severity: "error",
        to: text.length,
      },
    ])
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
      expect(result).toEqual([])
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

    it("validates helpers on inner functions", () => {
      const text = `function call(){
                      return helpers.helperFunction(1, 99)
                    }
                    return call()`

      const result = validateJsTemplate(text, validators)
      expect(result).toEqual([
        {
          from: 46,
          message: `Function "helperFunction" expects 3 parameters (a, b, c), but got 2.`,
          severity: "error",
          to: 75,
        },
      ])
    })

    it("validates multiple helpers", () => {
      const text =
        "return helpers.helperFunction(1, 99, 'a') + helpers.helperFunction(1) + helpers.another(1) + helpers.another()"
      const validators: CodeValidator = {
        helperFunction: {
          arguments: ["a", "b", "c"],
        },
        another: { arguments: [] },
      }

      const result = validateJsTemplate(text, validators)
      expect(result).toEqual([
        {
          from: 44,
          message: `Function "helperFunction" expects 3 parameters (a, b, c), but got 1.`,
          severity: "error",
          to: 69,
        },
        {
          from: 72,
          message: `Function "another" expects 0 parameters (), but got 1.`,
          severity: "error",
          to: 90,
        },
      ])
    })
  })
})
