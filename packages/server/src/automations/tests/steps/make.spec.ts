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
      .make({
        url: "http://www.example.com",
        body: null,
      })
      .test({ fields: {} })

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

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .make({
        body: { value: JSON.stringify(payload) },
        url: "http://www.example.com",
      })
      .test({ fields: {} })

    expect(result.steps[0].outputs.response.foo).toEqual("bar")
    expect(result.steps[0].outputs.success).toEqual(true)
  })

  it("should return a 400 if the JSON payload string is malformed", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .make({
        body: { value: "{ invalid json }" },
        url: "http://www.example.com",
      })
      .test({ fields: {} })

    expect(result.steps[0].outputs.httpStatus).toEqual(400)
    expect(result.steps[0].outputs.response).toEqual("Invalid payload JSON")
    expect(result.steps[0].outputs.success).toEqual(false)
  })

  it("should handle JSON containing apostrophes when body.value is already parsed", async () => {
    const payload = {
      Name: "John's Name",
      Email: "test@example.com",
      tableid: "ta_users_us_faee445",
    }

    nock("http://www.example.com/")
      .post("/", payload)
      .reply(200, { success: true })

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .make({
        body: { value: payload },
        url: "http://www.example.com",
      })
      .test({ fields: {} })

    expect(result.steps[0].outputs.response.success).toEqual(true)
    expect(result.steps[0].outputs.success).toEqual(true)
  })

  it("should handle JSON containing apostrophes when body.value is a string", async () => {
    const payload = {
      Name: "John's Name",
      Email: "test@example.com",
      tableid: "ta_users_us_faee445",
    }

    nock("http://www.example.com/")
      .post("/", payload)
      .reply(200, { success: true })

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .make({
        body: { value: JSON.stringify(payload) },
        url: "http://www.example.com",
      })
      .test({ fields: {} })

    expect(result.steps[0].outputs.response.success).toEqual(true)
    expect(result.steps[0].outputs.success).toEqual(true)
  })

  it("should not double-parse JSON objects that are already parsed", async () => {
    const alreadyParsedObject = {
      fields: {
        Rows: [{ Name: "John's Name", Email: "test@example.com" }],
      },
    }

    let capturedRequestBody: any
    nock("http://www.example.com/")
      .post("/", body => {
        capturedRequestBody = body
        return true
      })
      .reply(200, { success: true })

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .make({
        body: { value: alreadyParsedObject },
        url: "http://www.example.com",
      })
      .test({ fields: {} })

    expect(capturedRequestBody.fields.Rows[0].Name).toEqual("John's Name")
    expect(result.steps[0].outputs.success).toEqual(true)
  })
})
