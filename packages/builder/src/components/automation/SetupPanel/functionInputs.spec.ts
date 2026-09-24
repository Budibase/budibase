import { describe, expect, it } from "vitest"
import { parseFunctionInputsObject } from "./functionInputs"

describe("Function automation inputs", () => {
  it("accepts JSON objects with bindable values", () => {
    expect(parseFunctionInputsObject('{"name":"Ada"}')).toEqual({
      name: "Ada",
    })
    expect(parseFunctionInputsObject('{"name":"{{ steps.1.name }}"}')).toEqual({
      name: "{{ steps.1.name }}",
    })
    expect(parseFunctionInputsObject("{}")).toEqual({})
  })

  it("rejects invalid JSON and non-object JSON values", () => {
    expect(parseFunctionInputsObject("invalid")).toBeUndefined()
    expect(parseFunctionInputsObject("[]")).toBeUndefined()
    expect(parseFunctionInputsObject('"value"')).toBeUndefined()
    expect(parseFunctionInputsObject("null")).toBeUndefined()
    expect(parseFunctionInputsObject("{{ steps.1.output }}")).toBeUndefined()
  })
})
