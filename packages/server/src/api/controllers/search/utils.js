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
 * @param {string} sort The column to sort by.
 * @param {string} sortOrder The order to sort by. "ascending" or "descending".
 * @param {string} sortType The type of sort to perform. "string" or "number".
 * @param {boolean} excludeDocs By default full rows are returned, if required this can be disabled.
 * @return {string} The URL which a GET can be performed on to receive results.
 */
function buildSearchUrl({
  appId,
  query,
  bookmark,
  sort,
  sortOrder,
  sortType,
  excludeDocs,
  limit = 50,
}) {
  let url = `${env.COUCH_DB_URL}/${appId}/_design/database/_search`
  url += `/${SearchIndexes.ROWS}?q=${query}`
  url += `&limit=${Math.min(limit, 200)}`
  if (!excludeDocs) {
    url += "&include_docs=true"
  }
  if (sort) {
    const orderChar = sortOrder === "descending" ? "-" : ""
    url += `&sort="${orderChar}${sort.replace(/ /, "_")}<${sortType}>"`
  }
  if (bookmark) {
    url += `&bookmark=${bookmark}`
  }
  return checkSlashesInUrl(url)
}

const luceneEscape = value => {
  return `${value}`.replace(/[ #+\-&|!(){}\[\]^"~*?:\\]/g, "\\$&")
}

class QueryBuilder {
  constructor(appId, base, bookmark, limit, sort, sortOrder, sortType) {
    this.appId = appId
    this.query = {
      string: {},
      fuzzy: {},
      range: {},
      equal: {},
      notEqual: {},
      empty: {},
      notEmpty: {},
      ...base,
    }
    this.bookmark = bookmark
    this.limit = limit || 50
    this.sort = sort
    this.sortOrder = sortOrder || "ascending"
    this.sortType = sortType || "string"
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

  addNotEqual(key, value) {
    this.query.notEqual[key] = value
    return this
  }

  addEmpty(key, value) {
    this.query.empty[key] = value
    return this
  }

  addNotEmpty(key, value) {
    this.query.notEmpty[key] = value
    return this
  }

  addTable(tableId) {
    this.query.equal.tableId = tableId
    return this
  }

  complete(rawQuery = null) {
    let output = "*:*"
    function build(structure, queryFn) {
      for (let [key, value] of Object.entries(structure)) {
        const expression = queryFn(luceneEscape(key.replace(/ /, "_")), value)
        if (expression == null) {
          continue
        }
        output += ` AND ${expression}`
      }
    }

    if (this.query.string) {
      build(this.query.string, (key, value) => {
        return value ? `${key}:${luceneEscape(value.toLowerCase())}*` : null
      })
    }
    if (this.query.range) {
      build(this.query.range, (key, value) => {
        if (!value) {
          return null
        }
        if (value.low == null || value.low === "") {
          return null
        }
        if (value.high == null || value.high === "") {
          return null
        }
        return `${key}:[${value.low} TO ${value.high}]`
      })
    }
    if (this.query.fuzzy) {
      build(this.query.fuzzy, (key, value) => {
        return value ? `${key}:${luceneEscape(value.toLowerCase())}~` : null
      })
    }
    if (this.query.equal) {
      build(this.query.equal, (key, value) => {
        return value ? `${key}:${luceneEscape(value.toLowerCase())}` : null
      })
    }
    if (this.query.notEqual) {
      build(this.query.notEqual, (key, value) => {
        return value ? `!${key}:${luceneEscape(value.toLowerCase())}` : null
      })
    }
    if (this.query.empty) {
      build(this.query.empty, key => `!${key}:["" TO *]`)
    }
    if (this.query.notEmpty) {
      build(this.query.notEmpty, key => `${key}:["" TO *]`)
    }
    if (rawQuery) {
      output = output.length === 0 ? rawQuery : `&${rawQuery}`
    }
    return buildSearchUrl({
      appId: this.appId,
      query: output,
      bookmark: this.bookmark,
      limit: this.limit,
      sort: this.sort,
      sortOrder: this.sortOrder,
      sortType: this.sortType,
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
