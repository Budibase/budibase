import { writable, derived, get } from "svelte/store"
import Manifest from "manifest.json"
import { findComponentById, findComponentPathById } from "../utils/components"
import { API } from "api"

const dispatchEvent = (type, data = {}) => {
  window.parent.postMessage({ type, data })
}

const createBuilderStore = () => {
  const initialState = {
    inBuilder: false,
    layout: null,
    screen: null,
    selectedComponentId: null,
    editMode: false,
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
      if (id === get(writableStore).selectedComponentId) {
        return
      }
      writableStore.update(state => ({ ...state, editMode: false }))
      dispatchEvent("select-component", { id })
    },
    updateProp: (prop, value) => {
      dispatchEvent("update-prop", { prop, value })
    },
    deleteComponent: id => {
      dispatchEvent("delete-component", { id })
    },
    duplicateComponent: id => {
      dispatchEvent("duplicate-component", { id })
    },
    notifyLoaded: () => {
      dispatchEvent("preview-loaded")
    },
    pingEndUser: async () => {
      try {
        await API.pingEndUser()
      } catch (error) {
        // Do nothing
      }
    },
    setSelectedPath: path => {
      writableStore.update(state => ({ ...state, selectedPath: path }))
    },
    moveComponent: (componentId, destinationComponentId, mode) => {
      dispatchEvent("move-component", {
        componentId,
        destinationComponentId,
        mode,
      })
    },
    setDragging: dragging => {
      if (dragging === get(writableStore).isDragging) {
        return
      }
      writableStore.update(state => ({ ...state, isDragging: dragging }))
    },
    setEditMode: enabled => {
      if (enabled === get(writableStore).editMode) {
        return
      }
      writableStore.update(state => ({ ...state, editMode: enabled }))
    },
  }
  return {
    ...writableStore,
    set: state => writableStore.set({ ...initialState, ...state }),
    subscribe: derivedStore.subscribe,
    actions,
  }
}

export const builderStore = createBuilderStore()
