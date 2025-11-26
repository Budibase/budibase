import { events } from "@budibase/backend-core"
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
      // curl
      curl: {
        count: 1,
        source: "curl",
      },
    }
    await runTest(testImportQueries, assertions)
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
})
