import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import { db } from "@budibase/backend-core"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import generateApp from "../../../config/internal-api/fixtures/applications"
import generator from "../../../config/generator"
import generateScreen from "../../../config/internal-api/fixtures/screens"

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
      templateFile: undefined,
    })
  }

  it("GET - fetch applications", async () => {
    await config.applications.create({
      ...generateApp(),
      useTemplate: false,
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
      status: "SUCCESS",
    })
  })

  it("POST - Create an application from a template, publish and check it renders", async () => {
    // create the app
    const appName = generator.word()
    const [response, app] = await createAppFromTemplate()
    expect(response).toHaveStatusCode(200)
    expect(app.appId).toBeDefined()
    config.applications.api.appId = app.appId

    // check preview renders
    const [previewResponse, previewRenders] =
      await config.applications.canRender()
    expect(previewResponse).toHaveStatusCode(200)
    expect(previewRenders).toBe(true)

    // publish app
    await config.applications.publish()

    // check published app renders
    config.applications.api.appId = db.getProdAppID(app.appId)
    const [publishedAppResponse, publishedAppRenders] =
      await config.applications.canRender()
    expect(publishedAppRenders).toBe(true)
  })

  it("POST - Sync application before deployment", async () => {
    const [response, app] = await config.applications.create(generateApp())
    expect(response).toHaveStatusCode(200)
    expect(app.appId).toBeDefined()
    config.applications.api.appId = app.appId

    const [syncResponse, sync] = await config.applications.sync(
      <string>app.appId
    )
    expect(syncResponse).toHaveStatusCode(200)
    expect(sync).toEqual({
      message: "App sync not required, app not deployed.",
    })
  })

  it("POST - Sync application after deployment", async () => {
    const [response, app] = await config.applications.create(generateApp())
    expect(response).toHaveStatusCode(200)
    expect(app.appId).toBeDefined()
    config.applications.api.appId = app.appId

    // publish app
    await config.applications.publish()

    const [syncResponse, sync] = await config.applications.sync(
      <string>app.appId
    )
    expect(syncResponse).toHaveStatusCode(200)
    expect(sync).toEqual({
      message: "App sync completed successfully.",
    })
  })

  it("PUT - Update an application", async () => {
    const [response, app] = await config.applications.create(generateApp())
    expect(response).toHaveStatusCode(200)
    expect(app.appId).toBeDefined()
    config.applications.api.appId = app.appId

    const [updateResponse, updatedApp] = await config.applications.update(
      <string>app.appId,
      {
        name: generator.word(),
      }
    )
    expect(updateResponse).toHaveStatusCode(200)
    expect(updatedApp.name).not.toEqual(app.name)
  })

  it("POST - Revert Changes without changes", async () => {
    const [response, app] = await config.applications.create(generateApp())
    expect(response).toHaveStatusCode(200)
    expect(app.appId).toBeDefined()
    config.applications.api.appId = app.appId

    const [revertResponse, revert] = await config.applications.revert(
      <string>app.appId
    )
    expect(revertResponse).toHaveStatusCode(400)
    expect(revert).toEqual({
      message: "App has not yet been deployed",
      status: 400,
    })
  })

  it("POST - Revert Changes", async () => {
    const [response, app] = await config.applications.create(generateApp())
    expect(response).toHaveStatusCode(200)
    expect(app.appId).toBeDefined()
    config.applications.api.appId = app.appId

    // publish app
    const [publishResponse, publish] = await config.applications.publish()
    expect(publishResponse).toHaveStatusCode(200)
    expect(publish.status).toEqual("SUCCESS")

    // Change/add component to the app
    const [screenResponse, screen] = await config.applications.addScreentoApp(
      generateScreen()
    )
    expect(screenResponse).toHaveStatusCode(200)
    expect(screen._id).toBeDefined()

    // // Revert the app to published state
    const [revertResponse, revert] = await config.applications.revert(
      <string>app.appId
    )
    expect(revertResponse).toHaveStatusCode(200)
    expect(revert).toEqual({
      message: "Reverted changes successfully.",
    })

    // Check screen is removed
    const [routesResponse, routes] = await config.applications.getRoutes()
    expect(routesResponse).toHaveStatusCode(200)
    expect(routes.routes["/test"]).toBeUndefined()
  })

  it("DELETE - Delete an application", async () => {
    const [response, app] = await config.applications.create(generateApp())
    expect(response).toHaveStatusCode(200)
    expect(app.appId).toBeDefined()

    const [deleteResponse] = await config.applications.delete(<string>app.appId)
    expect(deleteResponse).toHaveStatusCode(200)
  })
})
