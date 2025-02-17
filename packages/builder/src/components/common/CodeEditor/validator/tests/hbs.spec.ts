import { validateHbsTemplate } from "../hbs"
import { CodeValidator } from "@/types"

describe("hbs validator", () => {
  it("validate empty strings", () => {
    const text = ""
    const validators = {}

    const result = validateHbsTemplate(text, validators)
    expect(result).toHaveLength(0)
  })

  it("validate strings without hbs expressions", () => {
    const text = "first line\nand another one"
    const validators = {}

    const result = validateHbsTemplate(text, validators)
    expect(result).toHaveLength(0)
  })

  describe("basic expressions", () => {
    const validators = {
      fieldName: {},
    }

    it("validate valid expressions", () => {
      const text = "{{ fieldName }}"

      const result = validateHbsTemplate(text, validators)
      expect(result).toHaveLength(0)
    })

    it("throws on invalid expressions", () => {
      const text = "{{ anotherFieldName }}"

      const result = validateHbsTemplate(text, validators)
      expect(result).toEqual([
        {
          from: 0,
          message: `"anotherFieldName" handler does not exist.`,
          severity: "warning",
          to: 22,
        },
      ])
    })

    it("throws on untrimmed invalid expressions", () => {
      const text = "    {{ anotherFieldName }}"

      const result = validateHbsTemplate(text, validators)
      expect(result).toEqual([
        {
          from: 4,
          message: `"anotherFieldName" handler does not exist.`,
          severity: "warning",
          to: 26,
        },
      ])
    })

    it("throws on invalid expressions between valid lines", () => {
      const text =
        "literal expression\nthe value is {{ anotherFieldName }}\nanother expression"

      const result = validateHbsTemplate(text, validators)
      expect(result).toEqual([
        {
          from: 32,
          message: `"anotherFieldName" handler does not exist.`,
          severity: "warning",
          to: 54,
        },
      ])
    })
  })

  describe("expressions with parameters", () => {
    const validators: CodeValidator = {
      helperFunction: {
        arguments: ["a", "b", "c"],
      },
    }

    it("validate valid params", () => {
      const text = "{{ helperFunction 1 99 'a' }}"

      const result = validateHbsTemplate(text, validators)
      expect(result).toHaveLength(0)
    })

    it("throws on too few params", () => {
      const text = "{{ helperFunction 100 }}"

      const result = validateHbsTemplate(text, validators)
      expect(result).toEqual([
        {
          from: 0,
          message: `Helper "helperFunction" expects 3 parameters (a, b, c), but got 1.`,
          severity: "error",
          to: 24,
        },
      ])
    })

    it("throws on too many params", () => {
      const text = "{{ helperFunction  1 99 'a' 100 }}"

      const result = validateHbsTemplate(text, validators)
      expect(result).toEqual([
        {
          from: 0,
          message: `Helper "helperFunction" expects 3 parameters (a, b, c), but got 4.`,
          severity: "error",
          to: 34,
        },
      ])
    })
  })
})
