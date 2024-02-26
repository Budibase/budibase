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
import { checkBuilderEndpoint } from "./utilities/TestFunctions"
import * as setup from "./utilities"
import { AppStatus } from "../../../db/utils"
import { events, utils, context } from "@budibase/backend-core"
import env from "../../../environment"
import type { App } from "@budibase/types"

jest.setTimeout(150000000)

describe("/applications", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let app: App

  afterAll(setup.afterAll)
  beforeAll(async () => await config.init())

  beforeEach(async () => {
    app = await config.api.application.create({ name: utils.newid() })
    const deployment = await config.api.application.publish(app.appId)
    expect(deployment.status).toBe("SUCCESS")
    jest.clearAllMocks()
  })

  describe("create", () => {
    it("creates empty app", async () => {
      const app = await config.api.application.create({ name: utils.newid() })
      expect(app._id).toBeDefined()
      expect(events.app.created).toBeCalledTimes(1)
    })

    it("creates app from template", async () => {
      const app = await config.api.application.create({
        name: utils.newid(),
        useTemplate: "true",
        templateKey: "test",
        templateString: "{}",
      })
      expect(app._id).toBeDefined()
      expect(events.app.created).toBeCalledTimes(1)
      expect(events.app.templateImported).toBeCalledTimes(1)
    })

    it("creates app from file", async () => {
      const app = await config.api.application.create({
        name: utils.newid(),
        useTemplate: "true",
        templateFile: "src/api/routes/tests/data/export.txt",
      })
      expect(app._id).toBeDefined()
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
      const app = await config.api.application.create({
        name: utils.newid(),
        useTemplate: "true",
        templateFile: "src/api/routes/tests/data/old-app.txt",
      })
      expect(app._id).toBeDefined()
      expect(app.navigation).toBeDefined()
      expect(app.navigation!.hideLogo).toBe(true)
      expect(app.navigation!.title).toBe("Custom Title")
      expect(app.navigation!.hideLogo).toBe(true)
      expect(app.navigation!.navigation).toBe("Left")
      expect(app.navigation!.navBackground).toBe(
        "var(--spectrum-global-color-blue-600)"
      )
      expect(app.navigation!.navTextColor).toBe(
        "var(--spectrum-global-color-gray-50)"
      )
      expect(events.app.created).toBeCalledTimes(1)
      expect(events.app.fileImported).toBeCalledTimes(1)
    })
  })

  describe("fetch", () => {
    it("lists all applications", async () => {
      const apps = await config.api.application.fetch({ status: AppStatus.DEV })
      expect(apps.length).toBeGreaterThan(0)
    })
  })

  describe("fetchAppDefinition", () => {
    it("should be able to get an apps definition", async () => {
      const res = await config.api.application.getDefinition(app.appId)
      expect(res.libraries.length).toEqual(1)
    })
  })

  describe("fetchAppPackage", () => {
    it("should be able to fetch the app package", async () => {
      const res = await config.api.application.getAppPackage(app.appId)
      expect(res.application).toBeDefined()
      expect(res.application.appId).toEqual(config.getAppId())
    })
  })

  describe("update", () => {
    it("should be able to update the app package", async () => {
      const updatedApp = await config.api.application.update(app.appId, {
        name: "TEST_APP",
      })
      expect(updatedApp._rev).toBeDefined()
      expect(events.app.updated).toBeCalledTimes(1)
    })
  })

  describe("publish", () => {
    it("should publish app with dev app ID", async () => {
      await config.api.application.publish(app.appId)
      expect(events.app.published).toBeCalledTimes(1)
    })

    it("should publish app with prod app ID", async () => {
      await config.api.application.publish(app.appId.replace("_dev", ""))
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
      const { message } = await config.api.application.sync(app.appId)
      expect(message).toEqual("App sync completed successfully.")
    })

    it("app should not sync if production", async () => {
      const { message } = await config.api.application.sync(
        app.appId.replace("_dev", ""),
        { statusCode: 400 }
      )

      expect(message).toEqual(
        "This action cannot be performed for production apps"
      )
    })

    it("app should not sync if sync is disabled", async () => {
      env._set("DISABLE_AUTO_PROD_APP_SYNC", true)
      const { message } = await config.api.application.sync(app.appId)
      expect(message).toEqual(
        "App sync disabled. You can reenable with the DISABLE_AUTO_PROD_APP_SYNC environment variable."
      )
      env._set("DISABLE_AUTO_PROD_APP_SYNC", false)
    })
  })

  describe("unpublish", () => {
    it("should unpublish app with dev app ID", async () => {
      await config.api.application.unpublish(app.appId)
      expect(events.app.unpublished).toBeCalledTimes(1)
    })

    it("should unpublish app with prod app ID", async () => {
      await config.api.application.unpublish(app.appId.replace("_dev", ""))
      expect(events.app.unpublished).toBeCalledTimes(1)
    })
  })

  describe("delete", () => {
    it("should delete published app and dev apps with dev app ID", async () => {
      await config.api.application.delete(app.appId)
      expect(events.app.deleted).toBeCalledTimes(1)
      expect(events.app.unpublished).toBeCalledTimes(1)
    })

    it("should delete published app and dev app with prod app ID", async () => {
      await config.api.application.delete(app.appId.replace("_dev", ""))
      expect(events.app.deleted).toBeCalledTimes(1)
      expect(events.app.unpublished).toBeCalledTimes(1)
    })
  })

  describe("POST /api/applications/:appId/sync", () => {
    it("should not sync automation logs", async () => {
      const automation = await config.createAutomation()
      await context.doInAppContext(app.appId, () =>
        config.createAutomationLog(automation)
      )

      await config.api.application.sync(app.appId)

      // does exist in prod
      const prodLogs = await config.getAutomationLogs()
      expect(prodLogs.data.length).toBe(1)

      await config.api.application.unpublish(app.appId)

      // doesn't exist in dev
      const devLogs = await config.getAutomationLogs()
      expect(devLogs.data.length).toBe(0)
    })
  })
})
