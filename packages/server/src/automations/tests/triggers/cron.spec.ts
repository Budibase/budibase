import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import {
  captureAutomationQueueMessages,
  captureAutomationResults,
} from "../utilities"
import { automations } from "@budibase/pro"
import { AutomationStatus } from "@budibase/types"

describe("cron trigger", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
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

    const messages = await captureAutomationQueueMessages(automation, () =>
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

  it.only("should stop if the job fails more than 3 times", async () => {
    const runner = await createAutomationBuilder(config)
      .onCron({ cron: "* * * * *" })
      .queryRows({
        // @ts-expect-error intentionally sending invalid data
        tableId: null,
      })
      .save()

    await config.api.application.publish()

    const results = await captureAutomationResults(
      runner.automation,
      async () => {
        await runner.trigger({ timeout: 1000, fields: {} })
        await runner.trigger({ timeout: 1000, fields: {} })
        await runner.trigger({ timeout: 1000, fields: {} })
        await runner.trigger({ timeout: 1000, fields: {} })
        await runner.trigger({ timeout: 1000, fields: {} })
      }
    )

    expect(results).toHaveLength(5)

    await config.withProdApp(async () => {
      const logs = await automations.logs.logSearch({
        automationId: runner.automation._id,
        status: AutomationStatus.STOPPED_ERROR,
      })
      expect(logs.data).toHaveLength(1)
      expect(logs.data[0].status).toEqual(AutomationStatus.STOPPED_ERROR)
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
