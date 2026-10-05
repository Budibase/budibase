import type { FunctionInputType, JSONValue } from "@budibase/types"
import {
  getFunctionInputError,
  validateFunctionInputSchema,
} from "./functionInputs"

interface InheritedPropertyTestCase {
  scenario: string
  inputs: Record<string, JSONValue>
  expectedError: string | undefined
}

const cases: {
  type: FunctionInputType
  value: JSONValue
  invalid: JSONValue
}[] = [
  { type: "string", value: "Ada", invalid: 1 },
  { type: "number", value: 0, invalid: "0" },
  { type: "boolean", value: false, invalid: "false" },
  { type: "object", value: { nested: [1, null] }, invalid: [] },
  { type: "array", value: [1, { nested: true }], invalid: {} },
]

describe("Function input definitions", () => {
  it.each(cases)(
    "validates supplied $type inputs without coercion and allows omitted or null values",
    ({ type, value, invalid }) => {
      const inputSchema = [{ name: "value", type }]
      expect(
        getFunctionInputError({ inputSchema, inputs: { value } })
      ).toBeUndefined()
      expect(
        getFunctionInputError({ inputSchema, inputs: { value: invalid } })
      ).toBe(`Input "value" must be of type ${type}.`)
      expect(
        getFunctionInputError({ inputSchema, inputs: { value: null } })
      ).toBeUndefined()
      expect(getFunctionInputError({ inputSchema, inputs: {} })).toBeUndefined()
    }
  )

  it("allows arbitrary JSON inputs when no schema is defined", () => {
    expect(
      getFunctionInputError({ inputs: { arbitrary: [null, 42] } })
    ).toBeUndefined()
  })

  it("rejects duplicate and invalid identifiers", () => {
    expect(
      validateFunctionInputSchema([
        { name: "valid", type: "number" },
        { name: "valid", type: "string" },
        { name: "bad name", type: "array" },
        { name: "newline\n", type: "string" },
      ])
    ).toEqual([
      "Input 2: input names must be unique.",
      "Input 3: use a valid identifier of up to 128 characters.",
      "Input 4: use a valid identifier of up to 128 characters.",
    ])
  })

  it.each<InheritedPropertyTestCase>([
    { scenario: "an omitted", inputs: {}, expectedError: undefined },
    {
      scenario: "a supplied string",
      inputs: { toString: "value" },
      expectedError: undefined,
    },
    {
      scenario: "a supplied number",
      inputs: { toString: 123 },
      expectedError: 'Input "toString" must be of type string.',
    },
  ])(
    "validates $scenario input named after an inherited property",
    ({ inputs, expectedError }) => {
      expect(
        getFunctionInputError({
          inputSchema: [{ name: "toString", type: "string" }],
          inputs,
        })
      ).toBe(expectedError)
    }
  )
})
