const setup = require("./utilities")
const { events, constants } = require("@budibase/backend-core")

describe("/static", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let app

  const timezone = "Europe/London"

  afterAll(setup.afterAll)

  beforeAll(async () => {
    app = await config.init()
  })
  
  beforeEach(()=>{
    jest.clearAllMocks()
  })

  describe("/ping", () => {
    it("should ping from builder", async () => {
      await request
        .post("/api/bbtel/ping")
        .send({source: "builder", timezone})
        .set(config.defaultHeaders())
        .expect(200)

      expect(events.serve.servedBuilder).toBeCalledTimes(1)
      expect(events.serve.servedBuilder).toBeCalledWith(timezone)
      expect(events.serve.servedApp).not.toBeCalled()
      expect(events.serve.servedAppPreview).not.toBeCalled()
    })

    it("should ping from app preview", async () => {
      await request
        .post("/api/bbtel/ping")
        .send({source: "app", timezone})
        .set(config.defaultHeaders())
        .expect(200)

      expect(events.serve.servedAppPreview).toBeCalledTimes(1)
      expect(events.serve.servedAppPreview).toBeCalledWith(config.getApp(), timezone)
      expect(events.serve.servedApp).not.toBeCalled()
    })

    it("should ping from app", async () => {
      const headers = config.defaultHeaders()
      headers[constants.Header.APP_ID] = config.prodAppId

      await request
        .post("/api/bbtel/ping")
        .send({source: "app", timezone})
        .set(headers)
        .expect(200)

      expect(events.serve.servedApp).toBeCalledTimes(1)
      expect(events.serve.servedApp).toBeCalledWith(config.getProdApp(), timezone, undefined)
      expect(events.serve.servedAppPreview).not.toBeCalled()
    })

    it("should ping from an embedded app", async () => {
      const headers = config.defaultHeaders()
      headers[constants.Header.APP_ID] = config.prodAppId

      await request
        .post("/api/bbtel/ping")
        .send({source: "app", timezone, embedded: true})
        .set(headers)
        .expect(200)

      expect(events.serve.servedApp).toBeCalledTimes(1)
      expect(events.serve.servedApp).toBeCalledWith(config.getProdApp(), timezone, true)
      expect(events.serve.servedAppPreview).not.toBeCalled()
    })
  })
})
