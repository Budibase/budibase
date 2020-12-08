import { getFrontendStore } from "./store/frontend"
import { getBackendUiStore } from "./store/backend"
import { getAutomationStore } from "./store/automation/"
import { getThemeStore } from "./store/theme"
import { derived } from "svelte/store"
import analytics from "analytics"
import { LAYOUT_NAMES } from "../constants"
import { makePropsSafe } from "components/userInterface/assetParsing/createProps"

export const store = getFrontendStore()
export const backendUiStore = getBackendUiStore()
export const automationStore = getAutomationStore()
export const themeStore = getThemeStore()

export const currentAsset = derived(store, $store => {
  const layout = $store.layouts
    ? $store.layouts.find(layout => layout._id === $store.currentAssetId)
    : null

  if (layout) return layout

  const screen = $store.screens
    ? $store.screens.find(screen => screen._id === $store.currentAssetId)
    : null

  if (screen) return screen

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

export const currentAssetName = derived(store, () => {
  return currentAsset.name
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

export const initialise = async () => {
  try {
    await analytics.activate()
    analytics.captureEvent("Builder Started")
  } catch (err) {
    console.log(err)
  }
}
