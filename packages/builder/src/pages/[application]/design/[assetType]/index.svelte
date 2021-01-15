<script>
  import { onMount } from "svelte"
  import { goto } from "@sveltech/routify"
  import { store, allScreens } from "builderStore"
  import { FrontendTypes } from "constants"
  import { params } from "@sveltech/routify"

  onMount(() => {
    let id

    // Get valid asset type
    let assetType = $params.assetType
    if (![FrontendTypes.LAYOUT, FrontendTypes.SCREEN].includes(assetType)) {
      assetType = FrontendTypes.SCREEN
    }

    // Get ID or first correct asset type
    if (assetType === FrontendTypes.LAYOUT) {
      if (
        $store.selectedLayoutId &&
        $store.layouts.find(layout => layout._id === $store.selectedLayoutId)
      ) {
        id = $store.selectedLayoutId
      } else {
        id = $store.layouts[0]?._id
      }
    } else if (assetType === FrontendTypes.SCREEN) {
      if (
        $store.selectedScreenId &&
        $allScreens.find(screen => screen._id === $store.selectedScreenId)
      ) {
        id = $store.selectedScreenId
      } else {
        id = $allScreens[0]?._id
      }
    }

    // Send correct URL which will then update state
    if (id) {
      $goto(`../../${assetType}/${id}`)
    }
  })
</script>

<!-- routify:options index=false -->
