import {
  breakExternalTableId,
  buildExternalTableId,
} from "../../../integrations/utils"
import {
  foreignKeyStructure,
  generateForeignKey,
  generateJunctionTableName,
  hasTypeChanged,
  setStaticSchemas,
} from "./utils"
import { FieldTypes } from "../../../constants"
import { makeExternalQuery } from "../../../integrations/base/query"
import { handleRequest } from "../row/external"
import { context, events } from "@budibase/backend-core"
import { isRows, isSchema, parse } from "../../../utilities/schema"
import {
  BulkImportRequest,
  BulkImportResponse,
  Datasource,
  FieldSchema,
  ManyToManyRelationshipFieldMetadata,
  ManyToOneRelationshipFieldMetadata,
  OneToManyRelationshipFieldMetadata,
  Operation,
  QueryJson,
  RelationshipFieldMetadata,
  RelationshipType,
  RenameColumn,
  SaveTableRequest,
  SaveTableResponse,
  Table,
  TableRequest,
  UserCtx,
  ViewV2,
} from "@budibase/types"
import sdk from "../../../sdk"
import { builderSocket } from "../../../websockets"

const { cloneDeep } = require("lodash/fp")

async function makeTableRequest(
  datasource: Datasource,
  operation: Operation,
  table: Table,
  tables: Record<string, Table>,
  oldTable?: Table,
  renamed?: RenameColumn
) {
  const json: QueryJson = {
    endpoint: {
      datasourceId: datasource._id!,
      entityId: table._id!,
      operation,
    },
    meta: {
      tables,
    },
    table,
  }
  if (oldTable) {
    json.meta!.table = oldTable
  }
  if (renamed) {
    json.meta!.renamed = renamed
  }
  return makeExternalQuery(datasource, json)
}

function cleanupRelationships(
  table: Table,
  tables: Record<string, Table>,
  oldTable?: Table
) {
  const tableToIterate = oldTable ? oldTable : table
  // clean up relationships in couch table schemas
  for (let [key, schema] of Object.entries(tableToIterate.schema)) {
    if (
      schema.type === FieldTypes.LINK &&
      (!oldTable || table.schema[key] == null)
    ) {
      const schemaTableId = schema.tableId
      const relatedTable = Object.values(tables).find(
        table => table._id === schemaTableId
      )
      const foreignKey =
        schema.relationshipType !== RelationshipType.MANY_TO_MANY &&
        schema.foreignKey
      if (!relatedTable || !foreignKey) {
        continue
      }
      for (let [relatedKey, relatedSchema] of Object.entries(
        relatedTable.schema
      )) {
        if (
          relatedSchema.type === FieldTypes.LINK &&
          relatedSchema.fieldName === foreignKey
        ) {
          delete relatedTable.schema[relatedKey]
        }
      }
    }
  }
}

function getDatasourceId(table: Table) {
  if (!table) {
    throw "No table supplied"
  }
  if (table.sourceId) {
    return table.sourceId
  }
  return breakExternalTableId(table._id).datasourceId
}

function otherRelationshipType(type?: string) {
  if (type === RelationshipType.MANY_TO_MANY) {
    return RelationshipType.MANY_TO_MANY
  }
  return type === RelationshipType.ONE_TO_MANY
    ? RelationshipType.MANY_TO_ONE
    : RelationshipType.ONE_TO_MANY
}

function generateManyLinkSchema(
  datasource: Datasource,
  column: ManyToManyRelationshipFieldMetadata,
  table: Table,
  relatedTable: Table
): Table {
  if (!table.primary || !relatedTable.primary) {
    throw new Error("Unable to generate many link schema, no primary keys")
  }
  const primary = table.name + table.primary[0]
  const relatedPrimary = relatedTable.name + relatedTable.primary[0]
  const jcTblName = generateJunctionTableName(column, table, relatedTable)
  // first create the new table
  const junctionTable = {
    _id: buildExternalTableId(datasource._id!, jcTblName),
    name: jcTblName,
    primary: [primary, relatedPrimary],
    constrained: [primary, relatedPrimary],
    schema: {
      [primary]: foreignKeyStructure(primary, {
        toTable: table.name,
        toKey: table.primary[0],
      }),
      [relatedPrimary]: foreignKeyStructure(relatedPrimary, {
        toTable: relatedTable.name,
        toKey: relatedTable.primary[0],
      }),
    },
  }
  column.through = junctionTable._id
  column.throughFrom = relatedPrimary
  column.throughTo = primary
  column.fieldName = relatedPrimary
  return junctionTable
}

function generateLinkSchema(
  column:
    | OneToManyRelationshipFieldMetadata
    | ManyToOneRelationshipFieldMetadata,
  table: Table,
  relatedTable: Table,
  type: RelationshipType.ONE_TO_MANY | RelationshipType.MANY_TO_ONE
) {
  if (!table.primary || !relatedTable.primary) {
    throw new Error("Unable to generate link schema, no primary keys")
  }
  const isOneSide = type === RelationshipType.ONE_TO_MANY
  const primary = isOneSide ? relatedTable.primary[0] : table.primary[0]
  // generate a foreign key
  const foreignKey = generateForeignKey(column, relatedTable)
  column.relationshipType = type
  column.foreignKey = isOneSide ? foreignKey : primary
  column.fieldName = isOneSide ? primary : foreignKey
  return foreignKey
}

function generateRelatedSchema(
  linkColumn: RelationshipFieldMetadata,
  table: Table,
  relatedTable: Table,
  columnName: string
) {
  // generate column for other table
  const relatedSchema = cloneDeep(linkColumn)
  const isMany2Many =
    linkColumn.relationshipType === RelationshipType.MANY_TO_MANY
  // swap them from the main link
  if (!isMany2Many && linkColumn.foreignKey) {
    relatedSchema.fieldName = linkColumn.foreignKey
    relatedSchema.foreignKey = linkColumn.fieldName
  }
  // is many to many
  else if (isMany2Many) {
    // don't need to copy through, already got it
    relatedSchema.fieldName = linkColumn.throughTo
    relatedSchema.throughTo = linkColumn.throughFrom
    relatedSchema.throughFrom = linkColumn.throughTo
  }
  relatedSchema.relationshipType = otherRelationshipType(
    linkColumn.relationshipType
  )
  relatedSchema.tableId = relatedTable._id
  relatedSchema.name = columnName
  table.schema[columnName] = relatedSchema
}

function isRelationshipSetup(column: RelationshipFieldMetadata) {
  return (column as any).foreignKey || (column as any).through
}

export async function save(ctx: UserCtx<SaveTableRequest, SaveTableResponse>) {
  const inputs = ctx.request.body
  const renamed = inputs?._rename
  // can't do this right now
  delete inputs.rows
  const datasourceId = getDatasourceId(ctx.request.body)!
  // table doesn't exist already, note that it is created
  if (!inputs._id) {
    inputs.created = true
  }
  let tableToSave: TableRequest = {
    type: "table",
    _id: buildExternalTableId(datasourceId, inputs.name),
    sourceId: datasourceId,
    ...inputs,
  }

  let oldTable: Table | undefined
  if (ctx.request.body && ctx.request.body._id) {
    oldTable = await sdk.tables.getTable(ctx.request.body._id)
  }

  if (hasTypeChanged(tableToSave, oldTable)) {
    ctx.throw(400, "A column type has changed.")
  }

  for (let view in tableToSave.views) {
    const tableView = tableToSave.views[view]
    if (!tableView || !sdk.views.isV2(tableView)) continue

    tableToSave.views[view] = sdk.views.syncSchema(
      oldTable!.views![view] as ViewV2,
      tableToSave.schema,
      renamed
    )
  }

  const db = context.getAppDB()
  const datasource = await sdk.datasources.get(datasourceId)
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
        throw "Junction table already exists, cannot create another relationship."
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

  cleanupRelationships(tableToSave, tables, oldTable)

  const operation = oldTable ? Operation.UPDATE_TABLE : Operation.CREATE_TABLE
  await makeTableRequest(
    datasource,
    operation,
    tableToSave,
    tables,
    oldTable,
    renamed
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
  await db.put(sdk.tables.populateExternalTableSchemas(datasource))

  // Since tables are stored inside datasources, we need to notify clients
  // that the datasource definition changed
  const updatedDatasource = await sdk.datasources.get(datasource._id!)
  builderSocket?.emitDatasourceUpdate(ctx, updatedDatasource)

  return tableToSave
}

export async function destroy(ctx: UserCtx) {
  const tableToDelete: TableRequest = await sdk.tables.getTable(
    ctx.params.tableId
  )
  if (!tableToDelete || !tableToDelete.created) {
    ctx.throw(400, "Cannot delete tables which weren't created in Budibase.")
  }
  const datasourceId = getDatasourceId(tableToDelete)

  const db = context.getAppDB()
  const datasource = await sdk.datasources.get(datasourceId!)
  const tables = datasource.entities

  const operation = Operation.DELETE_TABLE
  if (tables) {
    await makeTableRequest(datasource, operation, tableToDelete, tables)
    cleanupRelationships(tableToDelete, tables)
    delete tables[tableToDelete.name]
    datasource.entities = tables
  }

  await db.put(sdk.tables.populateExternalTableSchemas(datasource))

  // Since tables are stored inside datasources, we need to notify clients
  // that the datasource definition changed
  const updatedDatasource = await sdk.datasources.get(datasource._id!)
  builderSocket?.emitDatasourceUpdate(ctx, updatedDatasource)

  return tableToDelete
}

export async function bulkImport(
  ctx: UserCtx<BulkImportRequest, BulkImportResponse>
) {
  const table = await sdk.tables.getTable(ctx.params.tableId)
  const { rows } = ctx.request.body
  const schema = table.schema

  if (!rows || !isRows(rows) || !isSchema(schema)) {
    ctx.throw(400, "Provided data import information is invalid.")
  }

  const parsedRows = parse(rows, schema)
  await handleRequest(Operation.BULK_CREATE, table._id!, {
    rows: parsedRows,
  })
  await events.rows.imported(table, parsedRows.length)
  return table
}
