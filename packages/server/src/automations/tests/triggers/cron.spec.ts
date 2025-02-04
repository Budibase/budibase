import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { getQueue } from "../.."

describe("cron trigger", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  it("should run the webhook automation - checking for parameters", async () => {
    const queue = getQueue()
    expect(await queue.count()).toEqual(0)

    await createAutomationBuilder({ config })
      .cron({ cron: "* * * * *" })
      .serverLog({
        text: "Hello, world!",
      })
      .save()

    await config.publish()

    expect(await queue.count()).toEqual(1)
  })
})
