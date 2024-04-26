import { Knex, knex } from "knex"
import {
  BBReferenceFieldSubType,
  FieldType,
  NumberFieldMetadata,
  Operation,
  QueryJson,
  RelationshipType,
  RenameColumn,
  SqlQuery,
  Table,
  TableSourceType,
} from "@budibase/types"
import { breakExternalTableId, getNativeSql, SqlClient } from "../utils"
import { utils } from "@budibase/shared-core"
import SchemaBuilder = Knex.SchemaBuilder
import CreateTableBuilder = Knex.CreateTableBuilder

function isIgnoredType(type: FieldType) {
  const ignored = [FieldType.LINK, FieldType.FORMULA]
  return ignored.indexOf(type) !== -1
}

function generateSchema(
  schema: CreateTableBuilder,
  table: Table,
  tables: Record<string, Table>,
  oldTable: null | Table = null,
  renamed?: RenameColumn
) {
  let primaryKey = table && table.primary ? table.primary[0] : null
  const columns = Object.values(table.schema)
  // all columns in a junction table will be meta
  let metaCols = columns.filter(col => (col as NumberFieldMetadata).meta)
  let isJunction = metaCols.length === columns.length
  // can't change primary once its set for now
  if (primaryKey && !oldTable && !isJunction) {
    schema.increments(primaryKey).primary()
  } else if (!oldTable && isJunction) {
    schema.primary(metaCols.map(col => col.name))
  }

  // check if any columns need added
  const foreignKeys = Object.values(table.schema).map(
    col => (col as any).foreignKey
  )
  for (let [key, column] of Object.entries(table.schema)) {
    // skip things that are already correct
    const oldColumn = oldTable ? oldTable.schema[key] : null
    if (
      (oldColumn && oldColumn.type) ||
      (primaryKey === key && !isJunction) ||
      renamed?.updated === key
    ) {
      continue
    }
    const columnType = column.type
    switch (columnType) {
      case FieldType.STRING:
      case FieldType.OPTIONS:
      case FieldType.LONGFORM:
      case FieldType.BARCODEQR:
      case FieldType.BB_REFERENCE_SINGLE:
        schema.text(key)
        break
      case FieldType.BB_REFERENCE: {
        const subtype = column.subtype
        switch (subtype) {
          case BBReferenceFieldSubType.USER:
            schema.text(key)
            break
          case BBReferenceFieldSubType.USERS:
            schema.json(key)
            break
          default:
            throw utils.unreachable(subtype)
        }
        break
      }
      case FieldType.NUMBER:
        // if meta is specified then this is a junction table entry
        if (column.meta && column.meta.toKey && column.meta.toTable) {
          const { toKey, toTable } = column.meta
          schema.integer(key).unsigned()
          schema.foreign(key).references(`${toTable}.${toKey}`)
        } else if (foreignKeys.indexOf(key) === -1) {
          schema.float(key)
        }
        break
      case FieldType.BIGINT:
        schema.bigint(key)
        break
      case FieldType.BOOLEAN:
        schema.boolean(key)
        break
      case FieldType.DATETIME:
        schema.datetime(key, {
          useTz: !column.ignoreTimezones,
        })
        break
      case FieldType.ARRAY:
        schema.json(key)
        break
      case FieldType.LINK:
        // this side of the relationship doesn't need any SQL work
        if (
          column.relationshipType !== RelationshipType.MANY_TO_ONE &&
          column.relationshipType !== RelationshipType.MANY_TO_MANY
        ) {
          if (!column.foreignKey || !column.tableId) {
            throw new Error("Invalid relationship schema")
          }
          const { tableName } = breakExternalTableId(column.tableId)
          // @ts-ignore
          const relatedTable = tables[tableName]
          if (!relatedTable) {
            throw new Error("Referenced table doesn't exist")
          }
          const relatedPrimary = relatedTable.primary[0]
          const externalType = relatedTable.schema[relatedPrimary].externalType
          if (externalType) {
            schema.specificType(column.foreignKey, externalType)
          } else {
            schema.integer(column.foreignKey).unsigned()
          }

          schema
            .foreign(column.foreignKey)
            .references(`${tableName}.${relatedPrimary}`)
        }
        break
      case FieldType.FORMULA:
        // This is allowed, but nothing to do on the external datasource
        break
      case FieldType.ATTACHMENTS:
      case FieldType.ATTACHMENT_SINGLE:
      case FieldType.AUTO:
      case FieldType.JSON:
      case FieldType.INTERNAL:
        throw `${column.type} is not a valid SQL type`

      default:
        utils.unreachable(columnType)
    }
  }

  const oldType = renamed ? oldTable?.schema[renamed.old].type : undefined
  if (renamed && oldType && !isIgnoredType(oldType)) {
    schema.renameColumn(renamed.old, renamed.updated)
  }

  // need to check if any columns have been deleted
  if (oldTable) {
    const deletedColumns = Object.entries(oldTable.schema).filter(
      ([key, column]) =>
        !isIgnoredType(column.type) && table.schema[key] == null
    )
    deletedColumns.forEach(([key, column]) => {
      if (renamed?.old === key || isIgnoredType(column.type)) {
        return
      }
      if (oldTable.constrained && oldTable.constrained.indexOf(key) !== -1) {
        schema.dropForeign(key)
      }
      schema.dropColumn(key)
    })
  }

  return schema
}

function buildCreateTable(
  knex: SchemaBuilder,
  table: Table,
  tables: Record<string, Table>
): SchemaBuilder {
  return knex.createTable(table.name, schema => {
    generateSchema(schema, table, tables)
  })
}

function buildUpdateTable(
  knex: SchemaBuilder,
  table: Table,
  tables: Record<string, Table>,
  oldTable: Table,
  renamed: RenameColumn
): SchemaBuilder {
  return knex.alterTable(table.name, schema => {
    generateSchema(schema, table, tables, oldTable, renamed)
  })
}

function buildDeleteTable(knex: SchemaBuilder, table: Table): SchemaBuilder {
  return knex.dropTable(table.name)
}

class SqlTableQueryBuilder {
  private readonly sqlClient: string

  // pass through client to get flavour of SQL
  constructor(client: string) {
    this.sqlClient = client
  }

  getSqlClient(): string {
    return this.sqlClient
  }

  /**
   * @param json the input JSON structure from which an SQL query will be built.
   * @return the operation that was found in the JSON.
   */
  _operation(json: QueryJson): Operation {
    return json.endpoint.operation
  }

  _tableQuery(json: QueryJson): SqlQuery | SqlQuery[] {
    let client = knex({ client: this.sqlClient }).schema
    let schemaName = json?.endpoint?.schema
    if (schemaName) {
      client = client.withSchema(schemaName)
    }

    let query: Knex.SchemaBuilder
    if (!json.table || !json.meta || !json.meta.tables) {
      throw new Error("Cannot execute without table being specified")
    }
    if (json.table.sourceType === TableSourceType.INTERNAL) {
      throw new Error("Cannot perform table actions for SQS.")
    }

    switch (this._operation(json)) {
      case Operation.CREATE_TABLE:
        query = buildCreateTable(client, json.table, json.meta.tables)
        break
      case Operation.UPDATE_TABLE:
        if (!json.meta || !json.meta.table) {
          throw new Error("Must specify old table for update")
        }
        // renameColumn does not work for MySQL, so return a raw query
        if (this.sqlClient === SqlClient.MY_SQL && json.meta.renamed) {
          const updatedColumn = json.meta.renamed.updated
          const tableName = schemaName
            ? `\`${schemaName}\`.\`${json.table.name}\``
            : `\`${json.table.name}\``
          return {
            sql: `alter table ${tableName} rename column \`${json.meta.renamed.old}\` to \`${updatedColumn}\`;`,
            bindings: [],
          }
        }

        query = buildUpdateTable(
          client,
          json.table,
          json.meta.tables,
          json.meta.table,
          json.meta.renamed!
        )

        // renameColumn for SQL Server returns a parameterised `sp_rename` query,
        // which is not supported by SQL Server and gives a syntax error.
        if (this.sqlClient === SqlClient.MS_SQL && json.meta.renamed) {
          const oldColumn = json.meta.renamed.old
          const updatedColumn = json.meta.renamed.updated
          const tableName = schemaName
            ? `${schemaName}.${json.table.name}`
            : `${json.table.name}`
          const sql = getNativeSql(query)
          if (Array.isArray(sql)) {
            for (const query of sql) {
              if (query.sql.startsWith("exec sp_rename")) {
                query.sql = `exec sp_rename '${tableName}.${oldColumn}', '${updatedColumn}', 'COLUMN'`
                query.bindings = []
              }
            }
          }

          return sql
        }
        break
      case Operation.DELETE_TABLE:
        query = buildDeleteTable(client, json.table)
        break
      default:
        throw new Error("Table operation is of unknown type")
    }
    return getNativeSql(query)
  }
}

export default SqlTableQueryBuilder
