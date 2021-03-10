const setup = require("./utilities")

describe("test things in the Cloud/Self hosted", () => {
  describe("test self hosted static page", () => {
    it("should be able to load the static page", async () => {
      await setup.switchToCloudForFunction(async () => {
        let request = setup.getRequest()
        let config = setup.getConfig()
        await config.init()
        const res = await request.get(`/`).expect(200)
        expect(res.text.includes("<title>Budibase self hosting️</title>")).toEqual(true)
        setup.afterAll()
      })
    })
  })
})
