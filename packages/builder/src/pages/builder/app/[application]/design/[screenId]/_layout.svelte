<script lang="ts">
  import AppPanel from "./_components/AppPanel.svelte"
  import * as routify from "@roxi/routify"
  import { syncURLToState } from "@/helpers/urlStateSync"
  import { screenStore, selectedScreen } from "@/stores/builder"
  import { onDestroy } from "svelte"
  import LeftPanel from "./_components/LeftPanel.svelte"
  import TopBar from "@/components/common/TopBar.svelte"
  import { featureFlags } from "@/stores/portal"
  import { FeatureFlag } from "@budibase/types"

  // Keep URL and state in sync for selected screen ID
  const stopSyncing = syncURLToState({
    urlParam: "screenId",
    stateKey: "selectedScreenId",
    validate: (id: string) =>
      $screenStore.screens.some(screen => screen._id === id),
    fallbackUrl: "../../design",
    routify,
    update: screenStore.select,
    store: screenStore,
  })

  onDestroy(() => {
    stopSyncing?.()
  })
</script>

{#if $selectedScreen}
  <div class="design">
    {#if $featureFlags[FeatureFlag.WORKSPACE_APPS]}
      <TopBar breadcrumbs={[{ text: "Design" }]} icon="layout"></TopBar>
    {/if}
    <div class="content">
      <LeftPanel />
      <AppPanel />
      <slot />
    </div>
  </div>
{/if}

<style>
  .design {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
  .content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    flex: 1 1 auto;
    height: 0;
  }
</style>
