// Do not use any aliased imports in common files, as these will be bundled
// by multiple bundlers which may not be able to resolve them
import { writable, derived, get } from "svelte/store"
import * as API from "../builderStore/api"
import { buildLuceneQuery } from "./lucene"

const defaultOptions = {
  tableId: null,
  filters: null,
  limit: 10,
  sortColumn: null,
  sortOrder: "ascending",
  paginate: true,
  schema: null,
}

export const fetchTableData = opts => {
  // Save option set so we can override it later rather than relying on params
  let options = {
    ...defaultOptions,
    ...opts,
  }

  // Local non-observable state
  let query
  let sortType
  let lastBookmark

  // Local observable state
  const store = writable({
    rows: [],
    schema: null,
    loading: false,
    loaded: false,
    bookmarks: [],
    pageNumber: 0,
  })

  // Derive certain properties to return
  const derivedStore = derived(store, $store => {
    return {
      ...$store,
      hasNextPage: $store.bookmarks[$store.pageNumber + 1] != null,
      hasPrevPage: $store.pageNumber > 0,
    }
  })

  const fetchPage = async bookmark => {
    lastBookmark = bookmark
    const { tableId, limit, sortColumn, sortOrder, paginate } = options
    const res = await API.post(`/api/${options.tableId}/search`, {
      tableId,
      query,
      limit,
      sort: sortColumn,
      sortOrder: sortOrder?.toLowerCase() ?? "ascending",
      sortType,
      paginate,
      bookmark,
    })
    return await res.json()
  }

  // Fetches a fresh set of results from the server
  const fetchData = async () => {
    const { tableId, schema, sortColumn, filters } = options

    // Ensure table ID exists
    if (!tableId) {
      return
    }

    // Get and enrich schema.
    // Ensure there are "name" properties for all fields and that field schema
    // are objects
    let enrichedSchema = schema
    if (!enrichedSchema) {
      const definition = await API.get(`/api/tables/${tableId}`)
      enrichedSchema = definition?.schema ?? null
    }
    if (enrichedSchema) {
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

      // Save fixed schema so we can provide it later
      options.schema = enrichedSchema
    }

    // Ensure schema exists
    if (!schema) {
      return
    }
    store.update($store => ({ ...$store, schema, loading: true }))

    // Work out what sort type to use
    if (!sortColumn || !schema[sortColumn]) {
      sortType = "string"
    }
    const type = schema?.[sortColumn]?.type
    sortType = type === "number" ? "number" : "string"

    // Build the lucene query
    query = buildLuceneQuery(filters)

    // Actually fetch data
    const page = await fetchPage()
    store.update($store => ({
      ...$store,
      loading: false,
      loaded: true,
      pageNumber: 0,
      rows: page.rows,
      bookmarks: page.hasNextPage ? [null, page.bookmark] : [null],
    }))
  }

  // Fetches the next page of data
  const nextPage = async () => {
    const state = get(derivedStore)
    if (state.loading || !options.paginate || !state.hasNextPage) {
      return
    }

    // Fetch next page
    store.update($store => ({ ...$store, loading: true }))
    const page = await fetchPage(state.bookmarks[state.pageNumber + 1])

    // Update state
    store.update($store => {
      let { bookmarks, pageNumber } = $store
      if (page.hasNextPage) {
        bookmarks[pageNumber + 2] = page.bookmark
      }
      return {
        ...$store,
        pageNumber: pageNumber + 1,
        rows: page.rows,
        bookmarks,
        loading: false,
      }
    })
  }

  // Fetches the previous page of data
  const prevPage = async () => {
    const state = get(derivedStore)
    if (state.loading || !options.paginate || !state.hasPrevPage) {
      return
    }

    // Fetch previous page
    store.update($store => ({ ...$store, loading: true }))
    const page = await fetchPage(state.bookmarks[state.pageNumber - 1])

    // Update state
    store.update($store => {
      return {
        ...$store,
        pageNumber: $store.pageNumber - 1,
        rows: page.rows,
        loading: false,
      }
    })
  }

  // Resets the data set and updates options
  const update = async newOptions => {
    if (newOptions) {
      options = {
        ...options,
        ...newOptions,
      }
    }
    await fetchData()
  }

  // Loads the same page again
  const refresh = async () => {
    if (get(store).loading) {
      return
    }
    const page = await fetchPage(lastBookmark)
    store.update($store => ({ ...$store, rows: page.rows }))
  }

  // Initially fetch data but don't bother waiting for the result
  fetchData()

  // Return our derived store which will be updated over time
  return {
    subscribe: derivedStore.subscribe,
    nextPage,
    prevPage,
    update,
    refresh,
  }
}
