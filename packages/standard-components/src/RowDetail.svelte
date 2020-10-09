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
    }
  }

  async function fetchData() {
    const pathParts = window.location.pathname.split("/")

    let row
    // if srcdoc, then we assume this is the builder preview
    if (pathParts.length === 0 || pathParts[0] === "srcdoc") {
      row = await fetchFirstRow()
    } else {
      const id = pathParts[pathParts.length - 1]
      const GET_ROW_URL = `/api/${table}/rows/${id}`
      const response = await _bb.api.get(GET_ROW_URL)
      if (response.status === 200) {
        row = await response.json()
      }
    }

    if (row) {
      // Fetch table schema so we can check for linked rows
      const table = await fetchTable(row.tableId)
      for (let key of Object.keys(table.schema)) {
        if (table.schema[key].type === "link") {
          row[key] = Array.isArray(row[key]) ? row[key].length : 0
        }
      }

      _bb.attachChildren(target, {
        hydrate: false,
        context: row,
      })
    } else {
      throw new Error("Failed to fetch row.", response)
    }
  }

  onMount(async () => {
    await fetchData()
  })
</script>

<section bind:this={target} />
