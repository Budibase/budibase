import * as setup from "./utilities"

describe("/oauth2", () => {
  let config = setup.getConfig()

  beforeAll(async () => {
    await config.init()
  })

  describe("fetch", () => {
    it("returns empty when no oauth are created", async () => {
      const response = await config.api.oauth2.fetch()
      expect(response).toEqual({
        configs: [],
      })
    })
  })
})
