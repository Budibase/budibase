import * as setup from "./utilities"
import path from "path"

jest.setTimeout(15000)
const PASSWORD = "testtest"

describe("/applications/:appId/import", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  it("should be able to perform import", async () => {
    const appId = config.getAppId()
    const res = await request
      .post(`/api/applications/${appId}/import`)
      .field("encryptionPassword", PASSWORD)
      .attach("appExport", path.join(__dirname, "assets", "export.tar.gz"))
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    const appPackage = await config.api.application.get(appId!)
    expect(appPackage.navigation?.links?.length).toBe(2)
    expect(expect(appPackage.navigation?.links?.[0].url).toBe("/blank"))
    expect(expect(appPackage.navigation?.links?.[1].url).toBe("/derp"))
    const screens = await config.api.screen.list()
    expect(screens.length).toBe(2)
    expect(screens[0].routing.route).toBe("/derp")
    expect(screens[1].routing.route).toBe("/blank")
  })
})
