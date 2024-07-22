import {
  Automation,
  AutomationActionStepId,
  AutomationBuilderData,
  AutomationTriggerStepId,
} from "@budibase/types"
import sdk from "src/sdk"

export function checkForCollectStep(automation: Automation) {
  return automation.definition.steps.some(
    (step: any) => step.stepId === AutomationActionStepId.COLLECT
  )
}

export async function getBuilderData(
  automations: Automation[]
): Promise<Record<string, AutomationBuilderData>> {
  const tableNameCache: Record<string, string> = {}
  async function getTableName(tableId: string) {
    if (!tableNameCache[tableId]) {
      const table = await sdk.tables.getTable(tableId)
      tableNameCache[tableId] = table.name
    }

    return tableNameCache[tableId]
  }

  const result: Record<string, AutomationBuilderData> = {}
  for (const automation of automations) {
    const { trigger } = automation.definition
    const isRowAction = trigger.stepId === AutomationTriggerStepId.ROW_ACTION
    if (!isRowAction) {
      result[automation._id!] = { displayName: automation.name }
      continue
    }

    const tableName = await getTableName(trigger.inputs.tableId)

    result[automation._id!] = {
      displayName: `${tableName}: ${automation.name}`,
      triggerInfo: {
        title: "Automation trigger",
        description: `This trigger is tied to the row action TODO on your ${tableName} table`,
      },
    }
  }
  return result
}
