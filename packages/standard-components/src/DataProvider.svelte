<script>
  import { getContext } from "svelte"
  import { ProgressCircle, Pagination } from "@budibase/bbui"
  import {
    buildLuceneQuery,
    luceneQuery,
    luceneSort,
    luceneLimit,
  } from "./lucene"

  export let dataSource
  export let filter
  export let sortColumn
  export let sortOrder
  export let limit
  export let paginate

  const { API, styleable, Provider, ActionTypes } = getContext("sdk")
  const component = getContext("component")
  const dataProviderApi = {
    setLuceneQuery: newQuery => (query = newQuery),
  }

  // Loading flag every time data is being fetched
  let loading = false

  // Loading flag for the initial load
  let loaded = false
  let schemaLoaded = false

  // Provider state
  let rows = []
  let allRows = []
  let schema = {}
  let bookmarks = [null]
  let pageNumber = 0
  let query = null

  $: query = buildLuceneQuery(filter)
  $: internalTable = dataSource?.type === "table"
  $: nestedProvider = dataSource?.type === "provider"
  $: hasNextPage = bookmarks[pageNumber + 1] != null
  $: hasPrevPage = pageNumber > 0
  $: getSchema(dataSource)
  $: sortType = getSortType(schema, sortColumn)
  $: {
    // Wait until schema loads before loading data, so that we can determine
    // the correct sort type first time
    if (schemaLoaded) {
      fetchData(
        dataSource,
        query,
        limit,
        sortColumn,
        sortOrder,
        sortType,
        paginate
      )
    }
  }
  $: {
    if (internalTable) {
      // Internal tables are already processed server-side
      rows = allRows
    } else {
      // For anything else we use client-side implementations to filter, sort
      // and limit
      const filtered = luceneQuery(allRows, query)
      const sorted = luceneSort(filtered, sortColumn, sortOrder, sortType)
      rows = luceneLimit(sorted, limit)
    }
  }
  $: actions = [
    {
      type: ActionTypes.RefreshDatasource,
      callback: () => refresh(),
      metadata: { dataSource },
    },
    {
      type: ActionTypes.SetDataProviderQuery,
      callback: newQuery => (query = newQuery),
    },
  ]
  $: dataContext = {
    rows,
    schema,
    rowsLength: rows.length,

    // Undocumented properties. These aren't supposed to be used in builder
    // bindings, but are used internally by other components
    id: $component?.id,
    state: { query },
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
        query,
        limit,
        sortColumn,
        sortOrder,
        sortType,
        paginate
      )
    }
  }

  const fetchData = async (
    dataSource,
    query,
    limit,
    sortColumn,
    sortOrder,
    sortType,
    paginate
  ) => {
    loading = true
    if (dataSource?.type === "table") {
      // For internal tables we use server-side processing
      const res = await API.searchTable({
        tableId: dataSource.tableId,
        query,
        limit,
        sort: sortColumn,
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
      allRows = dataSource?.value?.rows ?? []
    } else {
      // For other data sources like queries or views, fetch all rows from the
      // server
      allRows = await API.fetchDatasource(dataSource)
    }
    loading = false
    loaded = true
  }

  const getSchema = async dataSource => {
    if (dataSource?.schema) {
      schema = dataSource.schema
    } else if (dataSource?.tableId) {
      const definition = await API.fetchTableDefinition(dataSource.tableId)
      schema = definition?.schema ?? {}
    } else if (dataSource?.type === "provider") {
      schema = dataSource.value?.schema ?? {}
    } else {
      schema = {}
    }

    // Ensure there are "name" properties for all fields and that field schema
    // are objects
    let fixedSchema = {}
    Object.entries(schema || {}).forEach(([fieldName, fieldSchema]) => {
      if (typeof fieldSchema === "string") {
        fixedSchema[fieldName] = {
          type: fieldSchema,
          name: fieldName,
        }
      } else {
        fixedSchema[fieldName] = {
          ...fieldSchema,
          name: fieldName,
        }
      }
    })
    schema = fixedSchema
    schemaLoaded = true
  }

  const nextPage = async () => {
    if (!hasNextPage || !internalTable) {
      return
    }
    const res = await API.searchTable({
      tableId: dataSource?.tableId,
      query,
      bookmark: bookmarks[pageNumber + 1],
      limit,
      sort: sortColumn,
      sortOrder: sortOrder?.toLowerCase() ?? "ascending",
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
    const res = await API.searchTable({
      tableId: dataSource?.tableId,
      query,
      bookmark: bookmarks[pageNumber - 1],
      limit,
      sort: sortColumn,
      sortOrder: sortOrder?.toLowerCase() ?? "ascending",
      sortType,
      paginate: true,
    })
    pageNumber--
    allRows = res.rows
  }
</script>

<div use:styleable={$component.styles} class="container">
  <Provider {actions} data={dataContext}>
    {#if !loaded}
      <div class="loading">
        <ProgressCircle />
      </div>
    {:else}
      <slot />
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
