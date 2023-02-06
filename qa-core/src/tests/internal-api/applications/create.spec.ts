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

describe("Internal API - Application creation", () => {
  const api = new InternalAPIClient()
  const accountsAPI = new AccountsAPIClient()
  const config = new TestConfiguration<Application>(api, accountsAPI)

  beforeAll(async () => {
    await config.setupAccountAndTenant()
  })

  afterAll(async () => {
    await config.afterAll()
  })

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
})
