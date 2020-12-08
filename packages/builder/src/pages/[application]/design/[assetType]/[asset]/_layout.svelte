<script>
  import { params, leftover, goto } from "@sveltech/routify"
  import { FrontendTypes } from "constants"
  import { store, allScreens } from "builderStore"

  // Get any leftover params not caught by Routifys params store.
  const componentIds = $leftover.split("/").filter(id => id !== "")

  const currentAssetId = decodeURI($params.asset)

  let assetList
  let actions

  // Determine screens or layouts based on the URL
  if ($params.assetType === FrontendTypes.SCREEN) {
    assetList = $allScreens
    actions = store.actions.screens
  } else {
    assetList = $store.layouts
    actions = store.actions.layouts
  }

  // select the screen or layout in the UI
  actions.select(currentAssetId)

  // There are leftover stuff, like IDs, so navigate the components and find the ID and select it.
  if ($leftover) {
    // Get the correct screen children.
    const assetChildren = assetList.find(
      asset =>
        asset._id === $params.asset ||
        asset._id === decodeURIComponent($params.asset)
    ).props._children
    findComponent(componentIds, assetChildren)
  }
  // }

  // Find Component with ID and continue
  function findComponent(ids, children) {
    // Setup stuff
    let componentToSelect
    let currentChildren = children

    // Loop through each ID
    ids.forEach(id => {
      // Find ID
      const component = currentChildren.find(child => child._id === id)

      // If it does not exist, ignore (use last valid route)
      if (!component) return

      componentToSelect = component

      // Update childrens array to selected components children
      currentChildren = componentToSelect._children
    })

    // Select Component!
    if (componentToSelect) store.actions.components.select(componentToSelect)
  }
</script>

<slot />
