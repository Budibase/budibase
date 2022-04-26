<script>
  import { store } from "builderStore"
  import { onDestroy } from "svelte"
  import { syncURLToState } from "helpers/urlStateSync"
  import { goto, params, redirect } from "@roxi/routify"

  // Keep URL and state in sync for selected screen ID
  const stopSyncing = syncURLToState({
    keys: [
      {
        url: "screenId",
        state: "selectedScreenId",
        validate: screenId => $store.screens.some(x => x._id === screenId),
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
