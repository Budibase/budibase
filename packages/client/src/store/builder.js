import { writable, derived } from "svelte/store"
import Manifest from "@budibase/standard-components/manifest.json"

const dispatchEvent = (type, data = {}) => {
  window.dispatchEvent(
    new CustomEvent("bb-event", {
      detail: { type, data },
    })
  )
}

const findComponentById = (component, componentId) => {
  if (!component || !componentId) {
    return null
  }
  if (component._id === componentId) {
    return component
  }
  if (!component._children?.length) {
    return null
  }
  for (let child of component._children) {
    const result = findComponentById(child, componentId)
    if (result) {
      return result
    }
  }
  return null
}

const findComponentIdPath = (component, componentId, path = []) => {
  if (!component || !componentId) {
    return null
  }
  path = [...path, component._id]
  if (component._id === componentId) {
    return path
  }
  if (!component._children?.length) {
    return null
  }
  for (let child of component._children) {
    const result = findComponentIdPath(child, componentId, path)
    if (result) {
      return result
    }
  }
  return null
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
    const path = findComponentIdPath(asset.props, selectedComponentId) || []

    return {
      ...$state,
      selectedComponent: component,
      selectedComponentDefinition: definition,
      selectedComponentPath: path,
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
    setSelectedPath: path => {
      console.log("set to ")
      console.log(path)
      writableStore.update(state => {
        state.selectedPath = path
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
