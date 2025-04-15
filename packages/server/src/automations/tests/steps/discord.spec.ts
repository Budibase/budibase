import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import nock from "nock"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

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
})
