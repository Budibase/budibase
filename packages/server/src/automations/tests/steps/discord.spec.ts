import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import nock from "nock"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("Discord automation step", () => {
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

  it("should be able to run the action", async () => {
    nock("http://www.example.com/").post("/").reply(200, { foo: "bar" })
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .discord({
        url: "http://www.example.com",
        username: "joe_bloggs",
        content: "Hello, world",
      })
      .test({ fields: {} })
    expect(result.steps[0].outputs.response.foo).toEqual("bar")
    expect(result.steps[0].outputs.success).toEqual(true)
  })

  it("should return a 400 when the webhook URL is missing", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .discord({
        url: "",
        content: "Hello, world",
      })
      .test({ fields: {} })

    expect(result.steps[0].outputs).toMatchObject({
      httpStatus: 400,
      response: "Missing Webhook URL",
      success: false,
    })
  })

  it("should return an error if something goes wrong in fetch", async () => {
    nock("http://www.example.com")
      .post("/discord")
      .replyWithError("discord failed")

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .discord({
        url: "http://www.example.com/discord",
        content: "Hello, world",
      })
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toEqual(false)
    expect(result.steps[0].outputs.response).toContain("discord failed")
  })
})
