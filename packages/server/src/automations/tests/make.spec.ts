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

  it("should be able to run the action", async () => {
    nock("http://www.example.com/").post("/").reply(200, { foo: "bar" })
    const res = await runStep(config, actions.integromat.stepId, {
      url: "http://www.example.com",
    })
    expect(res.response.foo).toEqual("bar")
    expect(res.success).toEqual(true)
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

    const res = await runStep(config, actions.integromat.stepId, {
      body: { value: JSON.stringify(payload) },
      url: "http://www.example.com",
    })
    expect(res.response.foo).toEqual("bar")
    expect(res.success).toEqual(true)
  })

  it("should return a 400 if the JSON payload string is malformed", async () => {
    const res = await runStep(config, actions.integromat.stepId, {
      body: { value: "{ invalid json }" },
      url: "http://www.example.com",
    })
    expect(res.httpStatus).toEqual(400)
    expect(res.response).toEqual("Invalid payload JSON")
    expect(res.success).toEqual(false)
  })
})
