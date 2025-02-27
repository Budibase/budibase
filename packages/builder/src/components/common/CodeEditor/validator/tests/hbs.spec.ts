import { validateHbsTemplate } from "../hbs"
import { CodeValidator } from "@/types"

describe("hbs validator", () => {
  it("validates empty strings", () => {
    const text = ""
    const validators = {}

    const result = validateHbsTemplate(text, validators)
    expect(result).toHaveLength(0)
  })

  it("validates strings without hbs expressions", () => {
    const text = "first line\nand another one"
    const validators = {}

    const result = validateHbsTemplate(text, validators)
    expect(result).toHaveLength(0)
  })

  describe("basic expressions", () => {
    const validators = {
      fieldName: {},
    }

    it("validates valid expressions", () => {
      const text = "{{ fieldName }}"

      const result = validateHbsTemplate(text, validators)
      expect(result).toHaveLength(0)
    })

    it("does not throw on missing validations", () => {
      const text = "{{ anotherFieldName }}"

      const result = validateHbsTemplate(text, validators)
      expect(result).toHaveLength(0)
    })

    // Waiting for missing fields validation
    it.skip("throws on untrimmed invalid expressions", () => {
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

    // Waiting for missing fields validation
    it.skip("throws on invalid expressions between valid lines", () => {
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

    describe("expressions with whitespaces", () => {
      const validators = {
        [`field name`]: {},
      }

      it("validates expressions with whitespaces", () => {
        const text = `{{ [field name] }}`

        const result = validateHbsTemplate(text, validators)
        expect(result).toHaveLength(0)
      })

      // Waiting for missing fields validation
      it.skip("throws if not wrapped between brackets", () => {
        const text = `{{ field name }}`

        const result = validateHbsTemplate(text, validators)
        expect(result).toEqual([
          {
            from: 0,
            message: `"field" handler does not exist.`,
            severity: "warning",
            to: 16,
          },
        ])
      })
    })
  })

  describe("expressions with parameters", () => {
    describe("basic expression", () => {
      const validators: CodeValidator = {
        helperFunction: {
          arguments: ["a", "b", "c"],
        },
      }

      it("validates valid params", () => {
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

    describe("body expressions", () => {
      const validators: CodeValidator = {
        bodyFunction: {
          arguments: ["a", "b", "c"],
          requiresBlock: true,
        },
        nonBodyFunction: {
          arguments: ["a", "b"],
        },
      }

      it("validates valid params", () => {
        const text = "{{#bodyFunction 1 99  }}body{{/bodyFunction}}"

        const result = validateHbsTemplate(text, validators)
        expect(result).toHaveLength(0)
      })

      it("validates empty bodies", () => {
        const text = "{{#bodyFunction 1 99  }}{{/bodyFunction}}"

        const result = validateHbsTemplate(text, validators)
        expect(result).toHaveLength(0)
      })

      it("validates too little parameters", () => {
        const text = "{{#bodyFunction 1 }}{{/bodyFunction}}"

        const result = validateHbsTemplate(text, validators)
        expect(result).toEqual([
          {
            from: 0,
            message: `Helper "bodyFunction" expects 3 parameters (a, b, c), but got 2.`,
            severity: "error",
            to: 37,
          },
        ])
      })

      it("validates too many parameters", () => {
        const text = "{{#bodyFunction 1 99 'a' 0 }}{{/bodyFunction}}"

        const result = validateHbsTemplate(text, validators)
        expect(result).toEqual([
          {
            from: 0,
            message: `Helper "bodyFunction" expects 3 parameters (a, b, c), but got 5.`,
            severity: "error",
            to: 46,
          },
        ])
      })

      it("validates non-supported body usages", () => {
        const text = "{{#nonBodyFunction 1 99}}{{/nonBodyFunction}}"

        const result = validateHbsTemplate(text, validators)
        expect(result).toEqual([
          {
            from: 0,
            message: `Helper "nonBodyFunction" should not contain a body.`,
            severity: "error",
            to: 45,
          },
        ])
      })
    })

    describe("optional parameters", () => {
      it("supports empty parameters", () => {
        const validators: CodeValidator = {
          helperFunction: {
            arguments: ["a", "b", "[c]"],
          },
        }
        const text = "{{ helperFunction 1 99 }}"

        const result = validateHbsTemplate(text, validators)
        expect(result).toHaveLength(0)
      })

      it("supports valid parameters", () => {
        const validators: CodeValidator = {
          helperFunction: {
            arguments: ["a", "b", "[c]"],
          },
        }
        const text = "{{ helperFunction 1 99 'a' }}"

        const result = validateHbsTemplate(text, validators)
        expect(result).toHaveLength(0)
      })

      it("returns a valid message on missing parameters", () => {
        const validators: CodeValidator = {
          helperFunction: {
            arguments: ["a", "b", "[c]"],
          },
        }
        const text = "{{ helperFunction 1 }}"

        const result = validateHbsTemplate(text, validators)
        expect(result).toEqual([
          {
            from: 0,
            message: `Helper "helperFunction" expects between 2 to 3 parameters (a, b, c (optional)), but got 1.`,
            severity: "error",
            to: 22,
          },
        ])
      })

      it("returns a valid message on too many parameters", () => {
        const validators: CodeValidator = {
          helperFunction: {
            arguments: ["a", "b", "[c]"],
          },
        }
        const text = "{{ helperFunction 1 2 3 4 }}"

        const result = validateHbsTemplate(text, validators)
        expect(result).toEqual([
          {
            from: 0,
            message: `Helper "helperFunction" expects between 2 to 3 parameters (a, b, c (optional)), but got 4.`,
            severity: "error",
            to: 28,
          },
        ])
      })
    })
  })

  it("validates wrong hbs code", () => {
    const text = "{{#fieldName}}{{/wrong}}"

    const result = validateHbsTemplate(text, {})
    expect(result).toEqual([
      {
        from: 0,
        message: `The handlebars code is not valid:\nfieldName doesn't match wrong - 1:3`,
        severity: "error",
        to: text.length,
      },
    ])
  })
})
