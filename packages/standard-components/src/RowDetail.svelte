<script>
  import { onMount } from "svelte"
  import {
    fetchTableDefinition,
    fetchTableData,
    fetchRow,
  } from "@budibase/component-sdk"

  export let _bb
  export let table

  let headers = []
  let store = _bb.store
  let target

  async function fetchFirstRow() {
    const rows = await fetchTableData(table)
    return Array.isArray(rows) && rows.length ? rows[0] : { tableId: table }
  }

  async function fetchData() {
    if (!table) {
      return
    }

    const pathParts = window.location.pathname.split("/")
    const routeParamId = _bb.routeParams().id
    let row

    // if srcdoc, then we assume this is the builder preview
    if ((pathParts.length === 0 || pathParts[0] === "srcdoc") && table) {
      row = await fetchFirstRow()
    } else if (routeParamId) {
      row = await fetchRow({ tableId: table, rowId: routeParamId })
    } else {
      throw new Error("Row ID was not supplied to RowDetail")
    }

    if (row) {
      row._table = await fetchTableDefinition(row.tableId)
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
