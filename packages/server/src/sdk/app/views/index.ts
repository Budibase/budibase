import { RenameColumn, TableSchema, View, ViewV2 } from "@budibase/types"
import { db as dbCore } from "@budibase/backend-core"
import { cloneDeep } from "lodash"

import sdk from "../../../sdk"
import * as utils from "../../../db/utils"
import { isExternalTable } from "../../../integrations/utils"

import * as internal from "./internal"
import * as external from "./external"

function pickApi(tableId: any) {
  if (isExternalTable(tableId)) {
    return external
  }
  return internal
}

export async function get(
  viewId: string,
  opts?: { enriched: boolean }
): Promise<ViewV2> {
  const { tableId } = utils.extractViewInfoFromID(viewId)
  return pickApi(tableId).get(viewId, opts)
}

export async function create(
  tableId: string,
  viewRequest: Omit<ViewV2, "id" | "version">
): Promise<ViewV2> {
  return pickApi(tableId).create(tableId, viewRequest)
}

export async function update(tableId: string, view: ViewV2): Promise<ViewV2> {
  return pickApi(tableId).update(tableId, view)
}

export function isV2(view: View | ViewV2): view is ViewV2 {
  return (view as ViewV2).version === 2
}

export async function remove(viewId: string): Promise<ViewV2> {
  const { tableId } = utils.extractViewInfoFromID(viewId)
  return pickApi(tableId).remove(viewId)
}

export function allowedFields(view: View | ViewV2) {
  return [
    ...Object.keys(view?.schema || {}),
    ...dbCore.CONSTANT_EXTERNAL_ROW_COLS,
    ...dbCore.CONSTANT_INTERNAL_ROW_COLS,
  ]
}

export function enrichSchema(view: View | ViewV2, tableSchema: TableSchema) {
  if (!sdk.views.isV2(view)) {
    return view
  }

  let schema = cloneDeep(tableSchema)
  const anyViewOrder = Object.values(view.schema || {}).some(
    ui => ui.order != null
  )
  for (const key of Object.keys(schema)) {
    // if nothing specified in view, then it is not visible
    const ui = view.schema?.[key] || { visible: false }
    if (ui.visible === false) {
      schema[key].visible = false
    } else {
      schema[key] = {
        ...schema[key],
        ...ui,
        order: anyViewOrder ? ui?.order ?? undefined : schema[key].order,
      }
    }
  }

  return {
    ...view,
    schema: schema,
  }
}

export function syncSchema(
  view: ViewV2,
  schema: TableSchema,
  renameColumn: RenameColumn | undefined
): ViewV2 {
  if (renameColumn && view.schema) {
    view.schema[renameColumn.updated] = view.schema[renameColumn.old]
    delete view.schema[renameColumn.old]
  }

  if (view.schema) {
    for (const fieldName of Object.keys(view.schema)) {
      if (!schema[fieldName]) {
        delete view.schema[fieldName]
      }
    }
    for (const fieldName of Object.keys(schema)) {
      if (!view.schema[fieldName]) {
        view.schema[fieldName] = { visible: false }
      }
    }
  }

  return view
}
