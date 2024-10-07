import {
  CalculationType,
  FieldType,
  PermissionLevel,
  RelationSchemaField,
  RenameColumn,
  Table,
  TableSchema,
  View,
  ViewV2,
  ViewV2ColumnEnriched,
  ViewV2Enriched,
} from "@budibase/types"
import { context, docIds, HTTPError, roles } from "@budibase/backend-core"
import {
  helpers,
  PROTECTED_EXTERNAL_COLUMNS,
  PROTECTED_INTERNAL_COLUMNS,
} from "@budibase/shared-core"

import * as utils from "../../../db/utils"
import { isExternalTableID } from "../../../integrations/utils"

import * as internal from "./internal"
import * as external from "./external"
import sdk from "../../../sdk"
import { PermissionUpdateType, updatePermissionOnRole } from "../permissions"

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

export async function getTable(view: string | ViewV2): Promise<Table> {
  const viewId = typeof view === "string" ? view : view.id
  const cached = context.getTableForView(viewId)
  if (cached) {
    return cached
  }
  const { tableId } = utils.extractViewInfoFromID(viewId)
  const table = await sdk.tables.getTable(tableId)
  context.setTableForView(viewId, table)
  return table
}

export function isView(view: any): view is ViewV2 {
  return view.id && docIds.isViewId(view.id) && view.version === 2
}

async function guardCalculationViewSchema(
  table: Table,
  view: Omit<ViewV2, "id" | "version">
) {
  const calculationFields = helpers.views.calculationFields(view)

  if (Object.keys(calculationFields).length > 5) {
    throw new HTTPError(
      "Calculation views can only have a maximum of 5 fields",
      400
    )
  }

  for (const calculationFieldName of Object.keys(calculationFields)) {
    const schema = calculationFields[calculationFieldName]
    const isCount = schema.calculationType === CalculationType.COUNT
    const isDistinct = isCount && "distinct" in schema && schema.distinct

    // Count fields that aren't distinct don't need to reference another field,
    // so we don't validate it.
    if (isCount && !isDistinct) {
      continue
    }

    const targetSchema = table.schema[schema.field]
    if (!targetSchema) {
      throw new HTTPError(
        `Calculation field "${calculationFieldName}" references field "${schema.field}" which does not exist in the table schema`,
        400
      )
    }

    if (!isCount && !helpers.schema.isNumeric(targetSchema)) {
      throw new HTTPError(
        `Calculation field "${calculationFieldName}" references field "${schema.field}" which is not a numeric field`,
        400
      )
    }
  }

  const groupByFields = helpers.views.basicFields(view)
  for (const groupByFieldName of Object.keys(groupByFields)) {
    const targetSchema = table.schema[groupByFieldName]
    if (!targetSchema) {
      throw new HTTPError(
        `Group by field "${groupByFieldName}" does not exist in the table schema`,
        400
      )
    }
  }
}

async function guardViewSchema(
  tableId: string,
  view: Omit<ViewV2, "id" | "version">
) {
  const table = await sdk.tables.getTable(tableId)

  if (helpers.views.isCalculationView(view)) {
    await guardCalculationViewSchema(table, view)
  }

  await checkReadonlyFields(table, view)
  checkRequiredFields(table, view)
  checkDisplayField(view)
}

async function checkReadonlyFields(
  table: Table,
  view: Omit<ViewV2, "id" | "version">
) {
  const viewSchema = view.schema || {}
  for (const field of Object.keys(viewSchema)) {
    const viewFieldSchema = viewSchema[field]
    if (helpers.views.isCalculationField(viewFieldSchema)) {
      continue
    }

    const tableFieldSchema = table.schema[field]
    if (!tableFieldSchema) {
      throw new HTTPError(
        `Field "${field}" is not valid for the requested table`,
        400
      )
    }

    if (viewSchema[field].readonly) {
      if (!viewSchema[field].visible) {
        throw new HTTPError(
          `Field "${field}" must be visible if you want to make it readonly`,
          400
        )
      }
    }
  }
}

function checkDisplayField(view: Omit<ViewV2, "id" | "version">) {
  if (view.primaryDisplay) {
    const viewSchemaField = view.schema?.[view.primaryDisplay]

    if (!viewSchemaField?.visible) {
      throw new HTTPError(
        `You can't hide "${view.primaryDisplay}" because it is the display column.`,
        400
      )
    }
  }
}

function checkRequiredFields(
  table: Table,
  view: Omit<ViewV2, "id" | "version">
) {
  const existingView = table.views?.[view.name] as ViewV2 | undefined
  for (const field of Object.values(table.schema)) {
    if (!helpers.schema.isRequired(field.constraints)) {
      continue
    }

    const viewSchemaField = view.schema?.[field.name]
    const existingViewSchema = existingView?.schema?.[field.name]
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

    if (
      helpers.views.isBasicViewField(viewSchemaField) &&
      viewSchemaField.readonly
    ) {
      throw new HTTPError(
        `You can't make "${field.name}" readonly because it is a required field.`,
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

  const view = await pickApi(tableId).create(tableId, viewRequest)

  // Set permissions to be the same as the table
  const tablePerms = await sdk.permissions.getResourcePerms(tableId)
  const readRole = tablePerms[PermissionLevel.READ]?.role
  const writeRole = tablePerms[PermissionLevel.WRITE]?.role
  await updatePermissionOnRole(
    {
      roleId: readRole || roles.BUILTIN_ROLE_IDS.BASIC,
      resourceId: view.id,
      level: PermissionLevel.READ,
    },
    PermissionUpdateType.ADD
  )
  await updatePermissionOnRole(
    {
      roleId: writeRole || roles.BUILTIN_ROLE_IDS.BASIC,
      resourceId: view.id,
      level: PermissionLevel.WRITE,
    },
    PermissionUpdateType.ADD
  )

  return view
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

export function allowedFields(
  view: View | ViewV2,
  permission: "WRITE" | "READ"
) {
  return [
    ...Object.keys(view?.schema || {}).filter(key => {
      if (!isV2(view)) {
        return true
      }
      const fieldSchema = view.schema![key]
      if (permission === "WRITE") {
        return fieldSchema.visible && !fieldSchema.readonly
      }
      return fieldSchema.visible
    }),
    ...PROTECTED_EXTERNAL_COLUMNS,
    ...PROTECTED_INTERNAL_COLUMNS,
  ]
}

export async function enrichSchema(
  view: ViewV2,
  tableSchema: TableSchema
): Promise<ViewV2Enriched> {
  async function populateRelTableSchema(
    tableId: string,
    viewFields: Record<string, RelationSchemaField>
  ) {
    const relTable = await sdk.tables.getTable(tableId)
    const result: Record<string, ViewV2ColumnEnriched> = {}
    for (const relTableFieldName of Object.keys(relTable.schema)) {
      const relTableField = relTable.schema[relTableFieldName]
      if ([FieldType.LINK, FieldType.FORMULA].includes(relTableField.type)) {
        continue
      }

      if (relTableField.visible === false) {
        continue
      }

      const viewFieldSchema = viewFields[relTableFieldName]
      const isVisible = !!viewFieldSchema?.visible
      const isReadonly = !!viewFieldSchema?.readonly
      result[relTableFieldName] = {
        ...relTableField,
        ...viewFieldSchema,
        name: relTableField.name,
        visible: isVisible,
        readonly: isReadonly,
      }
    }
    return result
  }

  let schema: ViewV2Enriched["schema"] = {}

  const viewSchema = view.schema || {}
  const anyViewOrder = Object.values(viewSchema).some(ui => ui.order != null)

  const visibleSchemaFields = Object.keys(viewSchema).filter(key => {
    if (helpers.views.isCalculationField(viewSchema[key])) {
      return viewSchema[key].visible !== false
    }
    return key in tableSchema && tableSchema[key].visible !== false
  })
  const visibleTableFields = Object.keys(tableSchema).filter(
    key => tableSchema[key].visible !== false
  )
  const visibleFields = new Set([...visibleSchemaFields, ...visibleTableFields])
  for (const key of visibleFields) {
    // if nothing specified in view, then it is not visible
    const ui = viewSchema[key] || { visible: false }
    schema[key] = {
      ...tableSchema[key],
      ...ui,
      order: anyViewOrder ? ui?.order ?? undefined : tableSchema[key]?.order,
      columns: undefined,
    }

    if (schema[key].type === FieldType.LINK) {
      schema[key].columns = await populateRelTableSchema(
        schema[key].tableId,
        viewSchema[key]?.columns || {}
      )
    }
  }

  return { ...view, schema }
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

export async function renameLinkedViews(table: Table, renaming: RenameColumn) {
  const relatedTables: Record<string, Table> = {}

  for (const field of Object.values(table.schema)) {
    if (field.type !== FieldType.LINK) {
      continue
    }

    relatedTables[field.tableId] ??= await sdk.tables.getTable(field.tableId)
  }

  for (const relatedTable of Object.values(relatedTables)) {
    let toSave = false
    const viewsV2 = Object.values(relatedTable.views || {}).filter(
      sdk.views.isV2
    )
    if (!viewsV2) {
      continue
    }

    for (const view of viewsV2) {
      for (const relField of Object.keys(view.schema || {}).filter(f => {
        const tableField = relatedTable.schema[f]
        if (!tableField || tableField.type !== FieldType.LINK) {
          return false
        }

        return tableField.tableId === table._id
      })) {
        const columns = view.schema?.[relField]?.columns

        if (columns && columns[renaming.old]) {
          columns[renaming.updated] = columns[renaming.old]
          delete columns[renaming.old]
          toSave = true
        }
      }
    }

    if (toSave) {
      await sdk.tables.saveTable(relatedTable)
    }
  }
}
