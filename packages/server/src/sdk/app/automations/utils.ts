import {
  Automation,
  AutomationActionStepId,
  AutomationBuilderData,
  AutomationTriggerStepId,
  TableRowActions,
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

  const rowActionNameCache: Record<string, TableRowActions> = {}
  async function getRowActionName(tableId: string, rowActionId: string) {
    if (!rowActionNameCache[tableId]) {
      const rowActions = await sdk.rowActions.get(tableId)
      rowActionNameCache[tableId] = rowActions
    }

    return rowActionNameCache[tableId].actions[rowActionId]?.name
  }

  const result: Record<string, AutomationBuilderData> = {}
  for (const automation of automations) {
    const { trigger } = automation.definition
    const isRowAction = trigger.stepId === AutomationTriggerStepId.ROW_ACTION
    if (!isRowAction) {
      result[automation._id!] = { displayName: automation.name }
      continue
    }

    const { tableId, rowActionId } = trigger.inputs

    const tableName = await getTableName(tableId)

    const rowActionName = await getRowActionName(tableId, rowActionId)

    result[automation._id!] = {
      displayName: `${tableName}: ${automation.name}`,
      triggerInfo: {
        title: "Automation trigger",
        description: `This trigger is tied to the row action ${rowActionName} on your ${tableName} table`,
      },
    }
  }
  return result
}
