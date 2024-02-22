jest.mock("../../../utilities/redis", () => ({
  init: jest.fn(),
  getLocksById: () => {
    return {}
  },
  doesUserHaveLock: () => {
    return true
  },
  updateLock: jest.fn(),
  setDebounce: jest.fn(),
  checkDebounce: jest.fn(),
  shutdown: jest.fn(),
}))
import { clearAllApps, checkBuilderEndpoint } from "./utilities/TestFunctions"
import * as setup from "./utilities"
import { AppStatus } from "../../../db/utils"
import { events, utils, context } from "@budibase/backend-core"
import env from "../../../environment"

jest.setTimeout(15000)

describe("/applications", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  describe("create", () => {
    it("creates empty app", async () => {
      const res = await request
        .post("/api/applications")
        .field("name", utils.newid())
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body._id).toBeDefined()
      expect(events.app.created).toBeCalledTimes(1)
    })

    it("creates app from template", async () => {
      const res = await request
        .post("/api/applications")
        .field("name", utils.newid())
        .field("useTemplate", "true")
        .field("templateKey", "test")
        .field("templateString", "{}") // override the file download
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body._id).toBeDefined()
      expect(events.app.created).toBeCalledTimes(1)
      expect(events.app.templateImported).toBeCalledTimes(1)
    })

    it("creates app from file", async () => {
      const res = await request
        .post("/api/applications")
        .field("name", utils.newid())
        .field("useTemplate", "true")
        .set(config.defaultHeaders())
        .attach("templateFile", "src/api/routes/tests/data/export.txt")
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body._id).toBeDefined()
      expect(events.app.created).toBeCalledTimes(1)
      expect(events.app.fileImported).toBeCalledTimes(1)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "POST",
        url: `/api/applications`,
        body: { name: "My App" },
      })
    })

    it("migrates navigation settings from old apps", async () => {
      const res = await request
        .post("/api/applications")
        .field("name", "Old App")
        .field("useTemplate", "true")
        .set(config.defaultHeaders())
        .attach("templateFile", "src/api/routes/tests/data/old-app.txt")
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body._id).toBeDefined()
      expect(res.body.navigation).toBeDefined()
      expect(res.body.navigation.hideLogo).toBe(true)
      expect(res.body.navigation.title).toBe("Custom Title")
      expect(res.body.navigation.hideLogo).toBe(true)
      expect(res.body.navigation.navigation).toBe("Left")
      expect(res.body.navigation.navBackground).toBe(
        "var(--spectrum-global-color-blue-600)"
      )
      expect(res.body.navigation.navTextColor).toBe(
        "var(--spectrum-global-color-gray-50)"
      )
      expect(events.app.created).toBeCalledTimes(1)
      expect(events.app.fileImported).toBeCalledTimes(1)
    })

    it("should reject with a known name", async () => {
      let createError

      const app = config.getApp()
      expect(app).toBeDefined()
      try {
        await config.createApp(app?.name!)
      } catch (err: any) {
        createError = err
        // Must be reset back to its original value or it breaks all
        // subsequent tests
        config.appId = app?.appId!
      }

      expect(createError).toBeDefined()
      expect(createError.message).toEqual(
        "Error 400 - App name is already in use."
      )
    })

    it("should reject with a known url", async () => {
      let createError

      const app = config.getApp()
      expect(app).toBeDefined()
      try {
        await config.createApp("made up", app?.url!)
      } catch (err: any) {
        createError = err
        config.appId = app?.appId!
      }

      expect(createError).toBeDefined()
      expect(createError.message).toEqual(
        "Error 400 - App URL is already in use."
      )
    })
  })

  describe("fetch", () => {
    beforeEach(async () => {
      // Clean all apps but the onde from config
      await clearAllApps(config.getTenantId(), [config.getAppId()!])
    })

    it("lists all applications", async () => {
      await config.createApp("app1")
      await config.createApp("app2")

      const res = await request
        .get(`/api/applications?status=${AppStatus.DEV}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      // two created apps + the inited app
      expect(res.body.length).toBe(3)
    })
  })

  describe("fetchAppDefinition", () => {
    it("should be able to get an apps definition", async () => {
      const res = await request
        .get(`/api/applications/${config.getAppId()}/definition`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.libraries.length).toEqual(1)
    })
  })

  describe("fetchAppPackage", () => {
    it("should be able to fetch the app package", async () => {
      const res = await request
        .get(`/api/applications/${config.getAppId()}/appPackage`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.application).toBeDefined()
      expect(res.body.application.appId).toEqual(config.getAppId())
    })
  })

  describe("update", () => {
    it("should be able to update the app package", async () => {
      const res = await request
        .put(`/api/applications/${config.getAppId()}`)
        .send({
          name: "TEST_APP",
        })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body._rev).toBeDefined()
      expect(events.app.updated).toBeCalledTimes(1)
    })
  })

  describe("publish", () => {
    it("should publish app with dev app ID", async () => {
      const appId = config.getAppId()
      await request
        .post(`/api/applications/${appId}/publish`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(events.app.published).toBeCalledTimes(1)
    })

    it("should publish app with prod app ID", async () => {
      const appId = config.getProdAppId()
      await request
        .post(`/api/applications/${appId}/publish`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(events.app.published).toBeCalledTimes(1)
    })
  })

  describe("manage client library version", () => {
    it("should be able to update the app client library version", async () => {
      await request
        .post(`/api/applications/${config.getAppId()}/client/update`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(events.app.versionUpdated).toBeCalledTimes(1)
    })

    it("should be able to revert the app client library version", async () => {
      // We need to first update the version so that we can then revert
      await request
        .post(`/api/applications/${config.getAppId()}/client/update`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      await request
        .post(`/api/applications/${config.getAppId()}/client/revert`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(events.app.versionReverted).toBeCalledTimes(1)
    })
  })

  describe("edited at", () => {
    it("middleware should set edited at", async () => {
      const headers = config.defaultHeaders()
      headers["referer"] = `/${config.getAppId()}/test`
      const res = await request
        .put(`/api/applications/${config.getAppId()}`)
        .send({
          name: "UPDATED_NAME",
        })
        .set(headers)
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body._rev).toBeDefined()
      // retrieve the app to check it
      const getRes = await request
        .get(`/api/applications/${config.getAppId()}/appPackage`)
        .set(headers)
        .expect("Content-Type", /json/)
        .expect(200)
      expect(getRes.body.application.updatedAt).toBeDefined()
    })
  })

  describe("sync", () => {
    it("app should sync correctly", async () => {
      const res = await request
        .post(`/api/applications/${config.getAppId()}/sync`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.message).toEqual("App sync completed successfully.")
    })

    it("app should not sync if production", async () => {
      const res = await request
        .post(`/api/applications/app_123456/sync`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(400)
      expect(res.body.message).toEqual(
        "This action cannot be performed for production apps"
      )
    })

    it("app should not sync if sync is disabled", async () => {
      env._set("DISABLE_AUTO_PROD_APP_SYNC", true)
      const res = await request
        .post(`/api/applications/${config.getAppId()}/sync`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.message).toEqual(
        "App sync disabled. You can reenable with the DISABLE_AUTO_PROD_APP_SYNC environment variable."
      )
      env._set("DISABLE_AUTO_PROD_APP_SYNC", false)
    })
  })

  describe("unpublish", () => {
    beforeEach(async () => {
      // We want to republish as the unpublish will delete the prod app
      await config.publish()
    })

    it("should unpublish app with dev app ID", async () => {
      const appId = config.getAppId()
      await request
        .post(`/api/applications/${appId}/unpublish`)
        .set(config.defaultHeaders())
        .expect(204)
      expect(events.app.unpublished).toBeCalledTimes(1)
    })

    it("should unpublish app with prod app ID", async () => {
      const appId = config.getProdAppId()
      await request
        .post(`/api/applications/${appId}/unpublish`)
        .set(config.defaultHeaders())
        .expect(204)
      expect(events.app.unpublished).toBeCalledTimes(1)
    })
  })

  describe("delete", () => {
    it("should delete published app and dev apps with dev app ID", async () => {
      await config.createApp("to-delete")
      const appId = config.getAppId()
      await request
        .delete(`/api/applications/${appId}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(events.app.deleted).toBeCalledTimes(1)
      expect(events.app.unpublished).toBeCalledTimes(1)
    })

    it("should delete published app and dev app with prod app ID", async () => {
      await config.createApp("to-delete")
      const appId = config.getProdAppId()
      await request
        .delete(`/api/applications/${appId}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(events.app.deleted).toBeCalledTimes(1)
      expect(events.app.unpublished).toBeCalledTimes(1)
    })
  })

  describe("POST /api/applications/:appId/duplicate", () => {
    it("should duplicate an existing app", async () => {
      await config.createApp("to-dupe")
      const sourceAppId = config.getProdAppId()

      const resp = await request
        .post(`/api/applications/${sourceAppId}/duplicate`)
        .field("name", "to-dupe copy")
        .field("url", "/to-dupe-copy")
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(events.app.duplicated).toBeCalled()
      expect(resp.body.duplicateAppId).toBeDefined()
      expect(resp.body.sourceAppId).toEqual(sourceAppId)
      expect(resp.body.duplicateAppId).not.toEqual(sourceAppId)
    })

    it("should reject an unknown app id with a 404", async () => {
      await request
        .post(`/api/applications/app_1234_not_real/duplicate`)
        .field("name", "to-dupe copy")
        .field("url", "/to-dupe-copy")
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(404)
    })

    it("should reject with a known name", async () => {
      await config.createApp("known name")
      const sourceAppId = config.getProdAppId()
      const resp = await request
        .post(`/api/applications/${sourceAppId}/duplicate`)
        .field("name", "known name")
        .field("url", "/known-name")
        .set(config.defaultHeaders())
        .expect(400)

      expect(resp.body.message).toEqual("App name is already in use.")
    })

    it("should reject with a known url", async () => {
      await config.createApp("known-url")
      const sourceAppId = config.getProdAppId()

      const resp = await request
        .post(`/api/applications/${sourceAppId}/duplicate`)
        .field("name", "this is fine")
        .field("url", "/known-url")
        .set(config.defaultHeaders())
        .expect(400)

      expect(resp.body.message).toEqual("App URL is already in use.")
    })
  })

  describe("POST /api/applications/:appId/sync", () => {
    it("should not sync automation logs", async () => {
      // setup the apps
      await config.createApp("testing-auto-logs")
      const automation = await config.createAutomation()
      await config.publish()
      await context.doInAppContext(config.getProdAppId(), () => {
        return config.createAutomationLog(automation)
      })

      // do the sync
      const appId = config.getAppId()
      await request
        .post(`/api/applications/${appId}/sync`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      // does exist in prod
      const prodLogs = await config.getAutomationLogs()
      expect(prodLogs.data.length).toBe(1)

      // delete prod app so we revert to dev log search
      await config.unpublish()

      // doesn't exist in dev
      const devLogs = await config.getAutomationLogs()
      expect(devLogs.data.length).toBe(0)
    })
  })
})
