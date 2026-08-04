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

    expect(uploadResponse.body.template).toEqual(
      expect.objectContaining({
        id: "rest_template_example-api",
        name: "Example API",
        description: "An example API",
        operationsCount: 1,
        custom: true,
      })
    )
    expect(objectStore.upload).toHaveBeenCalledWith(
      expect.objectContaining({
        bucket: objectStore.ObjectStoreBuckets.CUSTOM_OPENAPI_TEMPLATES,
        filename: "rest_template_example-api/openapi.json",
      })
    )

    const listResponse = await request
      .get("/api/rest-templates")
      .set(config.defaultHeaders())
      .expect(200)
    expect(listResponse.body).toContainEqual(
      expect.objectContaining({
        id: "rest_template_example-api",
      })
    )

    const importInfoResponse = await request
      .post("/api/queries/import/info")
      .set(config.defaultHeaders())
      .send({
        restTemplateId: "rest_template_example-api",
      })
      .expect(200)
    expect(importInfoResponse.body.endpoints).toHaveLength(1)
    expect(objectStore.retrieve).toHaveBeenCalledWith(
      objectStore.ObjectStoreBuckets.CUSTOM_OPENAPI_TEMPLATES,
      "rest_template_example-api/openapi.json"
    )

    const importResponse = await request
      .post("/api/queries/import")
      .set(config.defaultHeaders())
      .send({
        restTemplateId: "rest_template_example-api",
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
      .delete("/api/rest-templates/rest_template_example-api")
      .set(config.defaultHeaders())
      .expect(200)
    expect(objectStore.deleteFolder).toHaveBeenCalledWith(
      objectStore.ObjectStoreBuckets.CUSTOM_OPENAPI_TEMPLATES,
      "rest_template_example-api"
    )

    const afterDeleteResponse = await request
      .get("/api/rest-templates")
      .set(config.defaultHeaders())
      .expect(200)
    expect(
      (afterDeleteResponse.body as RestTemplate[]).find(
        template => template.id === "rest_template_example-api"
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

  it("rejects names that resolve to an existing template ID", async () => {
    await request
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
      .delete("/api/rest-templates/rest_template_duplicate-api")
      .set(config.defaultHeaders())
      .expect(200)
  })
})
