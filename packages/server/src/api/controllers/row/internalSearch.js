const { SearchIndexes } = require("../../../db/utils")
const env = require("../../../environment")
const fetch = require("node-fetch")

/**
 * Class to build lucene query URLs.
 * Optionally takes a base lucene query object.
 */
class QueryBuilder {
  constructor(appId, base) {
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
    this.limit = 50
    this.sortOrder = "ascending"
    this.sortType = "string"
    this.includeDocs = true
    this.version = null
  }

  setVersion(version) {
    this.version = version
    return this
  }

  setTable(tableId) {
    this.query.equal.tableId = tableId
    return this
  }

  setLimit(limit) {
    this.limit = limit
    return this
  }

  setSort(sort) {
    this.sort = sort
    return this
  }

  setSortOrder(sortOrder) {
    this.sortOrder = sortOrder
    return this
  }

  setSortType(sortType) {
    this.sortType = sortType
    return this
  }

  setBookmark(bookmark) {
    this.bookmark = bookmark
    return this
  }

  excludeDocs() {
    this.includeDocs = false
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

  /**
   * Preprocesses a value before going into a lucene search.
   * Transforms strings to lowercase and wraps strings and bools in quotes.
   * @param value The value to process
   * @param options The preprocess options
   * @returns {string|*}
   */
  preprocess(value, { escape, lowercase, wrap } = {}) {
    const hasVersion = !!this.version
    // Determine if type needs wrapped
    const originalType = typeof value
    // Convert to lowercase
    if (value && lowercase) {
      value = value.toLowerCase ? value.toLowerCase() : value
    }
    // Escape characters
    if (escape && originalType === "string") {
      value = `${value}`.replace(/[ #+\-&|!(){}\]^"~*?:\\]/g, "\\$&")
    }
    // Wrap in quotes
    if (hasVersion && wrap) {
      value = originalType === "number" ? value : `"${value}"`
    }
    return value
  }

  buildSearchQuery() {
    const builder = this
    let query = "*:*"
    const allPreProcessingOpts = { escape: true, lowercase: true, wrap: true }

    function build(structure, queryFn) {
      for (let [key, value] of Object.entries(structure)) {
        key = builder.preprocess(key.replace(/ /, "_"), {
          escape: true,
        })
        const expression = queryFn(key, value)
        if (expression == null) {
          continue
        }
        query += ` AND ${expression}`
      }
    }

    // Construct the actual lucene search query string from JSON structure
    if (this.query.string) {
      build(this.query.string, (key, value) => {
        if (!value) {
          return null
        }
        value = builder.preprocess(value, {
          escape: true,
          lowercase: true,
        })
        return `${key}:${value}*`
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
        const low = builder.preprocess(value.low, allPreProcessingOpts)
        const high = builder.preprocess(value.high, allPreProcessingOpts)
        return `${key}:[${low} TO ${high}]`
      })
    }
    if (this.query.fuzzy) {
      build(this.query.fuzzy, (key, value) => {
        if (!value) {
          return null
        }
        value = builder.preprocess(value, {
          escape: true,
          lowercase: true,
        })
        return `${key}:${value}~`
      })
    }
    if (this.query.equal) {
      build(this.query.equal, (key, value) => {
        if (!value) {
          return null
        }
        return `${key}:${builder.preprocess(value, allPreProcessingOpts)}`
      })
    }
    if (this.query.notEqual) {
      build(this.query.notEqual, (key, value) => {
        if (!value) {
          return null
        }
        return `!${key}:${builder.preprocess(value, allPreProcessingOpts)}`
      })
    }
    if (this.query.empty) {
      build(this.query.empty, key => `!${key}:["" TO *]`)
    }
    if (this.query.notEmpty) {
      build(this.query.notEmpty, key => `${key}:["" TO *]`)
    }

    return query
  }

  buildSearchBody() {
    let body = {
      q: this.buildSearchQuery(),
      limit: Math.min(this.limit, 200),
      include_docs: this.includeDocs,
    }
    if (this.bookmark) {
      body.bookmark = this.bookmark
    }
    if (this.sort) {
      const order = this.sortOrder === "descending" ? "-" : ""
      const type = `<${this.sortType}>`
      body.sort = `${order}${this.sort.replace(/ /, "_")}${type}`
    }
    return body
  }

  async run() {
    const url = `${env.COUCH_DB_URL}/${this.appId}/_design/database/_search/${SearchIndexes.ROWS}`
    const body = this.buildSearchBody()
    return await runQuery(url, body)
  }
}

/**
 * Executes a lucene search query.
 * @param url The query URL
 * @param body The request body defining search criteria
 * @returns {Promise<{rows: []}>}
 */
const runQuery = async (url, body) => {
  const response = await fetch(url, {
    body: JSON.stringify(body),
    method: "POST",
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

/**
 * Gets round the fixed limit of 200 results from a query by fetching as many
 * pages as required and concatenating the results. This recursively operates
 * until enough results have been found.
 * @param appId {string} The app ID to search
 * @param query {object} The JSON query structure
 * @param params {object} The search params including:
 *   tableId {string} The table ID to search
 *   sort {string} The sort column
 *   sortOrder {string} The sort order ("ascending" or "descending")
 *   sortType {string} Whether to treat sortable values as strings or
 *     numbers. ("string" or "number")
 *   limit {number} The number of results to fetch
 *   bookmark {string|null} Current bookmark in the recursive search
 *   rows {array|null} Current results in the recursive search
 * @returns {Promise<*[]|*>}
 */
const recursiveSearch = async (appId, query, params) => {
  const bookmark = params.bookmark
  const rows = params.rows || []
  if (rows.length >= params.limit) {
    return rows
  }
  let pageSize = 200
  if (rows.length > params.limit - 200) {
    pageSize = params.limit - rows.length
  }
  const page = await new QueryBuilder(appId, query)
    .setVersion(params.version)
    .setTable(params.tableId)
    .setBookmark(bookmark)
    .setLimit(pageSize)
    .setSort(params.sort)
    .setSortOrder(params.sortOrder)
    .setSortType(params.sortType)
    .run()
  if (!page.rows.length) {
    return rows
  }
  if (page.rows.length < 200) {
    return [...rows, ...page.rows]
  }
  const newParams = {
    ...params,
    bookmark: page.bookmark,
    rows: [...rows, ...page.rows],
  }
  return await recursiveSearch(appId, query, newParams)
}

/**
 * Performs a paginated search. A bookmark will be returned to allow the next
 * page to be fetched. There is a max limit off 200 results per page in a
 * paginated search.
 * @param appId {string} The app ID to search
 * @param query {object} The JSON query structure
 * @param params {object} The search params including:
 *   tableId {string} The table ID to search
 *   sort {string} The sort column
 *   sortOrder {string} The sort order ("ascending" or "descending")
 *   sortType {string} Whether to treat sortable values as strings or
 *     numbers. ("string" or "number")
 *   limit {number} The desired page size
 *   bookmark {string} The bookmark to resume from
 * @returns {Promise<{hasNextPage: boolean, rows: *[]}>}
 */
exports.paginatedSearch = async (appId, query, params) => {
  let limit = params.limit
  if (limit == null || isNaN(limit) || limit < 0) {
    limit = 50
  }
  limit = Math.min(limit, 200)
  const search = new QueryBuilder(appId, query)
    .setVersion(params.version)
    .setTable(params.tableId)
    .setSort(params.sort)
    .setSortOrder(params.sortOrder)
    .setSortType(params.sortType)
  const searchResults = await search
    .setBookmark(params.bookmark)
    .setLimit(limit)
    .run()

  // Try fetching 1 row in the next page to see if another page of results
  // exists or not
  const nextResults = await search
    .setBookmark(searchResults.bookmark)
    .setLimit(1)
    .run()

  return {
    ...searchResults,
    hasNextPage: nextResults.rows && nextResults.rows.length > 0,
  }
}

/**
 * Performs a full search, fetching multiple pages if required to return the
 * desired amount of results. There is a limit of 1000 results to avoid
 * heavy performance hits, and to avoid client components breaking from
 * handling too much data.
 * @param appId {string} The app ID to search
 * @param query {object} The JSON query structure
 * @param params {object} The search params including:
 *   tableId {string} The table ID to search
 *   sort {string} The sort column
 *   sortOrder {string} The sort order ("ascending" or "descending")
 *   sortType {string} Whether to treat sortable values as strings or
 *     numbers. ("string" or "number")
 *   limit {number} The desired number of results
 * @returns {Promise<{rows: *}>}
 */
exports.fullSearch = async (appId, query, params) => {
  let limit = params.limit
  if (limit == null || isNaN(limit) || limit < 0) {
    limit = 1000
  }
  params.limit = Math.min(limit, 1000)
  const rows = await recursiveSearch(appId, query, params)
  return { rows }
}
