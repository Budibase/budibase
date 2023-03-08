import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { App } from "@budibase/types"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import AccountsAPIClient from "../../../config/internal-api/TestConfiguration/accountsAPIClient"
import { generateApp } from "../../../config/internal-api/fixtures/applications"
import { Screen } from "@budibase/types"
import generateScreen from "../../../config/internal-api/fixtures/screens"

describe("Internal API - /screens endpoints", () => {
  const api = new InternalAPIClient()
  const accountsAPI = new AccountsAPIClient()
  const config = new TestConfiguration<Screen>(api, accountsAPI)
  const appConfig = new TestConfiguration<App>(api, accountsAPI)

  beforeAll(async () => {
    await config.setupAccountAndTenant()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("Create a screen with each role type", async () => {
    // Create app
    const app = await appConfig.applications.create(generateApp())

    // Create Screen
    const roleArray = ["BASIC", "POWER", "ADMIN", "PUBLIC"]
    appConfig.applications.api.appId = app.appId
    for (let role in roleArray) {
      const [response, screen] = await config.screen.create(
        generateScreen(roleArray[role])
      )
    }
  })

  it("Get screens", async () => {
    // Create app
    const app = await appConfig.applications.create(generateApp())

    // Create Screen
    appConfig.applications.api.appId = app.appId
    await config.screen.create(generateScreen("BASIC"))

    // Check screen exists
    await appConfig.applications.getRoutes(true)
  })

  it("Delete a screen", async () => {
    // Create app
    const app = await appConfig.applications.create(generateApp())

    // Create Screen
    appConfig.applications.api.appId = app.appId
    const [screenResponse, screen] = await config.screen.create(
      generateScreen("BASIC")
    )

    // Delete Screen
    await config.screen.delete(screen._id!, screen._rev!)
  })
})
