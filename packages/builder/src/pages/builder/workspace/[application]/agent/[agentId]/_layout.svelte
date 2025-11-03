<script>
  import { syncURLToState } from "@/helpers/urlStateSync"
  import { agentsStore } from "@/stores/portal"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"

  let agentsLoaded = false

  $: agentsLoaded = $agentsStore.agentsLoaded

  const validateAgentId = id => {
    if (!agentsLoaded) {
      return true
    }
    return $agentsStore.agents.some(x => x._id === id)
  }

  const stopSyncing = syncURLToState({
    urlParam: "agentId",
    stateKey: "currentAgentId",
    validate: validateAgentId,
    fallbackUrl: "../index",
    store: agentsStore,
    update: agentsStore.selectAgent,
    routify,
  })

  onDestroy(stopSyncing)
</script>

<slot />
