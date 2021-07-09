jest.mock("../../../utilities/redis", () => ({
  init: jest.fn(),
  getAllLocks: () => {
    return []
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
const { AppStatus } = require("../../../db/utils")

describe("/applications", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await clearAllApps()
    await config.init()
  })

  describe("create", () => {
    it("returns a success message when the application is successfully created", async () => {
      const res = await request
        .post("/api/applications")
        .send({ name: "My App" })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body._id).toBeDefined()
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "POST",
        url: `/api/applications`,
        body: { name: "My App" },
      })
    })
  })

  describe("fetch", () => {
    it("lists all applications", async () => {
      await config.createApp(request, "app1")
      await config.createApp(request, "app2")

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
      // should have empty packages
      expect(res.body.screens.length).toEqual(1)
      expect(res.body.layouts.length).toEqual(2)
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
      expect(res.body.screens.length).toEqual(1)
      expect(res.body.layouts.length).toEqual(2)
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
      expect(res.body.rev).toBeDefined()
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
      expect(res.body.rev).toBeDefined()
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
