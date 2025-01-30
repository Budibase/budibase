import { getConfig, afterAll as _afterAll, runStep, actions } from "./utilities"
import nock from "nock"

describe("test the outgoing webhook action", () => {
  let config = getConfig()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(_afterAll)

  beforeEach(() => {
    nock.cleanAll()
  })

  it("should be able to run the action", async () => {
    nock("http://www.example.com/").post("/").reply(200, { foo: "bar" })
    const res = await runStep(config, actions.discord.stepId, {
      url: "http://www.example.com",
      username: "joe_bloggs",
    })
    expect(res.response.foo).toEqual("bar")
    expect(res.success).toEqual(true)
  })
})
