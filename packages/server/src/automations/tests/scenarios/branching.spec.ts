import * as automation from "../../index"
import * as setup from "../utilities"
import { Table, AutomationStatus } from "@budibase/types"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("Branching automations", () => {
  let config = setup.getConfig(),
    table: Table

  beforeEach(async () => {
    await automation.init()
    await config.init()
    table = await config.createTable()
    await config.createRow()
  })

  afterAll(setup.afterAll)

  it("should run a multiple nested branching automation", async () => {
    const builder = createAutomationBuilder({
      name: "Test Trigger with Loop and Create Row",
    })

    const results = await builder
      .appAction({ fields: {} })
      .serverLog({ text: "Starting automation" })
      .branch({
        topLevelBranch1: {
          steps: stepBuilder =>
            stepBuilder.serverLog({ text: "Branch 1" }).branch({
              branch1: {
                steps: stepBuilder =>
                  stepBuilder.serverLog({ text: "Branch 1.1" }),
                condition: {
                  equal: { "steps.1.success": true },
                },
              },
              branch2: {
                steps: stepBuilder =>
                  stepBuilder.serverLog({ text: "Branch 1.2" }),
                condition: {
                  equal: { "steps.1.success": false },
                },
              },
            }),
          condition: {
            equal: { "steps.1.success": true },
          },
        },
        topLevelBranch2: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Branch 2" }),
          condition: {
            equal: { "steps.1.success": false },
          },
        },
      })
      .run()
    expect(results.steps[3].outputs.status).toContain("branch1 branch taken")
    expect(results.steps[4].outputs.message).toContain("Branch 1.1")
  })

  it("should execute correct branch based on string equality", async () => {
    const builder = createAutomationBuilder({
      name: "String Equality Branching",
    })

    const results = await builder
      .appAction({ fields: { status: "active" } })
      .branch({
        activeBranch: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Active user" }),
          condition: {
            equal: { "trigger.fields.status": "active" },
          },
        },
        inactiveBranch: {
          steps: stepBuilder =>
            stepBuilder.serverLog({ text: "Inactive user" }),
          condition: {
            equal: { "trigger.fields.status": "inactive" },
          },
        },
      })
      .run()
    expect(results.steps[0].outputs.status).toContain(
      "activeBranch branch taken"
    )
    expect(results.steps[1].outputs.message).toContain("Active user")
  })

  it("should handle multiple conditions with AND operator", async () => {
    const builder = createAutomationBuilder({
      name: "Multiple AND Conditions Branching",
    })

    const results = await builder
      .appAction({ fields: { status: "active", role: "admin" } })
      .branch({
        activeAdminBranch: {
          steps: stepBuilder =>
            stepBuilder.serverLog({ text: "Active admin user" }),
          condition: {
            $and: {
              conditions: [
                { equal: { "trigger.fields.status": "active" } },
                { equal: { "trigger.fields.role": "admin" } },
              ],
            },
          },
        },
        otherBranch: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Other user" }),
          condition: {
            notEqual: { "trigger.fields.status": "active" },
          },
        },
      })
      .run()

    expect(results.steps[1].outputs.message).toContain("Active admin user")
  })

  it("should handle multiple conditions with OR operator", async () => {
    const builder = createAutomationBuilder({
      name: "Multiple OR Conditions Branching",
    })

    const results = await builder
      .appAction({ fields: { status: "test", role: "user" } })
      .branch({
        specialBranch: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Special user" }),
          condition: {
            $or: {
              conditions: [
                { equal: { "trigger.fields.status": "test" } },
                { equal: { "trigger.fields.role": "admin" } },
              ],
            },
          },
        },
        regularBranch: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Regular user" }),
          condition: {
            $and: {
              conditions: [
                { notEqual: { "trigger.fields.status": "active" } },
                { notEqual: { "trigger.fields.role": "admin" } },
              ],
            },
          },
        },
      })
      .run()

    expect(results.steps[1].outputs.message).toContain("Special user")
  })

  it("should stop the branch automation when no conditions are met", async () => {
    const builder = createAutomationBuilder({
      name: "Multiple OR Conditions Branching",
    })

    const results = await builder
      .appAction({ fields: { status: "test", role: "user" } })
      .createRow({ row: { name: "Test", tableId: table._id } })
      .branch({
        specialBranch: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Special user" }),
          condition: {
            $or: {
              conditions: [
                { equal: { "trigger.fields.status": "new" } },
                { equal: { "trigger.fields.role": "admin" } },
              ],
            },
          },
        },
        regularBranch: {
          steps: stepBuilder => stepBuilder.serverLog({ text: "Regular user" }),
          condition: {
            $and: {
              conditions: [
                { equal: { "trigger.fields.status": "active" } },
                { equal: { "trigger.fields.role": "admin" } },
              ],
            },
          },
        },
      })
      .serverLog({ text: "Test" })
      .run()

    expect(results.steps[1].outputs.status).toEqual(
      AutomationStatus.NO_CONDITION_MET
    )
    expect(results.steps[2]).toBeUndefined()
  })
})
