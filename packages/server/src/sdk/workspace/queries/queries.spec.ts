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

    // Regression tests for #18935 - request body bindings were escaping
    // newlines and stripping helpers.
    describe("#18935 binding escaping/helper expansion", () => {
      const currentYear = new Date().getFullYear().toString()

      it("expands helpers placed directly in the JSON body template", async () => {
        const result = await enrichContext({
          requestBody: `{ "text": "Today is {{ date now }}" }`,
        })

        const text = (result.json as any).text
        expect(text).not.toContain("{{")
        expect(text).toContain(currentYear)
      })

      it("preserves real newlines from a binding value (no escaping)", async () => {
        const result = await enrichContext(
          { requestBody: `{ "text": "{{ message }}" }` },
          { message: "Line1\nLine2" }
        )

        expect((result.json as any).text).toBe("Line1\nLine2")
      })

      it("renders a binding referenced as a raw (unquoted) JSON value", async () => {
        const result = await enrichContext(
          { requestBody: `{ "chat_id": 12345, "text": {{ message }} }` },
          { message: "This is a test\n\nFrom Budibase" }
        )

        expect(result.json).toEqual({
          chat_id: 12345,
          text: "This is a test\n\nFrom Budibase",
        })
      })

      it("expands a helper from a parameter value and preserves its newlines", async () => {
        const enrichedParams = await enrichContext(
          { message: "This is a test\n\nFrom Budibase\n\n{{ date now }}" },
          {}
        )
        expect(enrichedParams.message).toContain("This is a test\n\nFrom")
        expect(enrichedParams.message).toContain(currentYear)
        expect(enrichedParams.message).not.toContain("{{")

        const result = await enrichContext(
          { requestBody: `{ "chat_id": 12345, "text": {{ message }} }` },
          enrichedParams
        )

        const text = (result.json as any).text
        expect(text).toBe(enrichedParams.message)
        expect(JSON.stringify(result.json)).not.toContain("\\\\n")
      })

      it("renders bindings the same way for form-data style object bodies", async () => {
        const result = await enrichContext(
          { requestBody: `{ "text": "{{ message }}" }` },
          { message: "Line1\nLine2" }
        )

        expect((result.json as any).text).toBe("Line1\nLine2")
      })

      it("does not re-evaluate handlebars contained within binding values", async () => {
        // handlebars in resolved data must be left as-is (no template injection)
        const result = await enrichContext(
          { requestBody: `{ "text": "{{ message }}" }` },
          { message: "no eval {{ js return 1 }}" }
        )

        expect((result.json as any).text).toBe("no eval {{ js return 1 }}")
      })
    })
  })
})
