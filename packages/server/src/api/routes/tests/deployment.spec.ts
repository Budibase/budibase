import setup from "./utilities"
import { events } from "@budibase/backend-core"

describe("/deployments", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
    jest.clearAllMocks()
  })

  describe("deploy", () => {
    it("should publish the application", async () => {
      const appId = config.getProdAppId()
      await request
        .post(`/api/applications/${appId}/publish`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect((events.app.published as jest.Mock).mock.calls.length).toBe(1)
    })
  })
})
