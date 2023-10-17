const setup = require("./utilities")
const fetch = require("node-fetch")

jest.mock("node-fetch")

describe("test the outgoing webhook action", () => {
  let inputs
  let config = setup.getConfig()

  beforeAll(async () => {
    await config.init()
    inputs = {
      requestMethod: "POST",
      url: "www.test.com",
      requestBody: JSON.stringify({
        a: 1,
      }),
    }
  })

  afterAll(setup.afterAll)

  it("should be able to run the action", async () => {
    const res = await setup.runStep(setup.actions.OUTGOING_WEBHOOK.stepId, inputs)
    expect(res.success).toEqual(true)
    expect(res.response.url).toEqual("http://www.test.com")
    expect(res.response.method).toEqual("POST")
    expect(JSON.parse(res.response.body).a).toEqual(1)
  })

  it("should return an error if something goes wrong in fetch", async () => {
    const res = await setup.runStep(setup.actions.OUTGOING_WEBHOOK.stepId, {
      requestMethod: "GET",
      url: "www.invalid.com"
    })
    expect(res.success).toEqual(false)
  })

})
