import path from "path"
import { getAppObjectStorageEtags } from "../../../tests/utilities/objectStore"
import * as setup from "./utilities"

const PASSWORD = "testtest"

describe("/applications/:appId/import", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    await config.newTenant()
  })

  it("should be able to perform an old import", async () => {
    const appId = config.getDevWorkspaceId()
    await request
      .post(`/api/applications/${appId}/import`)
      .field("encryptionPassword", PASSWORD)
      .attach(
        "appExport",
        path.join(__dirname, "data", "old-export.enc.tar.gz")
      )
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    const appPackage = await config.api.workspace.get(appId!)
    expect(appPackage.navigation?.links?.length).toBe(2)
    expect(appPackage.navigation?.links?.[0].url).toBe("/blank")
    expect(appPackage.navigation?.links?.[1].url).toBe("/derp")

    const screens = await config.api.screen.list()
    expect(screens.length).toBe(2)
    expect(screens[0].routing.route).toBe("/derp")
    expect(screens[1].routing.route).toBe("/blank")

    const { workspaceApps: apps } = await config.api.workspaceApp.fetch()
    expect(apps.length).toBe(1)
    expect(apps[0].name).toBe(config.getDevWorkspace().name)

    const fileEtags = await getAppObjectStorageEtags(appId)
    expect(fileEtags).toEqual({
      // These etags match the ones from the export file
      "budibase-client.js": "a0ab956601262aae131122b3f65102da-2",
      "manifest.json": "8eecdd3935062de5298d8d115453e124",
    })
  })

  it("should be able to perform a new import", async () => {
    const appId = config.getDevWorkspaceId()
    await request
      .post(`/api/applications/${appId}/import`)
      .attach("appExport", path.join(__dirname, "data", "export.tar.gz"))
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    const appPackage = await config.api.workspace.get(appId!)
    expect(appPackage.navigation?.links?.length).toBe(3)
    expect(appPackage.navigation?.links?.[0].url).toBe("/my-change-requests")
    expect(appPackage.navigation?.links?.[1].url).toBe(
      "/review-change-requests"
    )
    expect(appPackage.navigation?.links?.[2].url).toBe("/administration")

    const screens = await config.api.screen.list()
    expect(screens.length).toBe(6)
    expect(screens[0].routing.route).toBe("/my-change-requests")
    expect(screens[1].routing.route).toBe("/administration")
    expect(screens[2].routing.route).toBe("/review-change-requests")
    expect(screens[3].routing.route).toBe("/my-change-requests/edit/:id")
    expect(screens[4].routing.route).toBe("/administration/:id")
    expect(screens[5].routing.route).toBe("/change-request/new")

    const { workspaceApps: apps } = await config.api.workspaceApp.fetch()
    expect(apps.length).toBe(1)
    expect(apps[0].name).toBe("Change request management")

    const fileEtags = await getAppObjectStorageEtags(appId)
    expect(fileEtags).toEqual({
      // These etags match the ones from the export file
      "_dependencies/apexcharts.js": "f69025c0acbca8d05cddf60fb085b2d9",
      "_dependencies/html5-qrcode.js": "ed3116b4b46ee666b7c3f8f857ccbcd4",
      "budibase-client.js": "b27f5d2981b4a44da59028dac62c5ea9-2",
      "budibase-client.new.js": "c010656cbf120c24f42a41a29b86d4bb-2",
      "manifest.json": "23c83411010b942309cf3ed7cf74bc3e",
    })
  })
})
