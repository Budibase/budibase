import type { QuerySchema } from "@budibase/types"
import { basicQuery } from "../../../tests/utilities/structures"
import {
  FUNCTION_QUERY_RESPONSE_LIMITS,
  inferQueryResponseSchema,
  renderQueryResponseType,
} from "./responseTypes"

describe("saved query response types", () => {
  const infer = (schema: Record<string, QuerySchema | string>) =>
    inferQueryResponseSchema({
      query: { ...basicQuery("datasource_test"), schema },
    })

  it("uses saved scalar types and keeps JSON and array contents generic", () => {
    expect(
      infer({
        name: "string",
        count: { type: "number", name: "Count" },
        enabled: { type: "boolean" },
        date: { type: "datetime" },
        object: { type: "json" },
        values: { type: "array" },
        children: { type: "json", subtype: "array" },
      })
    ).toEqual({
      fields: [
        { name: "children", type: "array" },
        { name: "count", type: "number" },
        { name: "date", type: "string" },
        { name: "enabled", type: "boolean" },
        { name: "name", type: "string" },
        { name: "object", type: "json" },
        { name: "values", type: "array" },
      ],
    })
  })

  it.each<Record<string, QuerySchema | string>>([
    {},
    { value: "unknown" },
    { value: { type: "number", subtype: "string" } },
    { value: { type: "json", subtype: "unknown" } },
    { value: { type: "string | never" } },
    { value: "__proto__" },
    { supported: "string", unsupported: "relationship" },
  ])("falls back for empty or unsupported metadata: %o", schema => {
    expect(renderQueryResponseType({ schema: infer(schema) })).toBe("JsonValue")
  })

  it("falls back for missing and recursive schemas", () => {
    const missing = basicQuery("datasource_test")
    Reflect.deleteProperty(missing, "schema")
    const recursive: QuerySchema = { type: "json" }
    Object.assign(recursive, { type: recursive })
    expect(inferQueryResponseSchema({ query: missing })).toBeUndefined()
    expect(
      inferQueryResponseSchema({
        query: Object.assign(basicQuery("datasource_test"), { schema: null }),
      })
    ).toBeUndefined()
    expect(
      inferQueryResponseSchema({
        query: {
          ...basicQuery("datasource_test"),
          schema: { value: recursive },
        },
      })
    ).toBeUndefined()
  })

  it("bounds field count, name length and emitted bytes", () => {
    const { maxFields, maxFieldNameLength } = FUNCTION_QUERY_RESPONSE_LIMITS
    expect(
      infer(
        Object.fromEntries(
          Array.from({ length: maxFields + 1 }, (_, i) => [
            `field${i}`,
            "string",
          ])
        )
      )
    ).toBeUndefined()
    expect(
      infer({ ["x".repeat(maxFieldNameLength + 1)]: "string" })
    ).toBeUndefined()
    expect(
      infer(
        Object.fromEntries(
          Array.from({ length: maxFields }, (_, i) => [
            `${i}${"x".repeat(250)}`,
            "string",
          ])
        )
      )
    ).toBeUndefined()
    expect(
      renderQueryResponseType({
        schema: {
          fields: Array.from({ length: maxFields + 1 }, (_, i) => ({
            name: `field${i}`,
            type: "string",
          })),
        },
      })
    ).toBe("JsonValue")
  })

  it("ignores nested preview samples that cannot establish homogeneous arrays", () => {
    const query = {
      ...basicQuery("datasource_test"),
      schema: { items: { type: "json", subtype: "array" } },
      nestedSchemaFields: { items: { value: "string" } },
    }
    const before = inferQueryResponseSchema({ query })
    query.nestedSchemaFields.items.value = "number"
    expect(inferQueryResponseSchema({ query })).toEqual(before)
    expect(renderQueryResponseType({ schema: before })).toContain(
      '"items"?: JsonValue[] | null'
    )
  })
})
