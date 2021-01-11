import { getFrontendStore } from "./store/frontend"
import { getBackendUiStore } from "./store/backend"
import { getAutomationStore } from "./store/automation"
import { getHostingStore } from "./store/hosting"

import { getThemeStore } from "./store/theme"
import { derived, writable } from "svelte/store"
import analytics from "analytics"
import { FrontendTypes, LAYOUT_NAMES } from "../constants"
import { makePropsSafe } from "components/userInterface/assetParsing/createProps"

export const store = getFrontendStore()
export const backendUiStore = getBackendUiStore()
export const automationStore = getAutomationStore()
export const themeStore = getThemeStore()
export const hostingStore = getHostingStore()

export const currentAsset = derived(store, $store => {
  const type = $store.currentFrontEndType
  if (type === FrontendTypes.SCREEN) {
    return $store.screens.find(screen => screen._id === $store.selectedScreenId)
  } else if (type === FrontendTypes.LAYOUT) {
    return $store.layouts.find(layout => layout._id === $store.selectedLayoutId)
  }
  return null
})

export const selectedComponent = derived(
  [store, currentAsset],
  ([$store, $currentAsset]) => {
    if (!$currentAsset || !$store.selectedComponentId) return null

    function traverse(node, callback) {
      if (node._id === $store.selectedComponentId) return callback(node)

      if (node._children) {
        node._children.forEach(child => traverse(child, callback))
      }

      if (node.props) {
        traverse(node.props, callback)
      }
    }

    let component
    traverse($currentAsset, found => {
      const componentIdentifier = found._component ?? found.props._component
      const componentDef = componentIdentifier.startsWith("##")
        ? found
        : $store.components[componentIdentifier]

      component = makePropsSafe(componentDef, found)
    })

    return component
  }
)

export const currentAssetId = derived(store, $store => {
  return $store.currentFrontEndType === FrontendTypes.SCREEN
    ? $store.selectedScreenId
    : $store.selectedLayoutId
})

export const currentAssetName = derived(currentAsset, $currentAsset => {
  return $currentAsset?.name
})

// leave this as before for consistency
export const allScreens = derived(store, $store => {
  return $store.screens
})

export const mainLayout = derived(store, $store => {
  return $store.layouts?.find(
    layout => layout._id === LAYOUT_NAMES.MASTER.PRIVATE
  )
})

export const selectedAccessRole = writable("BASIC")

export const initialise = async () => {
  try {
    await analytics.activate()
    analytics.captureEvent("Builder Started")
  } catch (err) {
    console.log(err)
  }
}
