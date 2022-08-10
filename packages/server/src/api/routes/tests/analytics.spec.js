const setup = require("./utilities")
const { events, constants, db } = require("@budibase/backend-core")

describe("/static", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let app

  afterAll(setup.afterAll)

  beforeEach(async () => {
    app = await config.init()
    jest.clearAllMocks()
  })

  describe("/ping", () => {
    it("should ping from builder", async () => {
      await request
        .post("/api/bbtel/ping")
        .send({source: "builder"})
        .set(config.defaultHeaders())
        .expect(200)

      expect(events.serve.servedBuilder).toBeCalledTimes(1)
    })

    it("should ping from app preview", async () => {
      await request
        .post("/api/bbtel/ping")
        .send({source: "app"})
        .set(config.defaultHeaders())
        .expect(200)

      expect(events.serve.servedAppPreview).toBeCalledTimes(1)
      expect(events.serve.servedAppPreview).toBeCalledWith(config.getApp())
      expect(events.serve.servedApp).not.toBeCalled()
    })

    it("should ping from app", async () => {
      const headers = config.defaultHeaders()
      headers[constants.Headers.APP_ID] = config.prodAppId

      await request
        .post("/api/bbtel/ping")
        .send({source: "app"})
        .set(headers)
        .expect(200)

      expect(events.serve.servedApp).toBeCalledTimes(1)
      expect(events.serve.servedApp).toBeCalledWith(config.getProdApp())
      expect(events.serve.servedAppPreview).not.toBeCalled()
    })
  })
})
