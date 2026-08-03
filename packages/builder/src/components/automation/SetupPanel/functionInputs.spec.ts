import { describe, expect, it } from "vitest"
import { isFunctionInputsObject } from "./functionInputs"

describe("Function automation inputs", () => {
  it("accepts JSON objects and bindable input expressions", () => {
    expect(isFunctionInputsObject('{"name":"Ada"}')).toBe(true)
    expect(isFunctionInputsObject('{"name":"{{ steps.1.name }}"}')).toBe(true)
    expect(isFunctionInputsObject("{{ steps.1.output }}")).toBe(true)
  })

  it("rejects invalid JSON and non-object JSON values", () => {
    expect(isFunctionInputsObject("invalid")).toBe(false)
    expect(isFunctionInputsObject("[]")).toBe(false)
    expect(isFunctionInputsObject('"value"')).toBe(false)
    expect(isFunctionInputsObject("null")).toBe(false)
  })
})
