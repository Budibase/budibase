import { events } from "@budibase/backend-core"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

describe("/dev", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
    jest.clearAllMocks()
  })

  afterAll(() => {
    config.end()
  })

  describe("revert", () => {
    it("should revert the application", async () => {
      await config
        .request!.post(`/api/dev/${config.getAppId()}/revert`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(events.app.reverted).toHaveBeenCalledTimes(1)
    })
  })

  describe("version", () => {
    it("should get the installation version", async () => {
      const res = await config
        .request!.get(`/api/dev/version`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.version).toBe("0.0.0+jest")
      expect(events.installation.versionChecked).toHaveBeenCalledTimes(1)
      expect(events.installation.versionChecked).toHaveBeenCalledWith(
        "0.0.0+jest"
      )
    })
  })
})
