import { isRequired } from "../schema"

describe("schema utilities", () => {
  describe("isRequired", () => {
    it("not required by default", () => {
      const result = isRequired(undefined)
      expect(result).toBe(false)
    })

    it("required when presence is true", () => {
      const result = isRequired({ presence: true })
      expect(result).toBe(true)
    })

    it("not required when presence is false", () => {
      const result = isRequired({ presence: false })
      expect(result).toBe(false)
    })

    it("not required when presence is an empty object", () => {
      const result = isRequired({ presence: {} })
      expect(result).toBe(false)
    })

    it("not required when allowEmpty is true", () => {
      const result = isRequired({ presence: { allowEmpty: true } })
      expect(result).toBe(false)
    })

    it("required when allowEmpty is false", () => {
      const result = isRequired({ presence: { allowEmpty: false } })
      expect(result).toBe(true)
    })
  })
})
