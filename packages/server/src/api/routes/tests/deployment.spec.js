const setup = require("./utilities")
const { events } = require("@budibase/backend-core")

describe("/deployments", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
    jest.clearAllMocks()
  })

  describe("deploy", () => {
    it("should deploy the application", async () => {
      await request
        .post(`/api/deploy`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(events.app.published.mock.calls.length).toBe(1)
    })
  })
})