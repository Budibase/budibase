<script>
  import { onMount, getContext } from "svelte"

  const { API, screenStore, routeStore, DataProvider, styleable } = getContext(
    "sdk"
  )
  const component = getContext("component")

  export let table

  let headers = []
  let row

  async function fetchFirstRow() {
    const rows = await API.fetchTableData(table)
    return Array.isArray(rows) && rows.length ? rows[0] : { tableId: table }
  }

  async function fetchData() {
    if (!table) {
      return
    }

    const pathParts = window.location.pathname.split("/")
    const routeParamId = $routeStore.routeParams.id

    // if srcdoc, then we assume this is the builder preview
    if ((pathParts.length === 0 || pathParts[0] === "srcdoc") && table) {
      row = await fetchFirstRow()
    } else if (routeParamId) {
      row = await API.fetchRow({ tableId: table, rowId: routeParamId })
    } else {
      throw new Error("Row ID was not supplied to RowDetail")
    }
  }

  onMount(fetchData)
</script>

{#if row}
  <div use:styleable={$component.styles}>
    <DataProvider {row}>
      <slot />
    </DataProvider>
  </div>
{/if}
