import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { captureAutomationResults } from "../utilities"
import { Automation } from "@budibase/types"

describe("app action trigger", () => {
  const config = new TestConfiguration()
  let automation: Automation

  beforeAll(async () => {
    await config.init()
    await config.api.automation.deleteAll()

    automation = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({
        text: "App action triggered",
      })
      .save()
      .then(({ automation }) => automation)

    await config.api.application.publish()
  })

  afterAll(() => {
    config.end()
  })

  it("should trigger when the app action is performed", async () => {
    const jobs = await captureAutomationResults(automation, async () => {
      await config.withProdApp(async () => {
        await config.api.automation.trigger(automation._id!, {
          fields: {},
          timeout: 1000,
        })
      })
    })

    expect(jobs).toHaveLength(1)
    expect(jobs[0].data.event).toEqual(
      expect.objectContaining({
        fields: {},
        timeout: 1000,
      })
    )
  })

  it("should correct coerce values based on the schema", async () => {
    const { automation } = await createAutomationBuilder(config)
      .onAppAction({
        fields: { text: "string", number: "number", boolean: "boolean" },
      })
      .serverLog({
        text: "{{ fields.text }} {{ fields.number }} {{ fields.boolean }}",
      })
      .save()

    await config.api.application.publish()

    const jobs = await captureAutomationResults(automation, async () => {
      await config.withProdApp(async () => {
        await config.api.automation.trigger(automation._id!, {
          fields: { text: "1", number: "2", boolean: "true" },
          timeout: 1000,
        })
      })
    })

    expect(jobs).toHaveLength(1)
    expect(jobs[0].data.event.fields).toEqual({
      text: "1",
      number: 2,
      boolean: true,
    })
  })
})
