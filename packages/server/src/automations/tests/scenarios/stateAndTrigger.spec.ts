import { encodeJSBinding } from "@budibase/string-templates"
import { AutomationStatus, FilterCondition } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import * as automation from "../../index"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("State and trigger automations", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
    await automation.init()
  })

  beforeEach(async () => {
    await config.api.automation.deleteAll()
  })

  afterAll(async () => {
    await automation.shutdown()
    config.end()
  })

  it("extracts state and makes it available to later steps", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .extractState({
        key: "fullName",
        value: "{{ trigger.fields.first }} {{ trigger.fields.last }}",
      })
      .collect({ collection: "{{ state.fullName }}" })
      .test({
        fields: {
          first: "Ada",
          last: "Lovelace",
        },
      })

    expect(results.steps[0].outputs).toEqual({
      success: true,
      value: "Ada Lovelace",
    })
    expect(results.state?.fullName).toBe("Ada Lovelace")
    expect(results.steps[1].outputs).toEqual({
      success: true,
      value: "Ada Lovelace",
    })
  })

  it("keeps valid state when an extract state step fails", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .extractState({
        key: "invalid",
        value: encodeJSBinding("return 2 +"),
      })
      .extractState({
        key: "valid",
        value: encodeJSBinding("return 2 + 3"),
      })
      .test({ fields: {} })

    expect(results.status).toBe(AutomationStatus.ERROR)
    expect(results.steps[0].outputs.success).toBe(false)
    expect(results.steps[1].outputs).toEqual({
      success: true,
      value: 5,
    })
    expect(results.state?.invalid).toBeUndefined()
    expect(results.state?.valid).toBe(5)
  })

  it("runs another automation and exposes the child step results", async () => {
    const { automation: childAutomation } = await createAutomationBuilder(
      config
    )
      .onAppAction()
      .serverLog({ text: "Child automation ran" })
      .collect({ collection: "child value" })
      .save()

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .triggerAutomationRun({
        automation: {
          automationId: childAutomation._id!,
        },
      })
      .serverLog({
        text: "Child steps {{ steps.1.value.length }}",
      })
      .test({ fields: {} })

    expect(results.status).toBe(AutomationStatus.SUCCESS)
    expect(results.steps[0].outputs).toMatchObject({
      success: true,
      status: AutomationStatus.SUCCESS,
    })
    expect(results.steps[0].outputs.value).toHaveLength(3)
    expect(results.steps[1].outputs.message).toContain("Child steps 3")
  })

  it("stops the parent when the triggered automation stops", async () => {
    const { automation: childAutomation } = await createAutomationBuilder(
      config
    )
      .onAppAction()
      .filter({
        field: "1",
        condition: FilterCondition.EQUAL,
        value: "2",
      })
      .serverLog({ text: "This should not run" })
      .save()

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .triggerAutomationRun({
        automation: {
          automationId: childAutomation._id!,
        },
      })
      .serverLog({ text: "This should not run either" })
      .test({ fields: {} })

    expect(results.status).toBe(AutomationStatus.STOPPED)
    expect(results.steps[0].outputs).toMatchObject({
      success: true,
      status: AutomationStatus.STOPPED,
    })
    expect(results.steps[1]).toBeUndefined()
  })

  it("returns an error when the triggered automation cannot be found", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .triggerAutomationRun({
        automation: {
          automationId: "au_missing_automation",
        },
      })
      .test({ fields: {} })

    expect(results.status).toBe(AutomationStatus.ERROR)
    expect(results.steps[0].outputs).toMatchObject({
      success: false,
      status: AutomationStatus.ERROR,
    })
  })
})
