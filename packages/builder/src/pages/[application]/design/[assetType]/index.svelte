<script>
  import { store, allScreens } from "builderStore"
  import { FrontendTypes } from "constants"
  import { goto, params } from "@sveltech/routify"

  // Go to first layout
  if ($params.assetType === FrontendTypes.LAYOUT) {
    $goto(`../${$store.layouts[0]?._id}`)
  }

  // Go to first screen
  if ($params.assetType === FrontendTypes.SCREEN) {
    $goto(`../${$allScreens[0]?._id}`)
  }
</script>

<!-- routify:options index=false -->
