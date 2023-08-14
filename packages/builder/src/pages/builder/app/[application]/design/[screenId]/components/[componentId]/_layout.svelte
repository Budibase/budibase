<script>
  import LeftPanel from "./_components/LeftPanel/index.svelte"
  import AppPanel from "./_components/AppPanel.svelte"
  import { syncURLToState } from "helpers/urlStateSync"
  import { store, selectedScreen } from "builderStore"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"
  import { findComponent } from "builderStore/componentUtils"
  import ComponentSettingsPanel from "./_components/Component/ComponentSettingsPanel.svelte"
  import NavigationPanel from "./_components/Navigation/index.svelte"
  import ScreenSettingsPanel from "./_components/Screen/SettingsPanel.svelte"

  $: componentId = $store.selectedComponentId
  $: store.actions.websocket.selectResource(componentId)
  $: params = routify.params
  $: routeComponentId = $params.componentId

  const cleanUrl = url => {
    // Strip trailing slashes
    if (url?.endsWith("/index")) {
      url = url.replace("/index", "")
    }
    // Hide new component panel whenever component ID changes
    if (url?.endsWith("/new")) {
      url = url.replace("/new", "")
    }
    return { url }
  }

  const validate = id => {
    if (id === "screen") return true
    if (id === "navigation") return true

    return !!findComponent($selectedScreen.props, id)
  }

  // Keep URL and state in sync for selected component ID
  const stopSyncing = syncURLToState({
    urlParam: "componentId",
    stateKey: "selectedComponentId",
    validate,
    fallbackUrl: "../",
    store,
    routify,
    beforeNavigate: cleanUrl,
  })

  onDestroy(stopSyncing)
</script>

<div class="design">
  <div class="content">
    {#if $selectedScreen}
      <LeftPanel />
      <AppPanel />
      {#if routeComponentId === "screen"}
        <ScreenSettingsPanel />
      {:else if routeComponentId === "navigation"}
        <NavigationPanel />
      {:else}
        <ComponentSettingsPanel />
      {/if}
      <slot />
    {/if}
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
