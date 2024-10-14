import { Knex, knex } from "knex"
import * as dbCore from "../db"
import {
  getNativeSql,
  isExternalTable,
  isInvalidISODateString,
  isValidFilter,
  isValidISODateString,
  sqlLog,
  validateManyToMany,
} from "./utils"
import SqlTableQueryBuilder from "./sqlTable"
import {
  Aggregation,
  AnySearchFilter,
  ArrayOperator,
  BasicOperator,
  BBReferenceFieldMetadata,
  CalculationType,
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
import { cloneDeep } from "lodash"

type QueryFunction = (query: SqlQuery | SqlQuery[], operation: Operation) => any

export const COUNT_FIELD_NAME = "__bb_total"

function getBaseLimit() {
  const envLimit = environment.SQL_MAX_ROWS
    ? parseInt(environment.SQL_MAX_ROWS)
    : null
  return envLimit || 5000
}

function getRelationshipLimit() {
  const envLimit = environment.SQL_MAX_RELATED_ROWS
    ? parseInt(environment.SQL_MAX_RELATED_ROWS)
    : null
  return envLimit || 500
}

function prioritisedArraySort(toSort: string[], priorities: string[]) {
  return toSort.sort((a, b) => {
    const aPriority = priorities.find(field => field && a.endsWith(field))
    const bPriority = priorities.find(field => field && b.endsWith(field))
    if (aPriority && !bPriority) {
      return -1
    }
    if (!aPriority && bPriority) {
      return 1
    }
    return a.localeCompare(b)
  })
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

function isSqs(table: Table): boolean {
  return (
    table.sourceType === TableSourceType.INTERNAL ||
    table.sourceId === INTERNAL_TABLE_SOURCE_ID
  )
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

  // states the various situations in which we need a full mapped select statement
  private readonly SPECIAL_SELECT_CASES = {
    POSTGRES_MONEY: (field: FieldSchema | undefined) => {
      return (
        this.client === SqlClient.POSTGRES &&
        field?.externalType?.includes("money")
      )
    },
    MSSQL_DATES: (field: FieldSchema | undefined) => {
      return (
        this.client === SqlClient.MS_SQL &&
        field?.type === FieldType.DATETIME &&
        field.timeOnly
      )
    },
  }

  get table(): Table {
    return this.query.meta.table
  }

  getFieldSchema(key: string): FieldSchema | undefined {
    const { column } = this.splitter.run(key)
    return this.table.schema[column]
  }

  private quoteChars(): [string, string] {
    switch (this.client) {
      case SqlClient.ORACLE:
      case SqlClient.POSTGRES:
        return ['"', '"']
      case SqlClient.MS_SQL:
        return ["[", "]"]
      case SqlClient.MARIADB:
      case SqlClient.MY_SQL:
      case SqlClient.SQL_LITE:
        return ["`", "`"]
    }
  }

  // Takes a string like foo and returns a quoted string like [foo] for SQL Server
  // and "foo" for Postgres.
  private quote(str: string): string {
    const [start, end] = this.quoteChars()
    return `${start}${str}${end}`
  }

  private isQuoted(key: string): boolean {
    const [start, end] = this.quoteChars()
    return key.startsWith(start) && key.endsWith(end)
  }

  // Takes a string like a.b.c or an array like ["a", "b", "c"] and returns a
  // quoted identifier like [a].[b].[c] for SQL Server and `a`.`b`.`c` for
  // MySQL.
  private quotedIdentifier(key: string | string[]): string {
    if (!Array.isArray(key)) {
      key = this.splitIdentifier(key)
    }
    return key.map(part => this.quote(part)).join(".")
  }

  // Turns an identifier like a.b.c or `a`.`b`.`c` into ["a", "b", "c"]
  private splitIdentifier(key: string): string[] {
    const [start, end] = this.quoteChars()
    if (this.isQuoted(key)) {
      return key.slice(1, -1).split(`${end}.${start}`)
    }
    return key.split(".")
  }

  private qualifyIdentifier(key: string): string {
    const tableName = this.getTableName()
    const parts = this.splitIdentifier(key)
    if (parts[0] !== tableName) {
      parts.unshift(tableName)
    }
    if (this.isQuoted(key)) {
      return this.quotedIdentifier(parts)
    }
    return parts.join(".")
  }

  private isFullSelectStatementRequired(): boolean {
    const { meta } = this.query
    for (let column of Object.values(meta.table.schema)) {
      if (this.SPECIAL_SELECT_CASES.POSTGRES_MONEY(column)) {
        return true
      } else if (this.SPECIAL_SELECT_CASES.MSSQL_DATES(column)) {
        return true
      }
    }
    return false
  }

  private generateSelectStatement(): (string | Knex.Raw)[] | "*" {
    const { meta, endpoint, resource } = this.query

    if (!resource || !resource.fields || resource.fields.length === 0) {
      return "*"
    }

    const alias = this.getTableName(endpoint.entityId)
    const schema = meta.table.schema
    if (!this.isFullSelectStatementRequired()) {
      return [this.knex.raw(`${this.quote(alias)}.*`)]
    }
    // get just the fields for this table
    return resource.fields
      .map(field => {
        const parts = field.split(/\./g)
        let table: string | undefined = undefined
        let column = parts[0]

        // Just a column name, e.g.: "column"
        if (parts.length > 1) {
          table = parts[0]
          column = parts.slice(1).join(".")
        }

        return { table, column, field }
      })
      .filter(({ table }) => !table || table === alias)
      .map(({ table, column, field }) => {
        const columnSchema = schema[column]

        if (this.SPECIAL_SELECT_CASES.POSTGRES_MONEY(columnSchema)) {
          return this.knex.raw(
            `${this.quotedIdentifier(
              [table, column].join(".")
            )}::money::numeric as ${this.quote(field)}`
          )
        }

        if (this.SPECIAL_SELECT_CASES.MSSQL_DATES(columnSchema)) {
          // Time gets returned as timestamp from mssql, not matching the expected
          // HH:mm format
          return this.knex.raw(`CONVERT(varchar, ${field}, 108) as "${field}"`)
        }

        const quoted = table
          ? `${this.quote(table)}.${this.quote(column)}`
          : this.quote(field)
        return this.knex.raw(quoted)
      })
  }

  // OracleDB can't use character-large-objects (CLOBs) in WHERE clauses,
  // so when we use them we need to wrap them in to_char(). This function
  // converts a field name to the appropriate identifier.
  private convertClobs(field: string, opts?: { forSelect?: boolean }): string {
    if (this.client !== SqlClient.ORACLE) {
      throw new Error(
        "you've called convertClobs on a DB that's not Oracle, this is a mistake"
      )
    }
    const parts = this.splitIdentifier(field)
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
      if (opts?.forSelect) {
        identifier = `to_char(${identifier}) as ${this.quotedIdentifier(col)}`
      } else {
        identifier = `to_char(${identifier})`
      }
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

  private parseBody(body: Record<string, any>) {
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
    filters = cloneDeep(filters)
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

  addJoinFieldCheck(query: Knex.QueryBuilder, relationship: RelationshipsJson) {
    const document = relationship.from?.split(".")[0] || ""
    return query.andWhere(`${document}.fieldName`, "=", relationship.column)
  }

  addRelationshipForFilter(
    query: Knex.QueryBuilder,
    filterKey: string,
    whereCb: (query: Knex.QueryBuilder) => Knex.QueryBuilder
  ): Knex.QueryBuilder {
    const mainKnex = this.knex
    const { relationships, endpoint, tableAliases: aliases } = this.query
    const tableName = endpoint.entityId
    const fromAlias = aliases?.[tableName] || tableName
    const matches = (possibleTable: string) =>
      filterKey.startsWith(`${possibleTable}`)
    if (!relationships) {
      return query
    }
    for (const relationship of relationships) {
      const relatedTableName = relationship.tableName
      const toAlias = aliases?.[relatedTableName] || relatedTableName
      // this is the relationship which is being filtered
      if (
        (matches(relatedTableName) || matches(toAlias)) &&
        relationship.to &&
        relationship.tableName
      ) {
        let subQuery = mainKnex
          .select(mainKnex.raw(1))
          .from({ [toAlias]: relatedTableName })
        const manyToMany = validateManyToMany(relationship)
        if (manyToMany) {
          const throughAlias =
            aliases?.[manyToMany.through] || relationship.through
          let throughTable = this.tableNameWithSchema(manyToMany.through, {
            alias: throughAlias,
            schema: endpoint.schema,
          })
          subQuery = subQuery
            // add a join through the junction table
            .innerJoin(throughTable, function () {
              // @ts-ignore
              this.on(
                `${toAlias}.${manyToMany.toPrimary}`,
                "=",
                `${throughAlias}.${manyToMany.to}`
              )
            })
            // check the document in the junction table points to the main table
            .where(
              `${throughAlias}.${manyToMany.from}`,
              "=",
              mainKnex.raw(
                this.quotedIdentifier(`${fromAlias}.${manyToMany.fromPrimary}`)
              )
            )
          // in SQS the same junction table is used for different many-to-many relationships between the
          // two same tables, this is needed to avoid rows ending up in all columns
          if (this.client === SqlClient.SQL_LITE) {
            subQuery = this.addJoinFieldCheck(subQuery, manyToMany)
          }
        } else {
          // "join" to the main table, making sure the ID matches that of the main
          subQuery = subQuery.where(
            `${toAlias}.${relationship.to}`,
            "=",
            mainKnex.raw(
              this.quotedIdentifier(`${fromAlias}.${relationship.from}`)
            )
          )
        }
        query = query.whereExists(whereCb(subQuery))
        break
      }
    }
    return query
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
    const builder = this
    filters = this.parseFilters({ ...filters })
    const aliases = this.query.tableAliases
    // if all or specified in filters, then everything is an or
    const allOr = filters.allOr
    const isSqlite = this.client === SqlClient.SQL_LITE
    const tableName = isSqlite ? this.table._id! : this.table.name

    function getTableAlias(name: string) {
      const alias = aliases?.[name]
      return alias || name
    }
    function iterate(
      structure: AnySearchFilter,
      fn: (
        query: Knex.QueryBuilder,
        key: string,
        value: any
      ) => Knex.QueryBuilder,
      complexKeyFn?: (
        query: Knex.QueryBuilder,
        key: string[],
        value: any
      ) => Knex.QueryBuilder
    ) {
      const handleRelationship = (
        q: Knex.QueryBuilder,
        key: string,
        value: any
      ) => {
        const [filterTableName, ...otherProperties] = key.split(".")
        const property = otherProperties.join(".")
        const alias = getTableAlias(filterTableName)
        return fn(q, alias ? `${alias}.${property}` : property, value)
      }
      for (const key in structure) {
        const value = structure[key]
        const updatedKey = dbCore.removeKeyNumbering(key)
        const isRelationshipField = updatedKey.includes(".")
        const shouldProcessRelationship =
          opts?.relationship && isRelationshipField

        let castedTypeValue
        if (
          key === InternalSearchFilterOperator.COMPLEX_ID_OPERATOR &&
          (castedTypeValue = structure[key]) &&
          complexKeyFn
        ) {
          const alias = getTableAlias(tableName)
          query = complexKeyFn(
            query,
            castedTypeValue.id.map((x: string) =>
              alias ? `${alias}.${x}` : x
            ),
            castedTypeValue.values
          )
        } else if (!isRelationshipField) {
          const alias = getTableAlias(tableName)
          query = fn(
            query,
            alias ? `${alias}.${updatedKey}` : updatedKey,
            value
          )
        } else if (shouldProcessRelationship) {
          query = builder.addRelationshipForFilter(query, updatedKey, q => {
            return handleRelationship(q, updatedKey, value)
          })
        }
      }
    }

    const like = (q: Knex.QueryBuilder, key: string, value: any) => {
      const fuzzyOr = filters?.fuzzyOr
      const fnc = fuzzyOr || allOr ? "orWhere" : "where"
      // postgres supports ilike, nothing else does
      if (this.client === SqlClient.POSTGRES) {
        return q[fnc](key, "ilike", `%${value}%`)
      } else {
        const rawFnc = `${fnc}Raw`
        // @ts-ignore
        return q[rawFnc](`LOWER(${this.quotedIdentifier(key)}) LIKE ?`, [
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
        iterate(mode, (q, key, value) => {
          const wrap = any ? "" : "'"
          const op = any ? "\\?| array" : "@>"
          const fieldNames = key.split(/\./g)
          const table = fieldNames[0]
          const col = fieldNames[1]
          return q[rawFnc](
            `${not}COALESCE("${table}"."${col}"::jsonb ${op} ${wrap}${stringifyArray(
              value,
              any ? "'" : '"'
            )}${wrap}, FALSE)`
          )
        })
      } else if (
        this.client === SqlClient.MY_SQL ||
        this.client === SqlClient.MARIADB
      ) {
        const jsonFnc = any ? "JSON_OVERLAPS" : "JSON_CONTAINS"
        iterate(mode, (q, key, value) => {
          return q[rawFnc](
            `${not}COALESCE(${jsonFnc}(${key}, '${stringifyArray(
              value
            )}'), FALSE)`
          )
        })
      } else {
        const andOr = mode === filters?.containsAny ? " OR " : " AND "
        iterate(mode, (q, key, value) => {
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
            return q
          }

          if (not) {
            return q[rawFnc](
              `(NOT (${statement}) OR ${identifier} IS NULL)`,
              value
            )
          } else {
            return q[rawFnc](statement, value)
          }
        })
      }
    }

    if (filters.$and) {
      const { $and } = filters
      for (const condition of $and.conditions) {
        query = query.where(b => {
          this.addFilters(b, condition, opts)
        })
      }
    }

    if (filters.$or) {
      const { $or } = filters
      query = query.where(b => {
        for (const condition of $or.conditions) {
          b.orWhere(c =>
            this.addFilters(c, { ...condition, allOr: true }, opts)
          )
        }
      })
    }

    if (filters.oneOf) {
      const fnc = allOr ? "orWhereIn" : "whereIn"
      iterate(
        filters.oneOf,
        (q, key: string, array) => {
          if (this.client === SqlClient.ORACLE) {
            key = this.convertClobs(key)
            array = Array.isArray(array) ? array : [array]
            const binding = new Array(array.length).fill("?").join(",")
            return q.whereRaw(`${key} IN (${binding})`, array)
          } else {
            return q[fnc](key, Array.isArray(array) ? array : [array])
          }
        },
        (q, key: string[], array) => {
          if (this.client === SqlClient.ORACLE) {
            const keyStr = `(${key.map(k => this.convertClobs(k)).join(",")})`
            const binding = `(${array
              .map((a: any) => `(${new Array(a.length).fill("?").join(",")})`)
              .join(",")})`
            return q.whereRaw(`${keyStr} IN ${binding}`, array.flat())
          } else {
            return q[fnc](key, Array.isArray(array) ? array : [array])
          }
        }
      )
    }
    if (filters.string) {
      iterate(filters.string, (q, key, value) => {
        const fnc = allOr ? "orWhere" : "where"
        // postgres supports ilike, nothing else does
        if (this.client === SqlClient.POSTGRES) {
          return q[fnc](key, "ilike", `${value}%`)
        } else {
          const rawFnc = `${fnc}Raw`
          // @ts-ignore
          return q[rawFnc](`LOWER(${this.quotedIdentifier(key)}) LIKE ?`, [
            `${value.toLowerCase()}%`,
          ])
        }
      })
    }
    if (filters.fuzzy) {
      iterate(filters.fuzzy, like)
    }
    if (filters.range) {
      iterate(filters.range, (q, key, value) => {
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
            return q.whereRaw(
              `CAST(${key} AS INTEGER) BETWEEN CAST(? AS INTEGER) AND CAST(? AS INTEGER)`,
              [value.low, value.high]
            )
          } else {
            const fnc = allOr ? "orWhereBetween" : "whereBetween"
            return q[fnc](key, [value.low, value.high])
          }
        } else if (lowValid) {
          if (
            schema?.type === FieldType.BIGINT &&
            this.client === SqlClient.SQL_LITE
          ) {
            return q.whereRaw(`CAST(${key} AS INTEGER) >= CAST(? AS INTEGER)`, [
              value.low,
            ])
          } else {
            const fnc = allOr ? "orWhere" : "where"
            return q[fnc](key, ">=", value.low)
          }
        } else if (highValid) {
          if (
            schema?.type === FieldType.BIGINT &&
            this.client === SqlClient.SQL_LITE
          ) {
            return q.whereRaw(`CAST(${key} AS INTEGER) <= CAST(? AS INTEGER)`, [
              value.high,
            ])
          } else {
            const fnc = allOr ? "orWhere" : "where"
            return q[fnc](key, "<=", value.high)
          }
        }
        return q
      })
    }
    if (filters.equal) {
      iterate(filters.equal, (q, key, value) => {
        const fnc = allOr ? "orWhereRaw" : "whereRaw"
        if (this.client === SqlClient.MS_SQL) {
          return q[fnc](
            `CASE WHEN ${this.quotedIdentifier(key)} = ? THEN 1 ELSE 0 END = 1`,
            [value]
          )
        } else if (this.client === SqlClient.ORACLE) {
          const identifier = this.convertClobs(key)
          return q[fnc](`(${identifier} IS NOT NULL AND ${identifier} = ?)`, [
            value,
          ])
        } else {
          return q[fnc](`COALESCE(${this.quotedIdentifier(key)} = ?, FALSE)`, [
            value,
          ])
        }
      })
    }
    if (filters.notEqual) {
      iterate(filters.notEqual, (q, key, value) => {
        const fnc = allOr ? "orWhereRaw" : "whereRaw"
        if (this.client === SqlClient.MS_SQL) {
          return q[fnc](
            `CASE WHEN ${this.quotedIdentifier(key)} = ? THEN 1 ELSE 0 END = 0`,
            [value]
          )
        } else if (this.client === SqlClient.ORACLE) {
          const identifier = this.convertClobs(key)
          return q[fnc](
            `(${identifier} IS NOT NULL AND ${identifier} != ?) OR ${identifier} IS NULL`,
            [value]
          )
        } else {
          return q[fnc](`COALESCE(${this.quotedIdentifier(key)} != ?, TRUE)`, [
            value,
          ])
        }
      })
    }
    if (filters.empty) {
      iterate(filters.empty, (q, key) => {
        const fnc = allOr ? "orWhereNull" : "whereNull"
        return q[fnc](key)
      })
    }
    if (filters.notEmpty) {
      iterate(filters.notEmpty, (q, key) => {
        const fnc = allOr ? "orWhereNotNull" : "whereNotNull"
        return q[fnc](key)
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

  isSqs(): boolean {
    return isSqs(this.table)
  }

  getTableName(tableOrName?: Table | string): string {
    let table: Table
    if (typeof tableOrName === "string") {
      const name = tableOrName
      if (this.query.table?.name === name) {
        table = this.query.table
      } else if (this.query.meta.table?.name === name) {
        table = this.query.meta.table
      } else if (!this.query.meta.tables?.[name]) {
        // This can legitimately happen in custom queries, where the user is
        // querying against a table that may not have been imported into
        // Budibase.
        return name
      } else {
        table = this.query.meta.tables[name]
      }
    } else if (tableOrName) {
      table = tableOrName
    } else {
      table = this.table
    }

    let name = table.name
    if (isSqs(table) && table._id) {
      // SQS uses the table ID rather than the table name
      name = table._id
    }
    const aliases = this.query.tableAliases || {}
    return aliases[name] ? aliases[name] : name
  }

  addDistinctCount(query: Knex.QueryBuilder): Knex.QueryBuilder {
    if (!this.table.primary) {
      throw new Error("SQL counting requires primary key to be supplied")
    }
    return query.countDistinct(
      `${this.getTableName()}.${this.table.primary[0]} as ${COUNT_FIELD_NAME}`
    )
  }

  addAggregations(
    query: Knex.QueryBuilder,
    aggregations: Aggregation[]
  ): Knex.QueryBuilder {
    const fields = this.query.resource?.fields || []
    const tableName = this.getTableName()
    if (fields.length > 0) {
      const qualifiedFields = fields.map(field => this.qualifyIdentifier(field))
      if (this.client === SqlClient.ORACLE) {
        const groupByFields = qualifiedFields.map(field =>
          this.convertClobs(field)
        )
        const selectFields = qualifiedFields.map(field =>
          this.convertClobs(field, { forSelect: true })
        )
        query = query
          .groupByRaw(groupByFields.join(", "))
          .select(this.knex.raw(selectFields.join(", ")))
      } else {
        query = query.groupBy(qualifiedFields).select(qualifiedFields)
      }
    }
    for (const aggregation of aggregations) {
      const op = aggregation.calculationType
      if (op === CalculationType.COUNT) {
        if ("distinct" in aggregation && aggregation.distinct) {
          if (this.client === SqlClient.ORACLE) {
            const field = this.convertClobs(`${tableName}.${aggregation.field}`)
            query = query.select(
              this.knex.raw(
                `COUNT(DISTINCT ${field}) as ${this.quotedIdentifier(
                  aggregation.name
                )}`
              )
            )
          } else {
            query = query.countDistinct(
              `${tableName}.${aggregation.field} as ${aggregation.name}`
            )
          }
        } else {
          query = query.count(`* as ${aggregation.name}`)
        }
      } else {
        const field = `${tableName}.${aggregation.field} as ${aggregation.name}`
        switch (op) {
          case CalculationType.SUM:
            query = query.sum(field)
            break
          case CalculationType.AVG:
            query = query.avg(field)
            break
          case CalculationType.MIN:
            query = query.min(field)
            break
          case CalculationType.MAX:
            query = query.max(field)
            break
        }
      }
    }
    return query
  }

  isAggregateField(field: string): boolean {
    const found = this.query.resource?.aggregations?.find(
      aggregation => aggregation.name === field
    )
    return !!found
  }

  addSorting(query: Knex.QueryBuilder): Knex.QueryBuilder {
    let { sort, resource } = this.query
    const primaryKey = this.table.primary
    const aliased = this.getTableName()
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

        if (this.isAggregateField(key)) {
          query = query.orderBy(key, direction, nulls)
        } else {
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
    }

    // add sorting by the primary key if the result isn't already sorted by it,
    // to make sure result is deterministic
    const hasAggregations = (resource?.aggregations?.length ?? 0) > 0
    if (!hasAggregations && (!sort || sort[primaryKey[0]] === undefined)) {
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

  private buildJsonField(field: string): string {
    const parts = field.split(".")
    let tableField: string, unaliased: string
    if (parts.length > 1) {
      const alias = parts.shift()!
      unaliased = parts.join(".")
      tableField = `${this.quote(alias)}.${this.quote(unaliased)}`
    } else {
      unaliased = parts.join(".")
      tableField = this.quote(unaliased)
    }
    const separator = this.client === SqlClient.ORACLE ? " VALUE " : ","
    return `'${unaliased}'${separator}${tableField}`
  }

  maxFunctionParameters() {
    // functions like say json_build_object() in SQL have a limit as to how many can be performed
    // before a limit is met, this limit exists in Postgres/SQLite. This can be very important, such as
    // for JSON column building as part of relationships. We also have a default limit to avoid very complex
    // functions being built - it is likely this is not necessary or the best way to do it.
    switch (this.client) {
      case SqlClient.SQL_LITE:
        return 127
      case SqlClient.POSTGRES:
        return 100
      // other DBs don't have a limit, but set some sort of limit
      default:
        return 200
    }
  }

  addJsonRelationships(
    query: Knex.QueryBuilder,
    fromTable: string,
    relationships: RelationshipsJson[]
  ): Knex.QueryBuilder {
    const sqlClient = this.client
    const knex = this.knex
    const { resource, tableAliases: aliases, endpoint, meta } = this.query
    const fields = resource?.fields || []
    for (let relationship of relationships) {
      const {
        tableName: toTable,
        through: throughTable,
        to: toKey,
        from: fromKey,
        fromPrimary,
        toPrimary,
      } = relationship
      // skip invalid relationships
      if (!toTable || !fromTable) {
        continue
      }
      const relatedTable = meta.tables?.[toTable]
      const toAlias = aliases?.[toTable] || toTable,
        fromAlias = aliases?.[fromTable] || fromTable,
        throughAlias = (throughTable && aliases?.[throughTable]) || throughTable
      let toTableWithSchema = this.tableNameWithSchema(toTable, {
        alias: toAlias,
        schema: endpoint.schema,
      })
      const requiredFields = [
        ...(relatedTable?.primary || []),
        relatedTable?.primaryDisplay,
      ].filter(field => field) as string[]
      // sort the required fields to first in the list, so they don't get sliced out
      let relationshipFields = prioritisedArraySort(
        fields.filter(field => field.split(".")[0] === toAlias),
        requiredFields
      )

      relationshipFields = relationshipFields.slice(
        0,
        Math.floor(this.maxFunctionParameters() / 2)
      )
      const fieldList: string = relationshipFields
        .map(field => this.buildJsonField(field))
        .join(",")
      // SQL Server uses TOP - which performs a little differently to the normal LIMIT syntax
      // it reduces the result set rather than limiting how much data it filters over
      const primaryKey = `${toAlias}.${toPrimary || toKey}`
      let subQuery: Knex.QueryBuilder = knex
        .from(toTableWithSchema)
        // add sorting to get consistent order
        .orderBy(primaryKey)

      const isManyToMany = throughTable && toPrimary && fromPrimary
      let correlatedTo = isManyToMany
          ? `${throughAlias}.${fromKey}`
          : `${toAlias}.${toKey}`,
        correlatedFrom = isManyToMany
          ? `${fromAlias}.${fromPrimary}`
          : `${fromAlias}.${fromKey}`
      // many-to-many relationship needs junction table join
      if (isManyToMany) {
        let throughTableWithSchema = this.tableNameWithSchema(throughTable, {
          alias: throughAlias,
          schema: endpoint.schema,
        })
        subQuery = subQuery.join(throughTableWithSchema, function () {
          this.on(`${toAlias}.${toPrimary}`, "=", `${throughAlias}.${toKey}`)
        })
      }

      // add the correlation to the overall query
      subQuery = subQuery.where(
        correlatedTo,
        "=",
        knex.raw(this.quotedIdentifier(correlatedFrom))
      )

      const standardWrap = (select: string): Knex.QueryBuilder => {
        subQuery = subQuery.select(`${toAlias}.*`).limit(getRelationshipLimit())
        // @ts-ignore - the from alias syntax isn't in Knex typing
        return knex.select(knex.raw(select)).from({
          [toAlias]: subQuery,
        })
      }
      let wrapperQuery: Knex.QueryBuilder | Knex.Raw
      switch (sqlClient) {
        case SqlClient.SQL_LITE:
          // need to check the junction table document is to the right column, this is just for SQS
          subQuery = this.addJoinFieldCheck(subQuery, relationship)
          wrapperQuery = standardWrap(
            `json_group_array(json_object(${fieldList}))`
          )
          break
        case SqlClient.POSTGRES:
          wrapperQuery = standardWrap(
            `json_agg(json_build_object(${fieldList}))`
          )
          break
        case SqlClient.MARIADB:
          // can't use the standard wrap due to correlated sub-query limitations in MariaDB
          wrapperQuery = subQuery.select(
            knex.raw(
              `json_arrayagg(json_object(${fieldList}) LIMIT ${getRelationshipLimit()})`
            )
          )
          break
        case SqlClient.MY_SQL:
        case SqlClient.ORACLE:
          wrapperQuery = standardWrap(
            `json_arrayagg(json_object(${fieldList}))`
          )
          break
        case SqlClient.MS_SQL:
          wrapperQuery = knex.raw(
            `(SELECT ${this.quote(toAlias)} = (${knex
              .select(`${fromAlias}.*`)
              // @ts-ignore - from alias syntax not TS supported
              .from({
                [fromAlias]: subQuery
                  .select(`${toAlias}.*`)
                  .limit(getRelationshipLimit()),
              })} FOR JSON PATH))`
          )
          break
        default:
          throw new Error(`JSON relationships not implement for ${sqlClient}`)
      }

      query = query.select({ [relationship.column]: wrapperQuery })
    }
    return query
  }

  addJoin(
    query: Knex.QueryBuilder,
    tables: { from: string; to: string; through?: string },
    columns: {
      from?: string
      to?: string
      fromPrimary?: string
      toPrimary?: string
    }[]
  ): Knex.QueryBuilder {
    const { tableAliases: aliases, endpoint } = this.query
    const schema = endpoint.schema
    const toTable = tables.to,
      fromTable = tables.from,
      throughTable = tables.through
    const toAlias = aliases?.[toTable] || toTable,
      throughAlias = (throughTable && aliases?.[throughTable]) || throughTable,
      fromAlias = aliases?.[fromTable] || fromTable
    let toTableWithSchema = this.tableNameWithSchema(toTable, {
      alias: toAlias,
      schema,
    })
    let throughTableWithSchema = throughTable
      ? this.tableNameWithSchema(throughTable, {
          alias: throughAlias,
          schema,
        })
      : undefined
    if (!throughTable) {
      // @ts-ignore
      query = query.leftJoin(toTableWithSchema, function () {
        for (let relationship of columns) {
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
          for (let relationship of columns) {
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
          for (let relationship of columns) {
            const toPrimary = relationship.toPrimary
            const to = relationship.to
            // @ts-ignore
            this.orOn(`${toAlias}.${toPrimary}`, `${throughAlias}.${to}`)
          }
        })
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
    if (!body) {
      throw new Error("Cannot create without row body")
    }

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
      this.client === SqlClient.MY_SQL ||
      this.client === SqlClient.MARIADB
    ) {
      const primary = this.table.primary
      if (!primary) {
        throw new Error("Primary key is required for upsert")
      }
      return query.insert(parsedBody).onConflict(primary).merge()
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
    let { endpoint, filters, paginate, relationships } = this.query
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
    }

    const aggregations = this.query.resource?.aggregations || []
    if (counting) {
      query = this.addDistinctCount(query)
    } else if (aggregations.length > 0) {
      query = this.addAggregations(query, aggregations)
    } else {
      query = query.select(this.generateSelectStatement())
    }

    // have to add after as well (this breaks MS-SQL)
    if (!counting) {
      query = this.addSorting(query)
    }

    query = this.addFilters(query, filters, { relationship: true })

    // handle relationships with a CTE for all others
    if (relationships?.length) {
      const mainTable =
        this.query.tableAliases?.[this.query.endpoint.entityId] ||
        this.query.endpoint.entityId
      const cte = this.addSorting(
        this.knex
          .with("paginated", query)
          .select(this.generateSelectStatement())
          .from({
            [mainTable]: "paginated",
          })
      )
      // add JSON aggregations attached to the CTE
      return this.addJsonRelationships(cte, tableName, relationships)
    }
    // no relationships found - return query
    else {
      return query
    }
  }

  update(opts: QueryOptions): Knex.QueryBuilder {
    const { body, filters } = this.query
    if (!body) {
      throw new Error("Cannot update without row body")
    }
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
      client: this.getBaseSqlClient(),
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
      } else if (
        sqlClient === SqlClient.MY_SQL ||
        sqlClient === SqlClient.MARIADB
      ) {
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

  private getTableName(
    table: Table,
    aliases?: Record<string, string>
  ): string | undefined {
    let name = table.name
    if (
      table.sourceType === TableSourceType.INTERNAL ||
      table.sourceId === INTERNAL_TABLE_SOURCE_ID
    ) {
      if (!table._id) {
        return
      }
      // SQS uses the table ID rather than the table name
      name = table._id
    }
    return aliases?.[name] || name
  }

  convertJsonStringColumns<T extends Record<string, any>>(
    table: Table,
    results: T[],
    aliases?: Record<string, string>
  ): T[] {
    const tableName = this.getTableName(table, aliases)
    for (const [name, field] of Object.entries(table.schema)) {
      if (!this._isJsonColumn(field)) {
        continue
      }
      const fullName = `${tableName}.${name}` as keyof T
      for (let row of results) {
        if (typeof row[fullName] === "string") {
          row[fullName] = JSON.parse(row[fullName])
        }
        if (typeof row[name] === "string") {
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
