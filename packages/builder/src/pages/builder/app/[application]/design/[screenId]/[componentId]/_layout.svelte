<script>
  import { syncURLToState } from "@/helpers/urlStateSync"
  import {
    builderStore,
    screenStore,
    selectedScreen,
    componentStore,
  } from "@/stores/builder"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"
  import { findComponent } from "@/helpers/components"
  import ComponentSettingsPanel from "./_components/Component/ComponentSettingsPanel.svelte"
  import NavigationPanel from "./_components/Navigation/index.svelte"
  import ScreenSettingsPanel from "./_components/Screen/index.svelte"

  $: componentId = $componentStore.selectedComponentId
  $: builderStore.selectResource(componentId)
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
    if (id === `${$screenStore.selectedScreenId}-screen`) return true
    if (id === `${$screenStore.selectedScreenId}-navigation`) return true

    return !!findComponent($selectedScreen.props, id)
  }

  // Keep URL and state in sync for selected component ID
  const stopSyncing = syncURLToState({
    urlParam: "componentId",
    stateKey: "selectedComponentId",
    validate,
    fallbackUrl: "../",
    store: componentStore,
    update: componentStore.select,
    routify,
    beforeNavigate: closeNewComponentPanel,
  })

  onDestroy(stopSyncing)
</script>

{#if routeComponentId === `${$screenStore.selectedScreenId}-screen`}
  <ScreenSettingsPanel />
{:else if routeComponentId === `${$screenStore.selectedScreenId}-navigation`}
  <NavigationPanel />
{:else}
  <ComponentSettingsPanel />
{/if}
<slot />
