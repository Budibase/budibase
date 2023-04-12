import TestConfiguration from "../../config/TestConfiguration"
import * as fixtures from "../../fixtures"

describe("Internal API - Application creation", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("Get applications without applications", async () => {
    await config.api.apps.fetchEmptyAppList()
  })

  it("Get all Applications after creating an application", async () => {
    await config.api.apps.create({
      ...fixtures.apps.generateApp(),
      useTemplate: "false",
    })

    await config.api.apps.fetchAllApplications()
  })

  it("Get application details", async () => {
    const app = await config.createApp({
      ...fixtures.apps.generateApp(),
      useTemplate: "false",
    })

    const [appPackageResponse, appPackageJson] =
      await config.api.apps.getAppPackage(app.appId!)
    expect(appPackageJson.application.name).toEqual(app.name)
    expect(appPackageJson.application.version).toEqual(app.version)
    expect(appPackageJson.application.url).toEqual(app.url)
    expect(appPackageJson.application.tenantId).toEqual(app.tenantId)
    expect(appPackageJson.application.status).toEqual(app.status)
  })
})
