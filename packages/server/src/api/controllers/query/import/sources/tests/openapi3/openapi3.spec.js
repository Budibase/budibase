const fs = require("fs")
const path = require("path")
const SwaggerParser = require("@apidevtools/swagger-parser")

const { OpenAPI3 } = require("../../openapi3")

const getData = (file, extension) => {
  return fs.readFileSync(
    path.join(__dirname, `./data/${file}/${file}.${extension}`),
    "utf8"
  )
}

describe("OpenAPI3 Import", () => {
  let openapi3

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
    supported = await openapi3.isSupported(data)
    expect(supported).toBe(false)

    // Empty
    data = ""
    supported = await openapi3.isSupported(data)
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
    }

    parseSpy.mockResolvedValue(document)
    validateSpy.mockRejectedValue(new Error("validation failed"))
    const dereferenced = { ...document, dereferenced: true }
    dereferenceSpy.mockResolvedValue(dereferenced)

    const supported = await openapi3.isSupported("{}")
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

    const supported = await openapi3.isSupported(spec)
    expect(supported).toBe(true)

    const [query] = await openapi3.getQueries("datasourceId")
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

  const runTests = async (filename, test, assertions) => {
    for (let extension of ["json", "yaml"]) {
      await test(filename, extension, assertions)
    }
  }

  const testImportInfo = async (file, extension) => {
    await openapi3.isSupported(getData(file, extension))
    const info = await openapi3.getInfo()
    expect(info.name).toBe("Swagger Petstore - OpenAPI 3.0")
  }

  it("returns import info", async () => {
    await runTests("petstore", testImportInfo)
  })

  describe("Returns queries", () => {
    const indexQueries = queries => {
      return queries.reduce((acc, query) => {
        acc[query.name] = query
        return acc
      }, {})
    }

    const getQueries = async (file, extension) => {
      await openapi3.isSupported(getData(file, extension))
      const queries = await openapi3.getQueries()
      expect(queries.length).toBe(6)
      return indexQueries(queries)
    }

    const testVerb = async (file, extension, assertions) => {
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

    const testPath = async (file, extension, assertions) => {
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

    const testHeaders = async (file, extension, assertions) => {
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

    const testQuery = async (file, extension, assertions) => {
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

    const testParameters = async (file, extension, assertions) => {
      const queries = await getQueries(file, extension)
      for (let [operationId, parameters] of Object.entries(assertions)) {
        expect(queries[operationId].parameters).toStrictEqual(parameters)
      }
    }

    it("populates parameters", async () => {
      const assertions = {
        createEntity: [],
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
        ],
        patchEntity: [
          {
            name: "entityId",
            default: "",
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

    const testBody = async (file, extension, assertions) => {
      const queries = await getQueries(file, extension)
      for (let [operationId, body] of Object.entries(assertions)) {
        expect(queries[operationId].fields.requestBody).toStrictEqual(
          JSON.stringify(body, null, 2)
        )
      }
    }
    it("populates body", async () => {
      const assertions = {
        createEntity: {
          name: "name",
          type: "type",
        },
        getEntities: undefined,
        getEntity: undefined,
        updateEntity: {
          id: 1,
          name: "name",
          type: "type",
        },
        patchEntity: {
          id: 1,
          name: "name",
          type: "type",
        },
        deleteEntity: undefined,
      }
      await runTests("crud", testBody, assertions)
    })
  })
})
