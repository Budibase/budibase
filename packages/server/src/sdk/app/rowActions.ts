import { context, docIds, HTTPError, utils } from "@budibase/backend-core"
import {
  AutomationTriggerStepId,
  SEPARATOR,
  TableRowActions,
  VirtualDocumentType,
} from "@budibase/types"
import { generateRowActionsID } from "../../db/utils"
import automations from "./automations"
import { definitions as TRIGGER_DEFINITIONS } from "../../automations/triggerInfo"
import * as triggers from "../../automations/triggers"
import sdk from ".."

function ensureUniqueAndThrow(
  doc: TableRowActions,
  name: string,
  existingRowActionId?: string
) {
  if (
    Object.entries(doc.actions).find(
      ([id, a]) =>
        a.name.toLowerCase() === name.toLowerCase() &&
        id !== existingRowActionId
    )
  ) {
    throw new HTTPError("A row action with the same name already exists.", 409)
  }
}

export async function create(tableId: string, rowAction: { name: string }) {
  const action = { name: rowAction.name.trim() }

  const db = context.getAppDB()
  const rowActionsId = generateRowActionsID(tableId)
  let doc: TableRowActions
  try {
    doc = await db.get<TableRowActions>(rowActionsId)
  } catch (e: any) {
    if (e.status !== 404) {
      throw e
    }

    doc = { _id: rowActionsId, actions: {} }
  }

  ensureUniqueAndThrow(doc, action.name)

  const appId = context.getAppId()
  if (!appId) {
    throw new Error("Could not get the current appId")
  }

  const newRowActionId = `${
    VirtualDocumentType.ROW_ACTION
  }${SEPARATOR}${utils.newid()}`

  const automation = await automations.create({
    name: action.name,
    appId,
    definition: {
      trigger: {
        id: "trigger",
        ...TRIGGER_DEFINITIONS.ROW_ACTION,
        stepId: AutomationTriggerStepId.ROW_ACTION,
        inputs: {
          tableId,
          rowActionId: newRowActionId,
        },
      },
      steps: [],
    },
  })

  doc.actions[newRowActionId] = {
    name: action.name,
    automationId: automation._id!,
    permissions: {
      table: { runAllowed: true },
      views: {},
    },
  }
  await db.put(doc)

  return {
    id: newRowActionId,
    ...doc.actions[newRowActionId],
  }
}

export async function get(tableId: string, rowActionId: string) {
  const actionsDoc = await getAll(tableId)
  const rowAction = actionsDoc?.actions[rowActionId]
  if (!rowAction) {
    throw new HTTPError(
      `Row action '${rowActionId}' not found in '${tableId}'`,
      400
    )
  }
  return rowAction
}

export async function getAll(tableId: string) {
  const db = context.getAppDB()
  const rowActionsId = generateRowActionsID(tableId)
  return await db.get<TableRowActions>(rowActionsId)
}

export async function docExists(tableId: string) {
  const db = context.getAppDB()
  const rowActionsId = generateRowActionsID(tableId)
  const result = await db.exists(rowActionsId)
  return result
}

async function updateDoc(
  tableId: string,
  rowActionId: string,
  transformer: (
    tableRowActions: TableRowActions
  ) => TableRowActions | Promise<TableRowActions>
) {
  const actionsDoc = await getAll(tableId)
  const rowAction = actionsDoc?.actions[rowActionId]
  if (!rowAction) {
    throw new HTTPError(
      `Row action '${rowActionId}' not found in '${tableId}'`,
      400
    )
  }

  const updated = await transformer(actionsDoc)

  const db = context.getAppDB()
  await db.put(updated)

  return {
    id: rowActionId,
    ...updated.actions[rowActionId],
  }
}

export async function update(
  tableId: string,
  rowActionId: string,
  rowActionData: { name: string }
) {
  const newName = rowActionData.name.trim()

  return await updateDoc(tableId, rowActionId, actionsDoc => {
    ensureUniqueAndThrow(actionsDoc, newName, rowActionId)
    actionsDoc.actions[rowActionId].name = newName
    return actionsDoc
  })
}

async function guardView(tableId: string, viewId: string) {
  let view
  if (docIds.isViewId(viewId)) {
    view = await sdk.views.get(viewId)
  }
  if (!view || view.tableId !== tableId) {
    throw new HTTPError(`View '${viewId}' not found in '${tableId}'`, 400)
  }
}

export async function setTablePermission(tableId: string, rowActionId: string) {
  return await updateDoc(tableId, rowActionId, async actionsDoc => {
    actionsDoc.actions[rowActionId].permissions.table.runAllowed = true
    return actionsDoc
  })
}

export async function unsetTablePermission(
  tableId: string,
  rowActionId: string
) {
  return await updateDoc(tableId, rowActionId, async actionsDoc => {
    actionsDoc.actions[rowActionId].permissions.table.runAllowed = false
    return actionsDoc
  })
}

export async function setViewPermission(
  tableId: string,
  rowActionId: string,
  viewId: string
) {
  await guardView(tableId, viewId)
  return await updateDoc(tableId, rowActionId, async actionsDoc => {
    actionsDoc.actions[rowActionId].permissions.views[viewId] = {
      runAllowed: true,
    }
    return actionsDoc
  })
}

export async function unsetViewPermission(
  tableId: string,
  rowActionId: string,
  viewId: string
) {
  await guardView(tableId, viewId)
  return await updateDoc(tableId, rowActionId, async actionsDoc => {
    delete actionsDoc.actions[rowActionId].permissions.views[viewId]
    return actionsDoc
  })
}

export async function remove(tableId: string, rowActionId: string) {
  return await updateDoc(tableId, rowActionId, async actionsDoc => {
    const { automationId } = actionsDoc.actions[rowActionId]
    const automation = await automations.get(automationId)
    await automations.remove(automation._id, automation._rev)

    delete actionsDoc.actions[rowActionId]
    return actionsDoc
  })
}

export async function run(tableId: any, rowActionId: any, rowId: string) {
  const table = await sdk.tables.getTable(tableId)
  if (!table) {
    throw new HTTPError("Table not found", 404)
  }

  const { actions } = await getAll(tableId)

  const rowAction = actions[rowActionId]
  if (!rowAction) {
    throw new HTTPError("Row action not found", 404)
  }

  const automation = await sdk.automations.get(rowAction.automationId)

  const row = await sdk.rows.find(tableId, rowId)
  await triggers.externalTrigger(
    automation,
    {
      fields: {
        row,
        table,
      },
      appId: context.getAppId(),
    },
    { getResponses: true }
  )
}
