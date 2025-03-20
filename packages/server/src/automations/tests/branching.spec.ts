import * as automation from "../index"
import { Table, AutomationStatus, EmptyFilterOption } from "@budibase/types"
import { createAutomationBuilder } from "./utilities/AutomationTestBuilder"
import TestConfiguration from "../../tests/utilities/TestConfiguration"

describe("Branching automations", () => {
  const config = new TestConfiguration()
  let table: Table

  beforeEach(async () => {
    await automation.init()
    await config.init()
    table = await config.createTable()
    await config.createRow()
  })

  afterAll(() => {
    config.end()
  })

  it("should run a multiple nested branching automation", async () => {
    const firstLogId = "11111111-1111-1111-1111-111111111111"
    const branch1LogId = "22222222-2222-2222-2222-222222222222"
    const branch2LogId = "33333333-3333-3333-3333-333333333333"
    const branch2Id = "44444444-4444-4444-4444-444444444444"

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog(
        { text: "Starting automation" },
        { stepName: "FirstLog", stepId: firstLogId }
      )
      .branch({
        topLevelBranch1: {
          steps: stepBuilder =>
            stepBuilder
              .serverLog(
                { text: "Branch 1" },
                { stepId: "66666666-6666-6666-6666-666666666666" }
              )
              .branch({
                branch1: {
                  steps: stepBuilder =>
                    stepBuilder.serverLog(
                      { text: "Branch 1.1" },
                      { stepId: branch1LogId }
                    ),
                  condition: {
                    equal: {
                      [`{{ literal steps.${firstLogId}.success }}`]: true,
                    },
                  },
                },
                branch2: {
                  steps: stepBuilder =>
                    stepBuilder.serverLog(
                      { text: "Branch 1.2" },
                      { stepId: branch2LogId }
                    ),
                  condition: {
                    equal: {
                      [`{{ literal steps.${firstLogId}.success }}`]: false,
                    },
                  },
                },
              }),
          condition: {
            equal: { [`{{ literal steps.${firstLogId}.success }}`]: true },
          },
        },
        topLevelBranch2: {
          steps: stepBuilder =>
            stepBuilder.serverLog({ text: "Branch 2" }, { stepId: branch2Id }),
          condition: {
            equal: { [`{{ literal steps.${firstLogId}.success }}`]: false },
          },
        },
      })
      .test({ fields: {} })

    expect(results.steps[3].outputs.status).toContain("branch1 branch taken")
    expect(results.steps[4].outputs.message).toContain("Branch 1.1")
  })

  it("should execute correct branch based on string equality", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .branch({
        activeBranch: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Active user" }),
          condition: {
            equal: { "{{trigger.fields.status}}": "active" },
          },
        },
        inactiveBranch: {
          steps: stepBuilder =>
            stepBuilder.serverLog({ text: "Inactive user" }),
          condition: {
            equal: { "{{trigger.fields.status}}": "inactive" },
          },
        },
      })
      .test({ fields: { status: "active" } })
    expect(results.steps[0].outputs.status).toContain(
      "activeBranch branch taken"
    )
    expect(results.steps[1].outputs.message).toContain("Active user")
  })

  it("should handle multiple conditions with AND operator", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .branch({
        activeAdminBranch: {
          steps: stepBuilder =>
            stepBuilder.serverLog({ text: "Active admin user" }),
          condition: {
            $and: {
              conditions: [
                { equal: { "{{trigger.fields.status}}": "active" } },
                { equal: { "{{trigger.fields.role}}": "admin" } },
              ],
            },
          },
        },
        otherBranch: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Other user" }),
          condition: {
            notEqual: { "{{trigger.fields.status}}": "active" },
          },
        },
      })
      .test({ fields: { status: "active", role: "admin" } })

    expect(results.steps[1].outputs.message).toContain("Active admin user")
  })

  it("should handle multiple conditions with OR operator", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .branch({
        specialBranch: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Special user" }),
          condition: {
            $or: {
              conditions: [
                { equal: { "{{trigger.fields.status}}": "test" } },
                { equal: { "{{trigger.fields.role}}": "admin" } },
              ],
            },
          },
        },
        regularBranch: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Regular user" }),
          condition: {
            $and: {
              conditions: [
                { notEqual: { "{{trigger.fields.status}}": "active" } },
                { notEqual: { "{{trigger.fields.role}}": "admin" } },
              ],
            },
          },
        },
      })
      .test({ fields: { status: "test", role: "user" } })

    expect(results.steps[1].outputs.message).toContain("Special user")
  })

  it("should stop the branch automation when no conditions are met", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .createRow({ row: { name: "Test", tableId: table._id } })
      .branch({
        specialBranch: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Special user" }),
          condition: {
            $or: {
              conditions: [
                { equal: { "{{trigger.fields.status}}": "new" } },
                { equal: { "{{trigger.fields.role}}": "admin" } },
              ],
            },
          },
        },
        regularBranch: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Regular user" }),
          condition: {
            $and: {
              conditions: [
                { equal: { "{{trigger.fields.status}}": "active" } },
                { equal: { "{{trigger.fields.role}}": "admin" } },
              ],
            },
          },
        },
      })
      .test({ fields: { status: "test", role: "user" } })

    expect(results.steps[1].outputs.status).toEqual(
      AutomationStatus.NO_CONDITION_MET
    )
    expect(results.steps[2]).toBeUndefined()
  })

  it("evaluate multiple conditions", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({ text: "Starting automation" }, { stepId: "aN6znRYHG" })
      .branch({
        specialBranch: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Special user" }),
          condition: {
            $or: {
              conditions: [
                {
                  equal: {
                    '{{ js "cmV0dXJuICQoInRyaWdnZXIuZmllbGRzLnRlc3RfdHJpZ2dlciIp" }}':
                      "{{ literal trigger.fields.test_trigger}}",
                  },
                },
              ],
            },
          },
        },
        regularBranch: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Regular user" }),
          condition: {
            $and: {
              conditions: [
                {
                  equal: { "{{ literal trigger.fields.test_trigger}}": "blah" },
                },
                {
                  equal: { "{{ literal trigger.fields.test_trigger}}": "123" },
                },
              ],
            },
          },
        },
      })
      .test({ fields: { test_trigger: true } })

    expect(results.steps[2].outputs.message).toContain("Special user")
  })

  it("evaluate multiple conditions with interpolated text", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({ text: "Starting automation" }, { stepId: "aN6znRYHG" })
      .branch({
        specialBranch: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Special user" }),
          condition: {
            $or: {
              conditions: [
                {
                  equal: {
                    "{{ trigger.fields.test_trigger }} 5":
                      "{{ trigger.fields.test_trigger }} 5",
                  },
                },
              ],
            },
          },
        },
        regularBranch: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Regular user" }),
          condition: {
            $and: {
              conditions: [
                { equal: { "{{ trigger.fields.test_trigger }}": "blah" } },
                { equal: { "{{ trigger.fields.test_trigger }}": "123" } },
              ],
            },
          },
        },
      })
      .test({ fields: { test_trigger: true } })

    expect(results.steps[2].outputs.message).toContain("Special user")
  })

  it("should not fail with empty conditions", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .branch({
        specialBranch: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Hello!" }),
          condition: {
            onEmptyFilter: EmptyFilterOption.RETURN_NONE,
          },
        },
      })
      .test({ fields: { test_trigger: true } })

    expect(results.steps[0].outputs.success).toEqual(false)
    expect(results.steps[0].outputs.status).toEqual(
      AutomationStatus.NO_CONDITION_MET
    )
  })
})
