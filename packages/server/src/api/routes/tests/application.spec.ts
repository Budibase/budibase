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
import {
  PermissionLevel,
  type App,
  INTERNAL_TABLE_SOURCE_ID,
  TableSourceType,
  FieldType,
} from "@budibase/types"
import tk from "timekeeper"

describe("/applications", () => {
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
      await config.api.application.updateClient(app.appId)
      expect(events.app.versionUpdated).toBeCalledTimes(1)
    })

    it("should be able to revert the app client library version", async () => {
      await config.api.application.updateClient(app.appId)
      await config.api.application.revertClient(app.appId)
      expect(events.app.versionReverted).toBeCalledTimes(1)
    })
  })

  describe("edited at", () => {
    it("middleware should set updatedAt", async () => {
      const app = await tk.withFreeze(
        "2021-01-01",
        async () => await config.api.application.create({ name: utils.newid() })
      )
      expect(app.updatedAt).toEqual("2021-01-01T00:00:00.000Z")

      const updatedApp = await tk.withFreeze(
        "2021-02-01",
        async () =>
          await config.api.application.update(app.appId, {
            name: "UPDATED_NAME",
          })
      )
      expect(updatedApp._rev).toBeDefined()
      expect(updatedApp.updatedAt).toEqual("2021-02-01T00:00:00.000Z")

      const fetchedApp = await config.api.application.get(app.appId)
      expect(fetchedApp.updatedAt).toEqual("2021-02-01T00:00:00.000Z")
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
        { status: 400 }
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

  describe("permissions", () => {
    it("should only return apps a user has access to", async () => {
      const user = await config.createUser({
        builder: { global: false },
        admin: { global: false },
      })

      const table = await config.api.table.save({
        name: "table",
        type: "table",
        sourceId: INTERNAL_TABLE_SOURCE_ID,
        sourceType: TableSourceType.INTERNAL,
        schema: {
          name: {
            type: FieldType.STRING,
            name: "name",
          },
        },
      })

      await config.withUser(user, async () => {
        const apps = await config.api.application.fetch()
        expect(apps).toHaveLength(0)
      })

      const role = await config.api.roles.save({
        name: "Test",
        inherits: "PUBLIC",
        permissionId: "read_only",
        version: "name",
      })

      await config.api.user.update({
        ...user,
        roles: {
          [config.getAppId()]: role._id!,
        },
      })

      await config.api.permission.add({
        resourceId: table._id!,
        roleId: role._id!,
        level: PermissionLevel.READ,
      })

      await config.withUser(user, async () => {
        const apps = await config.api.application.fetch()
        expect(apps).toHaveLength(1)
      })
    })
  })
})
