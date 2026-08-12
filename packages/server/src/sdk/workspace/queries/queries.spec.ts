const mockDbAllDocs = jest.fn().mockResolvedValue({ rows: [] })
const mockGetWorkspaceDB = jest.fn(() => ({
  allDocs: (...args: unknown[]) => mockDbAllDocs(...args),
}))

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getWorkspaceDB: (...args: Parameters<typeof mockGetWorkspaceDB>) =>
        mockGetWorkspaceDB(...args),
    },
  }
})

import { enrichContext, fetch } from "./queries"

jest.mock("../../utils", () => ({
  getEnvironmentVariables: jest.fn(() => ({})),
}))

describe("queries SDK", () => {
  describe("fetch", () => {
    beforeEach(() => {
      jest.clearAllMocks()
      mockDbAllDocs.mockResolvedValue({ rows: [] })
    })

    it("scopes queries to a datasource", async () => {
      await fetch({ enrich: false, datasourceId: "datasource_1" })

      expect(mockDbAllDocs).toHaveBeenCalledWith({
        startkey: "query_datasource_1_",
        endkey: "query_datasource_1_\ufff0",
        include_docs: true,
      })
    })

    it("fetches all workspace queries when no datasource is provided", async () => {
      await fetch({ enrich: false })

      expect(mockDbAllDocs).toHaveBeenCalledWith({
        startkey: "query_",
        endkey: "query_\ufff0",
        include_docs: true,
      })
    })
  })

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

    it("keeps quoted JSON parameters from changing MongoDB query structure", async () => {
      const result = await enrichContext(
        {
          json: '{"username": "{{ username }}"}',
        },
        {
          username: '", "$ne": ""',
        }
      )

      expect(result).toEqual({
        json: {
          username: '", "$ne": ""',
        },
      })
    })

    it("keeps quoted JSON parameters inside MongoDB filter fields", async () => {
      const result = await enrichContext(
        {
          json: '{"filter": {"username": "{{ username }}"}, "options": {}}',
        },
        {
          username: '", "$ne": ""',
        }
      )

      expect(result).toEqual({
        json: {
          filter: {
            username: '", "$ne": ""',
          },
          options: {},
        },
      })
    })

    it("keeps quoted JSON parameters safe in multi-object MongoDB templates", async () => {
      const injected = 'x","name":{"$exists":true},"$comment":"esc'
      const result = await enrichContext(
        {
          json: '{"name":"{{ name }}"} {"$set":{"touched":true}}',
        },
        {
          name: injected,
        }
      )

      expect(result.json).toEqual(
        `${JSON.stringify({ name: injected })} ${JSON.stringify({
          $set: { touched: true },
        })}`
      )
    })

    it("keeps dynamic keys safe in multi-object MongoDB templates", async () => {
      const injectedKey = 'name":{"$exists":true},"$comment'
      const result = await enrichContext(
        {
          json: '{"{{ key }}":"fixed"} {"$set":{"touched":true}}',
        },
        {
          key: injectedKey,
        }
      )

      expect(result.json).toEqual(
        `${JSON.stringify({ [injectedKey]: "fixed" })} ${JSON.stringify({
          $set: { touched: true },
        })}`
      )
    })

    it("keeps triple-brace JSON parameters safe in multi-object MongoDB templates", async () => {
      const injected = 'x","name":{"$exists":true},"$comment":"esc'
      const result = await enrichContext(
        {
          json: '{"criteria": {{{ extra }}}, "name":"{{ name }}"} {"$set":{"touched":true}} {}',
        },
        {
          extra: '{"active":true}',
          name: injected,
        }
      )

      expect(result.json).toEqual(
        `${JSON.stringify({
          criteria: { active: true },
          name: injected,
        })} ${JSON.stringify({ $set: { touched: true } })} {}`
      )
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
