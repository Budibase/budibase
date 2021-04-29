<script>
  import { getContext } from "svelte"

  export let dataSource
  export let filter
  export let sortColumn
  export let sortOrder
  export let limit

  const { API, styleable, Provider, ActionTypes } = getContext("sdk")
  const component = getContext("component")

  // Loading flag every time data is being fetched
  let loading = false

  // Loading flag for the initial load
  let loaded = false

  let allRows = []
  let schema = {}

  $: fetchData(dataSource)
  $: filteredRows = filterRows(allRows, filter)
  $: sortedRows = sortRows(filteredRows, sortColumn, sortOrder)
  $: rows = limitRows(sortedRows, limit)
  $: getSchema(dataSource)
  $: actions = [
    {
      type: ActionTypes.RefreshDatasource,
      callback: () => fetchData(dataSource),
      metadata: { dataSource },
    },
  ]
  $: dataContext = {
    rows,
    schema,
    rowsLength: rows.length,
    loading,
    loaded,
  }

  const fetchData = async dataSource => {
    loading = true
    allRows = await API.fetchDatasource(dataSource)
    loading = false
    loaded = true
  }

  const filterRows = (rows, filter) => {
    if (!Object.keys(filter || {}).length) {
      return rows
    }
    let filteredData = [...rows]
    Object.entries(filter).forEach(([field, value]) => {
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

    // Ensure all schema fields have a name property
    Object.entries(schema).forEach(([key, value]) => {
      if (!value.name) {
        value.name = key
      }
    })
  }
</script>

<Provider {actions} data={dataContext}>
  <slot />
</Provider>
