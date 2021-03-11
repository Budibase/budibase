const { checkBuilderEndpoint } = require("./utilities/TestFunctions")
const setup = require("./utilities")
const fs = require("fs")
const { resolve, join } = require("path")
const { budibaseAppsDir } = require("../../../utilities/budibaseDir")

describe("/component", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
  })

  function mock() {
    const manifestFile = "manifest.json"
    const appId = config.getAppId()
    const libraries = ["@budibase/standard-components"]
    for (let library of libraries) {
      let appDirectory = resolve(budibaseAppsDir(), appId, "node_modules", library, "package")
      fs.mkdirSync(appDirectory, { recursive: true })
      const file = require.resolve(library).split("dist/index.js")[0] + manifestFile
      fs.copyFileSync(file, join(appDirectory, manifestFile))
    }
  }

  describe("fetch definitions", () => {
    it("should be able to fetch definitions", async () => {
      // have to "mock" the files required
      mock()
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