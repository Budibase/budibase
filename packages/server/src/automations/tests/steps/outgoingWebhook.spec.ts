import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import nock from "nock"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import { RequestType } from "@budibase/types"

describe("test the outgoing webhook action", () => {
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
})
