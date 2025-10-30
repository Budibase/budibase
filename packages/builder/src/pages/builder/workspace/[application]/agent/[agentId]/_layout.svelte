<script>
  import TopBar from "@/components/common/TopBar.svelte"
  import { syncURLToState } from "@/helpers/urlStateSync"
  import { agentsStore } from "@/stores/portal"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"

  const stopSyncing = syncURLToState({
    urlParam: "agentId",
    stateKey: "selectedAgentId",
    validate: id => $agentsStore.agents.some(x => x._id === id),
    fallbackUrl: "../index",
    store: agentsStore,
    update: agentsStore.selectAgent,
    routify,
  })

  onDestroy(stopSyncing)
</script>

<slot />
