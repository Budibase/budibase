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

  async function fetchFirstRecord() {
    const FETCH_RECORDS_URL = `/api/views/all_${table}`
    const response = await _bb.api.get(FETCH_RECORDS_URL)
    if (response.status === 200) {
      const allRecords = await response.json()
      if (allRecords.length > 0) return allRecords[0]
    }
  }

  async function fetchData() {
    const pathParts = window.location.pathname.split("/")

    let record
    // if srcdoc, then we assume this is the builder preview
    if (pathParts.length === 0 || pathParts[0] === "srcdoc") {
      record = await fetchFirstRecord()
    } else {
      const id = pathParts[pathParts.length - 1]
      const GET_RECORD_URL = `/api/${table}/records/${id}`
      const response = await _bb.api.get(GET_RECORD_URL)
      if (response.status === 200) {
        record = await response.json()
      }
    }

    if (record) {
      // Fetch table schema so we can check for linked records
      const table = await fetchTable(record.tableId)
      for (let key of Object.keys(table.schema)) {
        if (table.schema[key].type === "link") {
          record[key] = Array.isArray(record[key]) ? record[key].length : 0
        }
      }

      _bb.attachChildren(target, {
        hydrate: false,
        context: record,
      })
    } else {
      throw new Error("Failed to fetch record.", response)
    }
  }

  onMount(async () => {
    await fetchData()
  })
</script>

<section bind:this={target} />
