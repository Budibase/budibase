import { writable, derived, get } from "svelte/store"
import { cloneDeep } from "lodash/fp"
import {
  buildLuceneQuery,
  luceneLimit,
  runLuceneQuery,
  luceneSort,
} from "../utils/lucene"
import { convertJSONSchemaToTableSchema } from "../utils/json"

/**
 * Parent class which handles the implementation of fetching data from an
 * internal table or datasource plus.
 * For other types of datasource, this class is overridden and extended.
 */
export default class DataFetch {
  /**
   * Constructs a new DataFetch instance.
   * @param opts the fetch options
   */
  constructor(opts) {
    // API client
    this.API = null

    // Feature flags
    this.featureStore = writable({
      supportsSearch: false,
      supportsSort: false,
      supportsPagination: false,
    })

    // Config
    this.options = {
      datasource: null,
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
    this.store = writable({
      rows: [],
      info: null,
      schema: null,
      loading: false,
      loaded: false,
      query: null,
      pageNumber: 0,
      cursor: null,
      cursors: [],
    })

    // Merge options with their default values
    this.API = opts?.API
    this.options = {
      ...this.options,
      ...opts,
    }
    if (!this.API) {
      throw "An API client is required for fetching data"
    }

    // Bind all functions to properly scope "this"
    this.getData = this.getData.bind(this)
    this.getPage = this.getPage.bind(this)
    this.getInitialData = this.getInitialData.bind(this)
    this.determineFeatureFlags = this.determineFeatureFlags.bind(this)
    this.refresh = this.refresh.bind(this)
    this.update = this.update.bind(this)
    this.hasNextPage = this.hasNextPage.bind(this)
    this.hasPrevPage = this.hasPrevPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.prevPage = this.prevPage.bind(this)

    // Derive certain properties to return
    this.derivedStore = derived(
      [this.store, this.featureStore],
      ([$store, $featureStore]) => {
        return {
          ...$store,
          ...$featureStore,
          hasNextPage: this.hasNextPage($store),
          hasPrevPage: this.hasPrevPage($store),
        }
      }
    )

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
    const { datasource, filter, paginate } = this.options

    // Fetch datasource definition and determine feature flags
    const definition = await this.getDefinition(datasource)
    const features = this.determineFeatureFlags(definition)
    this.featureStore.set({
      supportsSearch: !!features?.supportsSearch,
      supportsSort: !!features?.supportsSort,
      supportsPagination: paginate && !!features?.supportsPagination,
    })

    // Fetch and enrich schema
    let schema = this.getSchema(datasource, definition)
    schema = this.enrichSchema(schema)
    if (!schema) {
      return
    }

    // If no sort order, default to descending
    if (!this.options.sortOrder) {
      this.options.sortOrder = "ascending"
    }

    // If no sort column, use the first field in the schema
    if (!this.options.sortColumn) {
      this.options.sortColumn = Object.keys(schema)[0]
    }
    const { sortColumn } = this.options

    // Determine what sort type to use
    let sortType = "string"
    if (sortColumn) {
      const type = schema?.[sortColumn]?.type
      sortType = type === "number" ? "number" : "string"
    }
    this.options.sortType = sortType

    // Build the lucene query
    let query = this.options.query
    if (!query) {
      query = buildLuceneQuery(filter)
    }

    // Update store
    this.store.update($store => ({
      ...$store,
      definition,
      schema,
      query,
      loading: true,
      cursors: [],
      cursor: null,
    }))

    // Actually fetch data
    const page = await this.getPage()
    this.store.update($store => ({
      ...$store,
      loading: false,
      loaded: true,
      pageNumber: 0,
      rows: page.rows,
      info: page.info,
      cursors: paginate && page.hasNextPage ? [null, page.cursor] : [null],
      error: page.error,
    }))
  }

  /**
   * Fetches some filtered, sorted and paginated data
   */
  async getPage() {
    const { sortColumn, sortOrder, sortType, limit } = this.options
    const { query } = get(this.store)
    const features = get(this.featureStore)

    // Get the actual data
    let { rows, info, hasNextPage, cursor, error } = await this.getData()

    // If we don't support searching, do a client search
    if (!features.supportsSearch) {
      rows = runLuceneQuery(rows, query)
    }

    // If we don't support sorting, do a client-side sort
    if (!features.supportsSort) {
      rows = luceneSort(rows, sortColumn, sortOrder, sortType)
    }

    // If we don't support pagination, do a client-side limit
    if (!features.supportsPagination) {
      rows = luceneLimit(rows, limit)
    }

    return {
      rows,
      info,
      hasNextPage,
      cursor,
      error,
    }
  }

  /**
   * Fetches a single page of data from the remote resource.
   * Must be overridden by a datasource specific child class.
   */
  async getData() {
    return {
      rows: [],
      info: null,
      hasNextPage: false,
      cursor: null,
    }
  }

  /**
   * Gets the definition for this datasource.
   * Defaults to fetching a table definition.
   * @param datasource
   * @return {object} the definition
   */
  async getDefinition(datasource) {
    if (!datasource?.tableId) {
      return null
    }
    try {
      return await this.API.fetchTableDefinition(datasource.tableId)
    } catch (error) {
      return null
    }
  }

  /**
   * Gets the schema definition for a datasource.
   * Defaults to getting the "schema" property of the definition.
   * @param datasource the datasource
   * @param definition the datasource definition
   * @return {object} the schema
   */
  getSchema(datasource, definition) {
    return definition?.schema
  }

  /**
   * Enriches a datasource schema with nested fields and ensures the structure
   * is correct.
   * @param schema the datasource schema
   * @return {object} the enriched datasource schema
   */
  enrichSchema(schema) {
    if (schema == null) {
      return null
    }

    // Check for any JSON fields so we can add any top level properties
    let jsonAdditions = {}
    Object.keys(schema).forEach(fieldKey => {
      const fieldSchema = schema[fieldKey]
      if (fieldSchema?.type === "json") {
        const jsonSchema = convertJSONSchemaToTableSchema(fieldSchema, {
          squashObjects: true,
        })
        Object.keys(jsonSchema).forEach(jsonKey => {
          jsonAdditions[`${fieldKey}.${jsonKey}`] = {
            type: jsonSchema[jsonKey].type,
            nestedJSON: true,
          }
        })
      }
    })
    schema = { ...schema, ...jsonAdditions }

    // Ensure schema is in the correct structure
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
   * Determine the feature flag for this datasource definition
   * @param definition
   */
  // eslint-disable-next-line no-unused-vars
  determineFeatureFlags(definition) {
    return {
      supportsSearch: false,
      supportsSort: false,
      supportsPagination: false,
    }
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

    // Assign new options and reload data.
    // Clone the new options to ensure that some external source doesn't end up
    // mutating the real values in the config.
    this.options = {
      ...this.options,
      ...cloneDeep(newOptions),
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
    this.store.update($store => ({ ...$store, loading: true }))
    const { rows, info, error } = await this.getPage()
    this.store.update($store => ({
      ...$store,
      rows,
      info,
      loading: false,
      error,
    }))
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
      pageNumber: $store.pageNumber + 1,
    }))
    const { rows, info, hasNextPage, cursor, error } = await this.getPage()

    // Update state
    this.store.update($store => {
      let { cursors, pageNumber } = $store
      if (hasNextPage) {
        cursors[pageNumber + 1] = cursor
      }
      return {
        ...$store,
        rows,
        info,
        cursors,
        loading: false,
        error,
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
      pageNumber: $store.pageNumber - 1,
    }))
    const { rows, info, error } = await this.getPage()

    // Update state
    this.store.update($store => {
      return {
        ...$store,
        rows,
        info,
        loading: false,
        error,
      }
    })
  }
}
