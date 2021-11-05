import { Knex, knex } from "knex"
import {
  Operation,
  QueryJson,
  QueryOptions,
  RelationshipsJson,
  SearchFilters,
  SortDirection,
} from "../../definitions/datasource"
import { isIsoDateString } from "../utils"
import SqlTableQueryBuilder from "./sqlTable"

const BASE_LIMIT = 5000

type KnexQuery = Knex.QueryBuilder | Knex

function parseBody(body: any) {
  for (let [key, value] of Object.entries(body)) {
    if (Array.isArray(value)) {
      body[key] = JSON.stringify(value)
    }
    if (typeof value !== "string") {
      continue
    }
    if (isIsoDateString(value)) {
      body[key] = new Date(value)
    }
  }
  return body
}

class InternalBuilder {
  private readonly client: string

  constructor(client: string) {
    this.client = client
  }

  // right now we only do filters on the specific table being queried
  addFilters(
    tableName: string,
    query: KnexQuery,
    filters: SearchFilters | undefined
  ): KnexQuery {
    function iterate(
      structure: { [key: string]: any },
      fn: (key: string, value: any) => void
    ) {
      for (let [key, value] of Object.entries(structure)) {
        fn(`${tableName}.${key}`, value)
      }
    }
    if (!filters) {
      return query
    }
    // if all or specified in filters, then everything is an or
    const allOr = filters.allOr
    if (filters.oneOf) {
      iterate(filters.oneOf, (key, array) => {
        const fnc = allOr ? "orWhereIn" : "whereIn"
        query = query[fnc](key, array)
      })
    }
    if (filters.string) {
      iterate(filters.string, (key, value) => {
        const fnc = allOr ? "orWhere" : "where"
        // postgres supports ilike, nothing else does
        if (this.client === "pg") {
          query = query[fnc](key, "ilike", `${value}%`)
        } else {
          const rawFnc = `${fnc}Raw`
          // @ts-ignore
          query = query[rawFnc](`LOWER(${key}) LIKE ?`, [`${value}%`])
        }
      })
    }
    if (filters.fuzzy) {
      iterate(filters.fuzzy, (key, value) => {
        const fnc = allOr ? "orWhere" : "where"
        // postgres supports ilike, nothing else does
        if (this.client === "pg") {
          query = query[fnc](key, "ilike", `%${value}%`)
        } else {
          const rawFnc = `${fnc}Raw`
          // @ts-ignore
          query = query[rawFnc](`LOWER(${key}) LIKE ?`, [`%${value}%`])
        }
      })
    }
    if (filters.range) {
      iterate(filters.range, (key, value) => {
        if (!value.high || !value.low) {
          return
        }
        const fnc = allOr ? "orWhereBetween" : "whereBetween"
        query = query[fnc](key, [value.low, value.high])
      })
    }
    if (filters.equal) {
      iterate(filters.equal, (key, value) => {
        const fnc = allOr ? "orWhere" : "where"
        query = query[fnc]({ [key]: value })
      })
    }
    if (filters.notEqual) {
      iterate(filters.notEqual, (key, value) => {
        const fnc = allOr ? "orWhereNot" : "whereNot"
        query = query[fnc]({ [key]: value })
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
    return query
  }

  addRelationships(
    knex: Knex,
    query: KnexQuery,
    fields: string | string[],
    fromTable: string,
    relationships: RelationshipsJson[] | undefined
  ): KnexQuery {
    if (!relationships) {
      return query
    }
    for (let relationship of relationships) {
      const from = relationship.from,
        to = relationship.to,
        toTable = relationship.tableName
      if (!relationship.through) {
        // @ts-ignore
        query = query.leftJoin(
          toTable,
          `${fromTable}.${from}`,
          `${toTable}.${to}`
        )
      } else {
        const throughTable = relationship.through
        const fromPrimary = relationship.fromPrimary
        const toPrimary = relationship.toPrimary
        query = query
          // @ts-ignore
          .leftJoin(
            throughTable,
            `${fromTable}.${fromPrimary}`,
            `${throughTable}.${from}`
          )
          .leftJoin(toTable, `${toTable}.${toPrimary}`, `${throughTable}.${to}`)
      }
    }
    return query.limit(BASE_LIMIT)
  }

  create(knex: Knex, json: QueryJson, opts: QueryOptions): KnexQuery {
    const { endpoint, body } = json
    let query: KnexQuery = knex(endpoint.entityId)
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

  read(knex: Knex, json: QueryJson, limit: number): KnexQuery {
    let { endpoint, resource, filters, sort, paginate, relationships } = json
    const tableName = endpoint.entityId
    // select all if not specified
    if (!resource) {
      resource = { fields: [] }
    }
    let selectStatement: string | string[] = "*"
    // handle select
    if (resource.fields && resource.fields.length > 0) {
      // select the resources as the format "table.columnName" - this is what is provided
      // by the resource builder further up
      selectStatement = resource.fields.map(field => `${field} as ${field}`)
    }
    let foundLimit = limit || BASE_LIMIT
    // handle pagination
    let foundOffset: number | null = null
    if (paginate && paginate.page && paginate.limit) {
      // @ts-ignore
      const page = paginate.page <= 1 ? 0 : paginate.page - 1
      const offset = page * paginate.limit
      foundLimit = paginate.limit
      foundOffset = offset
    } else if (paginate && paginate.limit) {
      foundLimit = paginate.limit
    }
    // start building the query
    let query: KnexQuery = knex(tableName).limit(foundLimit)
    if (foundOffset) {
      query = query.offset(foundOffset)
    }
    if (sort) {
      for (let [key, value] of Object.entries(sort)) {
        const direction = value === SortDirection.ASCENDING ? "asc" : "desc"
        query = query.orderBy(key, direction)
      }
    }
    query = this.addFilters(tableName, query, filters)
    // @ts-ignore
    let preQuery: KnexQuery = knex({
      // @ts-ignore
      [tableName]: query,
    }).select(selectStatement)
    // handle joins
    return this.addRelationships(
      knex,
      preQuery,
      selectStatement,
      tableName,
      relationships
    )
  }

  update(knex: Knex, json: QueryJson, opts: QueryOptions): KnexQuery {
    const { endpoint, body, filters } = json
    let query: KnexQuery = knex(endpoint.entityId)
    const parsedBody = parseBody(body)
    query = this.addFilters(endpoint.entityId, query, filters)
    // mysql can't use returning
    if (opts.disableReturning) {
      return query.update(parsedBody)
    } else {
      return query.update(parsedBody).returning("*")
    }
  }

  delete(knex: Knex, json: QueryJson, opts: QueryOptions): KnexQuery {
    const { endpoint, filters } = json
    let query: KnexQuery = knex(endpoint.entityId)
    query = this.addFilters(endpoint.entityId, query, filters)
    // mysql can't use returning
    if (opts.disableReturning) {
      return query.delete()
    } else {
      return query.delete().returning("*")
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

  /**
   * @param json The JSON query DSL which is to be converted to SQL.
   * @param opts extra options which are to be passed into the query builder, e.g. disableReturning
   * which for the sake of mySQL stops adding the returning statement to inserts, updates and deletes.
   * @return {{ sql: string, bindings: object }} the query ready to be passed to the driver.
   */
  _query(json: QueryJson, opts: QueryOptions = {}) {
    const sqlClient = this.getSqlClient()
    const client = knex({ client: sqlClient })
    let query
    const builder = new InternalBuilder(sqlClient)
    switch (this._operation(json)) {
      case Operation.CREATE:
        query = builder.create(client, json, opts)
        break
      case Operation.READ:
        query = builder.read(client, json, this.limit)
        break
      case Operation.UPDATE:
        query = builder.update(client, json, opts)
        break
      case Operation.DELETE:
        query = builder.delete(client, json, opts)
        break
      case Operation.CREATE_TABLE:
      case Operation.UPDATE_TABLE:
      case Operation.DELETE_TABLE:
        return this._tableQuery(json)
      default:
        throw `Operation type is not supported by SQL query builder`
    }

    // @ts-ignore
    return query.toSQL().toNative()
  }
}

module.exports = SqlQueryBuilder
