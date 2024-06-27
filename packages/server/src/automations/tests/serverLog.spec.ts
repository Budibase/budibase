import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { runStep, actions } from "./utilities"

describe("test the server log action", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  it("should be able to log the text", async () => {
    let res = await runStep(config, actions.SERVER_LOG.stepId, {
      text: "log message",
    })
    expect(res.message).toEqual(`App ${config.getAppId()} - log message`)
    expect(res.success).toEqual(true)
  })
})
