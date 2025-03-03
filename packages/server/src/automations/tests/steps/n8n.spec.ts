import TestConfiguration from "../../..//tests/utilities/TestConfiguration"
import nock from "nock"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import { HttpMethod } from "@budibase/types"

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

  it("should be able to run the action and default to 'get'", async () => {
    nock("http://www.example.com/").get("/").reply(200, { foo: "bar" })
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .n8n({
        url: "http://www.example.com",
        body: { test: "IGNORE_ME" },
        authorization: "",
      })
      .test({ fields: {} })

    expect(result.steps[0].outputs.response).toEqual({ foo: "bar" })
    expect(result.steps[0].outputs.httpStatus).toEqual(200)
    expect(result.steps[0].outputs.success).toEqual(true)
  })

  it("should add the payload props when a JSON string is provided", async () => {
    nock("http://www.example.com/")
      .post("/", { name: "Adam", age: 9 })
      .reply(200)

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .n8n({
        url: "http://www.example.com",
        body: { value: JSON.stringify({ name: "Adam", age: 9 }) },
        method: HttpMethod.POST,
        authorization: "",
      })
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toEqual(true)
  })

  it("should return a 400 if the JSON payload string is malformed", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .n8n({
        url: "http://www.example.com",
        body: { value: "{ value1 1 }" },
        method: HttpMethod.POST,
        authorization: "",
      })
      .test({ fields: {} })

    expect(result.steps[0].outputs.httpStatus).toEqual(400)
    expect(result.steps[0].outputs.response).toEqual("Invalid payload JSON")
    expect(result.steps[0].outputs.success).toEqual(false)
  })

  it("should not append the body if the method is HEAD", async () => {
    nock("http://www.example.com/")
      .head("/", body => body === "")
      .reply(200)

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .n8n({
        url: "http://www.example.com",
        method: HttpMethod.HEAD,
        body: { test: "IGNORE_ME" },
        authorization: "",
      })
      .test({ fields: {} })

    expect(result.steps[0].outputs.success).toEqual(true)
  })
})
