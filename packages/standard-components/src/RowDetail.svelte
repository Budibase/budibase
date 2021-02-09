<script>
  import { onMount, getContext } from "svelte"

  export let table

  const {
    API,
    screenStore,
    routeStore,
    Provider,
    styleable,
    ActionTypes,
  } = getContext("sdk")
  const component = getContext("component")
  let headers = []
  let row

  const fetchFirstRow = async tableId => {
    const rows = await API.fetchTableData(tableId)
    return Array.isArray(rows) && rows.length ? rows[0] : { tableId }
  }

  const fetchData = async (rowId, tableId) => {
    if (!tableId) {
      return
    }

    const pathParts = window.location.pathname.split("/")

    // if srcdoc, then we assume this is the builder preview
    if ((pathParts.length === 0 || pathParts[0] === "srcdoc") && tableId) {
      row = await fetchFirstRow(tableId)
    } else if (rowId) {
      row = await API.fetchRow({ tableId, rowId })
    } else {
      throw new Error("Row ID was not supplied to RowDetail")
    }
  }

  $: actions = [
    {
      type: ActionTypes.RefreshDatasource,
      callback: () => fetchData($routeStore.routeParams.id, table),
      metadata: { datasource: { type: "table", tableId: table } },
    },
  ]

  onMount(() => fetchData($routeStore.routeParams.id, table))
</script>

{#if row}
  <Provider data={row} {actions}>
    <div use:styleable={$component.styles}>
      <slot />
    </div>
  </Provider>
{/if}
