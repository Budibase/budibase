<script>
  import { onMount } from "svelte"

  export let _bb
  export let table

  let row = {}

  $: {
    row.tableId = table
  }

  let target

  async function fetchTable(id) {
    const FETCH_TABLE_URL = `/api/tables/${id}`
    const response = await _bb.api.get(FETCH_TABLE_URL)
    return await response.json()
  }

  onMount(async () => {
    if (table) {
      const tableObj = await fetchTable(table)
      row.tableId = table
      row._table = tableObj
      _bb.attachChildren(target, {
        context: row,
      })
    } else {
      _bb.attachChildren(target, {
        context: {},
      })
    }
  })
</script>

<section bind:this={target} />
