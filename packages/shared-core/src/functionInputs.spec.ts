import type { FunctionInputType, JSONValue } from "@budibase/types"
import {
  getFunctionInputError,
  validateFunctionInputSchema,
} from "./functionInputs"

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
    "validates required and optional $type inputs without coercion",
    ({ type, value, invalid }) => {
      for (const required of [true, false]) {
        const inputSchema = [{ name: "value", type, required }]
        expect(
          getFunctionInputError({ inputSchema, inputs: { value } })
        ).toBeUndefined()
        expect(
          getFunctionInputError({ inputSchema, inputs: { value: invalid } })
        ).toBe('Input "value" must be of type ' + type + ".")
        expect(
          getFunctionInputError({ inputSchema, inputs: { value: null } })
        ).toBe(
          required ? 'Input "value" must be of type ' + type + "." : undefined
        )
        expect(getFunctionInputError({ inputSchema, inputs: {} })).toBe(
          required ? 'Required input "value" is missing.' : undefined
        )
      }
    }
  )

  it("allows arbitrary JSON inputs when no schema is defined", () => {
    expect(
      getFunctionInputError({ inputs: { arbitrary: [null, 42] } })
    ).toBeUndefined()
  })

  it("rejects duplicate and invalid identifiers and bounds descriptions", () => {
    expect(
      validateFunctionInputSchema([
        { name: "valid", type: "number", required: true },
        { name: "valid", type: "string", required: false },
        { name: "bad name", type: "array", required: false },
        { name: "newline\n", type: "string", required: false },
        {
          name: "long",
          type: "string",
          required: false,
          description: "x".repeat(1025),
        },
      ])
    ).toEqual([
      "Input 2: input names must be unique.",
      "Input 3: use a valid identifier of up to 128 characters.",
      "Input 4: use a valid identifier of up to 128 characters.",
      "Input 5: descriptions cannot exceed 1024 characters.",
    ])
  })

  it("does not treat inherited properties as supplied inputs", () => {
    expect(
      getFunctionInputError({
        inputSchema: [{ name: "toString", type: "string", required: true }],
        inputs: {},
      })
    ).toBe('Required input "toString" is missing.')
  })
})
