<script>
  import { syncURLToState } from "helpers/urlStateSync"
  import { store, selectedScreen } from "builderStore"
  import { goto, params, redirect } from "@roxi/routify"
  import { onDestroy } from "svelte"
  import { findComponent } from "builderStore/componentUtils"

  // Keep URL and state in sync for selected component ID
  const stopSyncing = syncURLToState({
    keys: [
      {
        url: "componentId",
        state: "selectedComponentId",
        validate: componentId => {
          return !!findComponent($selectedScreen.props, componentId)
        },
        fallbackUrl: "../",
      },
    ],
    store,
    params,
    goto,
    redirect,
    baseUrl: "..",
  })

  onDestroy(stopSyncing)
</script>

<slot />
