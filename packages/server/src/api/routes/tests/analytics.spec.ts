import { events, constants } from "@budibase/backend-core"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

describe("/static", () => {
  const config = new TestConfiguration()

  const timezone = "Europe/London"

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("/ping", () => {
    it("should ping from builder", async () => {
      await config
        .request!.post("/api/bbtel/ping")
        .send({ source: "builder", timezone })
        .set(config.defaultHeaders())
        .expect(200)

      expect(events.serve.servedBuilder).toHaveBeenCalledTimes(1)
      expect(events.serve.servedBuilder).toHaveBeenCalledWith(timezone)
      expect(events.serve.servedApp).not.toHaveBeenCalled()
      expect(events.serve.servedAppPreview).not.toHaveBeenCalled()
    })

    it("should ping from app preview", async () => {
      await config
        .request!.post("/api/bbtel/ping")
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

      await config
        .request!.post("/api/bbtel/ping")
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

      await config
        .request!.post("/api/bbtel/ping")
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
