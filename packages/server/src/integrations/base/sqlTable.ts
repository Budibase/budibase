import { Knex, knex } from "knex"
import {
  FieldSubtype,
  NumberFieldMetadata,
  Operation,
  QueryJson,
  RenameColumn,
  Table,
} from "@budibase/types"
import { breakExternalTableId } from "../utils"
import SchemaBuilder = Knex.SchemaBuilder
import CreateTableBuilder = Knex.CreateTableBuilder
import { FieldTypes, RelationshipType } from "../../constants"
import { utils } from "@budibase/shared-core"

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
    switch (column.type) {
      case FieldTypes.STRING:
      case FieldTypes.OPTIONS:
      case FieldTypes.LONGFORM:
      case FieldTypes.BARCODEQR:
        schema.text(key)
        break
      case FieldTypes.BB_REFERENCE:
        const subtype = column.subtype as FieldSubtype
        switch (subtype) {
          case FieldSubtype.USER:
            schema.text(key)
            break
          case FieldSubtype.USERS:
            schema.json(key)
            break
          default:
            throw utils.unreachable(subtype)
        }
        break
      case FieldTypes.NUMBER:
        // if meta is specified then this is a junction table entry
        if (column.meta && column.meta.toKey && column.meta.toTable) {
          const { toKey, toTable } = column.meta
          schema.integer(key).unsigned()
          schema.foreign(key).references(`${toTable}.${toKey}`)
        } else if (foreignKeys.indexOf(key) === -1) {
          schema.float(key)
        }
        break
      case FieldTypes.BIGINT:
        schema.bigint(key)
        break
      case FieldTypes.BOOLEAN:
        schema.boolean(key)
        break
      case FieldTypes.DATETIME:
        schema.datetime(key, {
          useTz: !column.ignoreTimezones,
        })
        break
      case FieldTypes.ARRAY:
        schema.json(key)
        break
      case FieldTypes.LINK:
        // this side of the relationship doesn't need any SQL work
        if (
          column.relationshipType !== RelationshipType.MANY_TO_ONE &&
          column.relationshipType !== RelationshipType.MANY_TO_MANY
        ) {
          if (!column.foreignKey || !column.tableId) {
            throw "Invalid relationship schema"
          }
          const { tableName } = breakExternalTableId(column.tableId)
          // @ts-ignore
          const relatedTable = tables[tableName]
          if (!relatedTable) {
            throw "Referenced table doesn't exist"
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
    }
  }

  if (renamed) {
    schema.renameColumn(renamed.old, renamed.updated)
  }

  // need to check if any columns have been deleted
  if (oldTable) {
    const deletedColumns = Object.entries(oldTable.schema)
      .filter(
        ([key, schema]) =>
          schema.type !== FieldTypes.LINK &&
          schema.type !== FieldTypes.FORMULA &&
          table.schema[key] == null
      )
      .map(([key]) => key)
    deletedColumns.forEach(key => {
      if (renamed?.old === key) {
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
   * @return {string} the operation that was found in the JSON.
   */
  _operation(json: QueryJson): Operation {
    return json.endpoint.operation
  }

  _tableQuery(json: QueryJson): any {
    let client = knex({ client: this.sqlClient }).schema
    if (json?.endpoint?.schema) {
      client = client.withSchema(json.endpoint.schema)
    }

    let query
    if (!json.table || !json.meta || !json.meta.tables) {
      throw "Cannot execute without table being specified"
    }
    switch (this._operation(json)) {
      case Operation.CREATE_TABLE:
        query = buildCreateTable(client, json.table, json.meta.tables)
        break
      case Operation.UPDATE_TABLE:
        if (!json.meta || !json.meta.table) {
          throw "Must specify old table for update"
        }
        query = buildUpdateTable(
          client,
          json.table,
          json.meta.tables,
          json.meta.table,
          json.meta.renamed!
        )
        break
      case Operation.DELETE_TABLE:
        query = buildDeleteTable(client, json.table)
        break
      default:
        throw "Table operation is of unknown type"
    }
    return query.toSQL()
  }
}

export default SqlTableQueryBuilder
