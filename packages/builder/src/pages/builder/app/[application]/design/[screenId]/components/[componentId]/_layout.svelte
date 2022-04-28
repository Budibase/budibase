<script>
  import { syncURLToState } from "helpers/urlStateSync"
  import { store, selectedScreen } from "builderStore"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"
  import { findComponent } from "builderStore/componentUtils"

  // Keep URL and state in sync for selected component ID
  const stopSyncing = syncURLToState({
    urlParam: "componentId",
    stateKey: "selectedComponentId",
    validate: id => !!findComponent($selectedScreen.props, id),
    fallbackUrl: "../",
    store,
    routify,
  })

  onDestroy(stopSyncing)
</script>

<slot />
