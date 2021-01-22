<script>
  import { get } from "svelte/store"
  import { store, allScreens, selectedAccessRole } from "builderStore"
  import { FrontendTypes } from "constants"
  import { params } from "@sveltech/routify"

  $: selectValidAsset($params.assetType)

  // If we ever land on this index page we want to correctly update state
  // to select a valid asset. The layout page will in turn update the URL
  // to reflect state.
  const selectValidAsset = assetType => {
    let id
    const state = get(store)
    const screens = get(allScreens)
    const role = get(selectedAccessRole)

    // Get ID or first correct asset type and select it
    if (assetType === FrontendTypes.LAYOUT) {
      if (
        state.selectedLayoutId &&
        state.layouts.find(layout => layout._id === state.selectedLayoutId)
      ) {
        id = state.selectedLayoutId
      } else {
        id = state.layouts[0]?._id
      }
      if (id) {
        store.actions.layouts.select(id)
      }
    } else if (assetType === FrontendTypes.SCREEN) {
      if (
        state.selectedScreenId &&
        screens.find(screen => screen._id === state.selectedScreenId)
      ) {
        id = state.selectedScreenId
      } else {
        // Select the first screen matching the selected role ID
        const filteredScreens = screens.filter(screen => {
          return screen.routing?.roleId === role
        })
        id = filteredScreens[0]?._id
      }
      if (id) {
        store.actions.screens.select(id)
      }
    }
  }
</script>

<!-- routify:options index=false -->
