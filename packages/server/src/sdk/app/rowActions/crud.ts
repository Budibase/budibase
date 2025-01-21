import { context, docIds, HTTPError, utils } from "@budibase/backend-core"
import {
  Automation,
  AutomationTriggerStepId,
  SEPARATOR,
  TableRowActions,
  User,
  VirtualDocumentType,
} from "@budibase/types"
import { generateRowActionsID } from "../../../db/utils"
import automations from "../automations"
import { definitions as TRIGGER_DEFINITIONS } from "../../../automations/triggerInfo"
import * as triggers from "../../../automations/triggers"
import sdk from "../.."

async function ensureUniqueAndThrow(
  doc: TableRowActions,
  name: string,
  existingRowActionId?: string
) {
  const names = await getNames(doc)
  name = name.toLowerCase().trim()

  if (
    Object.entries(names).find(
      ([automationId, automationName]) =>
        automationName.toLowerCase().trim() === name &&
        automationId !== existingRowActionId
    )
  ) {
    throw new HTTPError("A row action with the same name already exists.", 409)
  }
}

export async function create(tableId: string, rowAction: { name: string }) {
  const action = { name: rowAction.name.trim() }

  const db = context.getAppDB()
  const rowActionsId = generateRowActionsID(tableId)
  let doc = await db.tryGet<TableRowActions>(rowActionsId)
  if (!doc) {
    doc = { _id: rowActionsId, actions: {} }
  }

  await ensureUniqueAndThrow(doc, action.name)

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
    automationId: automation._id!,
    permissions: {
      table: { runAllowed: true },
      views: {},
    },
  }
  await db.put(doc)

  return {
    id: newRowActionId,
    name: automation.name,
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
  return await db.tryGet<TableRowActions>(rowActionsId)
}

export async function deleteAll(tableId: string) {
  const db = context.getAppDB()

  const doc = await getAll(tableId)
  if (!doc) {
    return
  }

  const automationIds = Object.values(doc.actions).map(a => a.automationId)
  const automations = await db.getMultiple<Automation>(automationIds)

  for (const automation of automations) {
    await sdk.automations.remove(automation._id!, automation._rev!)
  }

  await db.remove(doc)
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

export async function run(
  tableId: any,
  rowActionId: any,
  rowId: string,
  user: User
) {
  const table = await sdk.tables.getTable(tableId)
  if (!table) {
    throw new HTTPError("Table not found", 404)
  }

  const { automationId } = await get(tableId, rowActionId)
  const automation = await sdk.automations.get(automationId)

  const row = await sdk.rows.find(tableId, rowId)
  await triggers.externalTrigger(
    automation,
    {
      fields: {
        id: row._id,
        revision: row._rev,
        row,
        table,
      },
      user,
      appId: context.getAppId(),
    },
    { getResponses: true }
  )
}

export async function getNames({ actions }: TableRowActions) {
  const automations = await sdk.automations.find(
    Object.values(actions).map(({ automationId }) => automationId)
  )
  const automationNames = automations.reduce<Record<string, string>>(
    (names, a) => {
      names[a._id] = a.name
      return names
    },
    {}
  )
  return automationNames
}
