import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { getQueue } from "../.."
import { Job } from "bull"

describe("cron trigger", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
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

    await createAutomationBuilder({ config })
      .cron({ cron: "* * * * *" })
      .serverLog({
        text: "Hello, world!",
      })
      .save()

    await config.publish()

    expect(await queue.getCompletedCount()).toEqual(1)

    const job = await jobPromise
    const repeat = job.opts?.repeat
    if (!repeat || !("cron" in repeat)) {
      throw new Error("Expected cron repeat")
    }
    expect(repeat.cron).toEqual("* * * * *")
  })
})
