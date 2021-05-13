<script>
  import { getContext } from "svelte"
  import { ProgressCircle, Pagination } from "@budibase/bbui"

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
  let loaded = false

  // Provider state
  let rows = []
  let allRows = []
  let schema = {}
  let bookmarks = [null]
  let pageNumber = 0

  $: internalTable = dataSource?.type === "table"
  $: query = internalTable ? buildLuceneQuery(filter) : null
  $: hasNextPage = bookmarks[pageNumber + 1] != null
  $: hasPrevPage = pageNumber > 0
  $: getSchema(dataSource)
  $: sortType = getSortType(schema, sortColumn)
  $: fetchData(
    dataSource,
    query,
    limit,
    sortColumn,
    sortOrder,
    sortType,
    paginate
  )
  $: {
    if (internalTable) {
      rows = allRows
    } else {
      const sortedRows = sortRows(allRows, sortColumn, sortOrder)
      rows = limitRows(sortedRows, limit)
    }
  }
  $: actions = [
    {
      type: ActionTypes.RefreshDatasource,
      callback: () => fetchData(dataSource),
      metadata: { dataSource },
    },
  ]
  $: dataContext = { rows, schema, rowsLength: rows.length }

  const getSortType = (schema, sortColumn) => {
    if (!schema || !sortColumn || !schema[sortColumn]) {
      return "string"
    }
    const type = schema?.[sortColumn]?.type
    return type === "number" ? "number" : "string"
  }

  const buildLuceneQuery = filter => {
    let query = {
      string: {},
      fuzzy: {},
      range: {},
      equal: {},
      notEqual: {},
      empty: {},
      notEmpty: {},
    }
    if (Array.isArray(filter)) {
      filter.forEach(({ operator, field, type, value }) => {
        if (operator.startsWith("range")) {
          if (!query.range[field]) {
            query.range[field] = {
              low: type === "number" ? Number.MIN_SAFE_INTEGER : "0000",
              high: type === "number" ? Number.MAX_SAFE_INTEGER : "9999",
            }
          }
          if (operator === "rangeLow") {
            query.range[field].low = value
          } else if (operator === "rangeHigh") {
            query.range[field].high = value
          }
        } else if (query[operator]) {
          query[operator][field] = value
        }
      })
    }
    return query
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
    console.log("FETCH")
    loading = true
    if (dataSource?.type === "table") {
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
    } else {
      const rows = await API.fetchDatasource(dataSource)
      allRows = inMemoryFilterRows(rows, filter)
    }
    loading = false
    loaded = true
  }

  const inMemoryFilterRows = (rows, filter) => {
    let filteredData = [...rows]
    Object.entries(filter || {}).forEach(([field, value]) => {
      if (value != null && value !== "") {
        filteredData = filteredData.filter(row => {
          return row[field] === value
        })
      }
    })
    return filteredData
  }

  const sortRows = (rows, sortColumn, sortOrder) => {
    if (!sortColumn || !sortOrder) {
      return rows
    }
    return rows.slice().sort((a, b) => {
      const colA = a[sortColumn]
      const colB = b[sortColumn]
      if (sortOrder === "Descending") {
        return colA > colB ? -1 : 1
      } else {
        return colA > colB ? 1 : -1
      }
    })
  }

  const limitRows = (rows, limit) => {
    const numLimit = parseFloat(limit)
    if (isNaN(numLimit)) {
      return rows
    }
    return rows.slice(0, numLimit)
  }

  const getSchema = async dataSource => {
    if (dataSource?.schema) {
      schema = dataSource.schema
    } else if (dataSource?.tableId) {
      const definition = await API.fetchTableDefinition(dataSource.tableId)
      schema = definition?.schema ?? {}
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
    {#if !loaded && loading}
      <div class="loading">
        <ProgressCircle />
      </div>
    {:else}
      <slot />
      {#if paginate}
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
