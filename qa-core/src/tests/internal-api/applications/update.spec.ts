import TestConfiguration from "../../../config/internal-api/TestConfiguration"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import { db } from "@budibase/backend-core"
import InternalAPIClient from "../../../config/internal-api/TestConfiguration/InternalAPIClient"
import AccountsAPIClient from "../../../config/internal-api/TestConfiguration/accountsAPIClient"
import {
  generateApp,
  appFromTemplate,
} from "../../../config/internal-api/fixtures/applications"
import generator from "../../../config/generator"
import generateScreen from "../../../config/internal-api/fixtures/screens"

describe("Internal API - Application creation, update, publish and delete", () => {
  const api = new InternalAPIClient()
  const accountsAPI = new AccountsAPIClient()
  const config = new TestConfiguration<Application>(api, accountsAPI)

  beforeAll(async () => {
    await config.setupAccountAndTenant()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("Update an application", async () => {
    const app = await config.applications.create(generateApp())

    config.applications.api.appId = app.appId

    await config.applications.rename(<string>app.appId, <string>app.name, {
      name: generator.word(),
    })
  })

  it("Revert Changes without changes", async () => {
    const app = await config.applications.create(generateApp())
    config.applications.api.appId = app.appId

    await config.applications.revertUnpublished(<string>app.appId)
  })

  it("Revert Changes", async () => {
    const app = await config.applications.create(generateApp())
    config.applications.api.appId = app.appId

    // publish app
    await config.applications.publish(<string>app._id)

    // Change/add component to the app
    await config.screen.create(generateScreen("BASIC"))

    // // Revert the app to published state
    await config.applications.revertPublished(<string>app.appId)

    // Check screen is removed
    await config.applications.getRoutes()
  })
})
