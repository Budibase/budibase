import { writable, derived, get } from "svelte/store"
import {
  buildLuceneQuery,
  luceneLimit,
  luceneQuery,
  luceneSort,
} from "builder/src/helpers/lucene"
import { fetchTableDefinition } from "api"

/**
 * Parent class which handles the implementation of fetching data from an
 * internal table or datasource plus.
 * For other types of datasource, this class is overridden and extended.
 */
export default class TableFetch {
  SupportsSearch = false
  SupportsSort = false
  SupportsPagination = false

  // Config
  options = {
    datasource: null,
    schema: null,
    limit: 10,

    // Search config
    filter: null,
    query: null,

    // Sorting config
    sortColumn: null,
    sortOrder: "ascending",
    sortType: null,

    // Pagination config
    paginate: true,
  }

  // State of the fetch
  store = writable({
    rows: [],
    schema: null,
    loading: false,
    loaded: false,
    query: null,
    pageNumber: 0,
    cursor: null,
    cursors: [],
  })

  /**
   * Constructs a new DataFetch instance.
   * @param opts the fetch options
   */
  constructor(opts) {
    this.options = {
      ...this.options,
      ...opts,
    }

    // Bind all functions to properly scope "this"
    this.getData = this.getData.bind(this)
    this.getInitialData = this.getInitialData.bind(this)
    this.refresh = this.refresh.bind(this)
    this.update = this.update.bind(this)
    this.hasNextPage = this.hasNextPage.bind(this)
    this.hasPrevPage = this.hasPrevPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.prevPage = this.prevPage.bind(this)

    // Derive certain properties to return
    this.derivedStore = derived(this.store, $store => {
      return {
        ...$store,
        hasNextPage: this.hasNextPage($store),
        hasPrevPage: this.hasPrevPage($store),
      }
    })

    // Mark as loaded if we have no datasource
    if (!this.options.datasource) {
      this.store.update($store => ({ ...$store, loaded: true }))
      return
    }

    // Initially fetch data but don't bother waiting for the result
    this.getInitialData()
  }

  /**
   * Extend the svelte store subscribe method to that instances of this class
   * can be treated like stores
   */
  get subscribe() {
    return this.derivedStore.subscribe
  }

  /**
   * Fetches a fresh set of data from the server, resetting pagination
   */
  async getInitialData() {
    const { datasource, filter, sortColumn } = this.options
    const tableId = datasource?.tableId

    // Ensure table ID exists
    if (!tableId) {
      return
    }

    // Ensure schema exists and enrich it
    let schema = this.options.schema
    if (!schema) {
      schema = await this.constructor.getSchema(datasource)
    }
    if (!schema) {
      return
    }

    // Determine what sort type to use
    if (!this.options.sortType) {
      let sortType = "string"
      if (sortColumn) {
        const type = schema?.[sortColumn]?.type
        sortType = type === "number" ? "number" : "string"
      }
      this.options.sortType = sortType
    }

    // Build the lucene query
    let query = this.options.query
    if (!query) {
      query = buildLuceneQuery(filter)
    }

    // Update store
    this.store.update($store => ({ ...$store, schema, query, loading: true }))

    // Actually fetch data
    const page = await this.getPage()
    this.store.update($store => ({
      ...$store,
      loading: false,
      loaded: true,
      pageNumber: 0,
      rows: page.rows,
      cursors: page.hasNextPage ? [null, page.cursor] : [null],
    }))
  }

  /**
   * Fetches some filtered, sorted and paginated data
   */
  async getPage() {
    const { sortColumn, sortOrder, sortType, limit } = this.options
    const { query } = get(this.store)

    // Get the actual data
    let { rows, hasNextPage, cursor } = await this.getData()

    // If we don't support searching, do a client search
    if (!this.SupportsSearch) {
      rows = luceneQuery(rows, query)
    }

    // If we don't support sorting, do a client-side sort
    if (!this.SupportsSort) {
      rows = luceneSort(rows, sortColumn, sortOrder, sortType)
    }

    // If we don't support pagination, do a client-side limit
    if (!this.SupportsPagination) {
      rows = luceneLimit(rows, limit)
    }

    return {
      rows,
      hasNextPage,
      cursor,
    }
  }

  /**
   * Fetches a single page of data from the remote resource.
   * Must be overridden by a datasource specific child class.
   */
  async getData() {
    return {
      rows: [],
      hasNextPage: false,
      cursor: null,
    }
  }

  /**
   * Gets the schema definition for a datasource.
   * Defaults to fetching a table definition.
   * @param datasource the datasource definition
   * @return {object} the schema
   */
  static async getSchema(datasource) {
    if (!datasource?.tableId) {
      return null
    }
    const table = await fetchTableDefinition(datasource.tableId)
    return this.enrichSchema(table?.schema)
  }

  /**
   * Enriches the schema and ensures that entries are objects with names
   * @param schema the datasource schema
   * @return {object} the enriched datasource schema
   */
  static enrichSchema(schema) {
    if (schema == null) {
      return null
    }
    let enrichedSchema = {}
    Object.entries(schema).forEach(([fieldName, fieldSchema]) => {
      if (typeof fieldSchema === "string") {
        enrichedSchema[fieldName] = {
          type: fieldSchema,
          name: fieldName,
        }
      } else {
        enrichedSchema[fieldName] = {
          ...fieldSchema,
          name: fieldName,
        }
      }
    })
    return enrichedSchema
  }

  /**
   * Resets the data set and updates options
   * @param newOptions any new options
   */
  async update(newOptions) {
    // Check if any settings have actually changed
    let refresh = false
    const entries = Object.entries(newOptions || {})
    for (let [key, value] of entries) {
      if (JSON.stringify(value) !== JSON.stringify(this.options[key])) {
        refresh = true
        break
      }
    }
    if (!refresh) {
      return
    }

    // Assign new options and reload data
    this.options = {
      ...this.options,
      ...newOptions,
    }
    await this.getInitialData()
  }

  /**
   * Loads the same page again
   */
  async refresh() {
    if (get(this.store).loading) {
      return
    }
    const { rows } = await this.getPage()
    this.store.update($store => ({ ...$store, loading: true }))
    this.store.update($store => ({ ...$store, rows, loading: false }))
  }

  /**
   * Determines whether there is a next page of data based on the state of the
   * store
   * @param state the current store state
   * @return {boolean} whether there is a next page of data or not
   */
  hasNextPage(state) {
    return state.cursors[state.pageNumber + 1] != null
  }

  /**
   * Determines whether there is a previous page of data based on the state of
   * the store
   * @param state the current store state
   * @return {boolean} whether there is a previous page of data or not
   */
  hasPrevPage(state) {
    return state.pageNumber > 0
  }

  /**
   * Fetches the next page of data
   */
  async nextPage() {
    const state = get(this.derivedStore)
    if (state.loading || !this.options.paginate || !state.hasNextPage) {
      return
    }

    // Fetch next page
    const nextCursor = state.cursors[state.pageNumber + 1]
    this.store.update($store => ({
      ...$store,
      loading: true,
      cursor: nextCursor,
    }))
    const { rows, hasNextPage, cursor } = await this.getPage()

    // Update state
    this.store.update($store => {
      let { cursors, pageNumber } = $store
      if (hasNextPage) {
        cursors[pageNumber + 2] = cursor
      }
      return {
        ...$store,
        pageNumber: pageNumber + 1,
        rows,
        cursors,
        loading: false,
      }
    })
  }

  /**
   * Fetches the previous page of data
   */
  async prevPage() {
    const state = get(this.derivedStore)
    if (state.loading || !this.options.paginate || !state.hasPrevPage) {
      return
    }

    // Fetch previous page
    const prevCursor = state.cursors[state.pageNumber - 1]
    this.store.update($store => ({
      ...$store,
      loading: true,
      cursor: prevCursor,
    }))
    const { rows } = await this.getPage()

    // Update state
    this.store.update($store => {
      return {
        ...$store,
        pageNumber: $store.pageNumber - 1,
        rows,
        loading: false,
      }
    })
  }
}
