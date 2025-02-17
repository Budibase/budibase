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
})
