import {
  Automation,
  AutomationActionStepId,
  AutomationBuilderData,
  TableRowActions,
} from "@budibase/types"
import { sdk as coreSdk } from "@budibase/shared-core"
import sdk from "../../../sdk"

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
      rowActionNameCache[tableId] = await sdk.rowActions.get(tableId)
    }

    return rowActionNameCache[tableId].actions[rowActionId]?.name
  }

  const result: Record<string, AutomationBuilderData> = {}
  for (const automation of automations) {
    const isRowAction = coreSdk.automations.isRowAction(automation)
    if (!isRowAction) {
      result[automation._id!] = { displayName: automation.name }
      continue
    }

    const { tableId, rowActionId } = automation.definition.trigger.inputs
    if (!tableId || !rowActionId) {
      continue
    }

    const tableName = await getTableName(tableId)
    const rowActionName = await getRowActionName(tableId, rowActionId)

    result[automation._id!] = {
      displayName: `${tableName}: ${automation.name}`,
      triggerInfo: {
        type: "Automation trigger",
        table: { id: tableId, name: tableName },
        rowAction: {
          id: rowActionId,
          name: rowActionName,
        },
      },
    }
  }
  return result
}
