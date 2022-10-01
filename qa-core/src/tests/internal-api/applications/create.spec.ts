import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import { db } from "@budibase/backend-core"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import generateApp from "../../../config/internal-api/fixtures/applications"
import generator from "../../../config/generator"

describe("Internal API - /applications endpoints", () => {
  const api = new InternalAPIClient()
  const config = new TestConfiguration<Application>(api)

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  async function createAppFromTemplate() {
    return config.applications.create({
      name: generator.word(),
      url: `/${generator.word()}`,
      useTemplate: "true",
      templateName: "Near Miss Register",
      templateKey: "app/near-miss-register",
      templateFile: undefined
    })
  }

  it("GET - fetch applications", async () => {
    await config.applications.create({
      ...generateApp(),
      useTemplate: false
    })
    const [response, apps] = await config.applications.fetch()
    expect(response).toHaveStatusCode(200)
    expect(apps.length).toBeGreaterThanOrEqual(1)
  })

  it("POST - Create an application", async () => {
    const [response, app] = await config.applications.create(generateApp())
    expect(response).toHaveStatusCode(200)
    expect(app._id).toBeDefined()
  })

  it("POST - Publish application", async () => {
    // create app
    const [response, app] = await config.applications.create(generateApp())
    expect(response).toHaveStatusCode(200)
    expect(app.appId).toBeDefined()

    // publish app
    config.applications.api.appId = app.appId
    const [publishResponse, publish] = await config.applications.publish()
    expect(publishResponse).toHaveStatusCode(200)
    expect(publish).toEqual({
      _id: expect.any(String),
      appUrl: app.url,
      status: "SUCCESS"
    })
  })

  it("POST - Create an application from a template, publish and check it renders", async () => {
    // create the app
    const appName = generator.word()
    const [response, app] = await createAppFromTemplate({ name: appName })
    expect(response).toHaveStatusCode(200)
    expect(app.appId).toBeDefined()
    config.applications.api.appId = app.appId

    // check preview renders
    const [previewResponse, previewRenders] = await config.applications.canRender()
    expect(previewResponse).toHaveStatusCode(200)
    expect(previewRenders).toBe(true)

    // publish app
    await config.applications.publish()

    // check published app renders
    config.applications.api.appId = db.getProdAppID(app.appId)
    const [publishedAppResponse, publishedAppRenders] = await config.applications.canRender()
    expect(publishedAppRenders).toBe(true)
  })

})
