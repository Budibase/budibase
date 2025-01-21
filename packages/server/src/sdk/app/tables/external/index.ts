import {
  FieldType,
  Operation,
  RelationshipType,
  RenameColumn,
  Table,
  TableRequest,
  ViewV2,
  AutoFieldSubType,
} from "@budibase/types"
import { context, HTTPError } from "@budibase/backend-core"
import {
  breakExternalTableId,
  buildExternalTableId,
} from "../../../../integrations/utils"
import {
  foreignKeyStructure,
  hasTypeChanged,
  setStaticSchemas,
} from "../../../../api/controllers/table/utils"
import { cloneDeep } from "lodash/fp"
import { makeTableRequest } from "../../../../api/controllers/table/ExternalRequest"
import {
  isRelationshipSetup,
  cleanupRelationships,
  generateLinkSchema,
  generateManyLinkSchema,
  generateRelatedSchema,
} from "./utils"

import { getTable } from "../getters"
import { populateExternalTableSchemas } from "../validation"
import datasourceSdk from "../../datasources"
import * as viewSdk from "../../views"

const DEFAULT_PRIMARY_COLUMN = "id"

function noPrimaryKey(table: Table) {
  return table.primary == null || table.primary.length === 0
}

function validate(table: Table, oldTable?: Table) {
  if (
    !oldTable &&
    table.schema[DEFAULT_PRIMARY_COLUMN] &&
    noPrimaryKey(table)
  ) {
    throw new Error(
      "External tables with no `primary` column set will define an `id` column, but we found an `id` column in the supplied schema. Either set a `primary` column or remove the `id` column."
    )
  }

  if (hasTypeChanged(table, oldTable)) {
    throw new Error("A column type has changed.")
  }

  const autoSubTypes = Object.values(AutoFieldSubType)
  // check for auto columns, they are not allowed
  for (let [key, column] of Object.entries(table.schema)) {
    // this column is a special case, do not validate it
    if (key === DEFAULT_PRIMARY_COLUMN) {
      continue
    }
    // the auto-column type should never be used
    if (column.type === FieldType.AUTO) {
      throw new Error(
        `Column "${key}" has type "${FieldType.AUTO}" - this is not supported.`
      )
    }

    if (
      column.subtype &&
      autoSubTypes.includes(column.subtype as AutoFieldSubType)
    ) {
      throw new Error(
        `Column "${key}" has subtype "${column.subtype}" - this is not supported.`
      )
    }

    if (column.type === FieldType.DATETIME) {
      const oldColumn = oldTable?.schema[key] as typeof column

      if (oldColumn && column.timeOnly !== oldColumn.timeOnly) {
        throw new Error(
          `Column "${key}" can not change from time to datetime or viceversa.`
        )
      }
    }
  }
}

function getDatasourceId(table: Table) {
  if (!table) {
    throw new Error("No table supplied")
  }
  if (table.sourceId) {
    return table.sourceId
  }
  if (!table._id) {
    throw new Error("No table ID supplied")
  }
  return breakExternalTableId(table._id).datasourceId
}

export async function create(table: Omit<Table, "_id" | "_rev">) {
  const datasourceId = getDatasourceId(table)

  const tableToCreate = { ...table, created: true }
  try {
    const result = await save(datasourceId!, tableToCreate)
    return result.table
  } catch (err: any) {
    if (err instanceof Error) {
      throw new HTTPError(err.message, 400)
    } else {
      throw new HTTPError(err?.message || err, err.status || 500)
    }
  }
}

export async function save(
  datasourceId: string,
  update: Table,
  opts?: { tableId?: string; renaming?: RenameColumn }
) {
  let tableToSave: TableRequest = {
    ...update,
    type: "table",
    _id: buildExternalTableId(datasourceId, update.name),
    sourceId: datasourceId,
  }

  const tableId = opts?.tableId || update._id
  let oldTable: Table | undefined
  if (tableId) {
    oldTable = await getTable(tableId)
  }

  // this will throw an error if something is wrong
  validate(tableToSave, oldTable)

  if (!oldTable && noPrimaryKey(tableToSave)) {
    tableToSave.primary = [DEFAULT_PRIMARY_COLUMN]
    tableToSave.schema[DEFAULT_PRIMARY_COLUMN] = {
      type: FieldType.NUMBER,
      autocolumn: true,
      name: DEFAULT_PRIMARY_COLUMN,
    }
  }

  for (let view in tableToSave.views) {
    const tableView = tableToSave.views[view]
    if (!tableView || !viewSdk.isV2(tableView)) continue

    tableToSave.views[view] = viewSdk.syncSchema(
      oldTable!.views![view] as ViewV2,
      tableToSave.schema,
      opts?.renaming
    )
  }

  const db = context.getAppDB()
  const datasource = await datasourceSdk.get(datasourceId)
  if (!datasource.entities) {
    datasource.entities = {}
  }

  // GSheets is a specific case - only ever has a static primary key
  tableToSave = setStaticSchemas(datasource, tableToSave)

  const oldTables = cloneDeep(datasource.entities)
  const tables: Record<string, Table> = datasource.entities

  const extraTablesToUpdate = []

  // check if relations need setup
  for (let schema of Object.values(tableToSave.schema)) {
    if (schema.type !== FieldType.LINK || isRelationshipSetup(schema)) {
      continue
    }
    const schemaTableId = schema.tableId
    const relatedTable = Object.values(tables).find(
      table => table._id === schemaTableId
    )
    if (!relatedTable) {
      continue
    }
    const relatedColumnName = schema.fieldName!
    const relationType = schema.relationshipType
    if (relationType === RelationshipType.MANY_TO_MANY) {
      const junctionTable = generateManyLinkSchema(
        datasource,
        schema,
        tableToSave,
        relatedTable
      )
      if (tables[junctionTable.name]) {
        throw new Error(
          "Junction table already exists, cannot create another relationship."
        )
      }
      tables[junctionTable.name] = junctionTable
      extraTablesToUpdate.push(junctionTable)
    } else {
      const fkTable =
        relationType === RelationshipType.ONE_TO_MANY
          ? tableToSave
          : relatedTable
      const foreignKey = generateLinkSchema(
        schema,
        tableToSave,
        relatedTable,
        relationType
      )
      if (fkTable.schema[foreignKey] != null) {
        throw new Error(
          `Unable to generate foreign key - column ${foreignKey} already in use.`
        )
      }
      fkTable.schema[foreignKey] = foreignKeyStructure(foreignKey)
      if (fkTable.constrained == null) {
        fkTable.constrained = []
      }
      if (fkTable.constrained.indexOf(foreignKey) === -1) {
        fkTable.constrained.push(foreignKey)
      }
      // foreign key is in other table, need to save it to external
      if (fkTable._id !== tableToSave._id) {
        extraTablesToUpdate.push(fkTable)
      }
    }
    generateRelatedSchema(schema, relatedTable, tableToSave, relatedColumnName)
    tables[relatedTable.name] = relatedTable
    schema.main = true
  }

  // add in the new table for relationship purposes
  tables[tableToSave.name] = tableToSave
  if (oldTable) {
    cleanupRelationships(tableToSave, tables, { oldTable })
  }

  const operation = tableId ? Operation.UPDATE_TABLE : Operation.CREATE_TABLE
  await makeTableRequest(
    datasource,
    operation,
    tableToSave,
    oldTable,
    opts?.renaming
  )
  // update any extra tables (like foreign keys in other tables)
  for (let extraTable of extraTablesToUpdate) {
    const oldExtraTable = oldTables[extraTable.name]
    let op = oldExtraTable ? Operation.UPDATE_TABLE : Operation.CREATE_TABLE
    await makeTableRequest(datasource, op, extraTable, oldExtraTable)
  }

  // make sure the constrained list, all still exist
  if (Array.isArray(tableToSave.constrained)) {
    tableToSave.constrained = tableToSave.constrained.filter(constraint =>
      Object.keys(tableToSave.schema).includes(constraint)
    )
  }

  // remove the rename prop
  delete tableToSave._rename

  datasource.entities = {
    ...datasource.entities,
    ...tables,
  }

  // store it into couch now for budibase reference
  await db.put(populateExternalTableSchemas(datasource))

  // Since tables are stored inside datasources, we need to notify clients
  // that the datasource definition changed
  const updatedDatasource = await datasourceSdk.get(datasource._id!)

  if (updatedDatasource.isSQL) {
    tableToSave.sql = true
  }

  return { datasource: updatedDatasource, table: tableToSave, oldTable }
}

export async function destroy(datasourceId: string, table: Table) {
  const db = context.getAppDB()
  const datasource = await datasourceSdk.get(datasourceId)
  const tables = datasource.entities

  const operation = Operation.DELETE_TABLE
  if (tables) {
    await makeTableRequest(datasource, operation, table)
    cleanupRelationships(table, tables, { deleting: true })
    delete tables[table.name]
    datasource.entities = tables
  }

  await db.put(populateExternalTableSchemas(datasource))

  // Since tables are stored inside datasources, we need to notify clients
  // that the datasource definition changed
  const updatedDatasource = await datasourceSdk.get(datasource._id!)
  return { datasource: updatedDatasource, table }
}
