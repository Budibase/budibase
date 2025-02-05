import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import nock from "nock"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("test the outgoing webhook action", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  beforeEach(() => {
    nock.cleanAll()
  })

  it("should be able to run the action", async () => {
    nock("http://www.example.com/").post("/").reply(200, { foo: "bar" })
    const result = await createAutomationBuilder({ config })
      .appAction({ fields: {} })
      .make({
        url: "http://www.example.com",
        body: null,
      })
      .run()

    expect(result.steps[0].outputs.response.foo).toEqual("bar")
    expect(result.steps[0].outputs.success).toEqual(true)
  })

  it("should add the payload props when a JSON string is provided", async () => {
    const payload = {
      value1: 1,
      value2: 2,
      value3: 3,
      value4: 4,
      value5: 5,
      name: "Adam",
      age: 9,
    }

    nock("http://www.example.com/")
      .post("/", payload)
      .reply(200, { foo: "bar" })

    const result = await createAutomationBuilder({ config })
      .appAction({ fields: {} })
      .make({
        body: { value: JSON.stringify(payload) },
        url: "http://www.example.com",
      })
      .run()

    expect(result.steps[0].outputs.response.foo).toEqual("bar")
    expect(result.steps[0].outputs.success).toEqual(true)
  })

  it("should return a 400 if the JSON payload string is malformed", async () => {
    const result = await createAutomationBuilder({ config })
      .appAction({ fields: {} })
      .make({
        body: { value: "{ invalid json }" },
        url: "http://www.example.com",
      })
      .run()

    expect(result.steps[0].outputs.httpStatus).toEqual(400)
    expect(result.steps[0].outputs.response).toEqual("Invalid payload JSON")
    expect(result.steps[0].outputs.success).toEqual(false)
  })
})
