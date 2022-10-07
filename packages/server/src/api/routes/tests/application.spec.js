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

const {
  clearAllApps,
  checkBuilderEndpoint,
} = require("./utilities/TestFunctions")
const setup = require("./utilities")
const { basicScreen, basicLayout } = setup.structures
const { AppStatus } = require("../../../db/utils")
const { events } = require("@budibase/backend-core")

describe("/applications", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await clearAllApps()
    await config.init()
    jest.clearAllMocks()
  })

  describe("create", () => {
    it("creates empty app", async () => {
      const res = await request
        .post("/api/applications")
        .field("name", "My App")
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body._id).toBeDefined()
      expect(events.app.created).toBeCalledTimes(1)
    })

    it("creates app from template", async () => {
      const res = await request
        .post("/api/applications")
        .field("name", "My App")
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
        .field("name", "My App")
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
  })

  describe("fetch", () => {
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

  describe("delete", () => {
    it("should delete app", async () => {
      await config.createApp("to-delete")
      const appId = config.getAppId()
      await request
        .delete(`/api/applications/${appId}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(events.app.deleted).toBeCalledTimes(1)
    })

    it("should unpublish app", async () => {
      await config.createApp("to-unpublish")
      const appId = config.getProdAppId()
      await request
        .delete(`/api/applications/${appId}?unpublish=true`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(events.app.unpublished).toBeCalledTimes(1)
    })
  })

  describe("manage client library version", () => {
    it("should be able to update the app client library version", async () => {
      console.log(config.getAppId())
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
})
