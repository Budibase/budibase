<script>
  import { onMount } from "svelte"
  import { get } from "svelte/store"
  import { params, leftover, goto } from "@sveltech/routify"
  import { FrontendTypes } from "constants"
  import { store, allScreens, currentAsset } from "builderStore"
  import { findComponent, findComponentPath } from "builderStore/storeUtils"

  let initialised = false

  // Hydrate state from query param on mount
  onMount(() => {
    const assetId = decodeURI($params.asset)
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

    // Find and select the current asset
    const asset = assetList.find(asset => asset._id === assetId)
    if (asset) {
      actions.select(assetId)

      // Select the component ID if one is present in the URL
      const selectedComponentId = $leftover.split("/").pop()
      if (selectedComponentId) {
        const component = findComponent(asset.props, selectedComponentId)
        if (component) {
          store.actions.components.select(component)
        }
      }
    }

    initialised = true
  })

  // Updates the route params in the URL to the specified values
  const updateParams = (assetType, asset, componentId) => {
    // Wait until the initial state rehydration to avoid a wasted update
    if (!initialised) {
      return
    }

    // Extract current URL params
    const currentParams = get(params)
    const currentLeftover = get(leftover)
    const paramAssetType = currentParams.assetType
    const paramAssetId = currentParams.asset
    const paramComponentId = currentLeftover.split("/").pop()

    // Only update params if the params actually changed
    if (
      assetType !== paramAssetType ||
      asset?._id !== paramAssetId ||
      componentId !== paramComponentId
    ) {
      // Build and navigate to a valid URL
      let url = "../../"
      if ([FrontendTypes.SCREEN, FrontendTypes.LAYOUT].includes(assetType)) {
        url += `${assetType}`
        if (asset?._id) {
          url += `/${asset._id}`
          if (componentId) {
            const componentPath = findComponentPath(asset.props, componentId)
            const componentURL = componentPath
              .slice(1)
              .map(comp => comp._id)
              .join("/")
            url += `/${componentURL}`
          }
        }
      }
      $goto(url)
    }
  }

  // Automatically keep URL up to date with state
  $: updateParams(
    $store.currentFrontEndType,
    $currentAsset,
    $store.selectedComponentId
  )
</script>

<slot />
