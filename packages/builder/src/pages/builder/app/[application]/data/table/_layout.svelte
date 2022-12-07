<script>
  import { tables } from "stores/backend"
  import { onDestroy } from "svelte"
  import { syncURLToState } from "helpers/urlStateSync"
  import * as routify from "@roxi/routify"

  // Keep URL and state in sync for selected screen ID
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
