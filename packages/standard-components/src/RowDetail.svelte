<script>
  import { onMount, setContext } from "svelte"
  import {
    fetchTableDefinition,
    fetchTableData,
    fetchRow,
    screenStore,
    routeStore,
    createDataProviderContext,
    ContextTypes,
  } from "@budibase/component-sdk"

  export let table

  let headers = []

  // Expose data provider context for this row
  const dataProviderContext = createDataProviderContext()
  setContext(ContextTypes.DataProvider, dataProviderContext)

  async function fetchFirstRow() {
    const rows = await fetchTableData(table)
    return Array.isArray(rows) && rows.length ? rows[0] : { tableId: table }
  }

  async function fetchData() {
    if (!table) {
      return
    }

    const pathParts = window.location.pathname.split("/")
    const routeParamId = $routeStore.routeParams.id
    console.log(routeParamId)
    let row
    let tableDefinition

    // if srcdoc, then we assume this is the builder preview
    if ((pathParts.length === 0 || pathParts[0] === "srcdoc") && table) {
      row = await fetchFirstRow()
    } else if (routeParamId) {
      row = await fetchRow({ tableId: table, rowId: routeParamId })
    } else {
      throw new Error("Row ID was not supplied to RowDetail")
    }

    if (row) {
      tableDefinition = await fetchTableDefinition(row.tableId)
    }

    dataProviderContext.actions.setRows([row])
    dataProviderContext.actions.setTable(tableDefinition)
  }

  onMount(fetchData)
</script>

<slot />
