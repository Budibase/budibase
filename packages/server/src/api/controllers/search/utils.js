const { SearchIndexes } = require("../../../db/utils")
const { checkSlashesInUrl } = require("../../../utilities")
const env = require("../../../environment")
const fetch = require("node-fetch")

/**
 * Given a set of inputs this will generate the URL which is to be sent to the search proxy in CouchDB.
 * @param {string} appId The ID of the app which we will be searching within.
 * @param {string} query The lucene query string which is to be used for searching.
 * @param {string|null} bookmark If there were more than the limit specified can send the bookmark that was
 * returned with query for next set of search results.
 * @param {number} limit The number of entries to return per query.
 * @param {boolean} excludeDocs By default full rows are returned, if required this can be disabled.
 * @return {string} The URL which a GET can be performed on to receive results.
 */
function buildSearchUrl({ appId, query, bookmark, excludeDocs, limit = 50 }) {
  let url = `${env.COUCH_DB_URL}/${appId}/_design/database/_search`
  url += `/${SearchIndexes.ROWS}?q=${query}`
  url += `&limit=${limit}`
  if (!excludeDocs) {
    url += "&include_docs=true"
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

  complete(rawQuery = null) {
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
    if (rawQuery) {
      output = output.length === 0 ? rawQuery : `&${rawQuery}`
    }
    return buildSearchUrl({
      appId: this.appId,
      query: output,
      bookmark: this.bookmark,
      limit: this.limit,
    })
  }
}

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

exports.QueryBuilder = QueryBuilder
exports.buildSearchUrl = buildSearchUrl
