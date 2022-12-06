jest.mock("@budibase/backend-core", () => {
  const core = jest.requireActual("@budibase/backend-core")
  return {
    ...core,
    objectStore: {
      budibaseTempDir: core.objectStore.budibaseTempDir,
    },
  }
})

const { checkBuilderEndpoint } = require("./utilities/TestFunctions")
const setup = require("./utilities")
const { events } = require("@budibase/backend-core")

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
      expect(res.headers["content-type"]).toEqual("application/gzip")
      expect(events.app.exported.mock.calls.length).toBe(1)
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