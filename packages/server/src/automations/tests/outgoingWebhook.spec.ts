import { getConfig, afterAll as _afterAll, runStep, actions } from "./utilities"
import nock from "nock"

describe("test the outgoing webhook action", () => {
  const config = getConfig()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(_afterAll)

  beforeEach(() => {
    nock.cleanAll()
  })

  it("should be able to run the action", async () => {
    nock("http://www.example.com")
      .post("/", { a: 1 })
      .reply(200, { foo: "bar" })
    const res = await runStep(config, actions.OUTGOING_WEBHOOK.stepId, {
      requestMethod: "POST",
      url: "www.example.com",
      requestBody: JSON.stringify({ a: 1 }),
    })
    expect(res.success).toEqual(true)
    expect(res.response.foo).toEqual("bar")
  })

  it("should return an error if something goes wrong in fetch", async () => {
    const res = await runStep(config, actions.OUTGOING_WEBHOOK.stepId, {
      requestMethod: "GET",
      url: "www.invalid.com",
    })
    expect(res.success).toEqual(false)
  })
})
