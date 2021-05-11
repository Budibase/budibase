<script>
  import { getContext } from "svelte"

  export let dataSource
  export let filter
  export let sortColumn
  export let sortOrder
  export let limit = 50

  const { API, styleable, Provider, ActionTypes } = getContext("sdk")
  const component = getContext("component")

  // Loading flag every time data is being fetched
  let loading = false

  // Loading flag for the initial load
  let loaded = false

  // Provider state
  let rows = []
  let schema = {}
  let bookmarks = [null]
  let pageNumber = 0

  $: query = dataSource?.type === "table" ? buildLuceneQuery(filter) : null
  $: hasNextPage = bookmarks[pageNumber + 1] != null
  $: hasPrevPage = pageNumber > 0
  $: fetchData(dataSource, query, limit, sortColumn, sortOrder)
  // $: sortedRows = sortRows(filteredRows, sortColumn, sortOrder)
  // $: rows = limitRows(sortedRows, limit)
  $: getSchema(dataSource)
  $: actions = [
    {
      type: ActionTypes.RefreshDatasource,
      callback: () => fetchData(dataSource),
      metadata: { dataSource },
    },
    {
      type: ActionTypes.NextPage,
      callback: () => nextPage(),
    },
    {
      type: ActionTypes.PrevPage,
      callback: () => prevPage(),
    },
  ]
  $: dataContext = {
    rows,
    schema,
    rowsLength: rows.length,
    loading,
    loaded,
    pageNumber: pageNumber + 1,
    hasNextPage,
    hasPrevPage,
  }

  const buildLuceneQuery = (filter) => {
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
      filter.forEach((expression) => {
        if (expression.operator.startsWith("range")) {
          let range = {
            low: Number.MIN_SAFE_INTEGER,
            high: Number.MAX_SAFE_INTEGER,
          }
          if (expression.operator === "rangeLow") {
            range.low = expression.value
          } else if (expression.operator === "rangeHigh") {
            range.high = expression.value
          }
          query.range[expression.field] = range
        } else if (query[expression.operator]) {
          query[expression.operator][expression.field] = expression.value
        }
      })
    }
    return query
  }

  const fetchData = async (dataSource, query, limit, sortColumn, sortOrder) => {
    loading = true
    if (dataSource?.type === "table") {
      const res = await API.searchTable({
        tableId: dataSource.tableId,
        query,
        limit,
        sort: sortColumn,
        sortOrder: sortOrder?.toLowerCase() ?? "ascending",
      })
      pageNumber = 0
      rows = res.rows

      // Check we have next data
      const next = await API.searchTable({
        tableId: dataSource.tableId,
        query,
        limit: 1,
        bookmark: res.bookmark,
        sort: sortColumn,
        sortOrder: sortOrder?.toLowerCase() ?? "ascending",
      })
      if (next.rows?.length) {
        bookmarks = [null, res.bookmark]
      } else {
        bookmarks = [null]
      }
    } else {
      const rows = await API.fetchDatasource(dataSource)
      rows = inMemoryFilterRows(rows, filter)
    }
    loading = false
    loaded = true
  }

  const inMemoryFilterRows = (rows, filter) => {
    let filteredData = [...rows]
    Object.entries(filter).forEach(([field, value]) => {
      if (value != null && value !== "") {
        filteredData = filteredData.filter((row) => {
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

  const getSchema = async (dataSource) => {
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
    if (!hasNextPage) {
      return
    }
    const res = await API.searchTable({
      tableId: dataSource?.tableId,
      query,
      bookmark: bookmarks[pageNumber + 1],
      limit,
      sort: sortColumn,
      sortOrder: sortOrder?.toLowerCase() ?? "ascending",
    })
    pageNumber++
    rows = res.rows

    // Check we have next data
    const next = await API.searchTable({
      tableId: dataSource.tableId,
      query,
      limit: 1,
      bookmark: res.bookmark,
      sort: sortColumn,
      sortOrder: sortOrder?.toLowerCase() ?? "ascending",
    })
    if (next.rows?.length) {
      bookmarks[pageNumber + 1] = res.bookmark
    }
  }

  const prevPage = async () => {
    if (!hasPrevPage) {
      return
    }
    const res = await API.searchTable({
      tableId: dataSource?.tableId,
      query,
      bookmark: bookmarks[pageNumber - 1],
      limit,
      sort: sortColumn,
      sortOrder: sortOrder?.toLowerCase() ?? "ascending",
    })
    pageNumber--
    rows = res.rows
  }
</script>

<div use:styleable={$component.styles}>
  <Provider {actions} data={dataContext}>
    <slot />
  </Provider>
</div>
