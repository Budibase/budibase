const { checkBuilderEndpoint } = require("./utilities/TestFunctions")
const setup = require("./utilities")

jest.mock("../../../utilities/fileSystem/utilities")

describe("/backups", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
  })

  describe("exportAppDump", () => {
    it("should be able to export app", async () => {
      const res = await request
        .get(`/api/backups/export?appId=${config.getAppId()}&appname=test`)
        .set(config.defaultHeaders())
        .expect(200)
      expect(res.text).toBeDefined()
      expect(res.text.includes(`"db_name":"${config.getAppId()}"`)).toEqual(true)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/backups/export?appId=${config.getAppId()}`,
      })
    })
  })
})