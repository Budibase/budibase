import { objectStore } from "@budibase/backend-core"
import { SourceName, type RestTemplate } from "@budibase/types"
import { afterAll as cleanup, getConfig, getRequest } from "./utilities"

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    objectStore: {
      ...actual.objectStore,
      upload: jest.fn(),
      retrieve: jest.fn(),
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
        bucket: objectStore.ObjectStoreBuckets.CUSTOM_OPENAPI_TEMPLATES,
        filename: `${template.id}/openapi.json`,
      })
    )

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
      objectStore.ObjectStoreBuckets.CUSTOM_OPENAPI_TEMPLATES,
      `${template.id}/openapi.json`
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

    await request
      .delete(`/api/rest-templates/${template.id}`)
      .set(config.defaultHeaders())
      .expect(409)

    const importedDatasources = (await config.api.datasource.fetch()).filter(
      datasource => datasource.restTemplateId === template.id
    )
    expect(importedDatasources).toHaveLength(1)
    await config.api.datasource.delete(importedDatasources[0])
    expect(
      (await config.api.datasource.fetch()).filter(
        datasource => datasource.restTemplateId === template.id
      )
    ).toHaveLength(0)

    expect(objectStore.deleteFolder).toHaveBeenCalledWith(
      objectStore.ObjectStoreBuckets.CUSTOM_OPENAPI_TEMPLATES,
      template.id
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
  })

  it("removes an uploaded template when its last connection is deleted", async () => {
    const uploadResponse = await request
      .post("/api/rest-templates")
      .set(config.defaultHeaders())
      .field("name", "Unused API")
      .field("description", "An API used for cleanup")
      .attach("file", Buffer.from(OPENAPI_SCHEMA), "openapi.json")
      .expect(200)

    const template = uploadResponse.body.template as RestTemplate
    const datasource = await config.api.datasource.create({
      type: "datasource",
      name: "Unused API connection",
      source: SourceName.REST,
      restTemplateId: template.id,
      config: {},
    })
    const secondDatasource = await config.api.datasource.create({
      type: "datasource",
      name: "Second unused API connection",
      source: SourceName.REST,
      restTemplateId: template.id,
      config: {},
    })

    await config.api.datasource.delete(datasource)
    expect(objectStore.deleteFolder).not.toHaveBeenCalled()

    await config.api.datasource.delete(secondDatasource)

    expect(objectStore.deleteFolder).toHaveBeenCalledWith(
      objectStore.ObjectStoreBuckets.CUSTOM_OPENAPI_TEMPLATES,
      template.id
    )
    const templates = await request
      .get("/api/rest-templates")
      .set(config.defaultHeaders())
      .expect(200)
    expect(templates.body).not.toContainEqual(
      expect.objectContaining({ id: template.id })
    )
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
