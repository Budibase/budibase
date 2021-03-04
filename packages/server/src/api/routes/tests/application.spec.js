const {
  supertest,
} = require("./utilities")
const TestConfig = require("./utilities/TestConfiguration")
const { clearAllApps, checkBuilderEndpoint } = require("./utilities/TestFunctions")

describe("/applications", () => {
  let request
  let server
  let config

  beforeAll(async () => {
    ({ request, server } = await supertest())
  });

  beforeEach(async () => {
    await clearAllApps()
    config = new TestConfig(request)
    await config.init()
  })

  afterAll(() => {
    server.close()
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

})
