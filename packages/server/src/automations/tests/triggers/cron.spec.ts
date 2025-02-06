import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { getQueue } from "../.."
import { Job } from "bull"

describe("cron trigger", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  it("should queue a Bull cron job", async () => {
    const queue = getQueue()
    expect(await queue.getCompletedCount()).toEqual(0)

    const jobPromise = new Promise<Job>(resolve => {
      queue.on("completed", async job => {
        resolve(job)
      })
    })

    await createAutomationBuilder(config)
      .onCron({ cron: "* * * * *" })
      .serverLog({
        text: "Hello, world!",
      })
      .save()

    await config.api.application.publish(config.getAppId())

    expect(await queue.getCompletedCount()).toEqual(1)

    const job = await jobPromise
    const repeat = job.opts?.repeat
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
