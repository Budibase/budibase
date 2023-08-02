import { HTTPError, context } from "@budibase/backend-core"
import { FieldSchema, TableSchema, View, ViewV2 } from "@budibase/types"

import sdk from "../../../sdk"
import * as utils from "../../../db/utils"
import merge from "lodash/merge"

export async function get(viewId: string): Promise<ViewV2 | undefined> {
  const { tableId } = utils.extractViewInfoFromID(viewId)
  const table = await sdk.tables.getTable(tableId)
  const views = Object.values(table.views!)
  const view = views.find(v => isV2(v) && v.id === viewId) as ViewV2 | undefined

  return view
}

export async function create(
  tableId: string,
  viewRequest: Omit<ViewV2, "id" | "version">
): Promise<ViewV2> {
  const view: ViewV2 = {
    ...viewRequest,
    id: utils.generateViewID(tableId),
    version: 2,
  }

  const db = context.getAppDB()
  const table = await sdk.tables.getTable(tableId)
  table.views ??= {}

  table.views[view.name] = view
  await db.put(table)
  return view
}

export async function update(tableId: string, view: ViewV2): Promise<ViewV2> {
  const db = context.getAppDB()
  const table = await sdk.tables.getTable(tableId)
  table.views ??= {}

  const existingView = Object.values(table.views).find(
    v => isV2(v) && v.id === view.id
  )
  if (!existingView) {
    throw new HTTPError(`View ${view.id} not found in table ${tableId}`, 404)
  }

  delete table.views[existingView.name]
  table.views[view.name] = view
  await db.put(table)
  return view
}

export function isV2(view: View | ViewV2): view is ViewV2 {
  return (view as ViewV2).version === 2
}

export async function remove(viewId: string): Promise<void> {
  const db = context.getAppDB()

  const view = await get(viewId)
  const table = await sdk.tables.getTable(view?.tableId)
  if (!view) {
    throw new HTTPError(`View ${viewId} not found`, 404)
  }

  delete table.views![view?.name]
  await db.put(table)
}

export function enrichSchema(view: View | ViewV2, tableSchema: TableSchema) {
  if (!sdk.views.isV2(view)) {
    return view
  }

  let schema = { ...tableSchema }
  if (view.schemaUI) {
    const viewOverridesEntries = Object.entries(view.schemaUI)
    const viewSetsOrder = viewOverridesEntries.some(([_, v]) => v.order)
    for (const [fieldName, schemaUI] of viewOverridesEntries) {
      schema[fieldName] = {
        ...schema[fieldName],
        ...schemaUI,
        order: viewSetsOrder
          ? schemaUI.order || undefined
          : schema[fieldName].order,
      }
    }
    delete view.schemaUI
  }

  if (view?.columns?.length) {
    const pickedSchema: Record<string, FieldSchema> = {}
    for (const fieldName of view.columns) {
      if (!schema[fieldName]) {
        continue
      }
      pickedSchema[fieldName] = { ...schema[fieldName] }
    }
    schema = pickedSchema
    delete view.columns
  }

  return {
    ...view,
    schema: schema,
  }
}
