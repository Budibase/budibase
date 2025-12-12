import fs from "fs"
import path from "path"
import SwaggerParser from "@apidevtools/swagger-parser"
import { BodyType } from "@budibase/types"

import { OpenAPI3 } from "../../openapi3"

const getData = (file: string, extension: string) => {
  return fs.readFileSync(
    path.join(__dirname, `./data/${file}/${file}.${extension}`),
    "utf8"
  )
}

describe("OpenAPI3 Import", () => {
  let openapi3: OpenAPI3

  beforeEach(() => {
    openapi3 = new OpenAPI3()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("validates unsupported data", async () => {
    let data
    let supported

    // non json / yaml
    data = "curl http://example.com"
    supported = await openapi3.tryLoad(data)
    expect(supported).toBe(false)

    // Empty
    data = ""
    supported = await openapi3.tryLoad(data)
    expect(supported).toBe(false)
  })

  it("falls back when validation fails", async () => {
    const parseSpy = jest.spyOn(SwaggerParser, "parse")
    const validateSpy = jest.spyOn(SwaggerParser, "validate")
    const dereferenceSpy = jest.spyOn(SwaggerParser, "dereference")

    const document = {
      openapi: "3.0.0",
      info: {},
      paths: {},
    } as any

    parseSpy.mockResolvedValue(document)
    validateSpy.mockRejectedValue(new Error("validation failed"))
    const dereferenced = { ...document, dereferenced: true }
    dereferenceSpy.mockResolvedValue(dereferenced)

    const supported = await openapi3.tryLoad("{}")
    expect(supported).toBe(true)
    expect(openapi3.document).toBe(dereferenced)

    expect(parseSpy).toHaveBeenCalled()
    expect(validateSpy).toHaveBeenCalled()
    expect(dereferenceSpy).toHaveBeenCalled()
  })

  it("creates bindings for server variables", async () => {
    const spec = JSON.stringify({
      openapi: "3.0.0",
      info: {
        title: "Server Variables",
      },
      servers: [
        {
          url: "https://{subdomain}.{domain}.com/api",
          variables: {
            subdomain: {
              default: "example",
            },
            domain: {
              default: "zendesk",
            },
          },
        },
      ],
      paths: {
        "/trigger_categories/jobs": {
          post: {
            operationId: "BatchOperateTriggerCategories",
            responses: {
              default: {
                description: "ok",
              },
            },
          },
        },
      },
    })

    const supported = await openapi3.tryLoad(spec)
    expect(supported).toBe(true)

    const [query] = openapi3.getQueries("datasourceId")
    expect(query.fields.path).toBe(
      "https://{{subdomain}}.{{domain}}.com/api/trigger_categories/jobs"
    )
    expect(query.parameters).toEqual(
      expect.arrayContaining([
        {
          name: "subdomain",
          default: "example",
        },
        {
          name: "domain",
          default: "zendesk",
        },
      ])
    )
  })

  it("binds server variables to datasource statics when available", async () => {
    const spec = JSON.stringify({
      openapi: "3.0.0",
      info: {
        title: "Server Variables",
      },
      servers: [
        {
          url: "https://{subdomain}.{domain}.com/api",
          variables: {
            subdomain: {
              default: "example",
            },
            domain: {
              default: "zendesk",
            },
          },
        },
      ],
      paths: {
        "/trigger_categories/jobs": {
          post: {
            operationId: "BatchOperateTriggerCategories",
            responses: {
              default: {
                description: "ok",
              },
            },
          },
        },
      },
    })

    await openapi3.tryLoad(spec)

    const [query] = openapi3.getQueries("datasourceId", {
      staticVariables: {
        subdomain: "example",
        domain: "zendesk",
      },
    })

    expect(query.parameters).toEqual(
      expect.arrayContaining([
        {
          name: "subdomain",
          default: "{{ subdomain }}",
        },
        {
          name: "domain",
          default: "{{ domain }}",
        },
      ])
    )
  })

  const runTests = async (
    filename: string,
    test: (file: any, extension: any, assertions: any) => Promise<void>,
    assertions?: any
  ) => {
    for (let extension of ["json", "yaml"]) {
      await test(filename, extension, assertions)
    }
  }

  const testImportInfo = async (file: string, extension: string) => {
    await openapi3.tryLoad(getData(file, extension))
    const info = openapi3.getInfo()
    expect(info.name).toBe("Swagger Petstore - OpenAPI 3.0")
  }

  it("returns import info", async () => {
    await runTests("petstore", testImportInfo)
  })

  describe("Returns queries", () => {
    const indexQueries = (queries: any[]) => {
      return queries.reduce(
        (acc: { [x: string]: any }, query: { name: string | number }) => {
          acc[query.name] = query
          return acc
        },
        {}
      )
    }

    const getQueries = async (file: string, extension: string) => {
      await openapi3.tryLoad(getData(file, extension))
      const queries = openapi3.getQueries("datasourceId")
      expect(queries.length).toBe(6)
      return indexQueries(queries)
    }

    const testVerb = async (
      file: any,
      extension: any,
      assertions: { [s: string]: unknown } | ArrayLike<unknown>
    ) => {
      const queries = await getQueries(file, extension)
      for (let [operationId, method] of Object.entries(assertions)) {
        expect(queries[operationId].queryVerb).toBe(method)
      }
    }

    it("populates verb", async () => {
      const assertions = {
        createEntity: "create",
        getEntities: "read",
        getEntity: "read",
        updateEntity: "update",
        patchEntity: "patch",
        deleteEntity: "delete",
      }
      await runTests("crud", testVerb, assertions)
    })

    const testPath = async (
      file: any,
      extension: any,
      assertions: { [s: string]: unknown } | ArrayLike<unknown>
    ) => {
      const queries = await getQueries(file, extension)
      for (let [operationId, urlPath] of Object.entries(assertions)) {
        expect(queries[operationId].fields.path).toBe(urlPath)
      }
    }

    it("populates path", async () => {
      const assertions = {
        createEntity: "http://example.com/entities",
        getEntities: "http://example.com/entities",
        getEntity: "http://example.com/entities/{{entityId}}",
        updateEntity: "http://example.com/entities/{{entityId}}",
        patchEntity: "http://example.com/entities/{{entityId}}",
        deleteEntity: "http://example.com/entities/{{entityId}}",
      }
      await runTests("crud", testPath, assertions)
    })

    const testHeaders = async (
      file: any,
      extension: any,
      assertions: { [s: string]: unknown } | ArrayLike<unknown>
    ) => {
      const queries = await getQueries(file, extension)
      for (let [operationId, headers] of Object.entries(assertions)) {
        expect(queries[operationId].fields.headers).toStrictEqual(headers)
      }
    }

    const contentTypeHeader = {
      "Content-Type": "application/json",
    }

    it("populates headers", async () => {
      const assertions = {
        createEntity: {
          ...contentTypeHeader,
        },
        getEntities: {},
        getEntity: {},
        updateEntity: {
          ...contentTypeHeader,
        },
        patchEntity: {
          ...contentTypeHeader,
        },
        deleteEntity: {
          "x-api-key": "{{x-api-key}}",
        },
      }

      await runTests("crud", testHeaders, assertions)
    })

    it("sets encoded body type for form content", async () => {
      const spec = JSON.stringify({
        openapi: "3.0.0",
        info: {
          title: "Form Import",
        },
        paths: {
          "/customers": {
            post: {
              requestBody: {
                required: true,
                content: {
                  "application/x-www-form-urlencoded": {
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
                },
              },
              responses: {
                default: {
                  description: "created",
                },
              },
            },
          },
        },
      })

      const supported = await openapi3.tryLoad(spec)
      expect(supported).toBe(true)

      const [query] = openapi3.getQueries("datasourceId")
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
          { name: "cash_balance_settings_reconciliation_mode", default: "" },
          { name: "expand", default: "" },
          { name: "description", default: "" },
        ])
      )
    })

    const testQuery = async (
      file: any,
      extension: any,
      assertions: { [s: string]: unknown } | ArrayLike<unknown>
    ) => {
      const queries = await getQueries(file, extension)
      for (let [operationId, queryString] of Object.entries(assertions)) {
        expect(queries[operationId].fields.queryString).toStrictEqual(
          queryString
        )
      }
    }

    it("populates query", async () => {
      const assertions = {
        createEntity: "",
        getEntities: "page={{page}}&size={{size}}",
        getEntity: "",
        updateEntity: "",
        patchEntity: "",
        deleteEntity: "",
      }
      await runTests("crud", testQuery, assertions)
    })

    const testParameters = async (
      file: any,
      extension: any,
      assertions: { [s: string]: unknown } | ArrayLike<unknown>
    ) => {
      const queries = await getQueries(file, extension)
      for (let [operationId, parameters] of Object.entries(assertions)) {
        expect(queries[operationId].parameters).toStrictEqual(parameters)
      }
    }

    it("populates parameters", async () => {
      const assertions = {
        createEntity: [
          {
            name: "name",
            default: "name",
          },
          {
            name: "type",
            default: "type",
          },
        ],
        getEntities: [
          {
            name: "page",
            default: "",
          },
          {
            name: "size",
            default: "",
          },
        ],
        getEntity: [
          {
            name: "entityId",
            default: "",
          },
        ],
        updateEntity: [
          {
            name: "entityId",
            default: "",
          },
          {
            name: "id",
            default: "1",
          },
          {
            name: "name",
            default: "name",
          },
          {
            name: "type",
            default: "type",
          },
        ],
        patchEntity: [
          {
            name: "entityId",
            default: "",
          },
          {
            name: "id",
            default: "1",
          },
          {
            name: "name",
            default: "name",
          },
          {
            name: "type",
            default: "type",
          },
        ],
        deleteEntity: [
          {
            name: "entityId",
            default: "",
          },
          {
            name: "x-api-key",
            default: "",
          },
        ],
      }
      await runTests("crud", testParameters, assertions)
    })

    const testBody = async (
      file: any,
      extension: any,
      assertions: { [s: string]: unknown } | ArrayLike<unknown>
    ) => {
      const queries = await getQueries(file, extension)
      for (let [operationId, body] of Object.entries(assertions)) {
        expect(queries[operationId].fields.requestBody).toStrictEqual(body)
      }
    }
    it("populates body", async () => {
      const assertions = {
        createEntity: `{
  "name": "{{ name }}",
  "type": "{{ type }}"
}`,
        getEntities: undefined,
        getEntity: undefined,
        updateEntity: `{
  "id": {{ id }},
  "name": "{{ name }}",
  "type": "{{ type }}"
}`,
        patchEntity: `{
  "id": {{ id }},
  "name": "{{ name }}",
  "type": "{{ type }}"
}`,
        deleteEntity: undefined,
      }
      await runTests("crud", testBody, assertions)
    })
  })
})
