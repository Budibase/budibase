import tk from "timekeeper"
import "../../../environment"
import * as automations from "../../index"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

const initialTime = Date.now()
tk.freeze(initialTime)

const oneMinuteInMs = 60 * 1000

describe("cron automations", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await automations.init()
    await config.init()
  })

  afterAll(async () => {
    await automations.shutdown()
    config.end()
  })

  beforeEach(() => {
    tk.freeze(initialTime)
  })

  it("should initialise the automation timestamp", async () => {
    await createAutomationBuilder(config).onCron({ cron: "* * * * *" }).save()

    tk.travel(Date.now() + oneMinuteInMs)
    await config.publish()

    const { data } = await config.getAutomationLogs()
    expect(data).toHaveLength(1)
    expect(data).toEqual([
      expect.objectContaining({
        trigger: expect.objectContaining({
          outputs: { timestamp: initialTime + oneMinuteInMs },
        }),
      }),
    ])
  })
})
