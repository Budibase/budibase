import type { FunctionQueryResponseSchema } from "@budibase/types"
import {
  FUNCTION_QUERY_RESPONSE_LIMITS,
  renderQueryResponseFields,
  renderQueryResponseType,
} from "../functionDeclarations"

describe("query response fields", () => {
  it("formats every supported field type using the compiler's optional nullable properties", () => {
    const schema: FunctionQueryResponseSchema = {
      fields: [
        { name: 'room "name"', type: "string" },
        { name: "count", type: "number" },
        { name: "enabled", type: "boolean" },
        { name: "details", type: "json" },
        { name: "items", type: "array" },
      ],
    }

    expect(renderQueryResponseFields({ schema })).toEqual([
      '"count"?: number | null',
      '"details"?: JsonValue | null',
      '"enabled"?: boolean | null',
      '"items"?: JsonValue[] | null',
      '"room \\"name\\""?: string | null',
    ])
    expect(renderQueryResponseType({ schema })).toBe(
      'Record<string, JsonValue> & { data: { "count"?: number | null; "details"?: JsonValue | null; "enabled"?: boolean | null; "items"?: JsonValue[] | null; "room \\"name\\""?: string | null }[] }'
    )
  })

  it.each(["future", "constructor"])(
    "falls back for the unsupported field type %s",
    type => {
      const schema: FunctionQueryResponseSchema = {
        fields: [{ name: "name", type: "string" }],
      }
      Reflect.set(schema.fields[0], "type", type)

      expect(renderQueryResponseFields({ schema })).toBeUndefined()
      expect(renderQueryResponseType({ schema })).toBe("JsonValue")
    }
  )

  it("falls back for an oversized response schema", () => {
    const schema: FunctionQueryResponseSchema = {
      fields: Array.from(
        { length: FUNCTION_QUERY_RESPONSE_LIMITS.maxFields + 1 },
        (_, index) => ({ name: `field${index}`, type: "string" })
      ),
    }

    expect(renderQueryResponseFields({ schema })).toBeUndefined()
    expect(renderQueryResponseType({ schema })).toBe("JsonValue")
  })
})
