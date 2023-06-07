import TestConfiguration from "../../config/TestConfiguration"
import * as fixtures from "../../fixtures"

describe("Internal API - /screens endpoints", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("Create a screen with each role type", async () => {
    // Create app
    await config.createApp()

    // Create Screen
    const roleArray = ["BASIC", "POWER", "ADMIN", "PUBLIC"]
    for (let role in roleArray) {
      const [response, screen] = await config.api.screens.create(
        fixtures.screens.generateScreen(roleArray[role])
      )
    }
  })

  it("Get screens", async () => {
    // Create app
    await config.createApp()

    // Create Screen
    await config.api.screens.create(fixtures.screens.generateScreen("BASIC"))

    // Check screen exists
    await config.api.apps.getRoutes(true)
  })

  it("Delete a screen", async () => {
    // Create app
    await config.createApp()

    // Create Screen
    const [screenResponse, screen] = await config.api.screens.create(
      fixtures.screens.generateScreen("BASIC")
    )

    // Delete Screen
    await config.api.screens.delete(screen._id!, screen._rev!)
  })
})
