import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import { db } from "@budibase/backend-core"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import generateApp from "../../../config/internal-api/fixtures/applications"
import generator from "../../../config/generator"
import generateScreen from "../../../config/internal-api/fixtures/screens"

describe("Internal API - Application creation, update, publish and delete", () => {
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
  it("Get applications without applications", async () => {
    await config.applications.fetchEmptyAppList()
  })

  it("Get all Applications after creating an application", async () => {
    await config.applications.create({
      ...generateApp(),
      useTemplate: false,
    })

    await config.applications.fetchAllApplications()
  })

  it("Get application details", async () => {
    const app = await config.applications.create({
      ...generateApp(),
      useTemplate: false,
    })
    config.applications.api.appId = app.appId

    const [appPackageResponse, appPackageJson] =
      await config.applications.getAppPackage(<string>app.appId)
    expect(appPackageJson.application.name).toEqual(app.name)
    expect(appPackageJson.application.version).toEqual(app.version)
    expect(appPackageJson.application.url).toEqual(app.url)
    expect(appPackageJson.application.tenantId).toEqual(app.tenantId)
    expect(appPackageJson.application.status).toEqual(app.status)
  })

  it("Publish app", async () => {
    // create the app
    const appName = generator.word()
    const app = await createAppFromTemplate()
    config.applications.api.appId = app.appId

    // check preview renders
    await config.applications.canRender()

    // publish app
    await config.applications.publish(<string>app.url)

    // check published app renders
    config.applications.api.appId = db.getProdAppID(app.appId!)
    await config.applications.canRender()

    // unpublish app
    await config.applications.unpublish(<string>app.appId)
  })

  it("POST - Sync application before deployment", async () => {
    const app = await config.applications.create(generateApp())
    config.applications.api.appId = app.appId

    const [syncResponse, sync] = await config.applications.sync(
      <string>app.appId
    )
    expect(sync).toEqual({
      message: "App sync not required, app not deployed.",
    })
  })

  it("POST - Sync application after deployment", async () => {
    const app = await config.applications.create(generateApp())
    config.applications.api.appId = app.appId

    // publish app
    await config.applications.publish(<string>app.url)

    const [syncResponse, sync] = await config.applications.sync(
      <string>app.appId
    )
    expect(sync).toEqual({
      message: "App sync completed successfully.",
    })
  })

  it("PUT - Update an application", async () => {
    const app = await config.applications.create(generateApp())

    config.applications.api.appId = app.appId

    await config.applications.update(<string>app.appId, <string>app.name, {
      name: generator.word(),
    })
  })

  it("POST - Revert Changes without changes", async () => {
    const app = await config.applications.create(generateApp())
    config.applications.api.appId = app.appId

    await config.applications.revertUnpublished(<string>app.appId)
  })

  it("POST - Revert Changes", async () => {
    const app = await config.applications.create(generateApp())
    config.applications.api.appId = app.appId

    // publish app
    await config.applications.publish(<string>app.url)

    // Change/add component to the app
    await config.screen.create(generateScreen("BASIC"))

    // // Revert the app to published state
    await config.applications.revertPublished(<string>app.appId)

    // Check screen is removed
    await config.applications.getRoutes()
  })

  it("DELETE - Delete an application", async () => {
    const app = await config.applications.create(generateApp())

    await config.applications.delete(<string>app.appId)
  })
})
