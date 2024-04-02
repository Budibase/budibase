<script>
  import { syncURLToState } from "helpers/urlStateSync"
  import { tables, builderStore } from "stores/builder"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"

  $: tableId = $tables.selectedTableId
  $: builderStore.selectResource(tableId)

  const stopSyncing = syncURLToState({
    urlParam: "tableId",
    stateKey: "selectedTableId",
    validate: id => $tables.list?.some(table => table._id === id),
    update: tables.select,
    fallbackUrl: "../",
    store: tables,
    routify,
  })

  onDestroy(stopSyncing)
</script>

<slot />
