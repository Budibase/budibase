<script lang="ts">
  import * as routify from "@roxi/routify"
  import { syncURLToState } from "@/helpers/urlStateSync"
  import { workspaceAppStore } from "@/stores/builder"
  import { onDestroy } from "svelte"

  // Keep URL and state in sync for selected screen ID
  const stopSyncing = syncURLToState({
    urlParam: "workspaceAppId",
    stateKey: "selectedWorkspaceAppId",
    validate: (id: string) =>
      $workspaceAppStore.workspaceApps.some(app => app._id === id),
    fallbackUrl: () => {
      return "../../design"
    },
    routify,
    update: (id: string) => workspaceAppStore.select(id),
    store: workspaceAppStore,
  })

  onDestroy(() => {
    stopSyncing?.()
  })
</script>

<slot />
