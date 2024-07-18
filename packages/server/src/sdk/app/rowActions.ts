import { context, HTTPError, utils } from "@budibase/backend-core"

import { generateRowActionsID } from "../../db/utils"
import {
  AutomationCustomIOType,
  AutomationIOType,
  AutomationStepType,
  AutomationTriggerStepId,
  SEPARATOR,
  TableRowActions,
  VirtualDocumentType,
} from "@budibase/types"
import automations from "./automations"
import tables from "./tables"

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

  const { name: tableName } = await tables.getTable(tableId)

  ensureUniqueAndThrow(doc, action.name)

  const appId = context.getAppId()
  if (!appId) {
    throw new Error("Could not get the current appId")
  }

  const automation = await automations.create({
    name: `${tableName}: ${action.name}`,
    appId,
    definition: {
      trigger: {
        type: AutomationStepType.TRIGGER,
        id: "TODO id",
        tagline: "TODO tagline",
        name: "Row Action",
        description: "TODO description",
        icon: "Workflow",
        stepId: AutomationTriggerStepId.ROW_ACTION,
        inputs: {
          tableId,
        },
        schema: {
          inputs: {
            properties: {
              tableId: {
                type: AutomationIOType.STRING,
                customType: AutomationCustomIOType.TABLE,
                title: "Table",
                readonly: true,
              },
            },
            required: ["tableId"],
          },
          outputs: { properties: {} },
        },
      },
      steps: [],
    },
  })

  const newId = `${VirtualDocumentType.ROW_ACTION}${SEPARATOR}${utils.newid()}`
  doc.actions[newId] = {
    name: action.name,
    automationId: automation._id!,
  }
  await db.put(doc)

  return {
    id: newId,
    ...doc.actions[newId],
  }
}

export async function get(tableId: string) {
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

export async function update(
  tableId: string,
  rowActionId: string,
  rowAction: { name: string }
) {
  const action = { name: rowAction.name.trim() }
  const actionsDoc = await get(tableId)

  if (!actionsDoc.actions[rowActionId]) {
    throw new HTTPError(
      `Row action '${rowActionId}' not found in '${tableId}'`,
      400
    )
  }

  ensureUniqueAndThrow(actionsDoc, action.name, rowActionId)

  actionsDoc.actions[rowActionId] = {
    automationId: actionsDoc.actions[rowActionId].automationId,
    ...action,
  }

  const db = context.getAppDB()
  await db.put(actionsDoc)

  return {
    id: rowActionId,
    ...actionsDoc.actions[rowActionId],
  }
}

export async function remove(tableId: string, rowActionId: string) {
  const actionsDoc = await get(tableId)

  const rowAction = actionsDoc.actions[rowActionId]
  if (!rowAction) {
    throw new HTTPError(
      `Row action '${rowActionId}' not found in '${tableId}'`,
      400
    )
  }

  const { automationId } = rowAction
  const automation = await automations.get(automationId)
  await automations.remove(automation._id, automation._rev)
  delete actionsDoc.actions[rowActionId]

  const db = context.getAppDB()
  await db.put(actionsDoc)
}
