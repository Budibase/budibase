<script>
  import { onMount, setContext } from "svelte"
  import {
    fetchDatasource,
    createDataProviderContext,
    fetchTableDefinition,
    ContextTypes,
  } from "@budibase/component-sdk"
  import { isEmpty } from "lodash/fp"

  export let datasource = []

  let target

  const dataProviderContext = createDataProviderContext()
  setContext(ContextTypes.DataProvider, dataProviderContext)

  onMount(async () => {
    if (!isEmpty(datasource)) {
      const rows = await fetchDatasource(datasource)
      dataProviderContext.actions.setRows(rows)
      if (datasource.tableId) {
        const tableDefinition = await fetchTableDefinition(datasource.tableId)
        dataProviderContext.actions.setTable(tableDefinition)
      }
    }
  })
</script>

<section bind:this={target} />
