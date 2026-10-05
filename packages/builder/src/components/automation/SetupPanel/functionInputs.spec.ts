import { describe, expect, it } from "vitest"
import { encodeJSBinding } from "@budibase/string-templates"
import type { FunctionInputType, JSONValue } from "@budibase/types"
import { parseFunctionInputValue } from "./functionInputs"

const cases: { type: FunctionInputType; text: string; value: JSONValue }[] = [
  { type: "string", text: "Ada", value: "Ada" },
  { type: "number", text: "0", value: 0 },
  { type: "boolean", text: "false", value: false },
  { type: "object", text: '{"nested":true}', value: { nested: true } },
  { type: "array", text: "[1,null]", value: [1, null] },
]

describe("Function automation inputs", () => {
  it.each(cases)("saves literal $type inputs", ({ type, text, value }) => {
    expect(
      parseFunctionInputValue({ input: { name: "value", type }, text })
    ).toEqual({ value })
  })

  it.each(cases)("preserves $type bindings", ({ type }) => {
    const text = "{{ steps.1.output }}"
    expect(
      parseFunctionInputValue({ input: { name: "value", type }, text })
    ).toEqual({ value: text })
  })

  it.each(cases)("preserves JavaScript $type bindings", ({ type, value }) => {
    const text = encodeJSBinding(`return ${JSON.stringify(value)}`)
    expect(
      parseFunctionInputValue({ input: { name: "value", type }, text })
    ).toEqual({ value: text })
  })

  it.each(cases)("removes cleared $type inputs", ({ type }) => {
    expect(
      parseFunctionInputValue({ input: { name: "value", type }, text: "" })
    ).toEqual({})
  })

  it.each(["number", "boolean", "object", "array"] as const)(
    "rejects an invalid %s literal",
    type => {
      expect(
        parseFunctionInputValue({
          input: { name: "value", type },
          text: '"invalid"',
        }).error
      ).toBeDefined()
    }
  )
})
