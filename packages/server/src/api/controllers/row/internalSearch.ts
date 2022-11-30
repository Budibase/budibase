import { SearchIndexes } from "../../../db/utils"
import { removeKeyNumbering } from "./utils"
import fetch from "node-fetch"
import { db as dbCore, context } from "@budibase/backend-core"
import { SearchFilters, Row } from "@budibase/types"

type SearchParams = {
  tableId: string
  sort?: string
  sortOrder?: string
  sortType?: string
  limit?: number
  bookmark?: string
  version?: string
  rows?: Row[]
}

/**
 * Class to build lucene query URLs.
 * Optionally takes a base lucene query object.
 */
export class QueryBuilder {
  query: SearchFilters
  limit: number
  sort?: string
  bookmark?: string
  sortOrder: string
  sortType: string
  includeDocs: boolean
  version?: string

  constructor(base?: SearchFilters) {
    this.query = {
      allOr: false,
      string: {},
      fuzzy: {},
      range: {},
      equal: {},
      notEqual: {},
      empty: {},
      notEmpty: {},
      oneOf: {},
      contains: {},
      notContains: {},
      containsAny: {},
      ...base,
    }
    this.limit = 50
    this.sortOrder = "ascending"
    this.sortType = "string"
    this.includeDocs = true
  }

  setVersion(version?: string) {
    if (version != null) {
      this.version = version
    }
    return this
  }

  setTable(tableId: string) {
    this.query.equal!.tableId = tableId
    return this
  }

  setLimit(limit?: number) {
    if (limit != null) {
      this.limit = limit
    }
    return this
  }

  setSort(sort?: string) {
    if (sort != null) {
      this.sort = sort
    }
    return this
  }

  setSortOrder(sortOrder?: string) {
    if (sortOrder != null) {
      this.sortOrder = sortOrder
    }
    return this
  }

  setSortType(sortType?: string) {
    if (sortType != null) {
      this.sortType = sortType
    }
    return this
  }

  setBookmark(bookmark?: string) {
    if (bookmark != null) {
      this.bookmark = bookmark
    }
    return this
  }

  excludeDocs() {
    this.includeDocs = false
    return this
  }

  addString(key: string, partial: string) {
    this.query.string![key] = partial
    return this
  }

  addFuzzy(key: string, fuzzy: string) {
    this.query.fuzzy![key] = fuzzy
    return this
  }

  addRange(key: string, low: string | number, high: string | number) {
    this.query.range![key] = {
      low,
      high,
    }
    return this
  }

  addEqual(key: string, value: any) {
    this.query.equal![key] = value
    return this
  }

  addNotEqual(key: string, value: any) {
    this.query.notEqual![key] = value
    return this
  }

  addEmpty(key: string, value: any) {
    this.query.empty![key] = value
    return this
  }

  addNotEmpty(key: string, value: any) {
    this.query.notEmpty![key] = value
    return this
  }

  addOneOf(key: string, value: any) {
    this.query.oneOf![key] = value
    return this
  }

  addContains(key: string, value: any) {
    this.query.contains![key] = value
    return this
  }

  addNotContains(key: string, value: any) {
    this.query.notContains![key] = value
    return this
  }

  addContainsAny(key: string, value: any) {
    this.query.containsAny![key] = value
    return this
  }

  /**
   * Preprocesses a value before going into a lucene search.
   * Transforms strings to lowercase and wraps strings and bools in quotes.
   * @param value The value to process
   * @param options The preprocess options
   * @returns {string|*}
   */
  preprocess(value: any, { escape, lowercase, wrap, type }: any = {}) {
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
    if (originalType === "string" && !isNaN(value) && !type) {
      value = `"${value}"`
    } else if (hasVersion && wrap) {
      value = originalType === "number" ? value : `"${value}"`
    }
    return value
  }

  buildSearchQuery() {
    const builder = this
    let allOr = this.query && this.query.allOr
    let query = allOr ? "" : "*:*"
    const allPreProcessingOpts = { escape: true, lowercase: true, wrap: true }
    let tableId
    if (this.query.equal!.tableId) {
      tableId = this.query.equal!.tableId
      delete this.query.equal!.tableId
    }

    const equal = (key: string, value: any) => {
      // 0 evaluates to false, which means we would return all rows if we don't check it
      if (!value && value !== 0) {
        return null
      }
      return `${key}:${builder.preprocess(value, allPreProcessingOpts)}`
    }

    const contains = (key: string, value: any, mode = "AND") => {
      if (Array.isArray(value) && value.length === 0) {
        return null
      }
      if (!Array.isArray(value)) {
        return `${key}:${value}`
      }
      let statement = `${builder.preprocess(value[0], { escape: true })}`
      for (let i = 1; i < value.length; i++) {
        statement += ` ${mode} ${builder.preprocess(value[i], {
          escape: true,
        })}`
      }
      return `${key}:(${statement})`
    }

    const notContains = (key: string, value: any) => {
      // @ts-ignore
      const allPrefix = allOr === "" ? "*:* AND" : ""
      return allPrefix + "NOT " + contains(key, value)
    }

    const containsAny = (key: string, value: any) => {
      return contains(key, value, "OR")
    }

    const oneOf = (key: string, value: any) => {
      if (!Array.isArray(value)) {
        if (typeof value === "string") {
          value = value.split(",")
        } else {
          return ""
        }
      }
      let orStatement = `${builder.preprocess(value[0], allPreProcessingOpts)}`
      for (let i = 1; i < value.length; i++) {
        orStatement += ` OR ${builder.preprocess(
          value[i],
          allPreProcessingOpts
        )}`
      }
      return `${key}:(${orStatement})`
    }

    function build(structure: any, queryFn: any) {
      for (let [key, value] of Object.entries(structure)) {
        // check for new format - remove numbering if needed
        key = removeKeyNumbering(key)
        key = builder.preprocess(key.replace(/ /g, "_"), {
          escape: true,
        })
        const expression = queryFn(key, value)
        if (expression == null) {
          continue
        }
        if (query.length > 0) {
          query += ` ${allOr ? "OR" : "AND"} `
        }
        query += expression
      }
    }

    // Construct the actual lucene search query string from JSON structure
    if (this.query.string) {
      build(this.query.string, (key: string, value: any) => {
        if (!value) {
          return null
        }
        value = builder.preprocess(value, {
          escape: true,
          lowercase: true,
          type: "string",
        })
        return `${key}:${value}*`
      })
    }
    if (this.query.range) {
      build(this.query.range, (key: string, value: any) => {
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
      build(this.query.fuzzy, (key: string, value: any) => {
        if (!value) {
          return null
        }
        value = builder.preprocess(value, {
          escape: true,
          lowercase: true,
          type: "fuzzy",
        })
        return `${key}:${value}~`
      })
    }
    if (this.query.equal) {
      build(this.query.equal, equal)
    }
    if (this.query.notEqual) {
      build(this.query.notEqual, (key: string, value: any) => {
        if (!value) {
          return null
        }
        return `!${key}:${builder.preprocess(value, allPreProcessingOpts)}`
      })
    }
    if (this.query.empty) {
      build(this.query.empty, (key: string) => `!${key}:["" TO *]`)
    }
    if (this.query.notEmpty) {
      build(this.query.notEmpty, (key: string) => `${key}:["" TO *]`)
    }
    if (this.query.oneOf) {
      build(this.query.oneOf, oneOf)
    }
    if (this.query.contains) {
      build(this.query.contains, contains)
    }
    if (this.query.notContains) {
      build(this.query.notContains, notContains)
    }
    if (this.query.containsAny) {
      build(this.query.containsAny, containsAny)
    }
    // make sure table ID is always added as an AND
    if (tableId) {
      query = `(${query})`
      allOr = false
      build({ tableId }, equal)
    }
    return query
  }

  buildSearchBody() {
    let body: any = {
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
      body.sort = `${order}${this.sort.replace(/ /g, "_")}${type}`
    }
    return body
  }

  async run() {
    const appId = context.getAppId()
    const { url, cookie } = dbCore.getCouchInfo()
    const fullPath = `${url}/${appId}/_design/database/_search/${SearchIndexes.ROWS}`
    const body = this.buildSearchBody()
    return await runQuery(fullPath, body, cookie)
  }
}

/**
 * Executes a lucene search query.
 * @param url The query URL
 * @param body The request body defining search criteria
 * @param cookie The auth cookie for CouchDB
 * @returns {Promise<{rows: []}>}
 */
const runQuery = async (url: string, body: any, cookie: string) => {
  const response = await fetch(url, {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      Authorization: cookie,
    },
  })
  const json = await response.json()

  let output: any = {
    rows: [],
  }
  if (json.rows != null && json.rows.length > 0) {
    output.rows = json.rows.map((row: any) => row.doc)
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
async function recursiveSearch(query: any, params: any): Promise<any> {
  const bookmark = params.bookmark
  const rows = params.rows || []
  if (rows.length >= params.limit) {
    return rows
  }
  let pageSize = 200
  if (rows.length > params.limit - 200) {
    pageSize = params.limit - rows.length
  }
  const page = await new QueryBuilder(query)
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
  return await recursiveSearch(query, newParams)
}

/**
 * Performs a paginated search. A bookmark will be returned to allow the next
 * page to be fetched. There is a max limit off 200 results per page in a
 * paginated search.
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
export async function paginatedSearch(
  query: SearchFilters,
  params: SearchParams
) {
  let limit = params.limit
  if (limit == null || isNaN(limit) || limit < 0) {
    limit = 50
  }
  limit = Math.min(limit, 200)
  const search = new QueryBuilder(query)
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
    .setTable(params.tableId)
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
export async function fullSearch(query: SearchFilters, params: SearchParams) {
  let limit = params.limit
  if (limit == null || isNaN(limit) || limit < 0) {
    limit = 1000
  }
  params.limit = Math.min(limit, 1000)
  const rows = await recursiveSearch(query, params)
  return { rows }
}
