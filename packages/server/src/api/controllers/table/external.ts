import {
  buildExternalTableId,
  breakExternalTableId,
} from "../../../integrations/utils"
import {
  generateForeignKey,
  generateJunctionTableName,
  foreignKeyStructure,
  hasTypeChanged,
} from "./utils"
import { FieldTypes, RelationshipTypes } from "../../../constants"
import { makeExternalQuery } from "../../../integrations/base/query"
import { handleRequest } from "../row/external"
import { events, context } from "@budibase/backend-core"
import { parse, isRows, isSchema } from "../../../utilities/schema"
import {
  Datasource,
  Table,
  QueryJson,
  Operation,
  RenameColumn,
  FieldSchema,
  BBContext,
  TableRequest,
} from "@budibase/types"
import sdk from "../../../sdk"
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
      const relatedTable = Object.values(tables).find(
        table => table._id === schema.tableId
      )
      const foreignKey = schema.foreignKey
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
  if (type === RelationshipTypes.MANY_TO_MANY) {
    return RelationshipTypes.MANY_TO_MANY
  }
  return type === RelationshipTypes.ONE_TO_MANY
    ? RelationshipTypes.MANY_TO_ONE
    : RelationshipTypes.ONE_TO_MANY
}

function generateManyLinkSchema(
  datasource: Datasource,
  column: FieldSchema,
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
  column: FieldSchema,
  table: Table,
  relatedTable: Table,
  type: string
) {
  if (!table.primary || !relatedTable.primary) {
    throw new Error("Unable to generate link schema, no primary keys")
  }
  const isOneSide = type === RelationshipTypes.ONE_TO_MANY
  const primary = isOneSide ? relatedTable.primary[0] : table.primary[0]
  // generate a foreign key
  const foreignKey = generateForeignKey(column, relatedTable)
  column.relationshipType = type
  column.foreignKey = isOneSide ? foreignKey : primary
  column.fieldName = isOneSide ? primary : foreignKey
  return foreignKey
}

function generateRelatedSchema(
  linkColumn: FieldSchema,
  table: Table,
  relatedTable: Table,
  columnName: string
) {
  // generate column for other table
  const relatedSchema = cloneDeep(linkColumn)
  // swap them from the main link
  if (linkColumn.foreignKey) {
    relatedSchema.fieldName = linkColumn.foreignKey
    relatedSchema.foreignKey = linkColumn.fieldName
  }
  // is many to many
  else {
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

function isRelationshipSetup(column: FieldSchema) {
  return column.foreignKey || column.through
}

export async function save(ctx: BBContext) {
  const table: TableRequest = ctx.request.body
  const renamed = table?._rename
  // can't do this right now
  delete table.rows
  const datasourceId = getDatasourceId(ctx.request.body)!
  // table doesn't exist already, note that it is created
  if (!table._id) {
    table.created = true
  }
  let tableToSave: TableRequest = {
    type: "table",
    _id: buildExternalTableId(datasourceId, table.name),
    ...table,
  }

  let oldTable
  if (ctx.request.body && ctx.request.body._id) {
    oldTable = await sdk.tables.getTable(ctx.request.body._id)
  }

  if (hasTypeChanged(tableToSave, oldTable)) {
    ctx.throw(400, "A column type has changed.")
  }

  const db = context.getAppDB()
  const datasource = await sdk.datasources.get(datasourceId)
  if (!datasource.entities) {
    datasource.entities = {}
  }
  const oldTables = cloneDeep(datasource.entities)
  const tables: Record<string, Table> = datasource.entities

  const extraTablesToUpdate = []

  // check if relations need setup
  for (let schema of Object.values(tableToSave.schema)) {
    if (schema.type !== FieldTypes.LINK || isRelationshipSetup(schema)) {
      continue
    }
    const relatedTable = Object.values(tables).find(
      table => table._id === schema.tableId
    )
    if (!relatedTable) {
      continue
    }
    const relatedColumnName = schema.fieldName!
    const relationType = schema.relationshipType!
    if (relationType === RelationshipTypes.MANY_TO_MANY) {
      const junctionTable = generateManyLinkSchema(
        datasource,
        schema,
        table,
        relatedTable
      )
      if (tables[junctionTable.name]) {
        throw "Junction table already exists, cannot create another relationship."
      }
      tables[junctionTable.name] = junctionTable
      extraTablesToUpdate.push(junctionTable)
    } else {
      const fkTable =
        relationType === RelationshipTypes.ONE_TO_MANY ? table : relatedTable
      const foreignKey = generateLinkSchema(
        schema,
        table,
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
      if (fkTable._id !== table._id) {
        extraTablesToUpdate.push(fkTable)
      }
    }
    generateRelatedSchema(schema, relatedTable, table, relatedColumnName)
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
  await db.put(datasource)

  return tableToSave
}

export async function destroy(ctx: BBContext) {
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

  await db.put(datasource)

  return tableToDelete
}

export async function bulkImport(ctx: BBContext) {
  const table = await sdk.tables.getTable(ctx.params.tableId)
  const { rows }: { rows: unknown } = ctx.request.body
  const schema: unknown = table.schema

  if (!rows || !isRows(rows) || !isSchema(schema)) {
    ctx.throw(400, "Provided data import information is invalid.")
  }

  const parsedRows = await parse(rows, schema)
  await handleRequest(Operation.BULK_CREATE, table._id!, {
    rows: parsedRows,
  })
  await events.rows.imported(table, parsedRows.length)
  return table
}
