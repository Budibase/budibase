const setup = require("./utilities")
const { budibaseAppsDir } = require("../../../utilities/budibaseDir")
const fs = require("fs")
const { join } = require("path")

describe("/templates", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
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