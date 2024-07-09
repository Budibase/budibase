import { Knex, knex } from "knex"
import * as dbCore from "../db"
import {
  getNativeSql,
  isExternalTable,
  isValidISODateString,
  isValidFilter,
  sqlLog,
  isInvalidISODateString,
} from "./utils"
import { SqlStatements } from "./sqlStatements"
import SqlTableQueryBuilder from "./sqlTable"
import {
  AnySearchFilter,
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
import { helpers } from "@budibase/shared-core"

type QueryFunction = (query: SqlQuery | SqlQuery[], operation: Operation) => any

const envLimit = environment.SQL_MAX_ROWS
  ? parseInt(environment.SQL_MAX_ROWS)
  : null
const BASE_LIMIT = envLimit || 5000

function likeKey(client: string | string[], key: string): string {
  let start: string, end: string
  switch (client) {
    case SqlClient.MY_SQL:
      start = end = "`"
      break
    case SqlClient.SQL_LITE:
    case SqlClient.ORACLE:
    case SqlClient.POSTGRES:
      start = end = '"'
      break
    case SqlClient.MS_SQL:
      start = "["
      end = "]"
      break
    default:
      throw new Error("Unknown client generating like key")
  }
  const parts = key.split(".")
  key = parts.map(part => `${start}${part}${end}`).join(".")
  return key
}

function parse(input: any) {
  if (Array.isArray(input)) {
    return JSON.stringify(input)
  }
  if (input == undefined) {
    return null
  }
  if (typeof input !== "string") {
    return input
  }
  if (isInvalidISODateString(input)) {
    return null
  }
  if (isValidISODateString(input)) {
    return new Date(input.trim())
  }
  return input
}

function parseBody(body: any) {
  for (let [key, value] of Object.entries(body)) {
    body[key] = parse(value)
  }
  return body
}

function parseFilters(filters: SearchFilters | undefined): SearchFilters {
  if (!filters) {
    return {}
  }
  for (let [key, value] of Object.entries(filters)) {
    let parsed
    if (typeof value === "object") {
      parsed = parseFilters(value)
    } else {
      parsed = parse(value)
    }
    // @ts-ignore
    filters[key] = parsed
  }
  return filters
}

function generateSelectStatement(
  json: QueryJson,
  knex: Knex
): (string | Knex.Raw)[] | "*" {
  const { resource, meta } = json

  if (!resource || !resource.fields || resource.fields.length === 0) {
    return "*"
  }

  const schema = meta?.table?.schema
  return resource.fields.map(field => {
    const fieldNames = field.split(/\./g)
    const tableName = fieldNames[0]
    const columnName = fieldNames[1]
    const columnSchema = schema?.[columnName]
    if (columnSchema && knex.client.config.client === SqlClient.POSTGRES) {
      const externalType = schema[columnName].externalType
      if (externalType?.includes("money")) {
        return knex.raw(
          `"${tableName}"."${columnName}"::money::numeric as "${field}"`
        )
      }
    }
    if (
      knex.client.config.client === SqlClient.MS_SQL &&
      columnSchema?.type === FieldType.DATETIME &&
      columnSchema.timeOnly
    ) {
      // Time gets returned as timestamp from mssql, not matching the expected HH:mm format
      return knex.raw(`CONVERT(varchar, ${field}, 108) as "${field}"`)
    }
    return `${field} as ${field}`
  })
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
  private readonly client: string

  constructor(client: string) {
    this.client = client
  }

  // right now we only do filters on the specific table being queried
  addFilters(
    query: Knex.QueryBuilder,
    filters: SearchFilters | undefined,
    table: Table,
    opts: {
      aliases?: Record<string, string>
      relationship?: boolean
      columnPrefix?: string
    }
  ): Knex.QueryBuilder {
    if (!filters) {
      return query
    }
    filters = parseFilters(filters)
    // if all or specified in filters, then everything is an or
    const allOr = filters.allOr
    const sqlStatements = new SqlStatements(this.client, table, {
      allOr,
      columnPrefix: opts.columnPrefix,
    })
    const tableName =
      this.client === SqlClient.SQL_LITE ? table._id! : table.name

    function getTableAlias(name: string) {
      const alias = opts.aliases?.[name]
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
        } else if (!opts.relationship && !isRelationshipField) {
          const alias = getTableAlias(tableName)
          fn(alias ? `${alias}.${updatedKey}` : updatedKey, value)
        } else if (opts.relationship && isRelationshipField) {
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
        query = query[rawFnc](`LOWER(${likeKey(this.client, key)}) LIKE ?`, [
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
          for (let i in value) {
            if (typeof value[i] === "string") {
              value[i] = `%"${value[i].toLowerCase()}"%`
            } else {
              value[i] = `%${value[i]}%`
            }
            statement +=
              (statement ? andOr : "") +
              `COALESCE(LOWER(${likeKey(this.client, key)}), '') LIKE ?`
          }

          if (statement === "") {
            return
          }

          // @ts-ignore
          query = query[rawFnc](`${not}(${statement})`, value)
        })
      }
    }

    if (filters.oneOf) {
      const fnc = allOr ? "orWhereIn" : "whereIn"
      iterate(
        filters.oneOf,
        (key: string, array) => {
          query = query[fnc](key, Array.isArray(array) ? array : [array])
        },
        (key: string[], array) => {
          query = query[fnc](key, Array.isArray(array) ? array : [array])
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
          query = query[rawFnc](`LOWER(${likeKey(this.client, key)}) LIKE ?`, [
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
        if (lowValid && highValid) {
          query = sqlStatements.between(query, key, value.low, value.high)
        } else if (lowValid) {
          query = sqlStatements.lte(query, key, value.low)
        } else if (highValid) {
          query = sqlStatements.gte(query, key, value.high)
        }
      })
    }
    if (filters.equal) {
      iterate(filters.equal, (key, value) => {
        const fnc = allOr ? "orWhereRaw" : "whereRaw"
        if (this.client === SqlClient.MS_SQL) {
          query = query[fnc](
            `CASE WHEN ${likeKey(this.client, key)} = ? THEN 1 ELSE 0 END = 1`,
            [value]
          )
        } else {
          query = query[fnc](
            `COALESCE(${likeKey(this.client, key)} = ?, FALSE)`,
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
            `CASE WHEN ${likeKey(this.client, key)} = ? THEN 1 ELSE 0 END = 0`,
            [value]
          )
        } else {
          query = query[fnc](
            `COALESCE(${likeKey(this.client, key)} != ?, TRUE)`,
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

    const tableRef = opts?.aliases?.[table._id!] || table._id
    // when searching internal tables make sure long looking for rows
    if (filters.documentType && !isExternalTable(table) && tableRef) {
      // has to be its own option, must always be AND onto the search
      query.andWhereLike(
        `${tableRef}._id`,
        `${prefixed(filters.documentType)}%`
      )
    }

    return query
  }

  addDistinctCount(
    query: Knex.QueryBuilder,
    json: QueryJson
  ): Knex.QueryBuilder {
    const table = json.meta.table
    const primary = table.primary
    const aliases = json.tableAliases
    const aliased =
      table.name && aliases?.[table.name] ? aliases[table.name] : table.name
    if (!primary) {
      throw new Error("SQL counting requires primary key to be supplied")
    }
    return query.countDistinct(`${aliased}.${primary[0]} as total`)
  }

  addSorting(query: Knex.QueryBuilder, json: QueryJson): Knex.QueryBuilder {
    let { sort } = json
    const table = json.meta.table
    const primaryKey = table.primary
    const tableName = getTableName(table)
    const aliases = json.tableAliases
    const aliased =
      tableName && aliases?.[tableName] ? aliases[tableName] : table?.name
    if (!Array.isArray(primaryKey)) {
      throw new Error("Sorting requires primary key to be specified for table")
    }
    if (sort && Object.keys(sort || {}).length > 0) {
      for (let [key, value] of Object.entries(sort)) {
        const direction =
          value.direction === SortOrder.ASCENDING ? "asc" : "desc"
        let nulls
        if (this.client === SqlClient.POSTGRES) {
          // All other clients already sort this as expected by default, and adding this to the rest of the clients is causing issues
          nulls = value.direction === SortOrder.ASCENDING ? "first" : "last"
        }

        query = query.orderBy(`${aliased}.${key}`, direction, nulls)
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

  knexWithAlias(
    knex: Knex,
    endpoint: QueryJson["endpoint"],
    aliases?: QueryJson["tableAliases"]
  ): Knex.QueryBuilder {
    const tableName = endpoint.entityId
    const tableAlias = aliases?.[tableName]

    return knex(
      this.tableNameWithSchema(tableName, {
        alias: tableAlias,
        schema: endpoint.schema,
      })
    )
  }

  create(knex: Knex, json: QueryJson, opts: QueryOptions): Knex.QueryBuilder {
    const { endpoint, body } = json
    let query = this.knexWithAlias(knex, endpoint)
    const parsedBody = parseBody(body)
    // make sure no null values in body for creation
    for (let [key, value] of Object.entries(parsedBody)) {
      if (value == null) {
        delete parsedBody[key]
      }
    }

    // mysql can't use returning
    if (opts.disableReturning) {
      return query.insert(parsedBody)
    } else {
      return query.insert(parsedBody).returning("*")
    }
  }

  bulkCreate(knex: Knex, json: QueryJson): Knex.QueryBuilder {
    const { endpoint, body } = json
    let query = this.knexWithAlias(knex, endpoint)
    if (!Array.isArray(body)) {
      return query
    }
    const parsedBody = body.map(row => parseBody(row))
    return query.insert(parsedBody)
  }

  bulkUpsert(knex: Knex, json: QueryJson): Knex.QueryBuilder {
    const { endpoint, body } = json
    let query = this.knexWithAlias(knex, endpoint)
    if (!Array.isArray(body)) {
      return query
    }
    const parsedBody = body.map(row => parseBody(row))
    if (
      this.client === SqlClient.POSTGRES ||
      this.client === SqlClient.SQL_LITE ||
      this.client === SqlClient.MY_SQL
    ) {
      const primary = json.meta.table.primary
      if (!primary) {
        throw new Error("Primary key is required for upsert")
      }
      const ret = query.insert(parsedBody).onConflict(primary).merge()
      return ret
    } else if (this.client === SqlClient.MS_SQL) {
      // No upsert or onConflict support in MSSQL yet, see:
      //   https://github.com/knex/knex/pull/6050
      return query.insert(parsedBody)
    }
    return query.upsert(parsedBody)
  }

  read(
    knex: Knex,
    json: QueryJson,
    opts: {
      limits?: { base: number; query: number }
    } = {}
  ): Knex.QueryBuilder {
    let { endpoint, filters, paginate, relationships, tableAliases } = json
    const { limits } = opts
    const counting = endpoint.operation === Operation.COUNT

    const tableName = endpoint.entityId
    // start building the query
    let query = this.knexWithAlias(knex, endpoint, tableAliases)
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
      query = this.addSorting(query, json)
    }
    // add filters to the query (where)
    query = this.addFilters(query, filters, json.meta.table, {
      columnPrefix: json.meta.columnPrefix,
      aliases: tableAliases,
    })

    const alias = tableAliases?.[tableName] || tableName
    let preQuery: Knex.QueryBuilder = knex({
      // the typescript definition for the knex constructor doesn't support this
      // syntax, but it is the only way to alias a pre-query result as part of
      // a query - there is an alias dictionary type, but it assumes it can only
      // be a table name, not a pre-query
      [alias]: query as any,
    })
    // if counting, use distinct count, else select
    preQuery = !counting
      ? preQuery.select(generateSelectStatement(json, knex))
      : this.addDistinctCount(preQuery, json)
    // have to add after as well (this breaks MS-SQL)
    if (this.client !== SqlClient.MS_SQL && !counting) {
      preQuery = this.addSorting(preQuery, json)
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

    return this.addFilters(query, filters, json.meta.table, {
      columnPrefix: json.meta.columnPrefix,
      relationship: true,
      aliases: tableAliases,
    })
  }

  update(knex: Knex, json: QueryJson, opts: QueryOptions): Knex.QueryBuilder {
    const { endpoint, body, filters, tableAliases } = json
    let query = this.knexWithAlias(knex, endpoint, tableAliases)
    const parsedBody = parseBody(body)
    query = this.addFilters(query, filters, json.meta.table, {
      columnPrefix: json.meta.columnPrefix,
      aliases: tableAliases,
    })
    // mysql can't use returning
    if (opts.disableReturning) {
      return query.update(parsedBody)
    } else {
      return query.update(parsedBody).returning("*")
    }
  }

  delete(knex: Knex, json: QueryJson, opts: QueryOptions): Knex.QueryBuilder {
    const { endpoint, filters, tableAliases } = json
    let query = this.knexWithAlias(knex, endpoint, tableAliases)
    query = this.addFilters(query, filters, json.meta.table, {
      columnPrefix: json.meta.columnPrefix,
      aliases: tableAliases,
    })
    // mysql can't use returning
    if (opts.disableReturning) {
      return query.delete()
    } else {
      return query.delete().returning(generateSelectStatement(json, knex))
    }
  }
}

class SqlQueryBuilder extends SqlTableQueryBuilder {
  private readonly limit: number

  // pass through client to get flavour of SQL
  constructor(client: string, limit: number = BASE_LIMIT) {
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
    if (sqlClient === SqlClient.SQL_LITE) {
      config.useNullAsDefault = true
    }

    const client = knex(config)
    let query: Knex.QueryBuilder
    const builder = new InternalBuilder(sqlClient)
    switch (this._operation(json)) {
      case Operation.CREATE:
        query = builder.create(client, json, opts)
        break
      case Operation.READ:
        query = builder.read(client, json, {
          limits: {
            query: this.limit,
            base: BASE_LIMIT,
          },
        })
        break
      case Operation.COUNT:
        // read without any limits to count
        query = builder.read(client, json)
        break
      case Operation.UPDATE:
        query = builder.update(client, json, opts)
        break
      case Operation.DELETE:
        query = builder.delete(client, json, opts)
        break
      case Operation.BULK_CREATE:
        query = builder.bulkCreate(client, json)
        break
      case Operation.BULK_UPSERT:
        query = builder.bulkUpsert(client, json)
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
