import { objectStore } from "@budibase/backend-core"
import type { RestTemplate } from "@budibase/types"
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

const UPDATED_OPENAPI_SCHEMA = JSON.stringify({
  openapi: "3.0.0",
  info: {
    title: "Example API",
    version: "2.0.0",
  },
  paths: {
    "/items": {
      get: {
        description: "Updated items endpoint",
        responses: {
          "200": {
            description: "Success",
          },
        },
      },
    },
    "/users": {
      post: {
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
      .expect(200)
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

  it("updates existing endpoints when reimporting a custom template", async () => {
    const uploadResponse = await request
      .post("/api/rest-templates")
      .set(config.defaultHeaders())
      .field("name", "Versioned API")
      .field("description", "")
      .attach("file", Buffer.from(OPENAPI_SCHEMA), "openapi.json")
      .expect(200)

    const templateId = uploadResponse.body.template.id
    const firstImportResponse = await request
      .post("/api/queries/import")
      .set(config.defaultHeaders())
      .send({
        restTemplateId: templateId,
        datasource: {
          type: "datasource",
          source: "REST",
          name: "Versioned API",
          config: {},
        },
      })
      .expect(200)

    const originalQuery = firstImportResponse.body.queries[0]
    jest
      .mocked(objectStore.retrieve)
      .mockImplementation(async () => UPDATED_OPENAPI_SCHEMA)

    const secondImportResponse = await request
      .post("/api/queries/import")
      .set(config.defaultHeaders())
      .send({
        restTemplateId: templateId,
        datasourceId: firstImportResponse.body.datasourceId,
        datasource: {
          type: "datasource",
          source: "REST",
          name: "Versioned API",
          config: {},
        },
      })
      .expect(200)

    expect(secondImportResponse.body.queries).toHaveLength(2)
    const updatedQuery = secondImportResponse.body.queries.find(
      (query: { _id: string }) => query._id === originalQuery._id
    )
    expect(updatedQuery.restTemplateMetadata.description).toBe(
      "Updated items endpoint"
    )

    const queriesResponse = await request
      .get("/api/queries")
      .set(config.defaultHeaders())
      .expect(200)
    expect(
      queriesResponse.body.filter(
        (query: { datasourceId: string }) =>
          query.datasourceId === firstImportResponse.body.datasourceId
      )
    ).toHaveLength(2)

    await request
      .delete(`/api/rest-templates/${templateId}`)
      .set(config.defaultHeaders())
      .expect(200)
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
