import { writable, derived, get } from "svelte/store"
import * as API from "api"
import { buildLuceneQuery } from "builder/src/helpers/lucene"
import { fetchTableDefinition } from "api"

/**
 * Parent class which handles the implementation of fetching data from an
 * internal table or datasource plus.
 * For other types of datasource, this class is overridden and extended.
 */
export default class TableFetch {
  SupportsSearch = true
  SupportsSort = true
  SupportsPagination = true

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
    const { datasource, filter } = this.options
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

    // Build the lucene query
    let query = this.options.query
    if (!query) {
      query = buildLuceneQuery(filter)
    }

    // Update store
    this.store.update($store => ({ ...$store, schema, query, loading: true }))

    // Actually fetch data
    const page = await this.getData()
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
   * Fetches a single page of data from the remote resource
   */
  async getData() {
    const { datasource, limit, sortColumn, sortOrder, paginate } = this.options
    const { tableId } = datasource
    const { cursor, schema, query } = get(this.store)

    // Work out what sort type to use
    const type = schema?.[sortColumn]?.type
    const sortType = type === "number" ? "number" : "string"

    // Search table
    const res = await API.searchTable({
      tableId,
      query,
      limit,
      sort: sortColumn,
      sortOrder: sortOrder?.toLowerCase() ?? "ascending",
      sortType,
      paginate,
      bookmark: cursor,
    })
    return {
      rows: res?.rows || [],
      hasNextPage: res?.hasNextPage || false,
      cursor: res?.bookmark || null,
    }
  }

  /**
   * Gets the schema definition for a table
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
    const { rows } = await this.getData()
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
    const { rows, hasNextPage, cursor } = await this.getData()

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
    const { rows } = await this.getData()

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
