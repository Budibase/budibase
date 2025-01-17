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
  ArrayFilter,
  ArrayOperator,
  BasicOperator,
  BBReferenceFieldMetadata,
  CalculationType,
  EnrichedQueryJson,
  FieldSchema,
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  InternalSearchFilterOperator,
  JsonFieldMetadata,
  JsonTypes,
  LogicalOperator,
  Operation,
  prefixed,
  QueryOptions,
  RangeOperator,
  RelationshipsJson,
  SearchFilterKey,
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

function escapeQuotes(value: string, quoteChar = '"'): string {
  return value.replace(new RegExp(quoteChar, "g"), `${quoteChar}${quoteChar}`)
}

function wrap(value: string, quoteChar = '"'): string {
  return `${quoteChar}${escapeQuotes(value, quoteChar)}${quoteChar}`
}

function stringifyArray(value: any[], quoteStyle = '"'): string {
  for (let i in value) {
    if (typeof value[i] === "string") {
      value[i] = wrap(value[i], quoteStyle)
    }
  }
  return `[${value.join(",")}]`
}

const allowEmptyRelationships: Record<SearchFilterKey, boolean> = {
  [BasicOperator.EQUAL]: false,
  [BasicOperator.NOT_EQUAL]: true,
  [BasicOperator.EMPTY]: false,
  [BasicOperator.NOT_EMPTY]: true,
  [BasicOperator.FUZZY]: false,
  [BasicOperator.STRING]: false,
  [RangeOperator.RANGE]: false,
  [ArrayOperator.CONTAINS]: false,
  [ArrayOperator.NOT_CONTAINS]: true,
  [ArrayOperator.CONTAINS_ANY]: false,
  [ArrayOperator.ONE_OF]: false,
  [LogicalOperator.AND]: false,
  [LogicalOperator.OR]: false,
}

class InternalBuilder {
  private readonly client: SqlClient
  private readonly query: EnrichedQueryJson
  private readonly splitter: dataFilters.ColumnSplitter
  private readonly knex: Knex

  constructor(client: SqlClient, knex: Knex, query: EnrichedQueryJson) {
    this.client = client
    this.query = query
    this.knex = knex

    this.splitter = new dataFilters.ColumnSplitter([this.table], {
      aliases: this.query.tableAliases,
      columnPrefix: this.query.meta?.columnPrefix,
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
    return this.query.table
  }

  get knexClient(): Knex.Client {
    return this.knex.client as Knex.Client
  }

  getFieldSchema(key: string): FieldSchema | undefined {
    const { column } = this.splitter.run(key)
    return this.table.schema[column]
  }

  private quoteChars(): [string, string] {
    const wrapped = this.knexClient.wrapIdentifier("foo", {})
    return [wrapped[0], wrapped[wrapped.length - 1]]
  }

  // Takes a string like foo and returns a quoted string like [foo] for SQL
  // Server and "foo" for Postgres.
  private quote(str: string): string {
    return this.knexClient.wrapIdentifier(str, {})
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

  private quotedValue(value: string): string {
    const formatter = this.knexClient.formatter(this.knexClient.queryBuilder())
    return formatter.wrap(value, false)
  }

  private castIntToString(identifier: string | Knex.Raw): Knex.Raw {
    switch (this.client) {
      case SqlClient.ORACLE: {
        return this.knex.raw("to_char(??)", [identifier])
      }
      case SqlClient.POSTGRES: {
        return this.knex.raw("??::TEXT", [identifier])
      }
      case SqlClient.MY_SQL:
      case SqlClient.MARIADB: {
        return this.knex.raw("CAST(?? AS CHAR)", [identifier])
      }
      case SqlClient.SQL_LITE: {
        // Technically sqlite can actually represent numbers larger than a 64bit
        // int as a string, but it does it using scientific notation (e.g.
        // "1e+20") which is not what we want. Given that the external SQL
        // databases are limited to supporting only 64bit ints, we settle for
        // that here.
        return this.knex.raw("printf('%d', ??)", [identifier])
      }
      case SqlClient.MS_SQL: {
        return this.knex.raw("CONVERT(NVARCHAR, ??)", [identifier])
      }
    }
  }

  // Unfortuantely we cannot rely on knex's identifier escaping because it trims
  // the identifier string before escaping it, which breaks cases for us where
  // columns that start or end with a space aren't referenced correctly anymore.
  //
  // So whenever you're using an identifier binding in knex, e.g. knex.raw("??
  // as ?", ["foo", "bar"]), you need to make sure you call this:
  //
  //   knex.raw("?? as ?", [this.quotedIdentifier("foo"), "bar"])
  //
  // Issue we filed against knex about this:
  //   https://github.com/knex/knex/issues/6143
  private rawQuotedIdentifier(key: string): Knex.Raw {
    return this.knex.raw(this.quotedIdentifier(key))
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

  private generateSelectStatement(): (string | Knex.Raw)[] | "*" {
    const { table, resource } = this.query

    if (!resource || !resource.fields || resource.fields.length === 0) {
      return "*"
    }

    const alias = this.getTableName(table)
    const schema = this.table.schema

    // get just the fields for this table
    const tableFields = resource.fields
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

    return tableFields.map(({ table, column, field }) => {
      const columnSchema = schema[column]

      if (this.SPECIAL_SELECT_CASES.POSTGRES_MONEY(columnSchema)) {
        return this.knex.raw(`??::money::numeric as ??`, [
          this.rawQuotedIdentifier([table, column].join(".")),
          this.knex.raw(this.quote(field)),
        ])
      }

      if (this.SPECIAL_SELECT_CASES.MSSQL_DATES(columnSchema)) {
        // Time gets returned as timestamp from mssql, not matching the expected
        // HH:mm format

        return this.knex.raw(`CONVERT(varchar, ??, 108) as ??`, [
          this.rawQuotedIdentifier(field),
          this.knex.raw(this.quote(field)),
        ])
      }

      if (table) {
        return this.rawQuotedIdentifier(`${table}.${column}`)
      } else {
        return this.rawQuotedIdentifier(field)
      }
    })
  }

  // OracleDB can't use character-large-objects (CLOBs) in WHERE clauses,
  // so when we use them we need to wrap them in to_char(). This function
  // converts a field name to the appropriate identifier.
  private convertClobs(
    field: string,
    opts?: { forSelect?: boolean }
  ): Knex.Raw {
    if (this.client !== SqlClient.ORACLE) {
      throw new Error(
        "you've called convertClobs on a DB that's not Oracle, this is a mistake"
      )
    }
    const parts = this.splitIdentifier(field)
    const col = parts.pop()!
    const schema = this.table.schema[col]
    let identifier = this.rawQuotedIdentifier(field)

    if (
      schema.type === FieldType.STRING ||
      schema.type === FieldType.LONGFORM ||
      schema.type === FieldType.BB_REFERENCE_SINGLE ||
      schema.type === FieldType.BB_REFERENCE ||
      schema.type === FieldType.OPTIONS ||
      schema.type === FieldType.BARCODEQR
    ) {
      if (opts?.forSelect) {
        identifier = this.knex.raw("to_char(??) as ??", [
          identifier,
          this.rawQuotedIdentifier(col),
        ])
      } else {
        identifier = this.knex.raw("to_char(??)", [identifier])
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
    allowEmptyRelationships: boolean,
    filterKey: string,
    whereCb: (filterKey: string, query: Knex.QueryBuilder) => Knex.QueryBuilder
  ): Knex.QueryBuilder {
    const { relationships, schema, tableAliases: aliases, table } = this.query
    const fromAlias = aliases?.[table.name] || table.name
    const matches = (value: string) =>
      filterKey.match(new RegExp(`^${value}\\.`))
    if (!relationships) {
      return query
    }
    for (const relationship of relationships) {
      const relatedTableName = relationship.tableName
      const toAlias = aliases?.[relatedTableName] || relatedTableName

      const matchesTableName = matches(relatedTableName) || matches(toAlias)
      const matchesRelationName = matches(relationship.column)

      // this is the relationship which is being filtered
      if (
        (matchesTableName || matchesRelationName) &&
        relationship.to &&
        relationship.tableName
      ) {
        const joinTable = this.knex
          .select(this.knex.raw(1))
          .from({ [toAlias]: relatedTableName })
        let subQuery = joinTable.clone()
        const manyToMany = validateManyToMany(relationship)
        let updatedKey

        if (!matchesTableName) {
          updatedKey = filterKey.replace(
            new RegExp(`^${relationship.column}.`),
            `${aliases?.[relationship.tableName] || relationship.tableName}.`
          )
        } else {
          updatedKey = filterKey
        }

        if (manyToMany) {
          const throughAlias =
            aliases?.[manyToMany.through] || relationship.through
          let throughTable = this.tableNameWithSchema(manyToMany.through, {
            alias: throughAlias,
            schema,
          })
          subQuery = subQuery
            // add a join through the junction table
            .innerJoin(throughTable, function () {
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
              this.rawQuotedIdentifier(`${fromAlias}.${manyToMany.fromPrimary}`)
            )
          // in SQS the same junction table is used for different many-to-many relationships between the
          // two same tables, this is needed to avoid rows ending up in all columns
          if (this.client === SqlClient.SQL_LITE) {
            subQuery = this.addJoinFieldCheck(subQuery, manyToMany)
          }

          query = query.where(q => {
            q.whereExists(whereCb(updatedKey, subQuery))
            if (allowEmptyRelationships) {
              q.orWhereNotExists(
                joinTable.clone().innerJoin(throughTable, function () {
                  this.on(
                    `${fromAlias}.${manyToMany.fromPrimary}`,
                    "=",
                    `${throughAlias}.${manyToMany.from}`
                  )
                })
              )
            }
          })
        } else {
          const toKey = `${toAlias}.${relationship.to}`
          const foreignKey = `${fromAlias}.${relationship.from}`
          // "join" to the main table, making sure the ID matches that of the main
          subQuery = subQuery.where(
            toKey,
            "=",
            this.rawQuotedIdentifier(foreignKey)
          )

          query = query.where(q => {
            q.whereExists(whereCb(updatedKey, subQuery.clone()))
            if (allowEmptyRelationships) {
              q.orWhereNotExists(subQuery)
            }
          })
        }
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
    const shouldOr = filters.allOr
    const isSqlite = this.client === SqlClient.SQL_LITE
    const tableName = isSqlite ? this.table._id! : this.table.name

    function getTableAlias(name: string) {
      const alias = aliases?.[name]
      return alias || name
    }
    function iterate(
      structure: AnySearchFilter,
      operation: SearchFilterKey,
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
        return q.andWhere(subquery =>
          fn(subquery, alias ? `${alias}.${property}` : property, value)
        )
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
          if (shouldOr) {
            query = query.or
          }
          query = builder.addRelationshipForFilter(
            query,
            allowEmptyRelationships[operation],
            updatedKey,
            (updatedKey, q) => {
              return handleRelationship(q, updatedKey, value)
            }
          )
        }
      }
    }

    const like = (q: Knex.QueryBuilder, key: string, value: any) => {
      if (filters?.fuzzyOr || shouldOr) {
        q = q.or
      }
      if (
        this.client === SqlClient.ORACLE ||
        this.client === SqlClient.SQL_LITE
      ) {
        return q.whereRaw(`LOWER(??) LIKE ?`, [
          this.rawQuotedIdentifier(key),
          `%${value.toLowerCase()}%`,
        ])
      }
      return q.whereILike(
        // @ts-expect-error knex types are wrong, raw is fine here
        this.rawQuotedIdentifier(key),
        this.knex.raw("?", [`%${value}%`])
      )
    }

    const contains = (mode: ArrayFilter, any = false) => {
      function addModifiers<T extends {}, Q>(q: Knex.QueryBuilder<T, Q>) {
        if (shouldOr || mode === filters?.containsAny) {
          q = q.or
        }
        if (mode === filters?.notContains) {
          q = q.not
        }
        return q
      }

      if (this.client === SqlClient.POSTGRES) {
        iterate(mode, ArrayOperator.CONTAINS, (q, key, value) => {
          q = addModifiers(q)
          if (any) {
            return q.whereRaw(`COALESCE(??::jsonb \\?| array??, FALSE)`, [
              this.rawQuotedIdentifier(key),
              this.knex.raw(stringifyArray(value, "'")),
            ])
          } else {
            return q.whereRaw(`COALESCE(??::jsonb @> '??', FALSE)`, [
              this.rawQuotedIdentifier(key),
              this.knex.raw(stringifyArray(value)),
            ])
          }
        })
      } else if (
        this.client === SqlClient.MY_SQL ||
        this.client === SqlClient.MARIADB
      ) {
        iterate(mode, ArrayOperator.CONTAINS, (q, key, value) => {
          return addModifiers(q).whereRaw(`COALESCE(?(??, ?), FALSE)`, [
            this.knex.raw(any ? "JSON_OVERLAPS" : "JSON_CONTAINS"),
            this.rawQuotedIdentifier(key),
            this.knex.raw(wrap(stringifyArray(value))),
          ])
        })
      } else {
        iterate(mode, ArrayOperator.CONTAINS, (q, key, value) => {
          if (value.length === 0) {
            return q
          }

          q = q.where(subQuery => {
            if (mode === filters?.notContains) {
              subQuery = subQuery.not
            }

            subQuery = subQuery.where(subSubQuery => {
              for (const elem of value) {
                if (mode === filters?.containsAny) {
                  subSubQuery = subSubQuery.or
                } else {
                  subSubQuery = subSubQuery.and
                }

                const lower =
                  typeof elem === "string" ? `"${elem.toLowerCase()}"` : elem

                subSubQuery = subSubQuery.whereLike(
                  // @ts-expect-error knex types are wrong, raw is fine here
                  this.knex.raw(`COALESCE(LOWER(??), '')`, [
                    this.rawQuotedIdentifier(key),
                  ]),
                  `%${lower}%`
                )
              }
            })
            if (mode === filters?.notContains) {
              subQuery = subQuery.or.whereNull(
                // @ts-expect-error knex types are wrong, raw is fine here
                this.rawQuotedIdentifier(key)
              )
            }
            return subQuery
          })
          return q
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
      iterate(
        filters.oneOf,
        ArrayOperator.ONE_OF,
        (q, key: string, array) => {
          const schema = this.getFieldSchema(key)
          const values = Array.isArray(array) ? array : [array]
          if (shouldOr) {
            q = q.or
          }
          if (this.client === SqlClient.ORACLE) {
            // @ts-ignore
            key = this.convertClobs(key)
          } else if (
            this.client === SqlClient.SQL_LITE &&
            schema?.type === FieldType.DATETIME &&
            schema.dateOnly
          ) {
            for (const value of values) {
              if (value != null) {
                q = q.or.whereLike(key, `${value.toISOString().slice(0, 10)}%`)
              } else {
                q = q.or.whereNull(key)
              }
            }
            return q
          }
          return q.whereIn(key, values)
        },
        (q, key: string[], array) => {
          if (shouldOr) {
            q = q.or
          }
          if (this.client === SqlClient.ORACLE) {
            // @ts-ignore
            key = key.map(k => this.convertClobs(k))
          }
          return q.whereIn(key, Array.isArray(array) ? array : [array])
        }
      )
    }
    if (filters.string) {
      iterate(filters.string, BasicOperator.STRING, (q, key, value) => {
        if (shouldOr) {
          q = q.or
        }
        if (
          this.client === SqlClient.ORACLE ||
          this.client === SqlClient.SQL_LITE
        ) {
          return q.whereRaw(`LOWER(??) LIKE ?`, [
            this.rawQuotedIdentifier(key),
            `${value.toLowerCase()}%`,
          ])
        } else {
          return q.whereILike(key, `${value}%`)
        }
      })
    }
    if (filters.fuzzy) {
      iterate(filters.fuzzy, BasicOperator.FUZZY, like)
    }
    if (filters.range) {
      iterate(filters.range, RangeOperator.RANGE, (q, key, value) => {
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

        let rawKey: string | Knex.Raw = key
        let high = value.high
        let low = value.low

        if (
          this.client === SqlClient.SQL_LITE &&
          schema?.type === FieldType.DATETIME &&
          schema.dateOnly
        ) {
          if (high != null) {
            high = `${high.toISOString().slice(0, 10)}T23:59:59.999Z`
          }
          if (low != null) {
            low = low.toISOString().slice(0, 10)
          }
        }

        if (this.client === SqlClient.ORACLE) {
          rawKey = this.convertClobs(key)
        } else if (
          this.client === SqlClient.SQL_LITE &&
          schema?.type === FieldType.BIGINT
        ) {
          rawKey = this.knex.raw("CAST(?? AS INTEGER)", [
            this.rawQuotedIdentifier(key),
          ])
          high = this.knex.raw("CAST(? AS INTEGER)", [value.high])
          low = this.knex.raw("CAST(? AS INTEGER)", [value.low])
        }

        if (shouldOr) {
          q = q.or
        }

        if (lowValid && highValid) {
          // @ts-expect-error knex types are wrong, raw is fine here
          return q.whereBetween(rawKey, [low, high])
        } else if (lowValid) {
          // @ts-expect-error knex types are wrong, raw is fine here
          return q.where(rawKey, ">=", low)
        } else if (highValid) {
          // @ts-expect-error knex types are wrong, raw is fine here
          return q.where(rawKey, "<=", high)
        }
        return q
      })
    }
    if (filters.equal) {
      iterate(filters.equal, BasicOperator.EQUAL, (q, key, value) => {
        const schema = this.getFieldSchema(key)
        if (shouldOr) {
          q = q.or
        }
        if (this.client === SqlClient.MS_SQL) {
          return q.whereRaw(`CASE WHEN ?? = ? THEN 1 ELSE 0 END = 1`, [
            this.rawQuotedIdentifier(key),
            value,
          ])
        } else if (this.client === SqlClient.ORACLE) {
          const identifier = this.convertClobs(key)
          return q.where(subq =>
            // @ts-expect-error knex types are wrong, raw is fine here
            subq.whereNotNull(identifier).andWhere(identifier, value)
          )
        } else if (
          this.client === SqlClient.SQL_LITE &&
          schema?.type === FieldType.DATETIME &&
          schema.dateOnly
        ) {
          if (value != null) {
            return q.whereLike(key, `${value.toISOString().slice(0, 10)}%`)
          } else {
            return q.whereNull(key)
          }
        } else {
          return q.whereRaw(`COALESCE(?? = ?, FALSE)`, [
            this.rawQuotedIdentifier(key),
            value,
          ])
        }
      })
    }
    if (filters.notEqual) {
      iterate(filters.notEqual, BasicOperator.NOT_EQUAL, (q, key, value) => {
        const schema = this.getFieldSchema(key)
        if (shouldOr) {
          q = q.or
        }
        if (this.client === SqlClient.MS_SQL) {
          return q.whereRaw(`CASE WHEN ?? = ? THEN 1 ELSE 0 END = 0`, [
            this.rawQuotedIdentifier(key),
            value,
          ])
        } else if (this.client === SqlClient.ORACLE) {
          const identifier = this.convertClobs(key)
          return (
            q
              .where(subq =>
                subq.not
                  // @ts-expect-error knex types are wrong, raw is fine here
                  .whereNull(identifier)
                  .and.where(identifier, "!=", value)
              )
              // @ts-expect-error knex types are wrong, raw is fine here
              .or.whereNull(identifier)
          )
        } else if (
          this.client === SqlClient.SQL_LITE &&
          schema?.type === FieldType.DATETIME &&
          schema.dateOnly
        ) {
          if (value != null) {
            return q.not
              .whereLike(key, `${value.toISOString().slice(0, 10)}%`)
              .or.whereNull(key)
          } else {
            return q.not.whereNull(key)
          }
        } else {
          return q.whereRaw(`COALESCE(?? != ?, TRUE)`, [
            this.rawQuotedIdentifier(key),
            value,
          ])
        }
      })
    }
    if (filters.empty) {
      iterate(filters.empty, BasicOperator.EMPTY, (q, key) => {
        if (shouldOr) {
          q = q.or
        }
        return q.whereNull(key)
      })
    }
    if (filters.notEmpty) {
      iterate(filters.notEmpty, BasicOperator.NOT_EMPTY, (q, key) => {
        if (shouldOr) {
          q = q.or
        }
        return q.whereNotNull(key)
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

  getTableName(table?: Table): string {
    if (!table) {
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
        query = query.groupBy(groupByFields).select(selectFields)
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
              this.knex.raw(`COUNT(DISTINCT ??) as ??`, [
                field,
                aggregation.name,
              ])
            )
          } else {
            query = query.countDistinct(
              `${tableName}.${aggregation.field} as ${aggregation.name}`
            )
          }
        } else {
          if (this.client === SqlClient.ORACLE) {
            const field = this.convertClobs(`${tableName}.${aggregation.field}`)
            query = query.select(
              this.knex.raw(`COUNT(??) as ??`, [field, aggregation.name])
            )
          } else {
            query = query.count(`${aggregation.field} as ${aggregation.name}`)
          }
        }
      } else {
        const fieldSchema = this.getFieldSchema(aggregation.field)
        if (!fieldSchema) {
          // This should not happen in practice.
          throw new Error(
            `field schema missing for aggregation target: ${aggregation.field}`
          )
        }

        let aggregate = this.knex.raw("??(??)", [
          this.knex.raw(op),
          this.rawQuotedIdentifier(`${tableName}.${aggregation.field}`),
        ])

        if (fieldSchema.type === FieldType.BIGINT) {
          aggregate = this.castIntToString(aggregate)
        }

        query = query.select(
          this.knex.raw("?? as ??", [aggregate, aggregation.name])
        )
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

        const composite = `${aliased}.${key}`
        let identifier

        if (this.isAggregateField(key)) {
          identifier = this.rawQuotedIdentifier(key)
        } else if (this.client === SqlClient.ORACLE) {
          identifier = this.convertClobs(composite)
        } else {
          identifier = this.rawQuotedIdentifier(composite)
        }

        query = query.orderByRaw(`?? ?? ${nulls ? "nulls ??" : ""}`, [
          identifier,
          this.knex.raw(direction),
          ...(nulls ? [this.knex.raw(nulls as string)] : []),
        ])
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

  private buildJsonField(table: Table, field: string): [string, Knex.Raw] {
    const parts = field.split(".")
    let baseName = parts[parts.length - 1]
    let unaliased: string

    let tableField: string
    if (parts.length > 1) {
      const alias = parts.shift()!
      unaliased = parts.join(".")
      tableField = `${alias}.${unaliased}`
    } else {
      unaliased = parts.join(".")
      tableField = unaliased
    }

    if (this.query.meta?.columnPrefix) {
      baseName = baseName.replace(this.query.meta.columnPrefix, "")
    }

    let identifier = this.rawQuotedIdentifier(tableField)
    // Internal tables have special _id, _rev, createdAt, and updatedAt fields
    // that do not appear in the schema, meaning schema could actually be
    // undefined.
    const schema: FieldSchema | undefined = table.schema[baseName]
    if (schema && schema.type === FieldType.BIGINT) {
      identifier = this.castIntToString(identifier)
    }
    return [unaliased, identifier]
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
    const { resource, tableAliases: aliases, schema, tables } = this.query
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

      const relatedTable = tables[toTable]
      if (!relatedTable) {
        throw new Error(`related table "${toTable}" not found in datasource`)
      }
      const toAlias = aliases?.[toTable] || toTable,
        fromAlias = aliases?.[fromTable] || fromTable,
        throughAlias = (throughTable && aliases?.[throughTable]) || throughTable
      let toTableWithSchema = this.tableNameWithSchema(toTable, {
        alias: toAlias,
        schema,
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
      const fieldList = relationshipFields.map(field =>
        this.buildJsonField(relatedTable, field)
      )
      if (!fieldList.length) {
        continue
      }

      const fieldListFormatted = fieldList
        .map(f => {
          const separator = this.client === SqlClient.ORACLE ? " VALUE " : ","
          return this.knex.raw(`?${separator}??`, [f[0], f[1]]).toString()
        })
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
          schema,
        })
        subQuery = subQuery.join(throughTableWithSchema, function () {
          this.on(`${toAlias}.${toPrimary}`, "=", `${throughAlias}.${toKey}`)
        })
      }

      // add the correlation to the overall query
      subQuery = subQuery.where(
        this.rawQuotedIdentifier(correlatedTo),
        "=",
        this.rawQuotedIdentifier(correlatedFrom)
      )

      const standardWrap = (select: Knex.Raw): Knex.QueryBuilder => {
        subQuery = subQuery
          .select(
            relationshipFields.map(field => this.rawQuotedIdentifier(field))
          )
          .limit(getRelationshipLimit())
        // @ts-ignore - the from alias syntax isn't in Knex typing
        return knex.select(select).from({
          [toAlias]: subQuery,
        })
      }
      let wrapperQuery: Knex.QueryBuilder | Knex.Raw
      switch (sqlClient) {
        case SqlClient.SQL_LITE:
          // need to check the junction table document is to the right column, this is just for SQS
          subQuery = this.addJoinFieldCheck(subQuery, relationship)
          wrapperQuery = standardWrap(
            this.knex.raw(
              `json_group_array(json_object(${fieldListFormatted}))`
            )
          )
          break
        case SqlClient.POSTGRES:
          wrapperQuery = standardWrap(
            this.knex.raw(`json_agg(json_build_object(${fieldListFormatted}))`)
          )
          break
        case SqlClient.MARIADB:
          // can't use the standard wrap due to correlated sub-query limitations in MariaDB
          wrapperQuery = subQuery.select(
            knex.raw(
              `json_arrayagg(json_object(${fieldListFormatted}) LIMIT ${getRelationshipLimit()})`
            )
          )
          break
        case SqlClient.MY_SQL:
        case SqlClient.ORACLE:
          wrapperQuery = standardWrap(
            this.knex.raw(`json_arrayagg(json_object(${fieldListFormatted}))`)
          )
          break
        case SqlClient.MS_SQL: {
          const comparatorQuery = knex
            .select(`*`)
            // @ts-ignore - from alias syntax not TS supported
            .from({
              [fromAlias]: subQuery
                .select(
                  fieldList.map(f => {
                    // @ts-expect-error raw is fine here, knex types are wrong
                    return knex.ref(f[1]).as(f[0])
                  })
                )
                .limit(getRelationshipLimit()),
            })

          wrapperQuery = knex.raw(
            `(SELECT ?? = (${comparatorQuery} FOR JSON PATH))`,
            [this.rawQuotedIdentifier(toAlias)]
          )
          break
        }
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
    const { tableAliases: aliases, schema } = this.query
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
      query = query.leftJoin(toTableWithSchema, function () {
        for (let relationship of columns) {
          const from = relationship.from,
            to = relationship.to
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
            this.orOn(`${toAlias}.${toPrimary}`, `${throughAlias}.${to}`)
          }
        })
    }
    return query
  }

  qualifiedKnex(opts?: { alias?: string | boolean }): Knex.QueryBuilder {
    let alias = this.query.tableAliases?.[this.query.table.name]
    if (opts?.alias === false) {
      alias = undefined
    } else if (typeof opts?.alias === "string") {
      alias = opts.alias
    }
    return this.knex(
      this.tableNameWithSchema(this.query.table.name, {
        alias,
        schema: this.query.schema,
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
      for (const [column, schema] of Object.entries(this.query.table.schema)) {
        if (
          schema.constraints?.presence === true ||
          schema.type === FieldType.FORMULA ||
          schema.type === FieldType.AUTO ||
          schema.type === FieldType.LINK ||
          schema.type === FieldType.AI
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
    const { operation, filters, paginate, relationships, table } = this.query
    const { limits } = opts

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
    if (operation !== Operation.COUNT) {
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
    if (operation === Operation.COUNT) {
      query = this.addDistinctCount(query)
    } else if (aggregations.length > 0) {
      query = this.addAggregations(query, aggregations)
    } else {
      query = query.select(this.generateSelectStatement())
    }

    // have to add after as well (this breaks MS-SQL)
    if (operation !== Operation.COUNT) {
      query = this.addSorting(query)
    }

    query = this.addFilters(query, filters, { relationship: true })

    // handle relationships with a CTE for all others
    if (relationships?.length && aggregations.length === 0) {
      const mainTable = this.query.tableAliases?.[table.name] || table.name
      const cte = this.addSorting(
        this.knex
          .with("paginated", query.clone().clearSelect().select("*"))
          .select(this.generateSelectStatement())
          .from({
            [mainTable]: "paginated",
          })
      )
      // add JSON aggregations attached to the CTE
      return this.addJsonRelationships(cte, table.name, relationships)
    }

    return query
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
  _query(
    json: EnrichedQueryJson,
    opts: QueryOptions = {}
  ): SqlQuery | SqlQuery[] {
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

  async getReturningRow(queryFn: QueryFunction, json: EnrichedQueryJson) {
    if (!json.extra || !json.extra.idFilter) {
      return {}
    }
    const input = this._query({
      operation: Operation.READ,
      datasource: json.datasource,
      schema: json.schema,
      table: json.table,
      tables: json.tables,
      resource: { fields: [] },
      filters: json.extra?.idFilter,
      paginate: { limit: 1 },
    })
    return queryFn(input, Operation.READ)
  }

  // when creating if an ID has been inserted need to make sure
  // the id filter is enriched with it before trying to retrieve the row
  checkLookupKeys(id: any, json: EnrichedQueryJson) {
    if (!id || !json.table.primary) {
      return json
    }
    const primaryKey = json.table.primary[0]
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
    json: EnrichedQueryJson,
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
