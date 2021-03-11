const { clearAllApps, checkBuilderEndpoint } = require("./utilities/TestFunctions")
const setup = require("./utilities")

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
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.res.statusMessage).toEqual("Application My App created successfully")
      expect(res.body._id).toBeDefined()
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "POST",
        url: `/api/applications`,
        body: { name: "My App" }
      })
    })
  })

  describe("fetch", () => {
    it("lists all applications", async () => {
      await config.createApp(request, "app1")
      await config.createApp(request, "app2")

      const res = await request
        .get("/api/applications")
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

      // two created apps + the inited app
      expect(res.body.length).toBe(3)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/applications`,
      })
    })
  })

  describe("fetchAppDefinition", () => {
    it("should be able to get an apps definition", async () => {
      const res = await request
        .get(`/api/applications/${config.getAppId()}/definition`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)
      // should have empty packages
      expect(res.body.screens.length).toEqual(2)
      expect(res.body.layouts.length).toEqual(2)
    })
  })

  describe("fetchAppPackage", () => {
    it("should be able to fetch the app package", async () => {
      const res = await request
        .get(`/api/applications/${config.getAppId()}/appPackage`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.body.application).toBeDefined()
      expect(res.body.screens.length).toEqual(2)
      expect(res.body.layouts.length).toEqual(2)
    })
  })

  describe("update", () => {
    it("should be able to fetch the app package", async () => {
      const res = await request
        .put(`/api/applications/${config.getAppId()}`)
        .send({
          name: "TEST_APP"
        })
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.body.rev).toBeDefined()
    })
  })
})
