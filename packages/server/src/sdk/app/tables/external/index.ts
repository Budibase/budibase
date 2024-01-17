import {
  Operation,
  RelationshipType,
  RenameColumn,
  Table,
  TableRequest,
  ViewV2,
} from "@budibase/types"
import { context } from "@budibase/backend-core"
import { buildExternalTableId } from "../../../../integrations/utils"
import {
  foreignKeyStructure,
  hasTypeChanged,
  setStaticSchemas,
} from "../../../../api/controllers/table/utils"
import { cloneDeep } from "lodash/fp"
import { FieldTypes } from "../../../../constants"
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

  if (hasTypeChanged(tableToSave, oldTable)) {
    throw new Error("A column type has changed.")
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
    if (schema.type !== FieldTypes.LINK || isRelationshipSetup(schema)) {
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
    schema.main = true
  }

  // add in the new table for relationship purposes
  tables[tableToSave.name] = tableToSave
  cleanupRelationships(tableToSave, tables, oldTable)

  const operation = tableId ? Operation.UPDATE_TABLE : Operation.CREATE_TABLE
  await makeTableRequest(
    datasource,
    operation,
    tableToSave,
    tables,
    oldTable,
    opts?.renaming
  )
  // update any extra tables (like foreign keys in other tables)
  for (let extraTable of extraTablesToUpdate) {
    const oldExtraTable = oldTables[extraTable.name]
    let op = oldExtraTable ? Operation.UPDATE_TABLE : Operation.CREATE_TABLE
    await makeTableRequest(datasource, op, extraTable, tables, oldExtraTable)
  }

  // make sure the constrained list, all still exist
  if (Array.isArray(tableToSave.constrained)) {
    tableToSave.constrained = tableToSave.constrained.filter(constraint =>
      Object.keys(tableToSave.schema).includes(constraint)
    )
  }

  // remove the rename prop
  delete tableToSave._rename
  // store it into couch now for budibase reference
  datasource.entities[tableToSave.name] = tableToSave
  await db.put(populateExternalTableSchemas(datasource))

  // Since tables are stored inside datasources, we need to notify clients
  // that the datasource definition changed
  const updatedDatasource = await datasourceSdk.get(datasource._id!)

  return { datasource: updatedDatasource, table: tableToSave }
}

export async function destroy(datasourceId: string, table: Table) {
  const db = context.getAppDB()
  const datasource = await datasourceSdk.get(datasourceId)
  const tables = datasource.entities

  const operation = Operation.DELETE_TABLE
  if (tables) {
    await makeTableRequest(datasource, operation, table, tables)
    cleanupRelationships(table, tables)
    delete tables[table.name]
    datasource.entities = tables
  }

  await db.put(populateExternalTableSchemas(datasource))

  // Since tables are stored inside datasources, we need to notify clients
  // that the datasource definition changed
  const updatedDatasource = await datasourceSdk.get(datasource._id!)
  return { datasource: updatedDatasource, table }
}
