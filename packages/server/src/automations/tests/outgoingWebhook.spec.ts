import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { runStep, actions } from "./utilities"

describe("test the outgoing webhook action", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  it("should be able to run the action", async () => {
    const res = await runStep(config, actions.OUTGOING_WEBHOOK.stepId, {
      requestMethod: "POST",
      url: "www.example.com",
      requestBody: JSON.stringify({
        a: 1,
      }),
    })
    expect(res.success).toEqual(true)
    expect(res.response.url).toEqual("http://www.example.com")
    expect(res.response.method).toEqual("POST")
    expect(JSON.parse(res.response.body).a).toEqual(1)
  })

  it("should return an error if something goes wrong in fetch", async () => {
    const res = await runStep(config, actions.OUTGOING_WEBHOOK.stepId, {
      requestMethod: "GET",
      url: "www.invalid.com",
    })
    expect(res.success).toEqual(false)
  })
})
