import { getConfig, afterAll as _afterAll, runStep, actions } from "./utilities"

describe("test the server log action", () => {
  let config = getConfig()
  let inputs: any

  beforeAll(async () => {
    await config.init()
    inputs = {
      text: "log message",
    }
  })
  afterAll(_afterAll)

  it("should be able to log the text", async () => {
    let res = await runStep(config, actions.SERVER_LOG.stepId, inputs)
    expect(res.message).toEqual(`App ${config.getAppId()} - ${inputs.text}`)
    expect(res.success).toEqual(true)
  })
})
