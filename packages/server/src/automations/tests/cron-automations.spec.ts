import tk from "timekeeper"
import "../../environment"
import * as automations from "../index"
import * as setup from "./utilities"
import { basicCronAutomation } from "../../tests/utilities/structures"

const initialTime = Date.now()
tk.freeze(initialTime)

const oneMinuteInMs = 60 * 1000

describe("cron automations", () => {
  let config = setup.getConfig()

  beforeAll(async () => {
    await automations.init()
    await config.init()
  })

  afterAll(async () => {
    await automations.shutdown()
    setup.afterAll()
  })

  beforeEach(() => {
    tk.freeze(initialTime)
  })

  async function travel(ms: number) {
    tk.travel(Date.now() + ms)
  }

  it("should initialise the automation timestamp", async () => {
    const automation = basicCronAutomation(config.appId!, "* * * * *")
    await config.api.automation.post(automation)
    await travel(oneMinuteInMs)
    await config.publish()

    const automationLogs = await config.getAutomationLogs()
    expect(automationLogs.data).toHaveLength(1)
    expect(automationLogs.data).toEqual([
      expect.objectContaining({
        trigger: expect.objectContaining({
          outputs: { timestamp: initialTime + oneMinuteInMs },
        }),
      }),
    ])
  })
})
