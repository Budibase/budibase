<script>
  import { onMount } from "svelte"

  export let _bb
  export let table

  let headers = []
  let store = _bb.store
  let target

  async function fetchTable(id) {
    const FETCH_TABLE_URL = `/api/tables/${id}`
    const response = await _bb.api.get(FETCH_TABLE_URL)
    return await response.json()
  }

  async function fetchFirstRow() {
    const FETCH_ROWS_URL = `/api/views/all_${table}`
    const response = await _bb.api.get(FETCH_ROWS_URL)
    if (response.status === 200) {
      const allRows = await response.json()
      if (allRows.length > 0) return allRows[0]
      return { tableId: table }
    }
  }

  async function fetchData() {
    const pathParts = window.location.pathname.split("/")

    if (!table) {
      return
    }

    let row
    // if srcdoc, then we assume this is the builder preview
    if (pathParts.length === 0 || pathParts[0] === "srcdoc") {
      if (table) row = await fetchFirstRow()
    } else if (_bb.routeParams().id) {
      const GET_ROW_URL = `/api/${table}/rows/${_bb.routeParams().id}`
      const response = await _bb.api.get(GET_ROW_URL)
      if (response.status === 200) {
        row = await response.json()
      } else {
        throw new Error("Failed to fetch row.", response)
      }
    } else {
      throw new Exception("Row ID was not supplied to RowDetail")
    }

    if (row) {
      // Fetch table schema so we can check for linked rows
      const tableObj = await fetchTable(row.tableId)
      for (let key of Object.keys(tableObj.schema)) {
        if (tableObj.schema[key].type === "link") {
          row[`${key}_count`] = Array.isArray(row[key]) ? row[key].length : 0
        }
      }

      row._table = tableObj

      _bb.attachChildren(target, {
        context: row,
      })
    } else {
      _bb.attachChildren(target)
    }
  }

  onMount(async () => {
    await fetchData()
  })
</script>

<section bind:this={target} />
