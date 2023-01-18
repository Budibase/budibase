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

  it("DELETE - Delete an application", async () => {
    const app = await config.applications.create(generateApp())

    await config.applications.delete(<string>app.appId)
  })
})
