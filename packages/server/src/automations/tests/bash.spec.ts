import { getConfig, afterAll as _afterAll, runStep } from "./utilities"

describe("test the bash action", () => {
  let config = getConfig()

  beforeAll(async () => {
    await config.init()
  })
  afterAll(_afterAll)

  it("should be able to execute a script", async () => {
    let res = await runStep(config, "EXECUTE_BASH", {
      code: "echo 'test'",
    })
    expect(res.stdout).toEqual("test\n")
    expect(res.success).toEqual(true)
  })

  it("should handle a null value", async () => {
    let res = await runStep(config, "EXECUTE_BASH", {
      code: null,
    })
    expect(res.stdout).toEqual(
      "Budibase bash automation failed: Invalid inputs"
    )
  })
})
