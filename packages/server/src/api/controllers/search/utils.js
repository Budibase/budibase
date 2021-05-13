const { SearchIndexes } = require("../../../db/utils")
const { checkSlashesInUrl } = require("../../../utilities")
const env = require("../../../environment")
const fetch = require("node-fetch")

const luceneEscape = value => {
  return `${value}`.replace(/[ #+\-&|!(){}\[\]^"~*?:\\]/g, "\\$&")
}

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

  buildSearchURL(excludeDocs = false) {
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

    let url = `${env.COUCH_DB_URL}/${this.appId}/_design/database/_search`
    url += `/${SearchIndexes.ROWS}?q=${output}`
    url += `&limit=${Math.min(this.limit, 200)}`
    if (!excludeDocs) {
      url += "&include_docs=true"
    }
    if (this.sort) {
      const orderChar = this.sortOrder === "descending" ? "-" : ""
      url += `&sort="${orderChar}${this.sort.replace(/ /, "_")}<${
        this.sortType
      }>"`
    }
    if (this.bookmark) {
      url += `&bookmark=${this.bookmark}`
    }
    console.log(url)
    return checkSlashesInUrl(url)
  }
}

const runQuery = async query => {
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

const recursiveSearch = async (
  appId,
  query,
  tableId,
  sort,
  sortOrder,
  sortType,
  limit,
  bookmark,
  rows
) => {
  if (rows.length >= limit) {
    return rows
  }
  const pageSize = rows.length > limit - 200 ? limit - rows.length : 200
  const url = new QueryBuilder(appId, query)
    .setTable(tableId)
    .setBookmark(bookmark)
    .setLimit(pageSize)
    .setSort(sort)
    .setSortOrder(sortOrder)
    .setSortType(sortType)
    .buildSearchURL()
  const page = await runQuery(url)
  if (!page.rows.length) {
    return rows
  }
  if (page.rows.length < 200) {
    return [...rows, ...page.rows]
  }
  return await recursiveSearch(
    appId,
    query,
    tableId,
    sort,
    sortOrder,
    sortType,
    limit,
    page.bookmark,
    [...rows, ...page.rows]
  )
}

exports.paginatedSearch = async (
  appId,
  query,
  tableId,
  sort,
  sortOrder,
  sortType,
  limit,
  bookmark
) => {
  if (limit == null || isNaN(limit) || limit < 0) {
    limit = 50
  }
  const builder = new QueryBuilder(appId, query)
    .setTable(tableId)
    .setSort(sort)
    .setSortOrder(sortOrder)
    .setSortType(sortType)
  const searchUrl = builder
    .setBookmark(bookmark)
    .setLimit(limit)
    .buildSearchURL()
  const searchResults = await runQuery(searchUrl)
  const nextUrl = builder
    .setBookmark(searchResults.bookmark)
    .setLimit(1)
    .buildSearchURL()
  const nextResults = await runQuery(nextUrl)
  return {
    ...searchResults,
    hasNextPage: nextResults.rows && nextResults.rows.length > 0,
  }
}

exports.fullSearch = async (
  appId,
  query,
  tableId,
  sort,
  sortOrder,
  sortType,
  limit
) => {
  if (limit == null || isNaN(limit) || limit < 0) {
    limit = 1000
  }
  const rows = await recursiveSearch(
    appId,
    query,
    tableId,
    sort,
    sortOrder,
    sortType,
    Math.min(limit, 1000),
    null,
    []
  )
  return { rows }
}
