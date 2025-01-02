import { writable, derived, get, Writable, Readable } from "svelte/store"
import { cloneDeep } from "lodash/fp"
import { QueryUtils } from "../utils"
import { convertJSONSchemaToTableSchema } from "../utils/json"
import {
  FieldType,
  LegacyFilter,
  SearchFilters,
  SortOrder,
  SortType,
  TableSchema,
  UIDatasource,
  UIFetchAPI,
  UIRow,
  UISearchFilter,
} from "@budibase/types"

const { buildQuery, limit: queryLimit, runQuery, sort } = QueryUtils

interface DataFetchStore<T> {
  rows: UIRow[]
  info: null
  schema: TableSchema | null
  loading: boolean
  loaded: boolean
  query: SearchFilters | null
  pageNumber: number
  cursor: null
  cursors: any[]
  resetKey: number
  error: null
  definition?: T | null
}

interface DataFetchDerivedStore<T> extends DataFetchStore<T> {
  hasNextPage: boolean
  hasPrevPage: boolean
  supportsSearch: boolean
  supportsSort: boolean
  supportsPagination: boolean
}

/**
 * Parent class which handles the implementation of fetching data from an
 * internal table or datasource plus.
 * For other types of datasource, this class is overridden and extended.
 */
export default abstract class DataFetch<
  TDatasource extends UIDatasource | null,
  TDefinition extends { primaryDisplay?: string }
> {
  API: UIFetchAPI
  features: {
    supportsSearch: boolean
    supportsSort: boolean
    supportsPagination: boolean
  }
  options: {
    datasource: TDatasource
    limit: number
    // Search config
    filter: UISearchFilter | LegacyFilter[] | null
    query: SearchFilters | null
    // Sorting config
    sortColumn: string | null
    sortOrder: SortOrder
    sortType: SortType | null
    // Pagination config
    paginate: boolean
    // Client side feature customisation
    clientSideSearching: boolean
    clientSideSorting: boolean
    clientSideLimiting: boolean
  }
  store: Writable<DataFetchStore<TDefinition>>
  derivedStore: Readable<DataFetchDerivedStore<TDefinition>>

  /**
   * Constructs a new DataFetch instance.
   * @param opts the fetch options
   */
  constructor(opts: {
    API: UIFetchAPI
    datasource: TDatasource
    options?: {}
  }) {
    // Feature flags
    this.features = {
      supportsSearch: false,
      supportsSort: false,
      supportsPagination: false,
    }

    // Config
    this.options = {
      datasource: opts.datasource,
      limit: 10,

      // Search config
      filter: null,
      query: null,

      // Sorting config
      sortColumn: null,
      sortOrder: SortOrder.ASCENDING,
      sortType: null,

      // Pagination config
      paginate: true,

      // Client side feature customisation
      clientSideSearching: true,
      clientSideSorting: true,
      clientSideLimiting: true,
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
      resetKey: Math.random(),
      error: null,
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
    this.derivedStore = derived(this.store, $store => {
      return {
        ...$store,
        ...this.features,
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
   * Gets the default sort column for this datasource
   */
  getDefaultSortColumn(
    definition: { primaryDisplay?: string } | null,
    schema: Record<string, any>
  ): string | null {
    if (definition?.primaryDisplay && schema[definition.primaryDisplay]) {
      return definition.primaryDisplay
    } else {
      return Object.keys(schema)[0]
    }
  }

  /**
   * Fetches a fresh set of data from the server, resetting pagination
   */
  async getInitialData() {
    const { datasource, filter, paginate } = this.options

    // Fetch datasource definition and extract sort properties if configured
    const definition = await this.getDefinition(datasource)

    // Determine feature flags
    const features = this.determineFeatureFlags(definition)
    this.features = {
      supportsSearch: !!features?.supportsSearch,
      supportsSort: !!features?.supportsSort,
      supportsPagination: paginate && !!features?.supportsPagination,
    }

    // Fetch and enrich schema
    let schema = this.getSchema(datasource, definition) ?? null
    schema = this.enrichSchema(schema)
    if (!schema) {
      return
    }

    // If an invalid sort column is specified, delete it
    if (this.options.sortColumn && !schema[this.options.sortColumn]) {
      this.options.sortColumn = null
    }

    // If no sort column, get the default column for this datasource
    if (!this.options.sortColumn) {
      this.options.sortColumn = this.getDefaultSortColumn(definition, schema)
    }

    // If we don't have a sort column specified then just ensure we don't set
    // any sorting params
    if (!this.options.sortColumn) {
      this.options.sortOrder = SortOrder.ASCENDING
      this.options.sortType = null
    } else {
      // Otherwise determine what sort type to use base on sort column
      this.options.sortType = SortType.STRING
      const fieldSchema = schema?.[this.options.sortColumn]
      if (
        fieldSchema?.type === FieldType.NUMBER ||
        fieldSchema?.type === FieldType.BIGINT ||
        ("calculationType" in fieldSchema && fieldSchema?.calculationType)
      ) {
        this.options.sortType = SortType.NUMBER
      }
      // If no sort order, default to ascending
      if (!this.options.sortOrder) {
        this.options.sortOrder = SortOrder.ASCENDING
      }
    }

    // Build the query
    let query = this.options.query
    if (!query) {
      query = buildQuery(filter ?? undefined)
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
      resetKey: Math.random(),
    }))
  }

  /**
   * Fetches some filtered, sorted and paginated data
   */
  async getPage() {
    const {
      sortColumn,
      sortOrder,
      sortType,
      limit,
      clientSideSearching,
      clientSideSorting,
      clientSideLimiting,
    } = this.options
    const { query } = get(this.store)

    // Get the actual data
    let { rows, info, hasNextPage, cursor, error } = await this.getData()

    // If we don't support searching, do a client search
    if (!this.features.supportsSearch && clientSideSearching) {
      rows = runQuery(rows, query)
    }

    // If we don't support sorting, do a client-side sort
    if (!this.features.supportsSort && clientSideSorting) {
      rows = sort(rows, sortColumn as any, sortOrder, sortType)
    }

    // If we don't support pagination, do a client-side limit
    if (!this.features.supportsPagination && clientSideLimiting) {
      rows = queryLimit(rows, limit)
    }

    return {
      rows,
      info,
      hasNextPage,
      cursor,
      error,
    }
  }

  abstract getData(): Promise<{
    rows: UIRow[]
    info?: any
    hasNextPage: boolean
    cursor?: any
    error?: any
  }>

  /**
   * Gets the definition for this datasource.
   * @param datasource
   * @return {object} the definition
   */
  abstract getDefinition(
    datasource: UIDatasource | null
  ): Promise<TDefinition | null>

  /**
   * Gets the schema definition for a datasource.
   * @param datasource the datasource
   * @param definition the datasource definition
   * @return {object} the schema
   */
  abstract getSchema(
    datasource: UIDatasource | null,
    definition: TDefinition | null
  ): any

  /**
   * Enriches a datasource schema with nested fields and ensures the structure
   * is correct.
   * @param schema the datasource schema
   * @return {object} the enriched datasource schema
   */
  enrichSchema(schema: TableSchema | null): TableSchema | null {
    if (schema == null) {
      return null
    }

    // Check for any JSON fields so we can add any top level properties
    let jsonAdditions: Record<string, { type: string; nestedJSON: true }> = {}
    for (const fieldKey of Object.keys(schema)) {
      const fieldSchema = schema[fieldKey]
      if (fieldSchema?.type === FieldType.JSON) {
        const jsonSchema = convertJSONSchemaToTableSchema(fieldSchema, {
          squashObjects: true,
        }) as Record<string, { type: string }> | null // TODO: remove when convertJSONSchemaToTableSchema is typed
        if (jsonSchema) {
          for (const jsonKey of Object.keys(jsonSchema)) {
            jsonAdditions[`${fieldKey}.${jsonKey}`] = {
              type: jsonSchema[jsonKey].type,
              nestedJSON: true,
            }
          }
        }
      }
    }

    // Ensure schema is in the correct structure
    let enrichedSchema: TableSchema = {}
    Object.entries({ ...schema, ...jsonAdditions }).forEach(
      ([fieldName, fieldSchema]) => {
        if (typeof fieldSchema === "string") {
          enrichedSchema[fieldName] = {
            type: fieldSchema,
            name: fieldName,
          }
        } else {
          enrichedSchema[fieldName] = {
            ...fieldSchema,
            type: fieldSchema.type as any, // TODO: check type union definition conflicts
            name: fieldName,
          }
        }
      }
    )

    return enrichedSchema
  }

  /**
   * Determine the feature flag for this datasource definition
   * @param definition
   */
  determineFeatureFlags(_definition: TDefinition | null) {
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
  async update(newOptions: any) {
    // Check if any settings have actually changed
    let refresh = false
    for (const [key, value] of Object.entries(newOptions || {})) {
      const oldVal = this.options[key as keyof typeof this.options] ?? null
      const newVal = value == null ? null : value
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
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
    const { rows, info, error, cursor } = await this.getPage()

    let { cursors } = get(this.store)
    const { pageNumber } = get(this.store)

    if (!rows.length && pageNumber > 0) {
      // If the full page is gone but we have previous pages, navigate to the previous page
      this.store.update($store => ({
        ...$store,
        loading: false,
        cursors: cursors.slice(0, pageNumber),
      }))
      return await this.prevPage()
    }

    const currentNextCursor = cursors[pageNumber + 1]
    if (currentNextCursor != cursor) {
      // If the current cursor changed, all the next pages need to be updated, so we mark them as stale
      cursors = cursors.slice(0, pageNumber + 1)
      cursors[pageNumber + 1] = cursor
    }

    this.store.update($store => ({
      ...$store,
      rows,
      info,
      loading: false,
      error,
      cursors,
    }))
  }

  /**
   * Determines whether there is a next page of data based on the state of the
   * store
   * @param state the current store state
   * @return {boolean} whether there is a next page of data or not
   */
  hasNextPage(state: DataFetchStore<TDefinition>): boolean {
    return state.cursors[state.pageNumber + 1] != null
  }

  /**
   * Determines whether there is a previous page of data based on the state of
   * the store
   * @param state the current store state
   * @return {boolean} whether there is a previous page of data or not
   */
  hasPrevPage(state: { pageNumber: number }): boolean {
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
