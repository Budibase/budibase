import { OpenAPI2 } from "../../openapi2"
import { readFileSync } from "fs"
import { join } from "path"
import { groupBy, mapValues } from "lodash"
import { BodyType, Query } from "@budibase/types"

const getData = (file: string, extension: string) => {
  return readFileSync(
    join(__dirname, `./data/${file}/${file}.${extension}`),
    "utf8"
  )
}

describe("OpenAPI2 Import", () => {
  let openapi2: OpenAPI2

  beforeEach(() => {
    openapi2 = new OpenAPI2()
  })

  it("validates unsupported data", async () => {
    expect(await openapi2.isSupported("curl http://example.com")).toBe(false)
    expect(await openapi2.isSupported("")).toBe(false)
  })

  describe.each(["json", "yaml"])("%s", extension => {
    describe("petstore", () => {
      beforeEach(async () => {
        await openapi2.isSupported(getData("petstore", extension))
      })

      it("returns import info", async () => {
        const { name } = await openapi2.getInfo()
        expect(name).toBe("Swagger Petstore")
      })
    })

    describe("crud", () => {
      let queries: Record<string, Query>
      beforeEach(async () => {
        await openapi2.isSupported(getData("crud", extension))

        const raw = await openapi2.getQueries("fake_datasource_id")
        queries = mapValues(groupBy(raw, "name"), group => group[0])
      })

      it("should have 6 queries", () => {
        expect(Object.keys(queries).length).toBe(6)
      })

      it.each([
        ["createEntity", "create"],
        ["getEntities", "read"],
        ["getEntity", "read"],
        ["updateEntity", "update"],
        ["patchEntity", "patch"],
        ["deleteEntity", "delete"],
      ])("should have correct verb for %s", (operationId, method) => {
        expect(queries[operationId].queryVerb).toBe(method)
      })

      it.each([
        ["createEntity", "http://example.com/entities"],
        ["getEntities", "http://example.com/entities"],
        ["getEntity", "http://example.com/entities/{{entityId}}"],
        ["updateEntity", "http://example.com/entities/{{entityId}}"],
        ["patchEntity", "http://example.com/entities/{{entityId}}"],
        ["deleteEntity", "http://example.com/entities/{{entityId}}"],
      ])("should have correct path for %s", (operationId, urlPath) => {
        expect(queries[operationId].fields.path).toBe(urlPath)
      })

      it.each([
        ["createEntity", { "Content-Type": "application/json" }],
        ["getEntities", {}],
        ["getEntity", {}],
        ["updateEntity", { "Content-Type": "application/json" }],
        ["patchEntity", { "Content-Type": "application/json" }],
        ["deleteEntity", { "x-api-key": "{{x-api-key}}" }],
      ])(`should have correct headers for %s`, (operationId, headers) => {
        expect(queries[operationId].fields.headers).toStrictEqual(headers)
      })

      it.each([
        ["createEntity", ""],
        ["getEntities", "page={{page}}&size={{size}}"],
        ["getEntity", ""],
        ["updateEntity", ""],
        ["patchEntity", ""],
        ["deleteEntity", ""],
      ])(
        `should have correct query string for %s`,
        (operationId, queryString) => {
          expect(queries[operationId].fields.queryString).toBe(queryString)
        }
      )

      it.each([
        [
          "createEntity",
          [
            { name: "name", default: "name" },
            { name: "type", default: "type" },
          ],
        ],
        [
          "getEntities",
          [
            { name: "page", default: "" },
            { name: "size", default: "" },
          ],
        ],
        ["getEntity", [{ name: "entityId", default: "" }]],
        [
          "updateEntity",
          [
            { name: "entityId", default: "" },
            { name: "id", default: "1" },
            { name: "name", default: "name" },
            { name: "type", default: "type" },
          ],
        ],
        [
          "patchEntity",
          [
            { name: "entityId", default: "" },
            { name: "id", default: "1" },
            { name: "name", default: "name" },
            { name: "type", default: "type" },
          ],
        ],
        [
          "deleteEntity",
          [
            { name: "entityId", default: "" },
            { name: "x-api-key", default: "" },
          ],
        ],
      ])(`should have correct parameters for %s`, (operationId, parameters) => {
        expect(queries[operationId].parameters).toStrictEqual(parameters)
      })

      it.each([
        [
          "createEntity",
          `{
  "name": "{{ name }}",
  "type": "{{ type }}"
}`,
        ],
        ["getEntities", undefined],
        ["getEntity", undefined],
        [
          "updateEntity",
          `{
  "id": {{ id }},
  "name": "{{ name }}",
  "type": "{{ type }}"
}`,
        ],
        [
          "patchEntity",
          `{
  "id": {{ id }},
  "name": "{{ name }}",
  "type": "{{ type }}"
}`,
        ],
        ["deleteEntity", undefined],
      ])(`should have correct body for %s`, (operationId, body) => {
        expect(queries[operationId].fields.requestBody).toBe(body)
      })
    })

    it("sets encoded body type for form content", async () => {
      const spec = JSON.stringify({
        swagger: "2.0",
        info: {
          title: "Form Import",
          version: "1.0.0",
        },
        paths: {
          "/customers": {
            post: {
              consumes: ["application/x-www-form-urlencoded"],
              parameters: [
                {
                  in: "body",
                  name: "payload",
                  schema: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                      },
                      address: {
                        type: "object",
                        properties: {
                          city: {
                            type: "string",
                          },
                          postal_code: {
                            type: "string",
                          },
                        },
                      },
                      cash_balance: {
                        type: "object",
                        properties: {
                          settings: {
                            type: "object",
                            properties: {
                              reconciliation_mode: {
                                type: "string",
                              },
                            },
                          },
                        },
                      },
                      expand: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                      },
                      description: {
                        type: "string",
                      },
                    },
                  },
                },
              ],
              responses: {
                default: {
                  description: "created",
                },
              },
            },
          },
        },
      })

      const supported = await openapi2.isSupported(spec)
      expect(supported).toBe(true)

      const [query] = await openapi2.getQueries("datasourceId")
      expect(query.fields.bodyType).toBe(BodyType.ENCODED)
      expect(query.fields.headers?.["Content-Type"]).toBe(
        "application/x-www-form-urlencoded"
      )
      expect(query.fields.requestBody).toEqual({
        name: "{{ name }}",
        "address[city]": "{{ address_city }}",
        "address[postal_code]": "{{ address_postal_code }}",
        description: "{{ description }}",
        "cash_balance[settings][reconciliation_mode]":
          "{{ cash_balance_settings_reconciliation_mode }}",
        "expand[]": "{{ expand }}",
      })
      expect(query.parameters).toEqual(
        expect.arrayContaining([
          { name: "name", default: "" },
          { name: "address_city", default: "" },
          { name: "address_postal_code", default: "" },
          { name: "description", default: "" },
          { name: "cash_balance_settings_reconciliation_mode", default: "" },
          { name: "expand", default: "" },
        ])
      )
    })

    it("builds form-data bodies from parameters", async () => {
      const spec = JSON.stringify({
        swagger: "2.0",
        info: {
          title: "Slack",
          version: "1.0.0",
        },
        paths: {
          "/stars.add": {
            post: {
              operationId: "starsAdd",
              parameters: [
                {
                  name: "token",
                  in: "header",
                  type: "string",
                  required: true,
                },
                {
                  name: "channel",
                  in: "formData",
                  type: "string",
                },
                {
                  name: "file",
                  in: "formData",
                  type: "string",
                },
                {
                  name: "file_comment",
                  in: "formData",
                  type: "string",
                },
                {
                  name: "timestamp",
                  in: "formData",
                  type: "string",
                },
              ],
              responses: {
                200: {
                  description: "OK",
                },
              },
            },
          },
        },
      })

      const supported = await openapi2.isSupported(spec)
      expect(supported).toBe(true)

      const [query] = await openapi2.getQueries("datasourceId")
      expect(query.fields.bodyType).toBe(BodyType.ENCODED)
      expect(query.fields.headers?.["Content-Type"]).toBe(
        "application/x-www-form-urlencoded"
      )
      expect(query.fields.requestBody).toEqual({
        channel: "{{ channel }}",
        file: "{{ file }}",
        file_comment: "{{ file_comment }}",
        timestamp: "{{ timestamp }}",
      })
      expect(query.parameters).toEqual(
        expect.arrayContaining([
          { name: "token", default: "" },
          { name: "channel", default: "" },
          { name: "file", default: "" },
          { name: "file_comment", default: "" },
          { name: "timestamp", default: "" },
        ])
      )
    })

    it("avoids bodies for GET operations even when consumes is defined", async () => {
      const spec = JSON.stringify({
        swagger: "2.0",
        info: {
          title: "Slack",
          version: "1.0.0",
        },
        paths: {
          "/bots.info": {
            get: {
              operationId: "getBotInfo",
              consumes: ["application/x-www-form-urlencoded"],
              parameters: [
                {
                  name: "bot",
                  in: "query",
                  type: "string",
                  required: false,
                },
              ],
              responses: {
                200: {
                  description: "OK",
                },
              },
            },
          },
        },
      })

      const supported = await openapi2.isSupported(spec)
      expect(supported).toBe(true)

      const [query] = await openapi2.getQueries("datasourceId")
      expect(query.queryVerb).toBe("read")
      expect(query.fields.bodyType).toBe(BodyType.NONE)
      expect(query.fields.requestBody).toBeUndefined()
    })
  })
})
