import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import { db } from "@budibase/backend-core"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import generateApp from "../../../config/internal-api/fixtures/applications"
import generator from "../../../config/generator"
import generateScreen from "../../../config/internal-api/fixtures/screens"
import {
  generateTable,
  generateNewColumnForTable,
} from "../../../config/internal-api/fixtures/table"
import { generateNewRowForTable } from "../../../config/internal-api/fixtures/rows"

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

  it("Get all Applications", async () => {
    await config.applications.fetch()

    await config.applications.create({
      ...generateApp(),
      useTemplate: false,
    })

    await config.applications.fetch()
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
    config.applications.api.appId = db.getProdAppID(app.appId)
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

    await config.applications.update(
      <string>app.appId,
      <string>app.name,
      {
        name: generator.word(),
      }
    )
  })

  it("POST - Revert Changes without changes", async () => {
    const app = await config.applications.create(generateApp())
    config.applications.api.appId = app.appId

    await config.applications.revert(
      <string>app.appId,
      true
    )
  })

  it("POST - Revert Changes", async () => {
    const app = await config.applications.create(generateApp())
    config.applications.api.appId = app.appId

    // publish app
    await config.applications.publish(<string>app.url)


    // Change/add component to the app
    await config.screen.create(
      generateScreen("BASIC")
    )

    // // Revert the app to published state
    await config.applications.revert(
      <string>app.appId
    )

    // Check screen is removed
    await config.applications.getRoutes()

  })

  it("DELETE - Delete an application", async () => {
    const app = await config.applications.create(generateApp())

    await config.applications.delete(<string>app.appId)
  })

})
