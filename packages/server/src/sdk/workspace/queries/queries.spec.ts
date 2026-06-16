import { enrichContext } from "./queries"

jest.mock("../../utils", () => ({
  getEnvironmentVariables: jest.fn(() => ({})),
}))

describe("queries SDK", () => {
  describe("enrichContext", () => {
    it.each([
      ["false", false],
      ["0", 0],
      ["null", null],
    ])(
      "keeps JSON primitive request bodies: %s",
      async (template, expected) => {
        const result = await enrichContext({ requestBody: template })

        expect(result.json).toBe(expected)
      }
    )

    it("keeps JSON primitive custom data and removes the customData field", async () => {
      const result = await enrichContext({ customData: "false" })

      expect(result).toEqual({ json: false })
    })

    it("enriches object keys recursively", async () => {
      const result = await enrichContext(
        {
          json: {
            "{{ fieldName }}": "value",
            nested: {
              "{{ nestedFieldName }}": "{{ nestedValue }}",
            },
          },
        },
        {
          fieldName: "dynamicField",
          nestedFieldName: "dynamicNestedField",
          nestedValue: "nested field value",
        }
      )

      expect(result).toEqual({
        json: {
          dynamicField: "value",
          nested: {
            dynamicNestedField: "nested field value",
          },
        },
      })
    })

    it("enriches parsed JSON template keys", async () => {
      const result = await enrichContext(
        {
          json: `{
            "{{ fieldName }}": 9,
            "nested": {
              "{{ nestedFieldName }}": "{{ nestedValue }}"
            }
          }`,
        },
        {
          fieldName: "accommodates",
          nestedFieldName: "label",
          nestedValue: "Apartment",
        }
      )

      expect(result).toEqual({
        json: {
          accommodates: 9,
          nested: {
            label: "Apartment",
          },
        },
      })
    })

    it("falls back to requestBody when json is blank", async () => {
      const result = await enrichContext({
        json: "",
        requestBody: { ok: true },
      })

      expect(result).toEqual({
        json: { ok: true },
        requestBody: { ok: true },
      })
    })

    it("prefers json over customData and requestBody", async () => {
      const result = await enrichContext({
        json: { source: "json" },
        customData: { source: "customData" },
        requestBody: { source: "requestBody" },
      })

      expect(result).toEqual({
        json: { source: "json" },
        requestBody: { source: "requestBody" },
      })
    })

    it.each([
      ["false", false],
      ["0", 0],
      ["null", null],
    ])("prefers falsy json values: %s", async (template, expected) => {
      const result = await enrichContext({
        json: template,
        requestBody: { ok: true },
      })

      expect(result).toEqual({
        json: expected,
        requestBody: { ok: true },
      })
    })
  })
})
