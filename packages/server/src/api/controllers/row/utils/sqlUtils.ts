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
} from "@budibase/types"
import { breakExternalTableId } from "../../../../integrations/utils"
import { basicProcessing } from "./basic"
import { generateJunctionTableID } from "../../../../db/utils"

type TableMap = Record<string, Table>

export function isManyToMany(
  field: RelationshipFieldMetadata
): field is ManyToManyRelationshipFieldMetadata {
  return !!(field as ManyToManyRelationshipFieldMetadata).through
}

function isCorrectRelationship(
  relationship: RelationshipsJson,
  table1: Table,
  table2: Table,
  row: Row
): boolean {
  const junctionTableId = generateJunctionTableID(table1._id!, table2._id!)
  const possibleColumns = [
    `${junctionTableId}.doc1.fieldName`,
    `${junctionTableId}.doc2.fieldName`,
  ]
  return !!possibleColumns.find(col => row[col] === relationship.column)
}

/**
 * This iterates through the returned rows and works out what elements of the rows
 * actually match up to another row (based on primary keys) - this is pretty specific
 * to SQL and the way that SQL relationships are returned based on joins.
 * This is complicated, but the idea is that when a SQL query returns all the relations
 * will be separate rows, with all of the data in each row. We have to decipher what comes
 * from where (which tables) and how to convert that into budibase columns.
 */
export async function updateRelationshipColumns(
  table: Table,
  tables: TableMap,
  row: Row,
  rows: { [key: string]: Row },
  relationships: RelationshipsJson[],
  opts?: { sqs?: boolean }
) {
  const columns: { [key: string]: any } = {}
  for (let relationship of relationships) {
    const linkedTable = tables[relationship.tableName]
    if (!linkedTable) {
      continue
    }
    const fromColumn = `${table.name}.${relationship.from}`
    const toColumn = `${linkedTable.name}.${relationship.to}`
    // this is important when working with multiple relationships
    // between the same tables, don't want to overlap/multiply the relations
    if (
      !relationship.through &&
      row[fromColumn]?.toString() !== row[toColumn]?.toString()
    ) {
      continue
    }

    let linked = basicProcessing({
      row,
      table: linkedTable,
      isLinked: true,
      sqs: opts?.sqs,
    })
    if (!linked._id) {
      continue
    }
    if (
      !opts?.sqs ||
      isCorrectRelationship(relationship, table, linkedTable, row)
    ) {
      columns[relationship.column] = linked
    }
  }
  for (let [column, related] of Object.entries(columns)) {
    if (!row._id) {
      continue
    }
    const rowId: string = row._id
    if (!Array.isArray(rows[rowId][column])) {
      rows[rowId][column] = []
    }
    // make sure relationship hasn't been found already
    if (
      !rows[rowId][column].find((relation: Row) => relation._id === related._id)
    ) {
      rows[rowId][column].push(related)
    }
  }
  return rows
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

export function buildInternalRelationships(table: Table): RelationshipsJson[] {
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
export function buildSqlFieldList(
  table: Table,
  tables: TableMap,
  opts?: { relationships: boolean }
) {
  function extractRealFields(table: Table, existing: string[] = []) {
    return Object.entries(table.schema)
      .filter(
        ([columnName, column]) =>
          column.type !== FieldType.LINK &&
          column.type !== FieldType.FORMULA &&
          !existing.find((field: string) => field === columnName)
      )
      .map(column => `${table.name}.${column[0]}`)
  }
  let fields = extractRealFields(table)
  for (let field of Object.values(table.schema)) {
    if (
      field.type !== FieldType.LINK ||
      !opts?.relationships ||
      !field.tableId
    ) {
      continue
    }
    const { tableName: linkTableName } = breakExternalTableId(field.tableId)
    const linkTable = tables[linkTableName]
    if (linkTable) {
      const linkedFields = extractRealFields(linkTable, fields)
      fields = fields.concat(linkedFields)
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
