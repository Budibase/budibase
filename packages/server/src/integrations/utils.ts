import { SourceName, SqlQuery, Datasource, Table } from "@budibase/types"
import { DocumentType, SEPARATOR } from "../db/utils"
import { FieldTypes, BuildSchemaErrors, InvalidColumns } from "../constants"

const DOUBLE_SEPARATOR = `${SEPARATOR}${SEPARATOR}`
const ROW_ID_REGEX = /^\[.*]$/g

const SQL_NUMBER_TYPE_MAP = {
  integer: FieldTypes.NUMBER,
  int: FieldTypes.NUMBER,
  bigint: FieldTypes.NUMBER,
  decimal: FieldTypes.NUMBER,
  smallint: FieldTypes.NUMBER,
  real: FieldTypes.NUMBER,
  float: FieldTypes.NUMBER,
  numeric: FieldTypes.NUMBER,
  mediumint: FieldTypes.NUMBER,
  dec: FieldTypes.NUMBER,
  double: FieldTypes.NUMBER,
  fixed: FieldTypes.NUMBER,
  "double precision": FieldTypes.NUMBER,
  number: FieldTypes.NUMBER,
  binary_float: FieldTypes.NUMBER,
  binary_double: FieldTypes.NUMBER,
  money: FieldTypes.NUMBER,
  smallmoney: FieldTypes.NUMBER,
}

const SQL_DATE_TYPE_MAP = {
  timestamp: FieldTypes.DATETIME,
  time: FieldTypes.DATETIME,
  datetime: FieldTypes.DATETIME,
  smalldatetime: FieldTypes.DATETIME,
  date: FieldTypes.DATETIME,
}

const SQL_DATE_ONLY_TYPES = ["date"]
const SQL_TIME_ONLY_TYPES = ["time"]

const SQL_STRING_TYPE_MAP = {
  varchar: FieldTypes.STRING,
  char: FieldTypes.STRING,
  nchar: FieldTypes.STRING,
  nvarchar: FieldTypes.STRING,
  ntext: FieldTypes.STRING,
  enum: FieldTypes.STRING,
  blob: FieldTypes.STRING,
  long: FieldTypes.STRING,
  text: FieldTypes.STRING,
}

const SQL_BOOLEAN_TYPE_MAP = {
  boolean: FieldTypes.BOOLEAN,
  bit: FieldTypes.BOOLEAN,
  tinyint: FieldTypes.BOOLEAN,
}

const SQL_MISC_TYPE_MAP = {
  json: FieldTypes.JSON,
}

const SQL_TYPE_MAP = {
  ...SQL_NUMBER_TYPE_MAP,
  ...SQL_DATE_TYPE_MAP,
  ...SQL_STRING_TYPE_MAP,
  ...SQL_BOOLEAN_TYPE_MAP,
  ...SQL_MISC_TYPE_MAP,
}

export enum SqlClient {
  MS_SQL = "mssql",
  POSTGRES = "pg",
  MY_SQL = "mysql2",
  ORACLE = "oracledb",
}

export function isExternalTable(tableId: string) {
  return tableId.includes(DocumentType.DATASOURCE)
}

export function buildExternalTableId(datasourceId: string, tableName: string) {
  return `${datasourceId}${DOUBLE_SEPARATOR}${tableName}`
}

export function breakExternalTableId(tableId: string | undefined) {
  if (!tableId) {
    return {}
  }
  const parts = tableId.split(DOUBLE_SEPARATOR)
  let datasourceId = parts.shift()
  // if they need joined
  let tableName = parts.join(DOUBLE_SEPARATOR)
  return { datasourceId, tableName }
}

export function generateRowIdField(keyProps: any[] = []) {
  if (!Array.isArray(keyProps)) {
    keyProps = [keyProps]
  }
  // this conserves order and types
  // we have to swap the double quotes to single quotes for use in HBS statements
  // when using the literal helper the double quotes can break things
  return encodeURIComponent(JSON.stringify(keyProps).replace(/"/g, "'"))
}

export function isRowId(field: any) {
  return (
    Array.isArray(field) ||
    (typeof field === "string" && field.match(ROW_ID_REGEX) != null)
  )
}

export function convertRowId(field: any) {
  if (Array.isArray(field)) {
    return field[0]
  }
  if (typeof field === "string" && field.match(ROW_ID_REGEX) != null) {
    return field.substring(1, field.length - 1)
  }
  return field
}

// should always return an array
export function breakRowIdField(_id: string | { _id: string }): any[] {
  if (!_id) {
    return []
  }
  // have to replace on the way back as we swapped out the double quotes
  // when encoding, but JSON can't handle the single quotes
  const id = typeof _id === "string" ? _id : _id._id
  const decoded: string = decodeURIComponent(id).replace(/'/g, '"')
  try {
    const parsed = JSON.parse(decoded)
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch (err) {
    // wasn't json - likely was handlebars for a many to many
    return [_id]
  }
}

export function convertSqlType(type: string) {
  let foundType = FieldTypes.STRING
  const lcType = type.toLowerCase()
  for (let [external, internal] of Object.entries(SQL_TYPE_MAP)) {
    if (lcType.includes(external)) {
      foundType = internal
      break
    }
  }
  const schema: any = { type: foundType }
  if (foundType === FieldTypes.DATETIME) {
    schema.dateOnly = SQL_DATE_ONLY_TYPES.includes(lcType)
    schema.timeOnly = SQL_TIME_ONLY_TYPES.includes(lcType)
  }
  return schema
}

export function getSqlQuery(query: SqlQuery | string): SqlQuery {
  if (typeof query === "string") {
    return { sql: query }
  } else {
    return query
  }
}

export function isSQL(datasource: Datasource): boolean {
  if (!datasource || !datasource.source) {
    return false
  }
  const SQL = [
    SourceName.POSTGRES,
    SourceName.SQL_SERVER,
    SourceName.MYSQL,
    SourceName.ORACLE,
  ]
  return SQL.indexOf(datasource.source) !== -1
}

export function isIsoDateString(str: string) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) {
    return false
  }
  let d = new Date(str)
  return d.toISOString() === str
}

/**
 * This function will determine whether a column is a relationship and whether it
 * is currently valid. The reason for the validity check is that tables can be deleted
 * outside of Budibase control and if this is the case it will break Budibase relationships.
 * The tableIds is a list passed down from the main finalise tables function, which is
 * based on the tables that have just been fetched. This will only really be used on subsequent
 * fetches to the first one - if the user is periodically refreshing Budibase knowledge of tables.
 * @param column The column to check, to see if it is a valid relationship.
 * @param tableIds The IDs of the tables which currently exist.
 */
function shouldCopyRelationship(
  column: { type: string; tableId?: string },
  tableIds: [string]
) {
  return (
    column.type === FieldTypes.LINK &&
    column.tableId &&
    tableIds.includes(column.tableId)
  )
}

/**
 * Similar function to the shouldCopyRelationship function, but instead this looks for options and boolean
 * types. It is possible to switch a string -> options and a number -> boolean (and vice versus) need to make
 * sure that these get copied over when tables are fetched. Also checks whether they are still valid, if a
 * column has changed type in the external database then copying it over may not be possible.
 * @param column The column to check for options or boolean type.
 * @param fetchedColumn The fetched column to check for the type in the external database.
 */
function shouldCopySpecialColumn(
  column: { type: string },
  fetchedColumn: { type: string } | undefined
) {
  const specialTypes = [
    FieldTypes.OPTIONS,
    FieldTypes.LONGFORM,
    FieldTypes.ARRAY,
    FieldTypes.FORMULA,
  ]
  // column has been deleted, remove
  if (column && !fetchedColumn) {
    return false
  }
  const fetchedIsNumber =
    !fetchedColumn || fetchedColumn.type === FieldTypes.NUMBER
  return (
    specialTypes.indexOf(column.type as FieldTypes) !== -1 ||
    (fetchedIsNumber && column.type === FieldTypes.BOOLEAN)
  )
}

/**
 * Looks for columns which need to be copied over into the new table definitions, like relationships
 * and options types.
 * @param tableName The name of the table which is being checked.
 * @param table The specific table which is being checked.
 * @param entities All the tables that existed before - the old table definitions.
 * @param tableIds The IDs of the tables which exist now, to check if anything has been removed.
 */
function copyExistingPropsOver(
  tableName: string,
  table: Table,
  entities: { [key: string]: any },
  tableIds: [string]
) {
  if (entities && entities[tableName]) {
    if (entities[tableName].primaryDisplay) {
      table.primaryDisplay = entities[tableName].primaryDisplay
    }
    const existingTableSchema = entities[tableName].schema
    for (let key in existingTableSchema) {
      if (!existingTableSchema.hasOwnProperty(key)) {
        continue
      }
      const column = existingTableSchema[key]
      if (
        shouldCopyRelationship(column, tableIds) ||
        shouldCopySpecialColumn(column, table.schema[key])
      ) {
        table.schema[key] = existingTableSchema[key]
      }
    }
  }
  return table
}

/**
 * Look through the final table definitions to see if anything needs to be
 * copied over from the old and if any errors have occurred mark them so
 * that the user can be made aware.
 * @param tables The list of tables that have been retrieved from the external database.
 * @param entities The old list of tables, if there was any to look for definitions in.
 */
export function finaliseExternalTables(
  tables: { [key: string]: any },
  entities: { [key: string]: any }
) {
  const invalidColumns = Object.values(InvalidColumns)
  let finalTables: { [key: string]: any } = {}
  const errors: { [key: string]: string } = {}
  // @ts-ignore
  const tableIds: [string] = Object.values(tables).map(table => table._id)
  for (let [name, table] of Object.entries(tables)) {
    const schemaFields = Object.keys(table.schema)
    // make sure every table has a key
    if (table.primary == null || table.primary.length === 0) {
      errors[name] = BuildSchemaErrors.NO_KEY
      continue
    } else if (
      schemaFields.find(field =>
        invalidColumns.includes(field as InvalidColumns)
      )
    ) {
      errors[name] = BuildSchemaErrors.INVALID_COLUMN
      continue
    }
    // make sure all previous props have been added back
    finalTables[name] = copyExistingPropsOver(name, table, entities, tableIds)
  }
  // sort the tables by name
  finalTables = Object.entries(finalTables)
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
  return { tables: finalTables, errors }
}
