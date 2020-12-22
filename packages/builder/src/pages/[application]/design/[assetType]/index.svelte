<script>
  import { store, allScreens } from "builderStore"
  import { FrontendTypes } from "constants"
  import { goto, params } from "@sveltech/routify"

  // Go to first layout
  if ($params.assetType === FrontendTypes.LAYOUT) {
    // Try to use previously selected layout first
    let id
    if (
      $store.selectedLayoutId &&
      $store.layouts.find(layout => layout._id === $store.selectedLayoutId)
    ) {
      id = $store.selectedLayoutId
    } else {
      id = $store.layouts[0]?._id
    }
    $goto(`../${id}`)
  }

  // Go to first screen
  if ($params.assetType === FrontendTypes.SCREEN) {
    // Try to use previously selected layout first
    let id
    if (
      $store.selectedScreenId &&
      $allScreens.find(screen => screen._id === $store.selectedScreenId)
    ) {
      id = $store.selectedScreenId
    } else {
      id = $allScreens[0]?._id
    }
    $goto(`../${id}`)
  }
</script>

<!-- routify:options index=false -->
