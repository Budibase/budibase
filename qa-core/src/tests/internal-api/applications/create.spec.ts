import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import generateApp from "../../../config/internal-api/fixtures/applications"
import generator from "../../../config/generator"

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

  xit("POST - Can login", async () => {
    const [response] = await config.auth.login()
    expect(response).toHaveStatusCode(200)
  })

  xit("GET - fetch applications", async () => {
    await config.applications.create({
      ...generateApp(),
      useTemplate: false
    })
    const [response, apps] = await config.applications.fetch()
    expect(response).toHaveStatusCode(200)
    expect(apps.length).toBeGreaterThanOrEqual(1)
  })

  xit("POST - Create an application", async () => {
    const [response, app] = await config.applications.create(generateApp())
    expect(response).toHaveStatusCode(200)
    expect(app._id).toBeDefined()
  })

  it("POST - Create an application from a template and check it renders", async () => {
    const appName = generator.word()
    const [response, app] = await config.applications.create({
      name: appName,
      url: `/${generator.word()}`,
      useTemplate: true,
      templateName: "Car Rental Admin Panel",
      templateKey: "app/car-rental-admin-panel",
      templateFile: undefined
    })
    expect(response).toHaveStatusCode(200)
    expect(app.appId).toBeDefined()

    config.applications.api.appId = app.appId
    const [_, renderable] = await config.applications.canRender()
    expect(renderable).toBe(true)
  })

  xit("POST - Publish app from template", async () => {
    const appUrl = `/${generator.word()}`
    const [response, app] = await config.applications.create({
      name: generator.word(),
      url: appUrl,
      useTemplate: true,
      templateName: "Car Rental Admin Panel",
      templateKey: "app/car-rental-admin-panel",
      templateFile: undefined
    })
    expect(response).toHaveStatusCode(200)
    expect(app.appId).toBeDefined()

    config.applications.api.appId = app.appId

    const [publishResponse, json] = await config.applications.publish()
    expect(publishResponse).toHaveStatusCode(200)
    expect(json).toEqual({
      _id: expect.any(String),
      appUrl,
      status: "SUCCESS"
    })
  })
})
