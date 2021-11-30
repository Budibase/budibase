<script>
  import { getContext } from "svelte"
  import { ProgressCircle, Pagination } from "@budibase/bbui"
  import {
    buildLuceneQuery,
    luceneQuery,
    luceneSort,
    luceneLimit,
  } from "builder/src/helpers/lucene"
  import Placeholder from "./Placeholder.svelte"

  export let dataSource
  export let filter
  export let sortColumn
  export let sortOrder
  export let limit
  export let paginate

  const { API, styleable, Provider, ActionTypes } = getContext("sdk")
  const component = getContext("component")

  // Loading flag every time data is being fetched
  let loading = false

  // Loading flag for the initial load
  // Mark as loaded if we have no datasource so we don't stall forever
  let loaded = !dataSource
  let schemaLoaded = false

  // Provider state
  let rows = []
  let allRows = []
  let schema = {}
  let bookmarks = [null]
  let pageNumber = 0
  let query = null
  let queryExtensions = {}

  // Sorting can be overridden at run time, so we can't use the prop directly
  let currentSortColumn = sortColumn
  let currentSortOrder = sortOrder

  // Reset the current sort state to props if props change
  $: currentSortColumn = sortColumn
  $: currentSortOrder = sortOrder

  $: defaultQuery = buildLuceneQuery(filter)
  $: extendQuery(defaultQuery, queryExtensions)
  $: internalTable = dataSource?.type === "table"
  $: nestedProvider = dataSource?.type === "provider"
  $: hasNextPage = bookmarks[pageNumber + 1] != null
  $: hasPrevPage = pageNumber > 0
  $: getSchema(dataSource)
  $: sortType = getSortType(schema, currentSortColumn)

  // Wait until schema loads before loading data, so that we can determine
  // the correct sort type first time
  $: {
    if (schemaLoaded) {
      fetchData(
        dataSource,
        schema,
        query,
        limit,
        currentSortColumn,
        currentSortOrder,
        sortType,
        paginate
      )
    }
  }

  // Reactively filter and sort rows if required
  $: {
    if (internalTable) {
      // Internal tables are already processed server-side
      rows = allRows
    } else {
      // For anything else we use client-side implementations to filter, sort
      // and limit
      const filtered = luceneQuery(allRows, query)
      const sorted = luceneSort(
        filtered,
        currentSortColumn,
        currentSortOrder,
        sortType
      )
      rows = luceneLimit(sorted, limit)
    }
  }

  // Build our action context
  $: actions = [
    {
      type: ActionTypes.RefreshDatasource,
      callback: () => refresh(),
      metadata: { dataSource },
    },
    {
      type: ActionTypes.AddDataProviderQueryExtension,
      callback: addQueryExtension,
    },
    {
      type: ActionTypes.RemoveDataProviderQueryExtension,
      callback: removeQueryExtension,
    },
    {
      type: ActionTypes.SetDataProviderSorting,
      callback: ({ column, order }) => {
        if (column) {
          currentSortColumn = column
        }
        if (order) {
          currentSortOrder = order
        }
      },
    },
  ]

  // Build our data context
  $: dataContext = {
    rows,
    schema,
    rowsLength: rows.length,

    // Undocumented properties. These aren't supposed to be used in builder
    // bindings, but are used internally by other components
    id: $component?.id,
    state: {
      query,
      sortColumn: currentSortColumn,
      sortOrder: currentSortOrder,
    },
    loaded,
  }

  const getSortType = (schema, sortColumn) => {
    if (!schema || !sortColumn || !schema[sortColumn]) {
      return "string"
    }
    const type = schema?.[sortColumn]?.type
    return type === "number" ? "number" : "string"
  }

  const refresh = async () => {
    if (schemaLoaded && !nestedProvider) {
      fetchData(
        dataSource,
        schema,
        query,
        limit,
        currentSortColumn,
        currentSortOrder,
        sortType,
        paginate
      )
    }
  }

  const fetchData = async (
    dataSource,
    schema,
    query,
    limit,
    sortColumn,
    sortOrder,
    sortType,
    paginate
  ) => {
    loading = true
    if (dataSource?.type === "table") {
      // Sanity check sort column, as using a non-existant column will prevent
      // results coming back at all
      const sort = schema?.[sortColumn] ? sortColumn : undefined

      // For internal tables we use server-side processing
      const res = await API.searchTable({
        tableId: dataSource.tableId,
        query,
        limit,
        sort,
        sortOrder: sortOrder?.toLowerCase() ?? "ascending",
        sortType,
        paginate,
      })
      pageNumber = 0
      allRows = res.rows
      if (res.hasNextPage) {
        bookmarks = [null, res.bookmark]
      } else {
        bookmarks = [null]
      }
    } else if (dataSource?.type === "provider") {
      // For providers referencing another provider, just use the rows it
      // provides
      allRows = dataSource?.value?.rows || []
    } else if (dataSource?.type === "field") {
      // Field sources will be available from context.
      // Enrich non object elements into object to ensure a valid schema.
      const data = dataSource?.value || []
      if (Array.isArray(data) && data[0] && typeof data[0] !== "object") {
        allRows = data.map(value => ({ value }))
      } else {
        allRows = data
      }
    } else {
      // For other data sources like queries or views, fetch all rows from the
      // server
      allRows = await API.fetchDatasource(dataSource)
    }
    loading = false
    loaded = true
  }

  const getSchema = async dataSource => {
    let newSchema = (await API.fetchDatasourceSchema(dataSource)) || {}

    // Ensure there are "name" properties for all fields and that field schema
    // are objects
    Object.entries(newSchema).forEach(([fieldName, fieldSchema]) => {
      if (typeof fieldSchema === "string") {
        newSchema[fieldName] = {
          type: fieldSchema,
          name: fieldName,
        }
      } else {
        newSchema[fieldName] = {
          ...fieldSchema,
          name: fieldName,
        }
      }
    })
    schema = newSchema
    schemaLoaded = true
  }

  const nextPage = async () => {
    if (!hasNextPage || !internalTable) {
      return
    }
    const sort = schema?.[currentSortColumn] ? currentSortColumn : undefined
    const res = await API.searchTable({
      tableId: dataSource?.tableId,
      query,
      bookmark: bookmarks[pageNumber + 1],
      limit,
      sort,
      sortOrder: currentSortOrder?.toLowerCase() ?? "ascending",
      sortType,
      paginate: true,
    })
    pageNumber++
    allRows = res.rows
    if (res.hasNextPage) {
      bookmarks[pageNumber + 1] = res.bookmark
    }
  }

  const prevPage = async () => {
    if (!hasPrevPage || !internalTable) {
      return
    }
    const sort = schema?.[currentSortColumn] ? currentSortColumn : undefined
    const res = await API.searchTable({
      tableId: dataSource?.tableId,
      query,
      bookmark: bookmarks[pageNumber - 1],
      limit,
      sort,
      sortOrder: currentSortOrder?.toLowerCase() ?? "ascending",
      sortType,
      paginate: true,
    })
    pageNumber--
    allRows = res.rows
  }

  const addQueryExtension = (key, extension) => {
    if (!key || !extension) {
      return
    }
    queryExtensions = { ...queryExtensions, [key]: extension }
  }

  const removeQueryExtension = key => {
    if (!key) {
      return
    }
    const newQueryExtensions = { ...queryExtensions }
    delete newQueryExtensions[key]
    queryExtensions = newQueryExtensions
  }

  const extendQuery = (defaultQuery, extensions) => {
    const extensionValues = Object.values(extensions || {})
    let extendedQuery = { ...defaultQuery }
    extensionValues.forEach(extension => {
      Object.entries(extension || {}).forEach(([operator, fields]) => {
        extendedQuery[operator] = {
          ...extendedQuery[operator],
          ...fields,
        }
      })
    })

    if (JSON.stringify(query) !== JSON.stringify(extendedQuery)) {
      query = extendedQuery
    }
  }
</script>

<div use:styleable={$component.styles} class="container">
  <Provider {actions} data={dataContext}>
    {#if !loaded}
      <div class="loading">
        <ProgressCircle />
      </div>
    {:else}
      {#if $component.emptyState}
        <Placeholder />
      {:else}
        <slot />
      {/if}
      {#if paginate && internalTable}
        <div class="pagination">
          <Pagination
            page={pageNumber + 1}
            {hasPrevPage}
            {hasNextPage}
            goToPrevPage={prevPage}
            goToNextPage={nextPage}
          />
        </div>
      {/if}
    {/if}
  </Provider>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
  .loading {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100px;
  }
  .pagination {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-top: var(--spacing-xl);
  }
</style>
