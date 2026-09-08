import { objectStore } from "@budibase/backend-core"
import { SourceName, type RestTemplate } from "@budibase/types"
import sdk from "../../../sdk"
import { basicDatasource } from "../../../tests/utilities/structures"
import { afterAll as cleanup, getConfig, getRequest } from "./utilities"

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    objectStore: {
      ...actual.objectStore,
      upload: jest.fn(),
      retrieve: jest.fn(),
      deleteFile: jest.fn(),
      deleteFolder: jest.fn(),
    },
  }
})

const OPENAPI_SCHEMA = JSON.stringify({
  openapi: "3.0.0",
  info: {
    title: "Example API",
    version: "1.0.0",
  },
  paths: {
    "/items": {
      get: {
        responses: {
          "200": {
            description: "Success",
          },
        },
      },
    },
  },
  servers: [
    {
      url: "https://{account}.example.com",
      variables: {
        account: {
          default: "api",
        },
      },
    },
  ],
  components: {
    securitySchemes: {
      apiKey: {
        type: "apiKey",
        in: "header",
        name: "X-API-Key",
      },
    },
  },
})

describe("/rest-templates", () => {
  const config = getConfig()
  const request = getRequest()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(cleanup)

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(objectStore.upload).mockImplementation(async () => ({
      Key: "rest_template_example-api/openapi.json",
      $metadata: {},
    }))
    jest
      .mocked(objectStore.retrieve)
      .mockImplementation(async () => OPENAPI_SCHEMA)
    jest.mocked(objectStore.deleteFolder).mockImplementation(async () => {})
    jest.mocked(objectStore.deleteFile).mockImplementation(async () => ({
      $metadata: {},
    }))
  })

  it("uploads, lists, resolves and deletes a custom OpenAPI template", async () => {
    const uploadResponse = await request
      .post("/api/rest-templates")
      .set(config.defaultHeaders())
      .field("name", "Example API")
      .field("description", "An example API")
      .attach("file", Buffer.from(OPENAPI_SCHEMA), "openapi.json")
      .expect(200)

    const template = uploadResponse.body.template as RestTemplate
    expect(template).toEqual(
      expect.objectContaining({
        id: expect.stringMatching(/^rest_template_[a-z0-9]+$/),
        name: "Example API",
        description: "An example API",
        operationsCount: 1,
        custom: true,
      })
    )
    expect(objectStore.upload).toHaveBeenCalledWith(
      expect.objectContaining({
        bucket: objectStore.ObjectStoreBuckets.APPS,
        filename: `${config.getDevWorkspaceId()}/rest/${template.id}/openapi.json`,
      })
    )

    const updateResponse = await request
      .put(`/api/rest-templates/${template.id}`)
      .set(config.defaultHeaders())
      .field("name", "Updated Example API")
      .field("description", "An updated example API")
      .expect(200)
    expect(updateResponse.body.template).toEqual(
      expect.objectContaining({
        id: template.id,
        name: "Updated Example API",
        description: "An updated example API",
      })
    )
    expect(objectStore.upload).toHaveBeenCalledTimes(1)
    expect(objectStore.deleteFile).not.toHaveBeenCalled()

    const listResponse = await request
      .get("/api/rest-templates")
      .set(config.defaultHeaders())
      .expect(200)
    expect(listResponse.body).toContainEqual(
      expect.objectContaining({
        id: template.id,
      })
    )

    const importInfoResponse = await request
      .post("/api/queries/import/info")
      .set(config.defaultHeaders())
      .send({
        restTemplateId: template.id,
      })
      .expect(200)
    expect(importInfoResponse.body.endpoints).toHaveLength(1)
    expect(objectStore.retrieve).toHaveBeenCalledWith(
      objectStore.ObjectStoreBuckets.APPS,
      `${config.getDevWorkspaceId()}/rest/${template.id}/openapi.json`
    )

    const importResponse = await request
      .post("/api/queries/import")
      .set(config.defaultHeaders())
      .send({
        restTemplateId: template.id,
        datasource: {
          type: "datasource",
          source: "REST",
          name: "Example API",
          config: {},
        },
      })
      .expect(200)
    expect(importResponse.body.queries).toHaveLength(1)

    const existingDatasource = await config.api.datasource.create({
      type: "datasource",
      name: "Existing Example API",
      source: SourceName.REST,
      config: {},
    })
    const originalDatasource = await config.doInContext(
      config.getDevWorkspaceId(),
      () => sdk.datasources.get(existingDatasource._id!)
    )
    await request
      .post("/api/queries/import")
      .set(config.defaultHeaders())
      .send({
        restTemplateId: template.id,
        datasourceId: existingDatasource._id,
        selectedEndpointId: "missing::endpoint",
      })
      .expect(400)
    expect(
      await config.doInContext(config.getDevWorkspaceId(), () =>
        sdk.datasources.get(existingDatasource._id!)
      )
    ).toEqual(originalDatasource)

    const existingImportResponse = await request
      .post("/api/queries/import")
      .set(config.defaultHeaders())
      .send({
        restTemplateId: template.id,
        datasourceId: existingDatasource._id,
      })
      .expect(200)
    expect(existingImportResponse.body.queries[0].parameters).toContainEqual({
      name: "account",
      default: "{{ account }}",
    })
    const taggedDatasource = (await config.api.datasource.fetch()).find(
      datasource => datasource._id === existingDatasource._id
    )
    expect(taggedDatasource).toEqual(
      expect.objectContaining({
        restTemplateId: template.id,
        config: expect.objectContaining({
          staticVariables: { account: "api" },
          defaultHeaders: { "X-API-Key": "" },
        }),
      })
    )

    const preTaggedDatasource = await config.api.datasource.create({
      type: "datasource",
      name: "Pre-tagged Example API",
      source: SourceName.REST,
      restTemplateId: template.id,
      config: {},
    })
    await request
      .post("/api/queries/import")
      .set(config.defaultHeaders())
      .send({
        restTemplateId: template.id,
        datasourceId: preTaggedDatasource._id,
      })
      .expect(200)
    const preparedPreTaggedDatasource = (
      await config.api.datasource.fetch()
    ).find(datasource => datasource._id === preTaggedDatasource._id)
    expect(preparedPreTaggedDatasource?.config).toEqual(
      expect.objectContaining({
        staticVariables: { account: "api" },
        defaultHeaders: { "X-API-Key": "" },
      })
    )

    const nonRestDatasource = await config.api.datasource.create({
      type: "datasource",
      name: "Existing Postgres datasource",
      source: SourceName.POSTGRES,
      config: {},
    })
    await request
      .post("/api/queries/import")
      .set(config.defaultHeaders())
      .send({
        restTemplateId: template.id,
        datasourceId: nonRestDatasource._id,
      })
      .expect(400)
    const unchangedNonRestDatasource = (
      await config.api.datasource.fetch()
    ).find(datasource => datasource._id === nonRestDatasource._id)
    expect(unchangedNonRestDatasource?.restTemplateId).toBeUndefined()

    await request
      .delete(`/api/rest-templates/${template.id}`)
      .set(config.defaultHeaders())
      .expect(409)

    const importedDatasources = (await config.api.datasource.fetch()).filter(
      datasource => datasource.restTemplateId === template.id
    )
    expect(importedDatasources).toHaveLength(3)
    await config.api.datasource.delete(nonRestDatasource)
    await config.api.datasource.delete(importedDatasources[0])
    await config.api.datasource.delete(importedDatasources[1])
    await config.api.datasource.delete(importedDatasources[2])
    expect(
      (await config.api.datasource.fetch()).filter(
        datasource => datasource.restTemplateId === template.id
      )
    ).toHaveLength(0)

    await request
      .delete(`/api/rest-templates/${template.id}`)
      .set(config.defaultHeaders())
      .expect(200)

    expect(objectStore.deleteFolder).toHaveBeenCalledWith(
      objectStore.ObjectStoreBuckets.APPS,
      `${config.getDevWorkspaceId()}/rest/${template.id}`
    )

    const afterDeleteResponse = await request
      .get("/api/rest-templates")
      .set(config.defaultHeaders())
      .expect(200)
    expect(
      (afterDeleteResponse.body as RestTemplate[]).find(
        listedTemplate => listedTemplate.id === template.id
      )
    ).toBeUndefined()

    await request
      .delete(`/api/rest-templates/${template.id}`)
      .set(config.defaultHeaders())
      .expect(404)
  })

  it("rejects missing templates before preparing a datasource", async () => {
    const prepareDatasource = jest
      .spyOn(sdk.datasources, "prepareForSave")
      .mockRejectedValueOnce(new Error("Schema discovery should not run"))
    try {
      await request
        .post("/api/datasources")
        .set(config.defaultHeaders())
        .send({
          datasource: {
            ...basicDatasource().datasource,
            restTemplateId: "rest_template_missing",
          },
          fetchSchema: true,
        })
        .expect(404)
      expect(prepareDatasource).not.toHaveBeenCalled()
    } finally {
      prepareDatasource.mockRestore()
    }
  })

  it("rejects non-OpenAPI uploads", async () => {
    const response = await request
      .post("/api/rest-templates")
      .set(config.defaultHeaders())
      .field("name", "Invalid")
      .field("description", "Not an OpenAPI schema")
      .attach("file", Buffer.from("{}"), "invalid.json")
      .expect(400)

    expect(response.body.message).toBe(
      "File must contain a valid OpenAPI schema"
    )
    expect(objectStore.upload).not.toHaveBeenCalled()
  })

  it("rejects names that normalize to the same value", async () => {
    const firstResponse = await request
      .post("/api/rest-templates")
      .set(config.defaultHeaders())
      .field("name", "Duplicate API")
      .field("description", "")
      .attach("file", Buffer.from(OPENAPI_SCHEMA), "openapi.json")
      .expect(200)

    const duplicateResponse = await request
      .post("/api/rest-templates")
      .set(config.defaultHeaders())
      .field("name", "duplicate-api")
      .field("description", "")
      .attach("file", Buffer.from(OPENAPI_SCHEMA), "openapi.json")
      .expect(409)

    expect(duplicateResponse.body.message).toContain("already exists")

    await request
      .delete(`/api/rest-templates/${firstResponse.body.template.id}`)
      .set(config.defaultHeaders())
      .expect(200)
  })
})
