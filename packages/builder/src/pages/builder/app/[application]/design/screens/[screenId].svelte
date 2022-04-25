<script>
  import { store } from "builderStore"
  import { onDestroy } from "svelte"
  import { syncURLToState } from "helpers/urlStateSync"
  import { goto, params, redirect } from "@roxi/routify"
  import AppPanel from "components/design/AppPanel/AppPanel.svelte"
  import ScreenNavigationPanel from "./_components/ScreenNavigationPanel.svelte"
  import ScreenSettingsPanel from "./_components/ScreenSettingsPanel.svelte"

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
  })

  onDestroy(stopSyncing)
</script>

<ScreenNavigationPanel />
<AppPanel />
<ScreenSettingsPanel />
