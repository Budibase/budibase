const { checkBuilderEndpoint } = require("./utilities/TestFunctions")
const setup = require("./utilities")

describe("/component", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
  })

  describe("fetch definitions", () => {
    it("should be able to fetch definitions", async () => {
      const res = await request
        .get(`/${config.getAppId()}/components/definitions`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body["@budibase/standard-components/container"]).toBeDefined()
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/${config.getAppId()}/components/definitions`,
      })
    })
  })
})