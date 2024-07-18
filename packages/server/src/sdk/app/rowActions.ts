import { context, HTTPError, utils } from "@budibase/backend-core"

import { generateRowActionsID } from "../../db/utils"
import {
  SEPARATOR,
  TableRowActions,
  VirtualDocumentType,
} from "@budibase/types"

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

  const newId = `${VirtualDocumentType.ROW_ACTION}${SEPARATOR}${utils.newid()}`
  doc.actions[newId] = action
  await db.put(doc)

  return {
    id: newId,
    ...action,
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

  actionsDoc.actions[rowActionId] = action

  const db = context.getAppDB()
  await db.put(actionsDoc)

  return {
    id: rowActionId,
    ...action,
  }
}

export async function remove(tableId: string, rowActionId: string) {
  const actionsDoc = await get(tableId)

  if (!actionsDoc.actions[rowActionId]) {
    throw new HTTPError(
      `Row action '${rowActionId}' not found in '${tableId}'`,
      400
    )
  }

  delete actionsDoc.actions[rowActionId]

  const db = context.getAppDB()
  await db.put(actionsDoc)
}
