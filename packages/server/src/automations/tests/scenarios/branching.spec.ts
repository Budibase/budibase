jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    events: {
      ...actual.events,
      action: {
        ...actual.events.action,
        automationStepExecuted: jest.fn(),
        automationStepFailed: jest.fn(),
      },
    },
  }
})

import {
  ActionFailureReason,
  AutomationStatus,
  EmptyFilterOption,
  Table,
} from "@budibase/types"
import { events } from "@budibase/backend-core"
import { dataFilters } from "@budibase/shared-core"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import * as automation from "../../index"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("Branching automations", () => {
  const config = new TestConfiguration()
  let table: Table

  beforeAll(async () => {
    await config.init()
    await automation.init()
  })

  beforeEach(async () => {
    table = await config.createTable()
    await config.createRow()
  })

  afterAll(async () => {
    await automation.shutdown()
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

  it("executes branch conditions produced by the condition builder", async () => {
    const condition = dataFilters.buildQuery({
      logicalOperator: "all",
      onEmptyFilter: EmptyFilterOption.RETURN_NONE,
      groups: [
        {
          logicalOperator: "any",
          filters: [
            {
              field: "{{ trigger.fields.name }}",
              operator: "equal",
              type: "string",
              valueType: "Value",
              value: "j",
            },
          ],
        },
      ],
    })

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .branch({
        matched: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Matched" }),
          condition,
        },
        fallback: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Fallback" }),
          condition: {
            onEmptyFilter: EmptyFilterOption.RETURN_NONE,
          },
        },
      })
      .test({ fields: { name: "j" } })

    expect(results.steps[0].outputs.status).toContain("matched branch taken")
    expect(results.steps[1].outputs.message).toContain("Matched")
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
    expect(results.status).toEqual(AutomationStatus.ERROR)
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

  it("supports expanded branch condition operands", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .branch({
        matched: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Matched" }),
          condition: {
            $and: {
              conditions: [
                { string: { "{{trigger.fields.name}}": "Bud" } },
                { fuzzy: { "{{trigger.fields.description}}": "low-code" } },
                { oneOf: { "{{trigger.fields.status}}": ["new", "active"] } },
                { range: { "{{trigger.fields.score}}": { low: 10 } } },
                {
                  range: {
                    "{{trigger.fields.createdAt}}": {
                      high: "2026-01-31T00:00:00.000Z",
                    },
                  },
                },
                { equal: { "{{ literal trigger.fields.enabled }}": true } },
                { empty: { "{{trigger.fields.notes}}": null } },
              ],
            },
          },
        },
        fallback: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Fallback" }),
          condition: {
            onEmptyFilter: EmptyFilterOption.RETURN_NONE,
          },
        },
      })
      .test({
        fields: {
          name: "Budibase",
          description: "Build low-code tools",
          status: "active",
          score: 15,
          createdAt: "2026-01-15T00:00:00.000Z",
          enabled: true,
          notes: "",
        },
      })

    expect(results.steps[0].outputs.status).toContain("matched branch taken")
    expect(results.steps[1].outputs.message).toContain("Matched")
  })

  it("evaluates bindings inside branch condition values", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .branch({
        matched: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Matched" }),
          condition: {
            $and: {
              conditions: [
                {
                  range: {
                    "{{trigger.fields.score}}": {
                      low: "{{trigger.fields.minimumScore}}",
                    },
                  },
                },
                {
                  oneOf: {
                    "{{trigger.fields.status}}": [
                      "{{trigger.fields.expectedStatus}}",
                    ],
                  },
                },
              ],
            },
          },
        },
        fallback: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Fallback" }),
          condition: {
            onEmptyFilter: EmptyFilterOption.RETURN_NONE,
          },
        },
      })
      .test({
        fields: {
          score: 12,
          minimumScore: 10,
          status: "active",
          expectedStatus: "active",
        },
      })

    expect(results.steps[0].outputs.status).toContain("matched branch taken")
    expect(results.steps[1].outputs.message).toContain("Matched")
  })

  it("executes date branch conditions produced by the condition builder", async () => {
    const condition = dataFilters.buildQuery({
      logicalOperator: "all",
      onEmptyFilter: EmptyFilterOption.RETURN_NONE,
      groups: [
        {
          logicalOperator: "any",
          filters: [
            {
              field: "{{ trigger.fields.date }}",
              operator: "rangeLow",
              type: "datetime",
              valueType: "Value",
              value: "01/05/2026 10:45",
            },
          ],
        },
      ],
    })

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .branch({
        matched: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Matched" }),
          condition,
        },
        fallback: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Fallback" }),
          condition: {
            onEmptyFilter: EmptyFilterOption.RETURN_NONE,
          },
        },
      })
      .test({ fields: { date: "01/05/2026 10:45" } })

    expect(results.steps[0].outputs.status).toContain("matched branch taken")
    expect(results.steps[1].outputs.message).toContain("Matched")
  })

  it("should execute ELSE branch when no other conditions match", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .branch({
        branch1: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Branch 1" }),
          condition: {
            equal: { "{{trigger.fields.input}}": "1" },
          },
        },
        branch2: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Branch 2" }),
          condition: {
            equal: { "{{trigger.fields.input}}": "2" },
          },
        },
        elseBranch: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "ELSE Branch" }),
          condition: {
            onEmptyFilter: EmptyFilterOption.RETURN_NONE,
          }, // Empty condition acts as default/ELSE branch
        },
      })
      .test({ fields: { input: "3" } })

    expect(results.steps[0].outputs.status).toContain("elseBranch branch taken")
    expect(results.steps[1].outputs.message).toContain("ELSE Branch")
  })

  it("should execute first matching branch and skip ELSE", async () => {
    const results = await createAutomationBuilder(config)
      .onAppAction()
      .branch({
        branch1: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Branch 1" }),
          condition: {
            equal: { "{{trigger.fields.input}}": "1" },
          },
        },
        branch2: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Branch 2" }),
          condition: {
            equal: { "{{trigger.fields.input}}": "2" },
          },
        },
        elseBranch: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "ELSE Branch" }),
          condition: {
            onEmptyFilter: EmptyFilterOption.RETURN_NONE,
          }, // Empty condition acts as default/ELSE branch
        },
      })
      .test({ fields: { input: "2" } })

    expect(results.steps[0].outputs.status).toContain("branch2 branch taken")
    expect(results.steps[1].outputs.message).toContain("Branch 2")
  })

  it("emits automationStepFailed with NO_CONDITION_MET when no branch condition matches", async () => {
    jest.clearAllMocks()

    await createAutomationBuilder(config)
      .onAppAction()
      .branch({
        neverTrue: {
          steps: s => s.serverLog({ text: "unreachable" }),
          condition: { equal: { "{{ 1 }}": 2 } },
        },
      })
      .test({ fields: {} })

    expect(events.action.automationStepFailed).toHaveBeenCalledWith(
      expect.objectContaining({ reason: ActionFailureReason.NO_CONDITION_MET })
    )
  })

  it("emits automationStepFailed with ERROR when a step returns success false", async () => {
    jest.clearAllMocks()

    await createAutomationBuilder(config)
      .onAppAction()
      .createRow({ row: {} }) // no tableId → step returns success: false without throwing
      .test({ fields: {} })

    expect(events.action.automationStepFailed).toHaveBeenCalledWith(
      expect.objectContaining({ reason: ActionFailureReason.ERROR })
    )
  })
})
