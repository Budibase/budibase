<script>
  import { syncURLToState } from "helpers/urlStateSync"
  import { store, selectedScreen } from "builderStore"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"
  import { findComponent } from "builderStore/componentUtils"
  import ComponentListPanel from "./_components/navigation/ComponentListPanel.svelte"
  import ComponentSettingsPanel from "./_components/settings/ComponentSettingsPanel.svelte"

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

  // Keep URL and state in sync for selected component ID
  const stopSyncing = syncURLToState({
    urlParam: "componentId",
    stateKey: "selectedComponentId",
    validate: id => !!findComponent($selectedScreen.props, id),
    fallbackUrl: "../",
    store,
    routify,
    beforeNavigate: cleanUrl,
  })

  onDestroy(stopSyncing)
</script>

<ComponentListPanel />
<ComponentSettingsPanel />
<slot />
