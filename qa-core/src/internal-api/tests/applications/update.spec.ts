import TestConfiguration from "../../config/TestConfiguration"
import { generator } from "../../../shared"
import * as fixtures from "../../fixtures"

describe("Internal API - Application creation, update, publish and delete", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("Update an application", async () => {
    const app = await config.createApp()

    await config.api.apps.rename(app.appId!, app.name!, {
      name: generator.word(),
    })
  })

  it("Revert Changes without changes", async () => {
    const app = await config.createApp()

    await config.api.apps.revertUnpublished(app.appId!)
  })

  it("Revert Changes", async () => {
    const app = await config.createApp()

    // publish app
    await config.api.apps.publish(app._id)

    // Change/add component to the app
    await config.api.screens.create(fixtures.screens.generateScreen("BASIC"))

    // // Revert the app to published state
    await config.api.apps.revertPublished(app.appId!)

    // Check screen is removed
    await config.api.apps.getRoutes()
  })
})
