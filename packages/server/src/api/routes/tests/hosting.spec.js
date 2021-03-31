// mock out node fetch for this
jest.mock("node-fetch")

const { checkBuilderEndpoint } = require("./utilities/TestFunctions")
const setup = require("./utilities")

describe("/hosting", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let app

  afterAll(setup.afterAll)

  beforeEach(async () => {
    app = await config.init()
  })

  describe("fetchInfo", () => {
    it("should be able to fetch hosting information", async () => {
      const res = await request
        .get(`/api/hosting/info`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body).toEqual({ types: ["cloud", "self"]})
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/hosting/info`,
      })
    })
  })

  describe("fetchUrls", () => {
    it("should be able to fetch current app URLs", async () => {
      const res = await request
        .get(`/api/hosting/urls`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.app).toEqual(`https://${config.getAppId()}.app.budi.live`)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/hosting/urls`,
      })
    })
  })

  describe("fetch", () => {
    it("should be able to fetch the current hosting information", async () => {
      const res = await request
        .get(`/api/hosting`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body._id).toBeDefined()
      expect(res.body.hostingUrl).toBeDefined()
      expect(res.body.type).toEqual("cloud")
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/hosting`,
      })
    })
  })

  describe("save", () => {
    it("should be able to update the hosting information", async () => {
      const res = await request
        .post(`/api/hosting`)
        .send({
          type: "self",
          selfHostKey: "budibase",
          hostingUrl: "localhost:10000",
          useHttps: false,
        })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.ok).toEqual(true)
      // make sure URL updated
      const urlRes = await request
        .get(`/api/hosting/urls`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(urlRes.body.app).toEqual(`http://localhost:10000/app`)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "POST",
        url: `/api/hosting`,
      })
    })
  })

  describe("getDeployedApps", () => {
    it("should fail when not self hosted", async () => {
      await request
        .get(`/api/hosting/apps`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(400)
    })

    it("should get apps when in cloud", async () => {
      await setup.switchToSelfHosted(async () => {
        const res = await request
          .get(`/api/hosting/apps`)
          .set(config.defaultHeaders())
          .expect("Content-Type", /json/)
          .expect(200)
        expect(res.body.app1).toEqual({url: "/app1"})
      })
    })
  })
})