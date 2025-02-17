import { validateHbsTemplate } from "../hbs"

describe("hbs validator", () => {
  it("can validate empty strings", () => {
    const text = ""
    const validators = {}

    const result = validateHbsTemplate(text, validators)
    expect(result).toHaveLength(0)
  })

  it("can validate strings without hbs expressions", () => {
    const text = "first line\nand another one"
    const validators = {}

    const result = validateHbsTemplate(text, validators)
    expect(result).toHaveLength(0)
  })

  describe("basic expressions", () => {
    const validators = {
      fieldName: {},
    }

    it("can validate valid expressions", () => {
      const text = "{{ fieldName }}"

      const result = validateHbsTemplate(text, validators)
      expect(result).toHaveLength(0)
    })

    it("can validate invalid expressions", () => {
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

    it("can validate untrimmed invalid expressions", () => {
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

    it("can validate invalid expressions between valid lines", () => {
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
})
