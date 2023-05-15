import { getConfig, afterAll, runStep, actions } from "./utilities"

describe("test the outgoing webhook action", () => {
  let config = getConfig()

  beforeAll(async () => {
    await config.init()
  })

  afterAll()

  it("should be able to run the action", async () => {
    const res = await runStep(actions.zapier.stepId, {
      value1: "test",
      url: "http://www.test.com",
    })
    expect(res.response.url).toEqual("http://www.test.com")
    expect(res.response.method).toEqual("post")
    expect(res.success).toEqual(true)
  })

  it("should add the payload props when a JSON string is provided", async () => {
    const payload = `{ "value1": 1, "value2": 2, "value3": 3, "value4": 4, "value5": 5, "name": "Adam", "age": 9 }`
    const res = await runStep(actions.zapier.stepId, {
      value1: "ONE",
      value2: "TWO",
      value3: "THREE",
      value4: "FOUR",
      value5: "FIVE",
      body: {
        value: payload,
      },
      url: "http://www.test.com",
    })
    expect(res.response.url).toEqual("http://www.test.com")
    expect(res.response.method).toEqual("post")
    expect(res.response.body).toEqual(
      `{"platform":"budibase","value1":1,"value2":2,"value3":3,"value4":4,"value5":5,"name":"Adam","age":9}`
    )
    expect(res.success).toEqual(true)
  })

  it("should return a 400 if the JSON payload string is malformed", async () => {
    const payload = `{ value1 1 }`
    const res = await runStep(actions.zapier.stepId, {
      value1: "ONE",
      body: {
        value: payload,
      },
      url: "http://www.test.com",
    })
    expect(res.httpStatus).toEqual(400)
    expect(res.response).toEqual("Invalid payload JSON")
    expect(res.success).toEqual(false)
  })
})
