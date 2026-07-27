import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import nock from "nock"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("slack step", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
    await config.api.automation.deleteAll()
  })

  afterAll(() => {
    config.end()
  })

  beforeEach(() => {
    nock.cleanAll()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it("requires a webhook URL", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .slack({
        url: " ",
        text: "Hello",
      })
      .test({ fields: {} })

    expect(result.steps[0].outputs).toEqual({
      httpStatus: 400,
      response: "Missing Webhook URL",
      success: false,
    })
  })

  it("posts the message text to Slack", async () => {
    nock("http://www.example.com")
      .post("/services/test/webhook", { text: "Hello" })
      .reply(200, "ok")

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .slack({
        url: "http://www.example.com/services/test/webhook",
        text: "Hello",
      })
      .test({ fields: {} })

    expect(result.steps[0].outputs).toEqual({
      httpStatus: 200,
      response: "ok",
      success: true,
    })
    expect(nock.isDone()).toEqual(true)
  })

  it("reports fetch failures", async () => {
    nock("http://www.example.com").post("/").replyWithError("network failed")

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .slack({
        url: "http://www.example.com",
        text: "Hello",
      })
      .test({ fields: {} })

    expect(result.steps[0].outputs.httpStatus).toEqual(400)
    expect(result.steps[0].outputs.response).toContain("network failed")
    expect(result.steps[0].outputs.success).toEqual(false)
  })
})
