import { getConfig, afterAll, runStep, actions } from "./utilities"
import nock from "nock"

describe("test the outgoing webhook action", () => {
  let config = getConfig()

  beforeAll(async () => {
    await config.init()
  })

  afterAll()

  beforeEach(() => {
    nock.cleanAll()
  })

  it("should be able to run the action and default to 'get'", async () => {
    nock("http://www.example.com/").get("/").reply(200, { foo: "bar" })
    const res = await runStep(config, actions.n8n.stepId, {
      url: "http://www.example.com",
      body: {
        test: "IGNORE_ME",
      },
    })
    expect(res.response.foo).toEqual("bar")
    expect(res.success).toEqual(true)
  })

  it("should add the payload props when a JSON string is provided", async () => {
    nock("http://www.example.com/")
      .post("/", { name: "Adam", age: 9 })
      .reply(200)
    const res = await runStep(config, actions.n8n.stepId, {
      body: {
        value: JSON.stringify({ name: "Adam", age: 9 }),
      },
      method: "POST",
      url: "http://www.example.com",
    })
    expect(res.success).toEqual(true)
  })

  it("should return a 400 if the JSON payload string is malformed", async () => {
    const payload = `{ value1 1 }`
    const res = await runStep(config, actions.n8n.stepId, {
      value1: "ONE",
      body: {
        value: payload,
      },
      method: "POST",
      url: "http://www.example.com",
    })
    expect(res.httpStatus).toEqual(400)
    expect(res.response).toEqual("Invalid payload JSON")
    expect(res.success).toEqual(false)
  })

  it("should not append the body if the method is HEAD", async () => {
    nock("http://www.example.com/")
      .head("/", body => body === "")
      .reply(200)
    const res = await runStep(config, actions.n8n.stepId, {
      url: "http://www.example.com",
      method: "HEAD",
      body: {
        test: "IGNORE_ME",
      },
    })
    expect(res.success).toEqual(true)
  })
})
