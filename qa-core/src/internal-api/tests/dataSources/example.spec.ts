import TestConfiguration from "../../config/TestConfiguration"
import * as fixtures from "../../fixtures"

describe("Internal API - Data Sources", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("Create an app with a data source", async () => {
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
})
