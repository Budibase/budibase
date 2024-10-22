import {
  DatasourcePlusQueryResponse,
  DSPlusOperation,
  FieldType,
  isManyToOne,
  isOneToMany,
  ManyToManyRelationshipFieldMetadata,
  RelationshipFieldMetadata,
  RelationshipsJson,
  Row,
  Table,
  ViewV2,
} from "@budibase/types"
import { breakExternalTableId } from "../../../../integrations/utils"
import { generateJunctionTableID } from "../../../../db/utils"
import sdk from "../../../../sdk"
import { helpers } from "@budibase/shared-core"

type TableMap = Record<string, Table>

export function isManyToMany(
  field: RelationshipFieldMetadata
): field is ManyToManyRelationshipFieldMetadata {
  return !!(field as ManyToManyRelationshipFieldMetadata).through
}

/**
 * Gets the list of relationship JSON structures based on the columns in the table,
 * this will be used by the underlying library to build whatever relationship mechanism
 * it has (e.g. SQL joins).
 */
export function buildExternalRelationships(
  table: Table,
  tables: TableMap
): RelationshipsJson[] {
  const relationships = []
  for (let [fieldName, field] of Object.entries(table.schema)) {
    if (field.type !== FieldType.LINK || !field.tableId) {
      continue
    }
    const { tableName: linkTableName } = breakExternalTableId(field.tableId)
    // no table to link to, this is not a valid relationships
    if (!tables[linkTableName]) {
      continue
    }
    const linkTable = tables[linkTableName]
    if (!table.primary || !linkTable.primary) {
      continue
    }
    const definition: RelationshipsJson = {
      tableName: linkTableName,
      // need to specify where to put this back into
      column: fieldName,
    }
    if (isManyToMany(field) && field.through) {
      const { tableName: throughTableName } = breakExternalTableId(
        field.through
      )
      definition.through = throughTableName
      // don't support composite keys for relationships
      definition.from = field.throughTo || table.primary[0]
      definition.to = field.throughFrom || linkTable.primary[0]
      definition.fromPrimary = table.primary[0]
      definition.toPrimary = linkTable.primary[0]
    } else if (isManyToOne(field) || isOneToMany(field)) {
      // if no foreign key specified then use the name of the field in other table
      definition.from = field.foreignKey || table.primary[0]
      definition.to = field.fieldName
    }
    relationships.push(definition)
  }
  return relationships
}

export function buildInternalRelationships(
  table: Table,
  allTables: Table[]
): RelationshipsJson[] {
  const relationships: RelationshipsJson[] = []
  const links = Object.values(table.schema).filter(
    column => column.type === FieldType.LINK
  )
  const tableId = table._id!
  for (let link of links) {
    if (link.type !== FieldType.LINK) {
      continue
    }
    const linkTableId = link.tableId!
    const junctionTableId = generateJunctionTableID(tableId, linkTableId)
    const isFirstTable = tableId > linkTableId
    // skip relationships with missing table definitions
    if (!allTables.find(table => table._id === linkTableId)) {
      continue
    }
    relationships.push({
      through: junctionTableId,
      column: link.name,
      tableName: linkTableId,
      fromPrimary: "_id",
      to: isFirstTable ? "doc2.rowId" : "doc1.rowId",
      from: isFirstTable ? "doc1.rowId" : "doc2.rowId",
      toPrimary: "_id",
    })
  }
  return relationships
}

/**
 * This function is a bit crazy, but the exact purpose of it is to protect against the scenario in which
 * you have column overlap in relationships, e.g. we join a few different tables and they all have the
 * concept of an ID, but for some of them it will be null (if they say don't have a relationship).
 * Creating the specific list of fields that we desire, and excluding the ones that are no use to us
 * is more performant and has the added benefit of protecting against this scenario.
 */
export async function buildSqlFieldList(
  source: Table | ViewV2,
  tables: TableMap,
  opts?: { relationships: boolean }
) {
  const { relationships } = opts || {}
  function extractRealFields(table: Table, existing: string[] = []) {
    return Object.entries(table.schema)
      .filter(
        ([columnName, column]) =>
          column.type !== FieldType.LINK &&
          column.type !== FieldType.FORMULA &&
          !existing.find(
            (field: string) => field === `${table.name}.${columnName}`
          )
      )
      .map(([columnName]) => `${table.name}.${columnName}`)
  }

  let fields: string[] = []
  if (sdk.views.isView(source)) {
    fields = Object.keys(helpers.views.basicFields(source))
  } else {
    fields = extractRealFields(source)
  }

  let table: Table
  if (sdk.views.isView(source)) {
    table = await sdk.views.getTable(source.id)
  } else {
    table = source
  }

  for (let field of Object.values(table.schema)) {
    if (field.type !== FieldType.LINK || !relationships || !field.tableId) {
      continue
    }
    const { tableName } = breakExternalTableId(field.tableId)
    if (tables[tableName]) {
      fields = fields.concat(extractRealFields(tables[tableName], fields))
    }
  }

  return fields
}

export function isKnexEmptyReadResponse(resp: DatasourcePlusQueryResponse) {
  return (
    !Array.isArray(resp) ||
    resp.length === 0 ||
    (DSPlusOperation.READ in resp[0] && resp[0].read === true)
  )
}

export function isKnexRows(resp: DatasourcePlusQueryResponse): resp is Row[] {
  return !isKnexEmptyReadResponse(resp)
}
