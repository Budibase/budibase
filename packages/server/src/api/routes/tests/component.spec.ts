import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { checkBuilderEndpoint } from "./utilities/TestFunctions"

describe("/component", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  describe("fetch definitions", () => {
    it("should be able to fetch definitions", async () => {
      const res = await config
        .request!.get(`/api/${config.getAppId()}/components/definitions`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body["@budibase/standard-components/container"]).toBeDefined()
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/${config.getAppId()}/components/definitions`,
      })
    })
  })
})
