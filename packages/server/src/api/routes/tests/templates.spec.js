const setup = require("./utilities")

describe("/templates", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  describe("fetch", () => {
    it("should be able to fetch templates", async () => {
      const res = await request
        .get(`/api/templates`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      // this test is quite light right now, templates aren't heavily utilised yet
      expect(Array.isArray(res.body)).toEqual(true)
    })
  })
})