import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import generateApp from "../../../config/internal-api/fixtures/applications"

describe("Internal API - /applications endpoints", () => {
  const api = new InternalAPIClient()
  const config = new TestConfiguration<Application>(api)

  beforeAll(async () => {
    await config.beforeAll()
    await config.auth.login()
  })

  afterAll(async () => {
    await config.afterAll()
    await config.auth.logout()
  })

  it("POST - Can login", async () => {
    const [response] = await config.auth.login()
    expect(response).toHaveStatusCode(200)
  })

  it("GET - fetch applications", async () => {
    await config.applications.create({
      ...generateApp(),
      useTemplate: false
    })
    const [response, apps] = await config.applications.fetch()
    expect(response).toHaveStatusCode(200)
    expect(apps.length).toBeGreaterThan(1)
  })

  it("POST - Create an application", async () => {
    const [response, app] = await config.applications.create({
      ...generateApp(),
      useTemplate: false
    })
    expect(response).toHaveStatusCode(200)
    expect(app._id).toBeDefined()
  })
})
