const fetch = require("node-fetch")
const { SearchIndexes } = require("../../db/utils")
const { checkSlashesInUrl } = require("../../utilities")
const env = require("../../environment")

function buildSearchUrl(
  appId,
  query,
  bookmark = null,
  limit = 50,
  includeDocs = true
) {
  let url = `${env.COUCH_DB_URL}/${appId}/_design/database/_search`
  url += `/${SearchIndexes.ROWS}?q=${query}`
  if (includeDocs) {
    url += "&include_docs=true"
  }
  if (limit) {
    url += `&limit=${limit}`
  }
  if (bookmark) {
    url += `&bookmark=${bookmark}`
  }
  return checkSlashesInUrl(url)
}

class QueryBuilder {
  constructor(appId, base) {
    this.appId = appId
    this.query = {
      string: {},
      fuzzy: {},
      range: {},
      equal: {},
      meta: {},
      ...base,
    }
    this.limit = 50
    this.bookmark = null
  }

  setLimit(limit) {
    this.limit = limit
    return this
  }

  setBookmark(bookmark) {
    this.bookmark = bookmark
    return this
  }

  addString(key, partial) {
    this.query.string[key] = partial
    return this
  }

  addFuzzy(key, fuzzy) {
    this.query.fuzzy[key] = fuzzy
    return this
  }

  addRange(key, low, high) {
    this.query.range = {
      low,
      high,
    }
    return this
  }

  addEqual(key, value) {
    this.query.equal[key] = value
    return this
  }

  addTable(tableId) {
    this.query.equal.tableId = tableId
    return this
  }

  complete() {
    let output = ""
    function build(structure, queryFn) {
      for (let [key, value] of Object.entries(structure)) {
        if (output.length !== 0) {
          output += " AND "
        }
        output += queryFn(key, value)
      }
    }

    if (this.query.string) {
      build(this.query.string, (key, value) => `${key}:${value}*`)
    }
    if (this.query.number) {
      build(this.query.number, (key, value) =>
        value.length == null
          ? `${key}:${value}`
          : `${key}:[${value[0]} TO ${value[1]}]`
      )
    }
    if (this.query.fuzzy) {
      build(this.query.fuzzy, (key, value) => `${key}:${value}~`)
    }
    return buildSearchUrl(this.appId, output, this.bookmark, this.limit)
  }
}

exports.QueryBuilder = QueryBuilder

exports.search = async query => {
  const response = await fetch(query, {
    method: "GET",
  })
  const json = await response.json()
  let output = {
    rows: [],
  }
  if (json.rows != null && json.rows.length > 0) {
    output.rows = json.rows.map(row => row.doc)
  }
  if (json.bookmark) {
    output.bookmark = json.bookmark
  }
  return output
}

exports.rowSearch = async ctx => {
  // this can't be done through pouch, have to reach for trusty node-fetch
  const appId = ctx.user.appId
  const bookmark = ctx.params.bookmark
  let url
  if (ctx.params.query) {
    url = new QueryBuilder(appId, ctx.params.query, bookmark).complete()
  } else if (ctx.params.raw) {
    url = buildSearchUrl(appId, ctx.params.raw, bookmark)
  }
  ctx.body = await exports.search(url)
}
