<script>
  import { syncURLToState } from "helpers/urlStateSync"
  import { store, selectedScreen } from "builderStore"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"
  import { findComponent } from "builderStore/componentUtils"
  import ComponentSettingsPanel from "./_components/Component/ComponentSettingsPanel.svelte"
  import NavigationPanel from "./_components/Navigation/index.svelte"
  import ScreenSettingsPanel from "./_components/Screen/index.svelte"

  $: componentId = $store.selectedComponentId
  $: store.actions.websocket.selectResource(componentId)
  $: params = routify.params
  $: routeComponentId = $params.componentId

  // Hide new component panel whenever component ID changes
  const closeNewComponentPanel = url => {
    if (url?.endsWith("/new")) {
      url = url.replace("/new", "")
    }
    return { url }
  }

  const validate = id => {
    if (id === `${$store.selectedScreenId}-screen`) return true
    if (id === `${$store.selectedScreenId}-navigation`) return true

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
    beforeNavigate: closeNewComponentPanel,
  })

  onDestroy(stopSyncing)
</script>

{#if routeComponentId === `${$store.selectedScreenId}-screen`}
  <ScreenSettingsPanel />
{:else if routeComponentId === `${$store.selectedScreenId}-navigation`}
  <NavigationPanel />
{:else}
  <ComponentSettingsPanel />
{/if}
<slot />
