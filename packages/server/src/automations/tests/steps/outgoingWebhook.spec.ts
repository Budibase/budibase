import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import nock from "nock"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import { RequestType } from "@budibase/types"

describe("Outgoing webhook automation step", () => {
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
    nock("http://www.example.com")
      .post("/", { a: 1 })
      .reply(200, { foo: "bar" })

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .outgoingWebhook({
        requestMethod: RequestType.POST,
        url: "http://www.example.com",
        requestBody: JSON.stringify({ a: 1 }),
        headers: {},
      })
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toEqual(true)
    expect(result.steps[0].outputs.httpStatus).toEqual(200)
    expect(result.steps[0].outputs.response.foo).toEqual("bar")
  })

  it("should return an error if something goes wrong in fetch", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .outgoingWebhook({
        requestMethod: RequestType.GET,
        url: "www.invalid.com",
        requestBody: "",
        headers: {},
      })
      .test({ fields: {} })
    expect(result.steps[0].outputs.success).toEqual(false)
  })

  it("should return an error when headers are not a JSON object", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .outgoingWebhook({
        requestMethod: RequestType.POST,
        url: "http://www.example.com/outgoing",
        requestBody: JSON.stringify({ action: "created" }),
        headers: "{not-json",
      })
      .test({ fields: {} })

    expect(result.steps[0].outputs).toMatchObject({
      response: "Unable to process headers, must be a JSON object.",
      success: false,
    })
  })

  it("should follow redirects", async () => {
    nock("http://www.redirect.com")
      .post("/start", { redirected: true })
      .reply(302, "", {
        location: "http://www.redirected.com/final",
      })

    nock("http://www.redirected.com")
      .get("/final")
      .reply(200, { redirected: true })

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .outgoingWebhook({
        requestMethod: RequestType.POST,
        url: "http://www.redirect.com/start",
        requestBody: JSON.stringify({ redirected: true }),
        headers: {},
      })
      .test({ fields: {} })

    expect(result.steps[0].outputs).toMatchObject({
      httpStatus: 200,
      response: { redirected: true },
      success: true,
    })
  })
})
