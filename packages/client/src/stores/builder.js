import { writable, derived } from "svelte/store"
import Manifest from "manifest.json"
import { findComponentById, findComponentPathById } from "../utils/components"
import { pingEndUser } from "../api"

const dispatchEvent = (type, data = {}) => {
  window.parent.postMessage({ type, data })
}

const createBuilderStore = () => {
  const initialState = {
    inBuilder: false,
    appId: null,
    layout: null,
    screen: null,
    selectedComponentId: null,
    previewId: null,
    previewType: null,
    selectedPath: [],
    theme: null,
    customTheme: null,
    previewDevice: "desktop",
    isDragging: false,
  }
  const writableStore = writable(initialState)
  const derivedStore = derived(writableStore, $state => {
    // Avoid any of this logic if we aren't in the builder preview
    if (!$state.inBuilder) {
      return $state
    }

    // Derive the selected component instance and definition
    const { layout, screen, previewType, selectedComponentId } = $state
    const asset = previewType === "layout" ? layout : screen
    const component = findComponentById(asset?.props, selectedComponentId)
    const prefix = "@budibase/standard-components/"
    const type = component?._component?.replace(prefix, "")
    const definition = type ? Manifest[type] : null

    // Derive the selected component path
    const path = findComponentPathById(asset.props, selectedComponentId) || []

    return {
      ...$state,
      selectedComponent: component,
      selectedComponentDefinition: definition,
      selectedComponentPath: path?.map(component => component._id),
    }
  })

  const actions = {
    selectComponent: id => {
      dispatchEvent("select-component", { id })
    },
    updateProp: (prop, value) => {
      dispatchEvent("update-prop", { prop, value })
    },
    deleteComponent: id => {
      dispatchEvent("delete-component", { id })
    },
    notifyLoaded: () => {
      dispatchEvent("preview-loaded")
    },
    pingEndUser: () => {
      pingEndUser()
    },
    setSelectedPath: path => {
      writableStore.update(state => {
        state.selectedPath = path
        return state
      })
    },
    moveComponent: (componentId, destinationComponentId, mode) => {
      dispatchEvent("move-component", {
        componentId,
        destinationComponentId,
        mode,
      })
    },
    setDragging: dragging => {
      writableStore.update(state => {
        state.isDragging = dragging
        return state
      })
    },
  }
  return {
    ...writableStore,
    subscribe: derivedStore.subscribe,
    actions,
  }
}

export const builderStore = createBuilderStore()
