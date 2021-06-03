const { Operation, SortDirection } = require("./constants")

const BASE_LIMIT = 5000

function addFilters(query, filters) {
  function iterate(structure, fn) {
    for (let [key, value] of Object.entries(structure)) {
      fn(key, value)
    }
  }
  if (filters.string) {
    iterate(filters.string, (key, value) => {
      query = query.where(key, "like", `${value}%`)
    })
  }
  if (filters.range) {
    iterate(filters.range, (key, value) => {
      if (!value.high || !value.low) {
        return
      }
      query = query.whereBetween(key, [value.low, value.high])
    })
  }
  if (filters.equal) {
    iterate(filters.equal, (key, value) => {
      query = query.where({ [key]: value })
    })
  }
  if (filters.notEqual) {
    iterate(filters.notEqual, (key, value) => {
      query = query.whereNot({ [key]: value })
    })
  }
  if (filters.empty) {
    iterate(filters.empty, key => {
      query = query.whereNull(key)
    })
  }
  if (filters.notEmpty) {
    iterate(filters.notEmpty, key => {
      query = query.whereNotNull(key)
    })
  }
  return query
}

function buildCreate(knex, json) {
  const { endpoint, body } = json
  let query = knex(endpoint.entityId)
  return query.insert(body).toString()
}

function buildRead(knex, json, limit) {
  const { endpoint, resource, filters, sort, paginate } = json
  let query = knex(endpoint.entityId)
  // handle select
  if (resource.fields && resource.fields.length > 0) {
    query = query.select(resource.fields)
  } else {
    query = query.select("*")
  }
  // handle where
  query = addFilters(query, filters)
  // handle sorting
  if (sort) {
    for (let [key, value] of Object.entries(sort)) {
      const direction = value === SortDirection.ASCENDING ? "asc" : "desc"
      query = query.orderBy(key, direction)
    }
  }
  // handle pagination
  if (paginate.page && paginate.limit) {
    const page = paginate.page <= 1 ? 0 : paginate.page - 1
    const offset = page * paginate.limit
    query = query.offset(offset).limit(paginate.limit)
  } else if (paginate.limit) {
    query = query.limit(paginate.limit)
  } else {
    query.limit(limit)
  }
  return query.toString()
}

function buildUpdate(knex, json) {
  const { endpoint, body, filters } = json
  let query = knex(endpoint.entityId)
  query = addFilters(query, filters)
  return query.update(body).toString()
}

function buildDelete(knex, json) {
  const { endpoint, filters } = json
  let query = knex(endpoint.entityId)
  query = addFilters(query, filters)
  return query.delete().toString()
}

class SqlQueryBuilder {
  // pass through client to get flavour of SQL
  constructor(client, limit = BASE_LIMIT) {
    this._client = client
    this._limit = limit
  }

  query(json) {
    const { endpoint } = json
    const knex = require("knex")({ client: this._client })
    const operation = endpoint.operation
    switch (operation) {
      case Operation.CREATE:
        return buildCreate(knex, json)
      case Operation.READ:
        return buildRead(knex, json, this._limit)
      case Operation.UPDATE:
        return buildUpdate(knex, json)
      case Operation.DELETE:
        return buildDelete(knex, json)
      default:
        throw `Operation ${operation} type is not supported by SQL query builder`
    }
  }
}

module.exports = SqlQueryBuilder
