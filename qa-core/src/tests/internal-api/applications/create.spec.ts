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
    const [response, app] = await config.applications.create(generateApp())
    expect(response).toHaveStatusCode(200)
    expect(app._id).toBeDefined()
  })

  it("POST - Create an application from a template", async () => {
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
    const [_, appPackage] = await config.applications.getAppPackage(app.appId as string)
    expect(appPackage.application.appId).toBe(app.appId)
    expect(appPackage.application.name).toBe(appName)
  })

  it("POST - Publish app from template", async () => {
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
