const setup = require("./utilities")

describe("/analytics", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
  })

  describe("isEnabled", () => {
    it("check if analytics enabled", async () => {
      const res = await request
        .get(`/api/analytics`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(typeof res.body.enabled).toEqual("boolean")
    })
  })
})

describe("/health", () => {
  it("should confirm healthy", async () => {
    let config = setup.getConfig()
    await config.getRequest().get("/health").expect(200)
  })
})

describe("/version", () => {
  it("should confirm version", async () => {
    const config = setup.getConfig()
    const res = await config.getRequest().get("/version").expect(200)
    expect(res.text.split(".").length).toEqual(3)
  })
})