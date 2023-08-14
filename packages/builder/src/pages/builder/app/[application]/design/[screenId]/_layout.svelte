<script>
  import * as routify from "@roxi/routify"
  import { syncURLToState } from "helpers/urlStateSync"
  import { store } from "builderStore"
  import { onDestroy } from "svelte"

  $: screenId = $store.selectedScreenId
  $: store.actions.websocket.selectResource(screenId)

  // Keep URL and state in sync for selected screen ID
  const stopSyncing = syncURLToState({
    urlParam: "screenId",
    stateKey: "selectedScreenId",
    validate: id => $store.screens.some(screen => screen._id === id),
    fallbackUrl: "../../design",
    store,
    routify,
  })

  onDestroy(stopSyncing)
</script>

<slot />
