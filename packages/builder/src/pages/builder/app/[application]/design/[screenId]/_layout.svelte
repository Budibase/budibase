<script>
  import AppPanel from "./_components/AppPanel.svelte"
  import * as routify from "@roxi/routify"
  import { syncURLToState } from "helpers/urlStateSync"
  import { store } from "builderStore"
  import { onDestroy } from "svelte"
  import LeftPanel from "./_components/LeftPanel.svelte"

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

<div class="design">
  <div class="content">
    <LeftPanel />
    <AppPanel />
    <slot />
  </div>
</div>

<style>
  .design {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    height: 0;
  }

  .content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    flex: 1 1 auto;
  }
</style>
