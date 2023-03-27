import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { App } from "@budibase/types"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import AccountsAPIClient from "../../../config/internal-api/TestConfiguration/accountsAPIClient"
import { generateApp } from "../../../config/internal-api/fixtures/applications"
import { Screen } from "@budibase/types"
import generateScreen from "../../../config/internal-api/fixtures/screens"

describe("Internal API - Data Sources", () => {
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

  it("Create an app with a data source", async () => {
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
})
