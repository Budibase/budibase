<script>
  import { syncURLToState } from "helpers/urlStateSync"
  import { store } from "builderStore"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"

  // Keep URL and state in sync for selected component ID
  const stopSyncing = syncURLToState({
    urlParam: "layoutId",
    stateKey: "selectedLayoutId",
    validate: id => $store.layouts?.some(layout => layout._id === id),
    fallbackUrl: "../",
    store,
    routify,
  })

  onDestroy(stopSyncing)
</script>

<slot />
