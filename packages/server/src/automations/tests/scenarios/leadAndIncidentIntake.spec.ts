import { encodeJSBinding } from "@budibase/string-templates"
import { FilterCondition, LoopStepType } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"
import * as automation from "../../index"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("Lead and incident intake automations", () => {
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

  it("turns command output into routed onboarding rows", async () => {
    const table = await config.api.table.save(basicTable())

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .bash(
        {
          command: "node",
          args: [
            "-e",
            "process.stdout.write(process.argv[1].toLowerCase())",
            "{{ trigger.fields.region }}",
          ],
        },
        { stepName: "Normalise Region" }
      )
      .executeScriptV2(
        {
          code: encodeJSBinding(`
            const names = $("trigger.fields.names")
              .split(",")
              .map(name => name.trim())
              .filter(Boolean)
            return names
          `),
        },
        { stepName: "Parse Names" }
      )
      .loopV2({
        steps: builder => {
          builder.branch({
            vip: {
              steps: branch =>
                branch.createRow({
                  row: {
                    tableId: table._id,
                    name: "VIP {{ loop.currentItem }}",
                    description:
                      "Region {{ steps.[Normalise Region].stdout }}",
                  },
                }),
              condition: {
                equal: { "{{ literal loop.currentItem }}": "Ada Lovelace" },
              },
            },
            standard: {
              steps: branch =>
                branch.createRow({
                  row: {
                    tableId: table._id,
                    name: "Lead {{ loop.currentItem }}",
                    description:
                      "Region {{ steps.[Normalise Region].stdout }}",
                  },
                }),
              condition: {
                notEqual: {
                  "{{ literal loop.currentItem }}": "Ada Lovelace",
                },
              },
            },
          })
        },
        option: LoopStepType.ARRAY,
        binding: "{{ steps.[Parse Names].value }}",
      })
      .queryRows({ tableId: table._id! })
      .serverLog({
        text: "Created {{ steps.4.rows.length }} onboarding rows",
      })
      .test({
        fields: {
          names: "Ada Lovelace, Grace Hopper",
          region: "EMEA",
        },
      })

    expect(results.steps[0].outputs.stdout).toBe("emea")
    expect(results.steps[1].outputs.value).toEqual([
      "Ada Lovelace",
      "Grace Hopper",
    ])
    expect(results.steps[2].outputs.summary.totalProcessed).toBe(2)
    expect(results.steps[3].outputs.rows).toHaveLength(2)
    expect(results.steps[3].outputs.rows.map((row: any) => row.name)).toEqual(
      expect.arrayContaining(["VIP Ada Lovelace", "Lead Grace Hopper"])
    )
    expect(results.steps[4].outputs.message).toContain("Created 2")
  })

  it("enriches an incident row with derived state after validation", async () => {
    const table = await config.api.table.save(basicTable())
    const row = await config.api.row.save(table._id!, {
      name: "Incident 42",
      description: "Needs triage",
    })

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .getRow(
        {
          tableId: table._id!,
          rowId: "{{ trigger.fields.rowId }}",
        },
        { stepName: "Current Row" }
      )
      .executeScriptV2(
        {
          code: encodeJSBinding(`
            const row = $("steps.[Current Row].row")
            return row.name.includes("Incident") ? "needs-review" : "normal"
          `),
        },
        { stepName: "Classify Row" }
      )
      .filter({
        condition: FilterCondition.EQUAL,
        field: "{{ steps.[Classify Row].value }}",
        value: "needs-review",
      })
      .extractState({
        key: "reviewStatus",
        value: "{{ steps.[Classify Row].value }}",
      })
      .updateRow({
        rowId: "{{ steps.[Current Row].row._id }}",
        row: {
          tableId: table._id,
          name: "{{ steps.[Current Row].row.name }}",
          description: "Status {{ state.reviewStatus }}",
        },
      })
      .test({
        fields: {
          rowId: row._id!,
        },
      })

    expect(results.steps[1].outputs.value).toBe("needs-review")
    expect(results.state?.reviewStatus).toBe("needs-review")
    expect(results.steps[4].outputs.row.description).toBe(
      "Status needs-review"
    )
  })
})
