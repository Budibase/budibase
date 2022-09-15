import TestConfiguration from "../../../config/public-api/TestConfiguration"
import PublicAPIClient from "../../../config/public-api/TestConfiguration/PublicAPIClient"
import generateApp from "../../../config/public-api/fixtures/applications"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"

describe("Public API - /applications endpoints", () => {
  const api = new PublicAPIClient()
  const config = new TestConfiguration<Application>(api)

  beforeAll(async () => {
    await config.beforeAll()
    const [response, app] = await config.applications.seed()
    config.context = app
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("POST - Create an application", async () => {
    const [response, app] = await config.applications.create(generateApp())
    expect(response).toHaveStatusCode(200)
    expect(app._id).toBeDefined()
  })

  it("POST - Search applications", async () => {
    const [response, apps] = await config.applications.search({
      name: config.context.name,
    })
    expect(response).toHaveStatusCode(200)
    expect(apps[0]).toEqual(config.context)
  })

  it("GET - Retrieve an application", async () => {
    const [response, app] = await config.applications.read(config.context._id)
    expect(response).toHaveStatusCode(200)
    expect(app).toEqual(config.context)
  })

  it("PUT - update an application", async () => {
    config.context.name = "UpdatedName"
    const [response, app] = await config.applications.update(
      config.context._id,
      config.context
    )
    expect(response).toHaveStatusCode(200)
    expect(app.updatedAt).not.toEqual(config.context.updatedAt)
    expect(app.name).toEqual(config.context.name)
  })
})
