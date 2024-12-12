const setup = require("./utilities")
const { events, constants } = require("@budibase/backend-core")

describe("/static", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  const timezone = "Europe/London"

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("/ping", () => {
    it("should ping from builder", async () => {
      await request
        .post("/api/bbtel/ping")
        .send({ source: "builder", timezone })
        .set(config.defaultHeaders())
        .expect(200)

      expect(events.serve.servedBuilder).toHaveBeenCalledTimes(1)
      expect(events.serve.servedBuilder).toHaveBeenCalledWith(timezone)
      expect(events.serve.servedApp).not.toHaveBeenCalled()
      expect(events.serve.servedAppPreview).not.toHaveBeenCalled()
    })

    it("should ping from app preview", async () => {
      await request
        .post("/api/bbtel/ping")
        .send({ source: "app", timezone })
        .set(config.defaultHeaders())
        .expect(200)

      expect(events.serve.servedAppPreview).toHaveBeenCalledTimes(1)
      expect(events.serve.servedAppPreview).toHaveBeenCalledWith(
        config.getApp(),
        timezone
      )
      expect(events.serve.servedApp).not.toHaveBeenCalled()
    })

    it("should ping from app", async () => {
      const headers = config.defaultHeaders()
      headers[constants.Header.APP_ID] = config.prodAppId

      await request
        .post("/api/bbtel/ping")
        .send({ source: "app", timezone })
        .set(headers)
        .expect(200)

      expect(events.serve.servedApp).toHaveBeenCalledTimes(1)
      expect(events.serve.servedApp).toHaveBeenCalledWith(
        config.getProdApp(),
        timezone,
        undefined
      )
      expect(events.serve.servedAppPreview).not.toHaveBeenCalled()
    })

    it("should ping from an embedded app", async () => {
      const headers = config.defaultHeaders()
      headers[constants.Header.APP_ID] = config.prodAppId

      await request
        .post("/api/bbtel/ping")
        .send({ source: "app", timezone, embedded: true })
        .set(headers)
        .expect(200)

      expect(events.serve.servedApp).toHaveBeenCalledTimes(1)
      expect(events.serve.servedApp).toHaveBeenCalledWith(
        config.getProdApp(),
        timezone,
        true
      )
      expect(events.serve.servedAppPreview).not.toHaveBeenCalled()
    })
  })
})
