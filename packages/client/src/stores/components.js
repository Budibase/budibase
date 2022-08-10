import { get, writable, derived } from "svelte/store"
import Manifest from "manifest.json"
import { findComponentById, findComponentPathById } from "../utils/components"
import { devToolsStore } from "./devTools"
import { screenStore } from "./screens"
import { builderStore } from "./builder"
import Router from "../components/Router.svelte"
import * as AppComponents from "../components/app/index.js"

const budibasePrefix = "@budibase/standard-components/"

const createComponentStore = () => {
  const store = writable({})

  const derivedStore = derived(
    [store, builderStore, devToolsStore, screenStore],
    ([$store, $builderState, $devToolsState, $screenState]) => {
      // Avoid any of this logic if we aren't in the builder preview
      if (!$builderState.inBuilder && !$devToolsState.visible) {
        return {}
      }

      // Derive the selected component instance and definition
      let asset
      const { screen, selectedComponentId } = $builderState
      if ($builderState.inBuilder) {
        asset = screen
      } else {
        asset = $screenState.activeScreen
      }
      const component = findComponentById(asset?.props, selectedComponentId)
      const prefix = "@budibase/standard-components/"
      const type = component?._component?.replace(prefix, "")
      const definition = type ? Manifest[type] : null

      // Derive the selected component path
      const path =
        findComponentPathById(asset?.props, selectedComponentId) || []

      return {
        customComponentManifest: $store.customComponentManifest,
        selectedComponentInstance: $store[selectedComponentId],
        selectedComponent: component,
        selectedComponentDefinition: definition,
        selectedComponentPath: path?.map(component => component._id),
        mountedComponents: Object.keys($store).length,
        currentAsset: asset,
      }
    }
  )

  const registerInstance = (id, instance) => {
    store.update(state => ({
      ...state,
      [id]: instance,
    }))
  }

  const unregisterInstance = id => {
    store.update(state => {
      delete state[id]
      return state
    })
  }

  const isComponentRegistered = id => {
    return get(store)[id] != null
  }

  const getComponentById = id => {
    const asset = get(derivedStore).currentAsset
    return findComponentById(asset?.props, id)
  }

  const getComponentDefinition = type => {
    if (!type) {
      return null
    }

    // Screenslot is an edge case
    if (type === "screenslot") {
      type = `${budibasePrefix}${type}`
    }

    // Handle built-in components
    if (type.startsWith(budibasePrefix)) {
      type = type.replace(budibasePrefix, "")
      return type ? Manifest[type] : null
    }

    // Handle custom components
    const { customComponentManifest } = get(store)
    return customComponentManifest?.[type]?.schema?.schema
  }

  const getComponentConstructor = type => {
    if (!type) {
      return null
    }
    if (type === "screenslot") {
      return Router
    }

    // Handle budibase components
    if (type.startsWith(budibasePrefix)) {
      const split = type.split("/")
      const name = split[split.length - 1]
      return AppComponents[name]
    }

    // Handle custom components
    const { customComponentManifest } = get(store)
    return customComponentManifest?.[type]?.Component
  }

  const registerCustomComponent = ({ Component, schema }) => {
    if (!Component || !schema?.schema?.name) {
      return
    }
    store.update(state => {
      if (!state.customComponentManifest) {
        state.customComponentManifest = {}
      }
      state.customComponentManifest[schema.schema.name] = {
        schema,
        Component,
      }
      return state
    })
  }

  return {
    ...derivedStore,
    actions: {
      registerInstance,
      unregisterInstance,
      isComponentRegistered,
      getComponentById,
      getComponentDefinition,
      getComponentConstructor,
      registerCustomComponent,
    },
  }
}

export const componentStore = createComponentStore()
