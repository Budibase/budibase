import {
  RenameColumn,
  TableSchema,
  View,
  ViewUIFieldMetadata,
  ViewV2,
  ViewV2Enriched,
} from "@budibase/types"
import { HTTPError, db as dbCore } from "@budibase/backend-core"
import { features } from "@budibase/pro"
import { helpers } from "@budibase/shared-core"
import { cloneDeep } from "lodash/fp"

import * as utils from "../../../db/utils"
import { isExternalTableID } from "../../../integrations/utils"

import * as internal from "./internal"
import * as external from "./external"
import sdk from "../../../sdk"

function pickApi(tableId: any) {
  if (isExternalTableID(tableId)) {
    return external
  }
  return internal
}

export async function get(viewId: string): Promise<ViewV2> {
  const { tableId } = utils.extractViewInfoFromID(viewId)
  return pickApi(tableId).get(viewId)
}

export async function getEnriched(viewId: string): Promise<ViewV2Enriched> {
  const { tableId } = utils.extractViewInfoFromID(viewId)
  return pickApi(tableId).getEnriched(viewId)
}

async function guardViewSchema(
  tableId: string,
  view: Omit<ViewV2, "id" | "version">
) {
  const viewSchema = view.schema || {}
  const table = await sdk.tables.getTable(tableId)

  for (const field of Object.keys(viewSchema)) {
    const tableSchemaField = table.schema[field]
    if (!tableSchemaField) {
      throw new HTTPError(
        `Field "${field}" is not valid for the requested table`,
        400
      )
    }

    if (viewSchema[field].readonly) {
      if (
        !(await features.isViewReadonlyColumnsEnabled()) &&
        !(tableSchemaField as ViewUIFieldMetadata).readonly
      ) {
        throw new HTTPError(`Readonly fields are not enabled`, 400)
      }

      if (!viewSchema[field].visible) {
        throw new HTTPError(
          `Field "${field}" must be visible if you want to make it readonly`,
          400
        )
      }
    }
  }

  const existingView =
    table?.views && (table.views[view.name] as ViewV2 | undefined)

  for (const field of Object.values(table.schema)) {
    if (!helpers.schema.isRequired(field.constraints)) {
      continue
    }

    const viewSchemaField = viewSchema[field.name]
    const existingViewSchema =
      existingView?.schema && existingView.schema[field.name]
    if (!viewSchemaField && !existingViewSchema?.visible) {
      // Supporting existing configs with required columns but hidden in views
      continue
    }

    if (!viewSchemaField?.visible) {
      throw new HTTPError(
        `You can't hide "${field.name}" because it is a required field.`,
        400
      )
    }

    if (viewSchemaField.readonly) {
      throw new HTTPError(
        `You can't make "${field.name}" readonly because it is a required field.`,
        400
      )
    }
  }

  if (view.primaryDisplay) {
    const viewSchemaField = viewSchema[view.primaryDisplay]

    if (!viewSchemaField?.visible) {
      throw new HTTPError(
        `You can't hide "${view.primaryDisplay}" because it is the display column.`,
        400
      )
    }
  }
}

export async function create(
  tableId: string,
  viewRequest: Omit<ViewV2, "id" | "version">
): Promise<ViewV2> {
  await guardViewSchema(tableId, viewRequest)

  return pickApi(tableId).create(tableId, viewRequest)
}

export async function update(tableId: string, view: ViewV2): Promise<ViewV2> {
  await guardViewSchema(tableId, view)

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
    ...Object.keys(view?.schema || {}).filter(key => {
      if (!isV2(view)) {
        return true
      }
      const fieldSchema = view.schema![key]
      return fieldSchema.visible && !fieldSchema.readonly
    }),
    ...dbCore.CONSTANT_EXTERNAL_ROW_COLS,
    ...dbCore.CONSTANT_INTERNAL_ROW_COLS,
  ]
}

export function enrichSchema(
  view: ViewV2,
  tableSchema: TableSchema
): ViewV2Enriched {
  let schema = cloneDeep(tableSchema)
  const anyViewOrder = Object.values(view.schema || {}).some(
    ui => ui.order != null
  )
  for (const key of Object.keys(schema)) {
    // if nothing specified in view, then it is not visible
    const ui = view.schema?.[key] || { visible: false }
    schema[key] = {
      ...schema[key],
      ...ui,
      order: anyViewOrder ? ui?.order ?? undefined : schema[key].order,
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
