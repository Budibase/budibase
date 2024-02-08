import { getConfig, afterAll, runStep, actions } from "./utilities"

describe("test the outgoing webhook action", () => {
  let config = getConfig()

  beforeAll(async () => {
    await config.init()
  })

  afterAll()

  it("should be able to run the action and default to 'get'", async () => {
    const res = await runStep(actions.n8n.stepId, {
      url: "http://www.test.com",
      body: {
        test: "IGNORE_ME",
      },
    })
    expect(res.response.url).toEqual("http://www.test.com")
    expect(res.response.method).toEqual("get")
    expect(res.response.body).toBeUndefined()
    expect(res.success).toEqual(true)
  })

  it("should add the payload props when a JSON string is provided", async () => {
    const payload = `{ "name": "Adam", "age": 9 }`
    const res = await runStep(actions.n8n.stepId, {
      body: {
        value: payload,
      },
      method: "post",
      url: "http://www.test.com",
    })
    expect(res.response.url).toEqual("http://www.test.com")
    expect(res.response.method).toEqual("post")
    expect(res.response.body).toEqual(`{"name":"Adam","age":9}`)
    expect(res.success).toEqual(true)
  })

  it("should return a 400 if the JSON payload string is malformed", async () => {
    const payload = `{ value1 1 }`
    const res = await runStep(actions.n8n.stepId, {
      value1: "ONE",
      body: {
        value: payload,
      },
      method: "post",
      url: "http://www.test.com",
    })
    expect(res.httpStatus).toEqual(400)
    expect(res.response).toEqual("Invalid payload JSON")
    expect(res.success).toEqual(false)
  })

  it("should not append the body if the method is HEAD", async () => {
    const res = await runStep(actions.n8n.stepId, {
      url: "http://www.test.com",
      method: "head",
      body: {
        test: "IGNORE_ME",
      },
    })
    expect(res.response.url).toEqual("http://www.test.com")
    expect(res.response.method).toEqual("head")
    expect(res.response.body).toBeUndefined()
    expect(res.success).toEqual(true)
  })
})
