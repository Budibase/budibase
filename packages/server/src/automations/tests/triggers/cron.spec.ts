import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { captureAutomationResults } from "../utilities"

describe("cron trigger", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  it("should queue a Bull cron job", async () => {
    const { automation } = await createAutomationBuilder(config)
      .onCron({ cron: "* * * * *" })
      .serverLog({
        text: "Hello, world!",
      })
      .save()

    const jobs = await captureAutomationResults(automation, () =>
      config.api.application.publish()
    )
    expect(jobs).toHaveLength(1)

    const repeat = jobs[0].opts?.repeat
    if (!repeat || !("cron" in repeat)) {
      throw new Error("Expected cron repeat")
    }
    expect(repeat.cron).toEqual("* * * * *")
  })

  it("should fail if the cron expression is invalid", async () => {
    await createAutomationBuilder(config)
      .onCron({ cron: "* * * * * *" })
      .serverLog({
        text: "Hello, world!",
      })
      .save()

    await config.api.application.publish(config.getAppId(), {
      status: 500,
      body: {
        message:
          'Deployment Failed: Invalid automation CRON "* * * * * *" - Expected 5 values, but got 6.',
      },
    })
  })
})
