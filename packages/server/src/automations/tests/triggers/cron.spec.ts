import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import {
  captureAutomationMessages,
  captureAutomationRemovals,
  captureAutomationResults,
  triggerCron,
} from "../utilities"
import { automations } from "@budibase/pro"
import { AutomationData, AutomationStatus } from "@budibase/types"
import { MAX_AUTOMATION_RECURRING_ERRORS } from "../../../constants"
import { queue } from "@budibase/backend-core"

describe("cron trigger", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
    await config.api.automation.deleteAll()
  })

  afterAll(() => {
    config.end()
  })

  beforeEach(async () => {
    const { automations } = await config.api.automation.fetch()
    for (const automation of automations) {
      await config.api.automation.delete(automation)
    }
  })

  it("should queue a Bull cron job", async () => {
    const { automation } = await createAutomationBuilder(config)
      .onCron({ cron: "* * * * *" })
      .serverLog({
        text: "Hello, world!",
      })
      .save()

    const messages = await captureAutomationMessages(automation, () =>
      config.api.application.publish()
    )
    expect(messages).toHaveLength(1)

    const repeat = messages[0].opts?.repeat
    if (!repeat || !("cron" in repeat)) {
      throw new Error("Expected cron repeat")
    }
    expect(repeat.cron).toEqual("* * * * *")
  })

  it("should fail if the cron expression is invalid", async () => {
    const { automation } = await createAutomationBuilder(config)
      .onCron({ cron: "* * * * * *" })
      .serverLog({
        text: "Hello, world!",
      })
      .save()

    await config.api.application.publish(config.getAppId(), {
      status: 500,
      body: {
        message: `Deployment Failed: Failed to enable CRON trigger for automation "${automation.name}": Invalid automation CRON "* * * * * *" - Expected 5 values, but got 6.`,
      },
    })
  })

  it("should stop if the job fails more than N times", async () => {
    const { automation } = await createAutomationBuilder(config)
      .onCron({ cron: "* * * * *" })
      .queryRows({
        // @ts-expect-error intentionally sending invalid data
        tableId: null,
      })
      .save()

    const [message] = await captureAutomationMessages(automation, () =>
      config.api.application.publish()
    )

    await config.withProdApp(async () => {
      let results: queue.TestQueueMessage<AutomationData>[] = []
      const removed = await captureAutomationRemovals(automation, async () => {
        results = await captureAutomationResults(automation, async () => {
          for (let i = 0; i < MAX_AUTOMATION_RECURRING_ERRORS; i++) {
            triggerCron(message)
          }
        })
      })

      expect(removed).toHaveLength(1)
      expect(removed[0].id).toEqual(message.id)

      expect(results).toHaveLength(5)

      const search = await automations.logs.logSearch({
        automationId: automation._id,
        status: AutomationStatus.STOPPED_ERROR,
      })
      expect(search.data).toHaveLength(1)
      expect(search.data[0].status).toEqual(AutomationStatus.STOPPED_ERROR)
    })
  })

  it("should fill in the timestamp if one is not provided", async () => {
    const runner = await createAutomationBuilder(config)
      .onCron({ cron: "* * * * *" })
      .serverLog({
        text: "Hello, world!",
      })
      .save()

    await config.api.application.publish()

    const results = await captureAutomationResults(
      runner.automation,
      async () => {
        await runner.trigger({ timeout: 1000, fields: {} })
      }
    )
    expect(results).toHaveLength(1)
    expect(results[0].data.event.timestamp).toBeWithin(
      Date.now() - 1000,
      Date.now() + 1000
    )
  })

  it("should use the given timestamp if one is given", async () => {
    const timestamp = 1234
    const runner = await createAutomationBuilder(config)
      .onCron({ cron: "* * * * *" })
      .serverLog({
        text: "Hello, world!",
      })
      .save()

    await config.api.application.publish()

    const results = await captureAutomationResults(
      runner.automation,
      async () => {
        await runner.trigger({ timeout: 1000, fields: {}, timestamp })
      }
    )
    expect(results).toHaveLength(1)
    expect(results[0].data.event.timestamp).toEqual(timestamp)
  })
})
