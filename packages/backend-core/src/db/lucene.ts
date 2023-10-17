import fetch from "node-fetch"
import { getCouchInfo } from "./couch"
import { SearchFilters, Row, EmptyFilterOption } from "@budibase/types"

const QUERY_START_REGEX = /\d[0-9]*:/g

interface SearchResponse<T> {
  rows: T[] | any[]
  bookmark?: string
  totalRows: number
}

interface PaginatedSearchResponse<T> extends SearchResponse<T> {
  hasNextPage: boolean
}

export type SearchParams<T> = {
  tableId?: string
  sort?: string
  sortOrder?: string
  sortType?: string
  limit?: number
  bookmark?: string
  version?: string
  indexer?: () => Promise<any>
  disableEscaping?: boolean
  rows?: T | Row[]
}

export function removeKeyNumbering(key: any): string {
  if (typeof key === "string" && key.match(QUERY_START_REGEX) != null) {
    const parts = key.split(":")
    // remove the number
    parts.shift()
    return parts.join(":")
  } else {
    return key
  }
}

/**
 * Class to build lucene query URLs.
 * Optionally takes a base lucene query object.
 */
export class QueryBuilder<T> {
  #dbName: string
  #index: string
  #query: SearchFilters
  #limit: number
  #sort?: string
  #bookmark?: string
  #sortOrder: string
  #sortType: string
  #includeDocs: boolean
  #version?: string
  #indexBuilder?: () => Promise<any>
  #noEscaping = false
  #skip?: number

  static readonly maxLimit = 200

  constructor(dbName: string, index: string, base?: SearchFilters) {
    this.#dbName = dbName
    this.#index = index
    this.#query = {
      allOr: false,
      onEmptyFilter: EmptyFilterOption.RETURN_ALL,
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
    this.#limit = 50
    this.#sortOrder = "ascending"
    this.#sortType = "string"
    this.#includeDocs = true
  }

  disableEscaping() {
    this.#noEscaping = true
    return this
  }

  setIndexBuilder(builderFn: () => Promise<any>) {
    this.#indexBuilder = builderFn
    return this
  }

  setVersion(version?: string) {
    if (version != null) {
      this.#version = version
    }
    return this
  }

  setTable(tableId: string) {
    this.#query.equal!.tableId = tableId
    return this
  }

  setLimit(limit?: number) {
    if (limit != null) {
      this.#limit = limit
    }
    return this
  }

  setSort(sort?: string) {
    if (sort != null) {
      this.#sort = sort
    }
    return this
  }

  setSortOrder(sortOrder?: string) {
    if (sortOrder != null) {
      this.#sortOrder = sortOrder
    }
    return this
  }

  setSortType(sortType?: string) {
    if (sortType != null) {
      this.#sortType = sortType
    }
    return this
  }

  setBookmark(bookmark?: string) {
    if (bookmark != null) {
      this.#bookmark = bookmark
    }
    return this
  }

  setSkip(skip: number | undefined) {
    this.#skip = skip
    return this
  }

  excludeDocs() {
    this.#includeDocs = false
    return this
  }

  includeDocs() {
    this.#includeDocs = true
    return this
  }

  addString(key: string, partial: string) {
    this.#query.string![key] = partial
    return this
  }

  addFuzzy(key: string, fuzzy: string) {
    this.#query.fuzzy![key] = fuzzy
    return this
  }

  addRange(key: string, low: string | number, high: string | number) {
    this.#query.range![key] = {
      low,
      high,
    }
    return this
  }

  addEqual(key: string, value: any) {
    this.#query.equal![key] = value
    return this
  }

  addNotEqual(key: string, value: any) {
    this.#query.notEqual![key] = value
    return this
  }

  addEmpty(key: string, value: any) {
    this.#query.empty![key] = value
    return this
  }

  addNotEmpty(key: string, value: any) {
    this.#query.notEmpty![key] = value
    return this
  }

  addOneOf(key: string, value: any) {
    this.#query.oneOf![key] = value
    return this
  }

  addContains(key: string, value: any) {
    this.#query.contains![key] = value
    return this
  }

  addNotContains(key: string, value: any) {
    this.#query.notContains![key] = value
    return this
  }

  addContainsAny(key: string, value: any) {
    this.#query.containsAny![key] = value
    return this
  }

  setAllOr() {
    this.#query.allOr = true
  }

  setOnEmptyFilter(value: EmptyFilterOption) {
    this.#query.onEmptyFilter = value
  }

  handleSpaces(input: string) {
    if (this.#noEscaping) {
      return input
    } else {
      return input.replace(/ /g, "_")
    }
  }

  /**
   * Preprocesses a value before going into a lucene search.
   * Transforms strings to lowercase and wraps strings and bools in quotes.
   * @param value The value to process
   * @param options The preprocess options
   * @returns {string|*}
   */
  preprocess(value: any, { escape, lowercase, wrap, type }: any = {}) {
    const hasVersion = !!this.#version
    // Determine if type needs wrapped
    const originalType = typeof value
    // Convert to lowercase
    if (value && lowercase) {
      value = value.toLowerCase ? value.toLowerCase() : value
    }
    // Escape characters
    if (!this.#noEscaping && escape && originalType === "string") {
      value = `${value}`.replace(/[ \/#+\-&|!(){}\]^"~*?:\\]/g, "\\$&")
    }

    // Wrap in quotes
    if (originalType === "string" && !isNaN(value) && !type) {
      value = `"${value}"`
    } else if (hasVersion && wrap) {
      value = originalType === "number" ? value : `"${value}"`
    }
    return value
  }

  isMultiCondition() {
    let count = 0
    for (let filters of Object.values(this.#query)) {
      // not contains is one massive filter in allOr mode
      if (typeof filters === "object") {
        count += Object.keys(filters).length
      }
    }
    return count > 1
  }

  compressFilters(filters: Record<string, string[]>) {
    const compressed: typeof filters = {}
    for (let key of Object.keys(filters)) {
      const finalKey = removeKeyNumbering(key)
      if (compressed[finalKey]) {
        compressed[finalKey] = compressed[finalKey].concat(filters[key])
      } else {
        compressed[finalKey] = filters[key]
      }
    }
    // add prefixes back
    const final: typeof filters = {}
    let count = 1
    for (let [key, value] of Object.entries(compressed)) {
      final[`${count++}:${key}`] = value
    }
    return final
  }

  buildSearchQuery() {
    const builder = this
    let allOr = this.#query && this.#query.allOr
    let query = allOr ? "" : "*:*"
    let allFiltersEmpty = true
    const allPreProcessingOpts = { escape: true, lowercase: true, wrap: true }
    let tableId: string = ""
    if (this.#query.equal!.tableId) {
      tableId = this.#query.equal!.tableId
      delete this.#query.equal!.tableId
    }

    const equal = (key: string, value: any) => {
      // 0 evaluates to false, which means we would return all rows if we don't check it
      if (!value && value !== 0) {
        return null
      }
      return `${key}:${builder.preprocess(value, allPreProcessingOpts)}`
    }

    const contains = (key: string, value: any, mode = "AND") => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
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

    const fuzzy = (key: string, value: any) => {
      if (!value) {
        return null
      }
      value = builder.preprocess(value, {
        escape: true,
        lowercase: true,
        type: "fuzzy",
      })
      return `${key}:/.*${value}.*/`
    }

    const notContains = (key: string, value: any) => {
      const allPrefix = allOr ? "*:* AND " : ""
      const mode = allOr ? "AND" : undefined
      return allPrefix + "NOT " + contains(key, value, mode)
    }

    const containsAny = (key: string, value: any) => {
      return contains(key, value, "OR")
    }

    const oneOf = (key: string, value: any) => {
      if (!value) {
        return `*:*`
      }
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

    function build(
      structure: any,
      queryFn: (key: string, value: any) => string | null,
      opts?: { returnBuilt?: boolean; mode?: string }
    ) {
      let built = ""
      for (let [key, value] of Object.entries(structure)) {
        // check for new format - remove numbering if needed
        key = removeKeyNumbering(key)
        key = builder.preprocess(builder.handleSpaces(key), {
          escape: true,
        })
        let expression = queryFn(key, value)
        if (expression == null) {
          continue
        }
        if (built.length > 0 || query.length > 0) {
          const mode = opts?.mode ? opts.mode : allOr ? "OR" : "AND"
          built += ` ${mode} `
        }
        built += expression
        if (
          (typeof value !== "string" && value != null) ||
          (typeof value === "string" && value !== tableId && value !== "")
        ) {
          allFiltersEmpty = false
        }
      }
      if (opts?.returnBuilt) {
        return built
      } else {
        query += built
      }
    }

    // Construct the actual lucene search query string from JSON structure
    if (this.#query.string) {
      build(this.#query.string, (key: string, value: any) => {
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
    if (this.#query.range) {
      build(this.#query.range, (key: string, value: any) => {
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
    if (this.#query.fuzzy) {
      build(this.#query.fuzzy, fuzzy)
    }
    if (this.#query.equal) {
      build(this.#query.equal, equal)
    }
    if (this.#query.notEqual) {
      build(this.#query.notEqual, (key: string, value: any) => {
        if (!value) {
          return null
        }
        if (typeof value === "boolean") {
          return `(*:* AND !${key}:${value})`
        }
        return `!${key}:${builder.preprocess(value, allPreProcessingOpts)}`
      })
    }
    if (this.#query.empty) {
      build(this.#query.empty, (key: string) => `(*:* -${key}:["" TO *])`)
    }
    if (this.#query.notEmpty) {
      build(this.#query.notEmpty, (key: string) => `${key}:["" TO *]`)
    }
    if (this.#query.oneOf) {
      build(this.#query.oneOf, oneOf)
    }
    if (this.#query.contains) {
      build(this.#query.contains, contains)
    }
    if (this.#query.notContains) {
      build(this.compressFilters(this.#query.notContains), notContains)
    }
    if (this.#query.containsAny) {
      build(this.#query.containsAny, containsAny)
    }
    // make sure table ID is always added as an AND
    if (tableId) {
      query = this.isMultiCondition() ? `(${query})` : query
      allOr = false
      build({ tableId }, equal)
    }
    if (allFiltersEmpty) {
      if (this.#query.onEmptyFilter === EmptyFilterOption.RETURN_NONE) {
        return ""
      } else if (this.#query?.allOr) {
        return query.replace("()", "(*:*)")
      }
    }
    return query
  }

  buildSearchBody() {
    let body: any = {
      q: this.buildSearchQuery(),
      limit: Math.min(this.#limit, QueryBuilder.maxLimit),
      include_docs: this.#includeDocs,
    }
    if (this.#bookmark) {
      body.bookmark = this.#bookmark
    }
    if (this.#sort) {
      const order = this.#sortOrder === "descending" ? "-" : ""
      const type = `<${this.#sortType}>`
      body.sort = `${order}${this.handleSpaces(this.#sort)}${type}`
    }
    return body
  }

  async run() {
    if (this.#skip) {
      await this.#skipItems(this.#skip)
    }
    return await this.#execute()
  }

  /**
   * Lucene queries do not support pagination and use bookmarks instead.
   * For the given builder, walk through pages using bookmarks until the desired
   * page has been met.
   */
  async #skipItems(skip: number) {
    // Lucene does not support pagination.
    // Handle pagination by finding the right bookmark
    const prevIncludeDocs = this.#includeDocs
    const prevLimit = this.#limit

    this.excludeDocs()
    let skipRemaining = skip
    let iterationFetched = 0
    do {
      const toSkip = Math.min(QueryBuilder.maxLimit, skipRemaining)
      this.setLimit(toSkip)
      const { bookmark, rows } = await this.#execute()
      this.setBookmark(bookmark)
      iterationFetched = rows.length
      skipRemaining -= rows.length
    } while (skipRemaining > 0 && iterationFetched > 0)

    this.#includeDocs = prevIncludeDocs
    this.#limit = prevLimit
  }

  async #execute() {
    const { url, cookie } = getCouchInfo()
    const fullPath = `${url}/${this.#dbName}/_design/database/_search/${
      this.#index
    }`
    const body = this.buildSearchBody()
    try {
      return await runQuery<T>(fullPath, body, cookie)
    } catch (err: any) {
      if (err.status === 404 && this.#indexBuilder) {
        await this.#indexBuilder()
        return await runQuery<T>(fullPath, body, cookie)
      } else {
        throw err
      }
    }
  }
}

/**
 * Executes a lucene search query.
 * @param url The query URL
 * @param body The request body defining search criteria
 * @param cookie The auth cookie for CouchDB
 * @returns {Promise<{rows: []}>}
 */
async function runQuery<T>(
  url: string,
  body: any,
  cookie: string
): Promise<SearchResponse<T>> {
  const response = await fetch(url, {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      Authorization: cookie,
    },
  })

  if (response.status === 404) {
    throw response
  }
  const json = await response.json()

  let output: SearchResponse<T> = {
    rows: [],
    totalRows: 0,
  }
  if (json.rows != null && json.rows.length > 0) {
    output.rows = json.rows.map((row: any) => row.doc)
  }
  if (json.bookmark) {
    output.bookmark = json.bookmark
  }
  if (json.total_rows) {
    output.totalRows = json.total_rows
  }
  return output
}

/**
 * Gets round the fixed limit of 200 results from a query by fetching as many
 * pages as required and concatenating the results. This recursively operates
 * until enough results have been found.
 * @param dbName {string} Which database to run a lucene query on
 * @param index {string} Which search index to utilise
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
async function recursiveSearch<T>(
  dbName: string,
  index: string,
  query: any,
  params: any
): Promise<any> {
  const bookmark = params.bookmark
  const rows = params.rows || []
  if (rows.length >= params.limit) {
    return rows
  }
  let pageSize = QueryBuilder.maxLimit
  if (rows.length > params.limit - QueryBuilder.maxLimit) {
    pageSize = params.limit - rows.length
  }
  const page = await new QueryBuilder<T>(dbName, index, query)
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
  if (page.rows.length < QueryBuilder.maxLimit) {
    return [...rows, ...page.rows]
  }
  const newParams = {
    ...params,
    bookmark: page.bookmark,
    rows: [...rows, ...page.rows],
  }
  return await recursiveSearch(dbName, index, query, newParams)
}

/**
 * Performs a paginated search. A bookmark will be returned to allow the next
 * page to be fetched. There is a max limit off 200 results per page in a
 * paginated search.
 * @param dbName {string} Which database to run a lucene query on
 * @param index {string} Which search index to utilise
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
export async function paginatedSearch<T>(
  dbName: string,
  index: string,
  query: SearchFilters,
  params: SearchParams<T>
) {
  let limit = params.limit
  if (limit == null || isNaN(limit) || limit < 0) {
    limit = 50
  }
  limit = Math.min(limit, QueryBuilder.maxLimit)
  const search = new QueryBuilder<T>(dbName, index, query)
  if (params.version) {
    search.setVersion(params.version)
  }
  if (params.tableId) {
    search.setTable(params.tableId)
  }
  if (params.sort) {
    search
      .setSort(params.sort)
      .setSortOrder(params.sortOrder)
      .setSortType(params.sortType)
  }
  if (params.indexer) {
    search.setIndexBuilder(params.indexer)
  }
  if (params.disableEscaping) {
    search.disableEscaping()
  }
  const searchResults = await search
    .setBookmark(params.bookmark)
    .setLimit(limit)
    .run()

  // Try fetching 1 row in the next page to see if another page of results
  // exists or not
  search.setBookmark(searchResults.bookmark).setLimit(1)
  if (params.tableId) {
    search.setTable(params.tableId)
  }
  const nextResults = await search.run()

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
 * @param dbName {string} Which database to run a lucene query on
 * @param index {string} Which search index to utilise
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
export async function fullSearch<T>(
  dbName: string,
  index: string,
  query: SearchFilters,
  params: SearchParams<T>
) {
  let limit = params.limit
  if (limit == null || isNaN(limit) || limit < 0) {
    limit = 1000
  }
  params.limit = Math.min(limit, 1000)
  const rows = await recursiveSearch<T>(dbName, index, query, params)
  return { rows }
}
