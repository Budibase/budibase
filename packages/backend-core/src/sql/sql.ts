import { Knex, knex } from "knex"
import * as dbCore from "../db"
import {
  getNativeSql,
  isExternalTable,
  isInvalidISODateString,
  isValidFilter,
  isValidISODateString,
  sqlLog,
} from "./utils"
import SqlTableQueryBuilder from "./sqlTable"
import {
  AnySearchFilter,
  ArrayOperator,
  BasicOperator,
  BBReferenceFieldMetadata,
  FieldSchema,
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  InternalSearchFilterOperator,
  JsonFieldMetadata,
  JsonTypes,
  Operation,
  prefixed,
  QueryJson,
  QueryOptions,
  RangeOperator,
  RelationshipsJson,
  SearchFilters,
  SortOrder,
  SqlClient,
  SqlQuery,
  SqlQueryBinding,
  Table,
  TableSourceType,
} from "@budibase/types"
import environment from "../environment"
import { dataFilters, helpers } from "@budibase/shared-core"

type QueryFunction = (query: SqlQuery | SqlQuery[], operation: Operation) => any

function getBaseLimit() {
  const envLimit = environment.SQL_MAX_ROWS
    ? parseInt(environment.SQL_MAX_ROWS)
    : null
  return envLimit || 5000
}

function getTableName(table?: Table): string | undefined {
  // SQS uses the table ID rather than the table name
  if (
    table?.sourceType === TableSourceType.INTERNAL ||
    table?.sourceId === INTERNAL_TABLE_SOURCE_ID
  ) {
    return table?._id
  } else {
    return table?.name
  }
}

function convertBooleans(query: SqlQuery | SqlQuery[]): SqlQuery | SqlQuery[] {
  if (Array.isArray(query)) {
    return query.map((q: SqlQuery) => convertBooleans(q) as SqlQuery)
  } else {
    if (query.bindings) {
      query.bindings = query.bindings.map(binding => {
        if (typeof binding === "boolean") {
          return binding ? 1 : 0
        }
        return binding
      })
    }
  }
  return query
}

class InternalBuilder {
  private readonly client: SqlClient
  private readonly query: QueryJson
  private readonly splitter: dataFilters.ColumnSplitter
  private readonly knex: Knex

  constructor(client: SqlClient, knex: Knex, query: QueryJson) {
    this.client = client
    this.query = query
    this.knex = knex

    this.splitter = new dataFilters.ColumnSplitter([this.table], {
      aliases: this.query.tableAliases,
      columnPrefix: this.query.meta.columnPrefix,
    })
  }

  get table(): Table {
    return this.query.meta.table
  }

  getFieldSchema(key: string): FieldSchema | undefined {
    const { column } = this.splitter.run(key)
    return this.table.schema[column]
  }

  // Takes a string like foo and returns a quoted string like [foo] for SQL Server
  // and "foo" for Postgres.
  private quote(str: string): string {
    switch (this.client) {
      case SqlClient.SQL_LITE:
      case SqlClient.ORACLE:
      case SqlClient.POSTGRES:
        return `"${str}"`
      case SqlClient.MS_SQL:
        return `[${str}]`
      case SqlClient.MY_SQL:
        return `\`${str}\``
    }
  }

  // Takes a string like a.b.c and returns a quoted identifier like [a].[b].[c]
  // for SQL Server and `a`.`b`.`c` for MySQL.
  private quotedIdentifier(key: string): string {
    return key
      .split(".")
      .map(part => this.quote(part))
      .join(".")
  }

  private generateSelectStatement(): (string | Knex.Raw)[] | "*" {
    const { resource, meta } = this.query

    if (!resource || !resource.fields || resource.fields.length === 0) {
      return "*"
    }

    const schema = meta.table.schema
    return resource.fields.map(field => {
      const parts = field.split(/\./g)
      let table: string | undefined = undefined
      let column: string | undefined = undefined

      // Just a column name, e.g.: "column"
      if (parts.length === 1) {
        column = parts[0]
      }

      // A table name and a column name, e.g.: "table.column"
      if (parts.length === 2) {
        table = parts[0]
        column = parts[1]
      }

      // A link doc, e.g.: "table.doc1.fieldName"
      if (parts.length > 2) {
        table = parts[0]
        column = parts.slice(1).join(".")
      }

      if (!column) {
        throw new Error(`Invalid field name: ${field}`)
      }

      const columnSchema = schema[column]

      if (
        this.client === SqlClient.POSTGRES &&
        columnSchema?.externalType?.includes("money")
      ) {
        return this.knex.raw(
          `${this.quotedIdentifier(
            [table, column].join(".")
          )}::money::numeric as ${this.quote(field)}`
        )
      }

      if (
        this.client === SqlClient.MS_SQL &&
        columnSchema?.type === FieldType.DATETIME &&
        columnSchema.timeOnly
      ) {
        // Time gets returned as timestamp from mssql, not matching the expected
        // HH:mm format
        return this.knex.raw(`CONVERT(varchar, ${field}, 108) as "${field}"`)
      }

      // There's at least two edge cases being handled in the expression below.
      //  1. The column name could start/end with a space, and in that case we
      //     want to preseve that space.
      //  2. Almost all column names are specified in the form table.column, except
      //     in the case of relationships, where it's table.doc1.column. In that
      //     case, we want to split it into `table`.`doc1.column` for reasons that
      //     aren't actually clear to me, but `table`.`doc1` breaks things with the
      //     sample data tests.
      if (table) {
        return this.knex.raw(
          `${this.quote(table)}.${this.quote(column)} as ${this.quote(field)}`
        )
      } else {
        return this.knex.raw(`${this.quote(field)} as ${this.quote(field)}`)
      }
    })
  }

  // OracleDB can't use character-large-objects (CLOBs) in WHERE clauses,
  // so when we use them we need to wrap them in to_char(). This function
  // converts a field name to the appropriate identifier.
  private convertClobs(field: string): string {
    const parts = field.split(".")
    const col = parts.pop()!
    const schema = this.table.schema[col]
    let identifier = this.quotedIdentifier(field)
    if (
      schema.type === FieldType.STRING ||
      schema.type === FieldType.LONGFORM ||
      schema.type === FieldType.BB_REFERENCE_SINGLE ||
      schema.type === FieldType.BB_REFERENCE ||
      schema.type === FieldType.OPTIONS ||
      schema.type === FieldType.BARCODEQR
    ) {
      identifier = `to_char(${identifier})`
    }
    return identifier
  }

  private parse(input: any, schema: FieldSchema) {
    if (Array.isArray(input)) {
      return JSON.stringify(input)
    }
    if (input == undefined) {
      return null
    }

    if (
      this.client === SqlClient.ORACLE &&
      schema.type === FieldType.DATETIME &&
      schema.timeOnly
    ) {
      if (input instanceof Date) {
        const hours = input.getHours().toString().padStart(2, "0")
        const minutes = input.getMinutes().toString().padStart(2, "0")
        const seconds = input.getSeconds().toString().padStart(2, "0")
        return `${hours}:${minutes}:${seconds}`
      }
      if (typeof input === "string") {
        return new Date(`1970-01-01T${input}Z`)
      }
    }

    if (typeof input === "string") {
      if (isInvalidISODateString(input)) {
        return null
      }
      if (isValidISODateString(input)) {
        return new Date(input.trim())
      }
    }
    return input
  }

  private parseBody(body: any) {
    for (let [key, value] of Object.entries(body)) {
      const { column } = this.splitter.run(key)
      const schema = this.table.schema[column]
      if (!schema) {
        continue
      }
      body[key] = this.parse(value, schema)
    }
    return body
  }

  private parseFilters(filters: SearchFilters): SearchFilters {
    for (const op of Object.values(BasicOperator)) {
      const filter = filters[op]
      if (!filter) {
        continue
      }
      for (const key of Object.keys(filter)) {
        if (Array.isArray(filter[key])) {
          filter[key] = JSON.stringify(filter[key])
          continue
        }
        const { column } = this.splitter.run(key)
        const schema = this.table.schema[column]
        if (!schema) {
          continue
        }
        filter[key] = this.parse(filter[key], schema)
      }
    }

    for (const op of Object.values(ArrayOperator)) {
      const filter = filters[op]
      if (!filter) {
        continue
      }
      for (const key of Object.keys(filter)) {
        const { column } = this.splitter.run(key)
        const schema = this.table.schema[column]
        if (!schema) {
          continue
        }
        filter[key] = filter[key].map(v => this.parse(v, schema))
      }
    }

    for (const op of Object.values(RangeOperator)) {
      const filter = filters[op]
      if (!filter) {
        continue
      }
      for (const key of Object.keys(filter)) {
        const { column } = this.splitter.run(key)
        const schema = this.table.schema[column]
        if (!schema) {
          continue
        }
        const value = filter[key]
        if ("low" in value) {
          value.low = this.parse(value.low, schema)
        }
        if ("high" in value) {
          value.high = this.parse(value.high, schema)
        }
      }
    }

    return filters
  }

  // right now we only do filters on the specific table being queried
  addFilters(
    query: Knex.QueryBuilder,
    filters: SearchFilters | undefined,
    opts?: {
      relationship?: boolean
    }
  ): Knex.QueryBuilder {
    if (!filters) {
      return query
    }
    filters = this.parseFilters(filters)
    const aliases = this.query.tableAliases
    // if all or specified in filters, then everything is an or
    const allOr = filters.allOr
    const tableName =
      this.client === SqlClient.SQL_LITE ? this.table._id! : this.table.name

    function getTableAlias(name: string) {
      const alias = aliases?.[name]
      return alias || name
    }
    function iterate(
      structure: AnySearchFilter,
      fn: (key: string, value: any) => void,
      complexKeyFn?: (key: string[], value: any) => void
    ) {
      for (const key in structure) {
        const value = structure[key]
        const updatedKey = dbCore.removeKeyNumbering(key)
        const isRelationshipField = updatedKey.includes(".")

        let castedTypeValue
        if (
          key === InternalSearchFilterOperator.COMPLEX_ID_OPERATOR &&
          (castedTypeValue = structure[key]) &&
          complexKeyFn
        ) {
          const alias = getTableAlias(tableName)
          complexKeyFn(
            castedTypeValue.id.map((x: string) =>
              alias ? `${alias}.${x}` : x
            ),
            castedTypeValue.values
          )
        } else if (!opts?.relationship && !isRelationshipField) {
          const alias = getTableAlias(tableName)
          fn(alias ? `${alias}.${updatedKey}` : updatedKey, value)
        } else if (opts?.relationship && isRelationshipField) {
          const [filterTableName, property] = updatedKey.split(".")
          const alias = getTableAlias(filterTableName)
          fn(alias ? `${alias}.${property}` : property, value)
        }
      }
    }

    const like = (key: string, value: any) => {
      const fuzzyOr = filters?.fuzzyOr
      const fnc = fuzzyOr || allOr ? "orWhere" : "where"
      // postgres supports ilike, nothing else does
      if (this.client === SqlClient.POSTGRES) {
        query = query[fnc](key, "ilike", `%${value}%`)
      } else {
        const rawFnc = `${fnc}Raw`
        // @ts-ignore
        query = query[rawFnc](`LOWER(${this.quotedIdentifier(key)}) LIKE ?`, [
          `%${value.toLowerCase()}%`,
        ])
      }
    }

    const contains = (mode: AnySearchFilter, any: boolean = false) => {
      const rawFnc = allOr ? "orWhereRaw" : "whereRaw"
      const not = mode === filters?.notContains ? "NOT " : ""
      function stringifyArray(value: Array<any>, quoteStyle = '"'): string {
        for (let i in value) {
          if (typeof value[i] === "string") {
            value[i] = `${quoteStyle}${value[i]}${quoteStyle}`
          }
        }
        return `[${value.join(",")}]`
      }
      if (this.client === SqlClient.POSTGRES) {
        iterate(mode, (key, value) => {
          const wrap = any ? "" : "'"
          const op = any ? "\\?| array" : "@>"
          const fieldNames = key.split(/\./g)
          const table = fieldNames[0]
          const col = fieldNames[1]
          query = query[rawFnc](
            `${not}COALESCE("${table}"."${col}"::jsonb ${op} ${wrap}${stringifyArray(
              value,
              any ? "'" : '"'
            )}${wrap}, FALSE)`
          )
        })
      } else if (this.client === SqlClient.MY_SQL) {
        const jsonFnc = any ? "JSON_OVERLAPS" : "JSON_CONTAINS"
        iterate(mode, (key, value) => {
          query = query[rawFnc](
            `${not}COALESCE(${jsonFnc}(${key}, '${stringifyArray(
              value
            )}'), FALSE)`
          )
        })
      } else {
        const andOr = mode === filters?.containsAny ? " OR " : " AND "
        iterate(mode, (key, value) => {
          let statement = ""
          const identifier = this.quotedIdentifier(key)
          for (let i in value) {
            if (typeof value[i] === "string") {
              value[i] = `%"${value[i].toLowerCase()}"%`
            } else {
              value[i] = `%${value[i]}%`
            }
            statement += `${
              statement ? andOr : ""
            }COALESCE(LOWER(${identifier}), '') LIKE ?`
          }

          if (statement === "") {
            return
          }

          if (not) {
            query = query[rawFnc](
              `(NOT (${statement}) OR ${identifier} IS NULL)`,
              value
            )
          } else {
            query = query[rawFnc](statement, value)
          }
        })
      }
    }

    if (filters.$and) {
      const { $and } = filters
      query = query.where(x => {
        for (const condition of $and.conditions) {
          x = this.addFilters(x, condition, opts)
        }
      })
    }

    if (filters.$or) {
      const { $or } = filters
      query = query.where(x => {
        for (const condition of $or.conditions) {
          x = this.addFilters(x, { ...condition, allOr: true }, opts)
        }
      })
    }

    if (filters.oneOf) {
      const fnc = allOr ? "orWhereIn" : "whereIn"
      iterate(
        filters.oneOf,
        (key: string, array) => {
          if (this.client === SqlClient.ORACLE) {
            key = this.convertClobs(key)
            array = Array.isArray(array) ? array : [array]
            const binding = new Array(array.length).fill("?").join(",")
            query = query.whereRaw(`${key} IN (${binding})`, array)
          } else {
            query = query[fnc](key, Array.isArray(array) ? array : [array])
          }
        },
        (key: string[], array) => {
          if (this.client === SqlClient.ORACLE) {
            const keyStr = `(${key.map(k => this.convertClobs(k)).join(",")})`
            const binding = `(${array
              .map((a: any) => `(${new Array(a.length).fill("?").join(",")})`)
              .join(",")})`
            query = query.whereRaw(`${keyStr} IN ${binding}`, array.flat())
          } else {
            query = query[fnc](key, Array.isArray(array) ? array : [array])
          }
        }
      )
    }
    if (filters.string) {
      iterate(filters.string, (key, value) => {
        const fnc = allOr ? "orWhere" : "where"
        // postgres supports ilike, nothing else does
        if (this.client === SqlClient.POSTGRES) {
          query = query[fnc](key, "ilike", `${value}%`)
        } else {
          const rawFnc = `${fnc}Raw`
          // @ts-ignore
          query = query[rawFnc](`LOWER(${this.quotedIdentifier(key)}) LIKE ?`, [
            `${value.toLowerCase()}%`,
          ])
        }
      })
    }
    if (filters.fuzzy) {
      iterate(filters.fuzzy, like)
    }
    if (filters.range) {
      iterate(filters.range, (key, value) => {
        const isEmptyObject = (val: any) => {
          return (
            val &&
            Object.keys(val).length === 0 &&
            Object.getPrototypeOf(val) === Object.prototype
          )
        }
        if (isEmptyObject(value.low)) {
          value.low = ""
        }
        if (isEmptyObject(value.high)) {
          value.high = ""
        }
        const lowValid = isValidFilter(value.low),
          highValid = isValidFilter(value.high)

        const schema = this.getFieldSchema(key)

        if (this.client === SqlClient.ORACLE) {
          // @ts-ignore
          key = this.knex.raw(this.convertClobs(key))
        }

        if (lowValid && highValid) {
          if (
            schema?.type === FieldType.BIGINT &&
            this.client === SqlClient.SQL_LITE
          ) {
            query = query.whereRaw(
              `CAST(${key} AS INTEGER) BETWEEN CAST(? AS INTEGER) AND CAST(? AS INTEGER)`,
              [value.low, value.high]
            )
          } else {
            const fnc = allOr ? "orWhereBetween" : "whereBetween"
            query = query[fnc](key, [value.low, value.high])
          }
        } else if (lowValid) {
          if (
            schema?.type === FieldType.BIGINT &&
            this.client === SqlClient.SQL_LITE
          ) {
            query = query.whereRaw(
              `CAST(${key} AS INTEGER) >= CAST(? AS INTEGER)`,
              [value.low]
            )
          } else {
            const fnc = allOr ? "orWhere" : "where"
            query = query[fnc](key, ">=", value.low)
          }
        } else if (highValid) {
          if (
            schema?.type === FieldType.BIGINT &&
            this.client === SqlClient.SQL_LITE
          ) {
            query = query.whereRaw(
              `CAST(${key} AS INTEGER) <= CAST(? AS INTEGER)`,
              [value.high]
            )
          } else {
            const fnc = allOr ? "orWhere" : "where"
            query = query[fnc](key, "<=", value.high)
          }
        }
      })
    }
    if (filters.equal) {
      iterate(filters.equal, (key, value) => {
        const fnc = allOr ? "orWhereRaw" : "whereRaw"
        if (this.client === SqlClient.MS_SQL) {
          query = query[fnc](
            `CASE WHEN ${this.quotedIdentifier(key)} = ? THEN 1 ELSE 0 END = 1`,
            [value]
          )
        } else if (this.client === SqlClient.ORACLE) {
          const identifier = this.convertClobs(key)
          query = query[fnc](
            `(${identifier} IS NOT NULL AND ${identifier} = ?)`,
            [value]
          )
        } else {
          query = query[fnc](
            `COALESCE(${this.quotedIdentifier(key)} = ?, FALSE)`,
            [value]
          )
        }
      })
    }
    if (filters.notEqual) {
      iterate(filters.notEqual, (key, value) => {
        const fnc = allOr ? "orWhereRaw" : "whereRaw"
        if (this.client === SqlClient.MS_SQL) {
          query = query[fnc](
            `CASE WHEN ${this.quotedIdentifier(key)} = ? THEN 1 ELSE 0 END = 0`,
            [value]
          )
        } else if (this.client === SqlClient.ORACLE) {
          const identifier = this.convertClobs(key)
          query = query[fnc](
            `(${identifier} IS NOT NULL AND ${identifier} != ?) OR ${identifier} IS NULL`,
            [value]
          )
        } else {
          query = query[fnc](
            `COALESCE(${this.quotedIdentifier(key)} != ?, TRUE)`,
            [value]
          )
        }
      })
    }
    if (filters.empty) {
      iterate(filters.empty, key => {
        const fnc = allOr ? "orWhereNull" : "whereNull"
        query = query[fnc](key)
      })
    }
    if (filters.notEmpty) {
      iterate(filters.notEmpty, key => {
        const fnc = allOr ? "orWhereNotNull" : "whereNotNull"
        query = query[fnc](key)
      })
    }
    if (filters.contains) {
      contains(filters.contains)
    }
    if (filters.notContains) {
      contains(filters.notContains)
    }
    if (filters.containsAny) {
      contains(filters.containsAny, true)
    }

    const tableRef = aliases?.[this.table._id!] || this.table._id
    // when searching internal tables make sure long looking for rows
    if (filters.documentType && !isExternalTable(this.table) && tableRef) {
      // has to be its own option, must always be AND onto the search
      query.andWhereLike(
        `${tableRef}._id`,
        `${prefixed(filters.documentType)}%`
      )
    }

    return query
  }

  addDistinctCount(query: Knex.QueryBuilder): Knex.QueryBuilder {
    const primary = this.table.primary
    const aliases = this.query.tableAliases
    const aliased =
      this.table.name && aliases?.[this.table.name]
        ? aliases[this.table.name]
        : this.table.name
    if (!primary) {
      throw new Error("SQL counting requires primary key to be supplied")
    }
    return query.countDistinct(`${aliased}.${primary[0]} as total`)
  }

  addSorting(query: Knex.QueryBuilder): Knex.QueryBuilder {
    let { sort } = this.query
    const primaryKey = this.table.primary
    const tableName = getTableName(this.table)
    const aliases = this.query.tableAliases
    const aliased =
      tableName && aliases?.[tableName] ? aliases[tableName] : this.table?.name
    if (!Array.isArray(primaryKey)) {
      throw new Error("Sorting requires primary key to be specified for table")
    }
    if (sort && Object.keys(sort || {}).length > 0) {
      for (let [key, value] of Object.entries(sort)) {
        const direction =
          value.direction === SortOrder.ASCENDING ? "asc" : "desc"

        // TODO: figure out a way to remove this conditional, not relying on
        // the defaults of each datastore.
        let nulls: "first" | "last" | undefined = undefined
        if (
          this.client === SqlClient.POSTGRES ||
          this.client === SqlClient.ORACLE
        ) {
          nulls = value.direction === SortOrder.ASCENDING ? "first" : "last"
        }

        let composite = `${aliased}.${key}`
        if (this.client === SqlClient.ORACLE) {
          query = query.orderByRaw(
            `${this.convertClobs(composite)} ${direction} nulls ${nulls}`
          )
        } else {
          query = query.orderBy(composite, direction, nulls)
        }
      }
    }

    // add sorting by the primary key if the result isn't already sorted by it,
    // to make sure result is deterministic
    if (!sort || sort[primaryKey[0]] === undefined) {
      query = query.orderBy(`${aliased}.${primaryKey[0]}`)
    }
    return query
  }

  tableNameWithSchema(
    tableName: string,
    opts?: { alias?: string; schema?: string }
  ) {
    let withSchema = opts?.schema ? `${opts.schema}.${tableName}` : tableName
    if (opts?.alias) {
      withSchema += ` as ${opts.alias}`
    }
    return withSchema
  }

  addRelationships(
    query: Knex.QueryBuilder,
    fromTable: string,
    relationships: RelationshipsJson[] | undefined,
    schema: string | undefined,
    aliases?: Record<string, string>
  ): Knex.QueryBuilder {
    if (!relationships) {
      return query
    }
    const tableSets: Record<string, [RelationshipsJson]> = {}
    // aggregate into table sets (all the same to tables)
    for (let relationship of relationships) {
      const keyObj: { toTable: string; throughTable: string | undefined } = {
        toTable: relationship.tableName,
        throughTable: undefined,
      }
      if (relationship.through) {
        keyObj.throughTable = relationship.through
      }
      const key = JSON.stringify(keyObj)
      if (tableSets[key]) {
        tableSets[key].push(relationship)
      } else {
        tableSets[key] = [relationship]
      }
    }
    for (let [key, relationships] of Object.entries(tableSets)) {
      const { toTable, throughTable } = JSON.parse(key)
      const toAlias = aliases?.[toTable] || toTable,
        throughAlias = aliases?.[throughTable] || throughTable,
        fromAlias = aliases?.[fromTable] || fromTable
      let toTableWithSchema = this.tableNameWithSchema(toTable, {
        alias: toAlias,
        schema,
      })
      let throughTableWithSchema = this.tableNameWithSchema(throughTable, {
        alias: throughAlias,
        schema,
      })
      if (!throughTable) {
        // @ts-ignore
        query = query.leftJoin(toTableWithSchema, function () {
          for (let relationship of relationships) {
            const from = relationship.from,
              to = relationship.to
            // @ts-ignore
            this.orOn(`${fromAlias}.${from}`, "=", `${toAlias}.${to}`)
          }
        })
      } else {
        query = query
          // @ts-ignore
          .leftJoin(throughTableWithSchema, function () {
            for (let relationship of relationships) {
              const fromPrimary = relationship.fromPrimary
              const from = relationship.from
              // @ts-ignore
              this.orOn(
                `${fromAlias}.${fromPrimary}`,
                "=",
                `${throughAlias}.${from}`
              )
            }
          })
          .leftJoin(toTableWithSchema, function () {
            for (let relationship of relationships) {
              const toPrimary = relationship.toPrimary
              const to = relationship.to
              // @ts-ignore
              this.orOn(`${toAlias}.${toPrimary}`, `${throughAlias}.${to}`)
            }
          })
      }
    }
    return query
  }

  qualifiedKnex(opts?: { alias?: string | boolean }): Knex.QueryBuilder {
    let alias = this.query.tableAliases?.[this.query.endpoint.entityId]
    if (opts?.alias === false) {
      alias = undefined
    } else if (typeof opts?.alias === "string") {
      alias = opts.alias
    }
    return this.knex(
      this.tableNameWithSchema(this.query.endpoint.entityId, {
        alias,
        schema: this.query.endpoint.schema,
      })
    )
  }

  create(opts: QueryOptions): Knex.QueryBuilder {
    const { body } = this.query
    let query = this.qualifiedKnex({ alias: false })
    const parsedBody = this.parseBody(body)

    if (this.client === SqlClient.ORACLE) {
      // Oracle doesn't seem to automatically insert nulls
      // if we don't specify them, so we need to do that here
      for (const [column, schema] of Object.entries(
        this.query.meta.table.schema
      )) {
        if (
          schema.constraints?.presence === true ||
          schema.type === FieldType.FORMULA ||
          schema.type === FieldType.AUTO ||
          schema.type === FieldType.LINK
        ) {
          continue
        }

        const value = parsedBody[column]
        if (value == null) {
          parsedBody[column] = null
        }
      }
    } else {
      // make sure no null values in body for creation
      for (let [key, value] of Object.entries(parsedBody)) {
        if (value == null) {
          delete parsedBody[key]
        }
      }
    }

    // mysql can't use returning
    if (opts.disableReturning) {
      return query.insert(parsedBody)
    } else {
      return query.insert(parsedBody).returning("*")
    }
  }

  bulkCreate(): Knex.QueryBuilder {
    const { body } = this.query
    let query = this.qualifiedKnex({ alias: false })
    if (!Array.isArray(body)) {
      return query
    }
    const parsedBody = body.map(row => this.parseBody(row))
    return query.insert(parsedBody)
  }

  bulkUpsert(): Knex.QueryBuilder {
    const { body } = this.query
    let query = this.qualifiedKnex({ alias: false })
    if (!Array.isArray(body)) {
      return query
    }
    const parsedBody = body.map(row => this.parseBody(row))
    if (
      this.client === SqlClient.POSTGRES ||
      this.client === SqlClient.SQL_LITE ||
      this.client === SqlClient.MY_SQL
    ) {
      const primary = this.table.primary
      if (!primary) {
        throw new Error("Primary key is required for upsert")
      }
      const ret = query.insert(parsedBody).onConflict(primary).merge()
      return ret
    } else if (
      this.client === SqlClient.MS_SQL ||
      this.client === SqlClient.ORACLE
    ) {
      // No upsert or onConflict support in MSSQL/Oracle yet, see:
      //   https://github.com/knex/knex/pull/6050
      return query.insert(parsedBody)
    }
    return query.upsert(parsedBody)
  }

  read(
    opts: {
      limits?: { base: number; query: number }
    } = {}
  ): Knex.QueryBuilder {
    let { endpoint, filters, paginate, relationships, tableAliases } =
      this.query
    const { limits } = opts
    const counting = endpoint.operation === Operation.COUNT

    const tableName = endpoint.entityId
    // start building the query
    let query = this.qualifiedKnex()
    // handle pagination
    let foundOffset: number | null = null
    let foundLimit = limits?.query || limits?.base
    if (paginate && paginate.page && paginate.limit) {
      // @ts-ignore
      const page = paginate.page <= 1 ? 0 : paginate.page - 1
      const offset = page * paginate.limit
      foundLimit = paginate.limit
      foundOffset = offset
    } else if (paginate && paginate.offset && paginate.limit) {
      foundLimit = paginate.limit
      foundOffset = paginate.offset
    } else if (paginate && paginate.limit) {
      foundLimit = paginate.limit
    }
    // counting should not sort, limit or offset
    if (!counting) {
      // add the found limit if supplied
      if (foundLimit != null) {
        query = query.limit(foundLimit)
      }
      // add overall pagination
      if (foundOffset != null) {
        query = query.offset(foundOffset)
      }
      // add sorting to pre-query
      // no point in sorting when counting
      query = this.addSorting(query)
    }
    // add filters to the query (where)
    query = this.addFilters(query, filters)

    const alias = tableAliases?.[tableName] || tableName
    let preQuery: Knex.QueryBuilder = this.knex({
      // the typescript definition for the knex constructor doesn't support this
      // syntax, but it is the only way to alias a pre-query result as part of
      // a query - there is an alias dictionary type, but it assumes it can only
      // be a table name, not a pre-query
      [alias]: query as any,
    })
    // if counting, use distinct count, else select
    preQuery = !counting
      ? preQuery.select(this.generateSelectStatement())
      : this.addDistinctCount(preQuery)
    // have to add after as well (this breaks MS-SQL)
    if (this.client !== SqlClient.MS_SQL && !counting) {
      preQuery = this.addSorting(preQuery)
    }
    // handle joins
    query = this.addRelationships(
      preQuery,
      tableName,
      relationships,
      endpoint.schema,
      tableAliases
    )

    // add a base limit over the whole query
    // if counting we can't set this limit
    if (limits?.base) {
      query = query.limit(limits.base)
    }

    return this.addFilters(query, filters, { relationship: true })
  }

  update(opts: QueryOptions): Knex.QueryBuilder {
    const { body, filters } = this.query
    let query = this.qualifiedKnex()
    const parsedBody = this.parseBody(body)
    query = this.addFilters(query, filters)
    // mysql can't use returning
    if (opts.disableReturning) {
      return query.update(parsedBody)
    } else {
      return query.update(parsedBody).returning("*")
    }
  }

  delete(opts: QueryOptions): Knex.QueryBuilder {
    const { filters } = this.query
    let query = this.qualifiedKnex()
    query = this.addFilters(query, filters)
    // mysql can't use returning
    if (opts.disableReturning) {
      return query.delete()
    } else {
      return query.delete().returning(this.generateSelectStatement())
    }
  }
}

class SqlQueryBuilder extends SqlTableQueryBuilder {
  private readonly limit: number

  // pass through client to get flavour of SQL
  constructor(client: SqlClient, limit: number = getBaseLimit()) {
    super(client)
    this.limit = limit
  }

  private convertToNative(query: Knex.QueryBuilder, opts: QueryOptions = {}) {
    const sqlClient = this.getSqlClient()
    if (opts?.disableBindings) {
      return { sql: query.toString() }
    } else {
      let native = getNativeSql(query)
      if (sqlClient === SqlClient.SQL_LITE) {
        native = convertBooleans(native)
      }
      return native
    }
  }

  /**
   * @param json The JSON query DSL which is to be converted to SQL.
   * @param opts extra options which are to be passed into the query builder, e.g. disableReturning
   * which for the sake of mySQL stops adding the returning statement to inserts, updates and deletes.
   * @return the query ready to be passed to the driver.
   */
  _query(json: QueryJson, opts: QueryOptions = {}): SqlQuery | SqlQuery[] {
    const sqlClient = this.getSqlClient()
    const config: Knex.Config = {
      client: sqlClient,
    }
    if (sqlClient === SqlClient.SQL_LITE || sqlClient === SqlClient.ORACLE) {
      config.useNullAsDefault = true
    }

    const client = knex(config)
    let query: Knex.QueryBuilder
    const builder = new InternalBuilder(sqlClient, client, json)
    switch (this._operation(json)) {
      case Operation.CREATE:
        query = builder.create(opts)
        break
      case Operation.READ:
        query = builder.read({
          limits: {
            query: this.limit,
            base: getBaseLimit(),
          },
        })
        break
      case Operation.COUNT:
        // read without any limits to count
        query = builder.read()
        break
      case Operation.UPDATE:
        query = builder.update(opts)
        break
      case Operation.DELETE:
        query = builder.delete(opts)
        break
      case Operation.BULK_CREATE:
        query = builder.bulkCreate()
        break
      case Operation.BULK_UPSERT:
        query = builder.bulkUpsert()
        break
      case Operation.CREATE_TABLE:
      case Operation.UPDATE_TABLE:
      case Operation.DELETE_TABLE:
        return this._tableQuery(json)
      default:
        throw `Operation type is not supported by SQL query builder`
    }

    return this.convertToNative(query, opts)
  }

  async getReturningRow(queryFn: QueryFunction, json: QueryJson) {
    if (!json.extra || !json.extra.idFilter) {
      return {}
    }
    const input = this._query({
      endpoint: {
        ...json.endpoint,
        operation: Operation.READ,
      },
      resource: {
        fields: [],
      },
      filters: json.extra?.idFilter,
      paginate: {
        limit: 1,
      },
      meta: json.meta,
    })
    return queryFn(input, Operation.READ)
  }

  // when creating if an ID has been inserted need to make sure
  // the id filter is enriched with it before trying to retrieve the row
  checkLookupKeys(id: any, json: QueryJson) {
    if (!id || !json.meta.table || !json.meta.table.primary) {
      return json
    }
    const primaryKey = json.meta.table.primary?.[0]
    json.extra = {
      idFilter: {
        equal: {
          [primaryKey]: id,
        },
      },
    }
    return json
  }

  // this function recreates the returning functionality of postgres
  async queryWithReturning(
    json: QueryJson,
    queryFn: QueryFunction,
    processFn: Function = (result: any) => result
  ) {
    const sqlClient = this.getSqlClient()
    const operation = this._operation(json)
    const input = this._query(json, { disableReturning: true })
    if (Array.isArray(input)) {
      const responses = []
      for (let query of input) {
        responses.push(await queryFn(query, operation))
      }
      return responses
    }
    let row
    // need to manage returning, a feature mySQL can't do
    if (operation === Operation.DELETE) {
      row = processFn(await this.getReturningRow(queryFn, json))
    }
    const response = await queryFn(input, operation)
    const results = processFn(response)
    // same as delete, manage returning
    if (operation === Operation.CREATE || operation === Operation.UPDATE) {
      let id
      if (sqlClient === SqlClient.MS_SQL) {
        id = results?.[0].id
      } else if (sqlClient === SqlClient.MY_SQL) {
        id = results?.insertId
      }
      row = processFn(
        await this.getReturningRow(queryFn, this.checkLookupKeys(id, json))
      )
    }
    if (operation === Operation.COUNT) {
      return results
    }
    if (operation !== Operation.READ) {
      return row
    }
    return results.length ? results : [{ [operation.toLowerCase()]: true }]
  }

  convertJsonStringColumns<T extends Record<string, any>>(
    table: Table,
    results: T[],
    aliases?: Record<string, string>
  ): T[] {
    const tableName = getTableName(table)
    for (const [name, field] of Object.entries(table.schema)) {
      if (!this._isJsonColumn(field)) {
        continue
      }
      const aliasedTableName = (tableName && aliases?.[tableName]) || tableName
      const fullName = `${aliasedTableName}.${name}`
      for (let row of results) {
        if (typeof row[fullName as keyof T] === "string") {
          row[fullName as keyof T] = JSON.parse(row[fullName])
        }
        if (typeof row[name as keyof T] === "string") {
          row[name as keyof T] = JSON.parse(row[name])
        }
      }
    }
    return results
  }

  _isJsonColumn(
    field: FieldSchema
  ): field is JsonFieldMetadata | BBReferenceFieldMetadata {
    return (
      JsonTypes.includes(field.type) &&
      !helpers.schema.isDeprecatedSingleUserColumn(field)
    )
  }

  log(query: string, values?: SqlQueryBinding) {
    sqlLog(this.getSqlClient(), query, values)
  }
}

export default SqlQueryBuilder
