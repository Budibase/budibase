import { events } from "@budibase/backend-core"
import { BodyType, Datasource, SourceName } from "@budibase/types"
import fs from "fs"
import path from "path"
import TestConfig from "../../../../../tests/utilities/TestConfiguration"
import { RestImporter } from "../index"

type Assertions = Record<
  DatasetKey,
  { name?: string; source?: string; count?: number; endpoints?: number }
>

const getData = (file: string) => {
  return fs.readFileSync(
    path.join(__dirname, `../sources/tests/${file}`),
    "utf8"
  )
}

// openapi2 (swagger)
const oapi2CrudJson = getData("openapi2/data/crud/crud.json")
const oapi2CrudYaml = getData("openapi2/data/crud/crud.json")
const oapi2PetstoreJson = getData("openapi2/data/petstore/petstore.json")
const oapi2PetstoreYaml = getData("openapi2/data/petstore/petstore.json")

// openapi3
const oapi3CrudJson = getData("openapi3/data/crud/crud.json")
const oapi3CrudYaml = getData("openapi3/data/crud/crud.json")
const oapi3PetstoreJson = getData("openapi3/data/petstore/petstore.json")
const oapi3PetstoreYaml = getData("openapi3/data/petstore/petstore.json")
const oapi3OktaYaml = getData("openapi3/data/okta/okta.yaml")

// curl
const curl = getData("curl/data/post.txt")

const datasets = {
  // openapi2 (swagger)
  oapi2CrudJson,
  oapi2CrudYaml,
  oapi2PetstoreJson,
  oapi2PetstoreYaml,
  // openapi3
  oapi3CrudJson,
  oapi3CrudYaml,
  oapi3PetstoreJson,
  oapi3PetstoreYaml,
  oapi3OktaYaml,
  // curl
  curl,
}

type DatasetKey = keyof typeof datasets

describe("Rest Importer", () => {
  const config = new TestConfig()

  beforeAll(async () => {
    await config.init()
  })

  let restImporter: RestImporter

  const init = async (data: string) => {
    restImporter = new RestImporter(data)
    await restImporter.init()
  }

  const runTest = async (
    test: (
      key: DatasetKey,
      data: string,
      assertions: Assertions
    ) => Promise<void>,
    assertions: Assertions
  ) => {
    await config.doInContext(config.devWorkspaceId, async () => {
      for (let [key, data] of Object.entries(datasets)) {
        await test(key as DatasetKey, data, assertions)
      }
    })
  }

  const testGetInfo = async (
    key: DatasetKey,
    data: string,
    assertions: Assertions
  ) => {
    await init(data)
    const info = await restImporter.getInfo()
    expect(info.name).toBe(assertions[key].name)
    if (assertions[key].endpoints != null) {
      expect(info.endpoints.length).toBe(assertions[key].endpoints)
    } else {
      expect(info.endpoints.length).toBeGreaterThan(0)
    }
  }

  it("gets info", async () => {
    const assertions: Assertions = {
      // openapi2 (swagger)
      oapi2CrudJson: {
        name: "CRUD",
        endpoints: 6,
      },
      oapi2CrudYaml: {
        name: "CRUD",
        endpoints: 6,
      },
      oapi2PetstoreJson: {
        name: "Swagger Petstore",
        endpoints: 20,
      },
      oapi2PetstoreYaml: {
        name: "Swagger Petstore",
        endpoints: 20,
      },
      // openapi3
      oapi3CrudJson: {
        name: "CRUD",
        endpoints: 6,
      },
      oapi3CrudYaml: {
        name: "CRUD",
        endpoints: 6,
      },
      oapi3PetstoreJson: {
        name: "Swagger Petstore - OpenAPI 3.0",
        endpoints: 19,
      },
      oapi3PetstoreYaml: {
        name: "Swagger Petstore - OpenAPI 3.0",
        endpoints: 19,
      },
      oapi3OktaYaml: {
        name: "Okta Management Sample",
        endpoints: 2,
      },
      // curl
      curl: {
        name: "example.com",
        endpoints: 1,
      },
    }
    await runTest(testGetInfo, assertions)
  })

  const testImportQueries = async (
    key: DatasetKey,
    data: string,
    assertions: Assertions
  ) => {
    await init(data)
    const datasource = await config.createDatasource()
    const importResult = await config.doInContext(config.devWorkspaceId, () =>
      restImporter.importQueries(datasource._id)
    )
    expect(importResult.errorQueries.length).toBe(0)
    expect(importResult.queries.length).toBe(assertions[key].count)
    expect(events.query.imported).toHaveBeenCalledTimes(1)
    expect(events.query.imported).toHaveBeenCalledWith(
      datasource,
      assertions[key].source,
      assertions[key].count
    )
    jest.clearAllMocks()
  }

  it("imports queries", async () => {
    // simple sanity assertions that the whole dataset
    // makes it through the importer
    const assertions: Assertions = {
      // openapi2 (swagger)
      oapi2CrudJson: {
        count: 6,
        source: "openapi2.0",
      },
      oapi2CrudYaml: {
        count: 6,
        source: "openapi2.0",
      },
      oapi2PetstoreJson: {
        count: 20,
        source: "openapi2.0",
      },
      oapi2PetstoreYaml: {
        count: 20,
        source: "openapi2.0",
      },
      // openapi3
      oapi3CrudJson: {
        count: 6,
        source: "openapi3.0",
      },
      oapi3CrudYaml: {
        count: 6,
        source: "openapi3.0",
      },
      oapi3PetstoreJson: {
        count: 19,
        source: "openapi3.0",
      },
      oapi3PetstoreYaml: {
        count: 19,
        source: "openapi3.0",
      },
      oapi3OktaYaml: {
        count: 2,
        source: "openapi3.0",
      },
      // curl
      curl: {
        count: 1,
        source: "curl",
      },
    }
    await runTest(testImportQueries, assertions)
  })

  it("imports referenced parameters and request bodies from Okta specs", async () => {
    await init(oapi3OktaYaml)
    const datasource = await config.createDatasource()
    const { queries } = await config.doInContext(config.devWorkspaceId, () =>
      restImporter.importQueries(datasource._id)
    )

    const listQuery = queries.find(query => query.name === "listApps")
    const createQuery = queries.find(query => query.name === "createApp")

    expect(listQuery).toBeDefined()
    expect(createQuery).toBeDefined()

    const getParameters = listQuery?.parameters || []
    expect(getParameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Okta-Version", default: "2025-11-0" }),
        expect.objectContaining({ name: "limit", default: "200" }),
        expect.objectContaining({ name: "subdomain", default: "example" }),
      ])
    )
    expect(listQuery?.fields.headers?.["Okta-Version"]).toBe("{{Okta-Version}}")
    expect(listQuery?.fields.queryString).toBe("limit={{limit}}")
    expect(listQuery?.fields.path).toContain(
      "https://{{subdomain}}.okta.com/api/v1/apps"
    )

    const createParameters = createQuery?.parameters || []
    expect(createParameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Okta-Version", default: "2025-11-0" }),
        expect.objectContaining({ name: "subdomain", default: "example" }),
        expect.objectContaining({
          name: "label",
          default: "Example app",
        }),
        expect.objectContaining({
          name: "settings_oauthClient_client_uri",
          default: "https://example.okta.com/app",
        }),
        expect.objectContaining({
          name: "settings_oauthClient_redirect_uris",
          default: "https://example.okta.com/callback",
        }),
      ])
    )

    expect(createQuery?.fields.bodyType).toBe(BodyType.JSON)
    expect(createQuery?.fields.path).toContain(
      "https://{{subdomain}}.okta.com/api/v1/apps"
    )
    expect(createQuery?.fields.requestBody).toContain('"label": "{{ label }}"')
    expect(createQuery?.fields.requestBody).toContain(
      '"client_uri": "{{ settings_oauthClient_client_uri }}"'
    )
    expect(createQuery?.fields.requestBody).toContain(
      "{{ settings_oauthClient_redirect_uris }}"
    )

    expect(createQuery?.restTemplateMetadata?.defaultBindings).toMatchObject({
      label: "Example app",
      settings_oauthClient_client_uri: "https://example.okta.com/app",
      settings_oauthClient_redirect_uris: "https://example.okta.com/callback",
      "Okta-Version": "2025-11-0",
      subdomain: "example",
    })

    jest.clearAllMocks()
  })

  it("imports only the selected endpoint", async () => {
    const dataset = oapi3CrudJson
    await init(dataset)
    const info = await restImporter.getInfo()
    const endpoint = info.endpoints[0]
    const datasource = await config.createDatasource()
    const importResult = await config.doInContext(config.devWorkspaceId, () =>
      restImporter.importQueries(datasource._id, endpoint.id)
    )
    expect(importResult.errorQueries.length).toBe(0)
    expect(importResult.queries.length).toBe(1)
    expect(importResult.queries[0].name).toBe(endpoint.name)
    expect(events.query.imported).toHaveBeenCalledTimes(1)
    expect(events.query.imported).toHaveBeenCalledWith(
      datasource,
      restImporter.source.getImportSource(),
      1
    )
    jest.clearAllMocks()
  })

  it("throws when the selected endpoint is missing", async () => {
    await init(oapi3CrudJson)
    const datasource = await config.createDatasource()
    await expect(
      config.doInContext(config.devWorkspaceId, () =>
        restImporter.importQueries(datasource._id, "missing::endpoint")
      )
    ).rejects.toThrow("Selected endpoint could not be imported")
  })

  it("filters unsupported options methods", async () => {
    const spec = JSON.stringify(
      {
        swagger: "2.0",
        info: {
          title: "Options Filter",
        },
        paths: {
          "/files": {
            options: {
              operationId: "filesOptions",
              responses: {
                200: {
                  description: "OK",
                },
              },
            },
            get: {
              operationId: "filesGet",
              responses: {
                200: {
                  description: "OK",
                },
              },
            },
          },
        },
      },
      null,
      2
    )

    await init(spec)
    const datasource = await config.createDatasource()
    const importResult = await config.doInContext(config.devWorkspaceId, () =>
      restImporter.importQueries(datasource._id)
    )

    expect(importResult.errorQueries.length).toBe(0)
    expect(importResult.queries.length).toBe(1)
    expect(importResult.queries[0].queryVerb).toBe("read")
    expect(events.query.imported).toHaveBeenCalledTimes(1)
    expect(events.query.imported).toHaveBeenCalledWith(
      datasource,
      "openapi2.0",
      1
    )
    jest.clearAllMocks()
  })

  it("populates request body for OpenAPI 3 POST endpoints without examples", async () => {
    const openapi3Doc = {
      openapi: "3.0.0",
      info: {
        title: "Bindings",
        version: "1.0.0",
      },
      paths: {
        "/users": {
          post: {
            operationId: "createUser",
            summary: "Creates a user",
            description: "Creates a user",
            externalDocs: {
              url: "https://docs.example.com/users#create",
            },
            parameters: [
              {
                name: "verbose",
                in: "query",
                schema: {
                  type: "boolean",
                  default: false,
                },
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["name", "email"],
                    properties: {
                      name: { type: "string" },
                      email: { type: "string" },
                      age: { type: "integer" },
                      verified: { type: "boolean" },
                    },
                  },
                },
              },
            },
            responses: {
              "200": {
                description: "successful operation",
              },
            },
          },
        },
      },
    }

    await init(JSON.stringify(openapi3Doc))
    const datasource = await config.createDatasource()
    const { queries: importedQueries } = await config.doInContext(
      config.devWorkspaceId,
      () => restImporter.importQueries(datasource._id)
    )

    const createQuery = importedQueries.find(
      query => query.name === "createUser"
    )

    expect(createQuery).toBeDefined()
    expect(createQuery?.fields.requestBody).toBeDefined()

    const expectedBody = `{
  "name": "{{ name }}",
  "email": "{{ email }}",
  "age": {{ age }},
  "verified": {{ verified }}
}`

    expect(createQuery?.fields.requestBody).toEqual(expectedBody)
    expect(createQuery?.parameters).toEqual([
      { name: "verbose", default: "false" },
      { name: "name", default: "" },
      { name: "email", default: "" },
      { name: "age", default: "0" },
      { name: "verified", default: "false" },
    ])

    expect(createQuery?.restTemplateMetadata).toMatchObject({
      operationId: "createUser",
      docsUrl: "https://docs.example.com/users#create",
      description: "Creates a user",
      originalPath: "/users",
      originalRequestBody: {
        name: "{{ name }}",
        email: "{{ email }}",
        age: "{{ age }}",
        verified: "{{ verified }}",
      },
      defaultBindings: {
        name: "",
        email: "",
        age: "0",
        verified: "false",
        verbose: "false",
      },
    })
  })

  it("populates request body for OpenAPI 2 POST endpoints without examples", async () => {
    const openapi2Doc = {
      swagger: "2.0",
      info: {
        title: "Bindings",
        version: "1.0.0",
      },
      paths: {
        "/users": {
          post: {
            operationId: "createUserV2",
            consumes: ["application/json"],
            parameters: [
              {
                name: "user",
                in: "body",
                required: true,
                schema: {
                  type: "object",
                  required: ["name", "email"],
                  properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    age: { type: "integer" },
                    verified: { type: "boolean" },
                  },
                },
              },
            ],
            responses: {
              "200": {
                description: "successful operation",
              },
            },
          },
        },
      },
    }

    await init(JSON.stringify(openapi2Doc))
    const datasource = await config.createDatasource()
    const { queries: importedQueries } = await config.doInContext(
      config.devWorkspaceId,
      () => restImporter.importQueries(datasource._id)
    )

    const createQuery = importedQueries.find(
      query => query.name === "createUserV2"
    )

    expect(createQuery).toBeDefined()
    expect(createQuery?.fields.requestBody).toBeDefined()

    const expectedBody = `{
  "name": "{{ name }}",
  "email": "{{ email }}",
  "age": {{ age }},
  "verified": {{ verified }}
}`

    expect(createQuery?.fields.requestBody).toEqual(expectedBody)
    expect(createQuery?.parameters).toEqual([
      { name: "name", default: "" },
      { name: "email", default: "" },
      { name: "age", default: "0" },
      { name: "verified", default: "false" },
    ])
  })

  it("returns OpenAPI 3 server variable defaults before importing queries", async () => {
    const openapiWithServerVariables = {
      openapi: "3.0.0",
      info: {
        title: "Server Variables",
        version: "1.0.0",
      },
      servers: [
        {
          url: "https://{companyDomain}.example.com",
          variables: {
            companyDomain: {
              default: "acme",
              description: "Company domain",
            },
          },
        },
      ],
      paths: {
        "/users": {
          get: {
            operationId: "getUsers",
            responses: {
              "200": {
                description: "successful operation",
              },
            },
          },
        },
      },
    }

    await init(JSON.stringify(openapiWithServerVariables))
    const staticVariables = restImporter.getStaticServerVariables()

    expect(staticVariables).toEqual({ companyDomain: "acme" })
  })

  const openapiWithHeaderSecurity = {
    openapi: "3.0.0",
    info: {
      title: "Header Security",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "X-Apikey",
        },
      },
    },
    security: [{ ApiKeyAuth: [] }],
    paths: {
      "/files": {
        get: {
          operationId: "listFiles",
          parameters: [
            {
              name: "x-apikey",
              in: "header",
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            "200": {
              description: "OK",
            },
          },
        },
      },
    },
  }

  const openapiWithoutServers = {
    openapi: "3.0.0",
    info: {
      title: "Missing Servers",
      version: "1.0.0",
    },
    paths: {
      "/items": {
        get: {
          operationId: "listItems",
          responses: {
            "200": {
              description: "OK",
            },
          },
        },
      },
    },
  }

  it("adds datasource header defaults from OpenAPI security schemes", async () => {
    await init(JSON.stringify(openapiWithHeaderSecurity))
    const datasource: Datasource = {
      type: "datasource",
      source: SourceName.REST,
      config: {},
    }

    restImporter.prepareDatasourceConfig(datasource)

    expect(datasource.config?.defaultHeaders).toEqual({ "X-Apikey": "" })
  })

  it("does not duplicate security headers in generated queries", async () => {
    await init(JSON.stringify(openapiWithHeaderSecurity))
    const datasource = await config.createDatasource()
    const importResult = await config.doInContext(config.devWorkspaceId, () =>
      restImporter.importQueries(datasource._id)
    )

    expect(importResult.queries.length).toBe(1)
    const [query] = importResult.queries
    expect(query.parameters?.some(param => param.name === "x-apikey")).toBe(
      false
    )
    expect(query.fields.headers?.["X-Apikey"]).toBeUndefined()
  })

  it("exposes security headers via importer info", async () => {
    await init(JSON.stringify(openapiWithHeaderSecurity))
    const info = await restImporter.getInfo()
    expect(info.securityHeaders).toEqual(["X-Apikey"])
  })

  it("adds a baseUrl static variable when no server URL exists", async () => {
    await init(JSON.stringify(openapiWithoutServers))
    const staticVariables = restImporter.getStaticServerVariables()

    expect(staticVariables).toEqual({ baseUrl: "" })
  })

  it("prefixes imported paths with the baseUrl binding when no server URL exists", async () => {
    await init(JSON.stringify(openapiWithoutServers))
    const datasource = await config.createDatasource()
    const importResult = await config.doInContext(config.devWorkspaceId, () =>
      restImporter.importQueries(datasource._id)
    )

    expect(importResult.queries.length).toBe(1)
    const [query] = importResult.queries
    expect(query.fields.path).toBe("{{baseUrl}}/items")

    jest.clearAllMocks()
  })
})
