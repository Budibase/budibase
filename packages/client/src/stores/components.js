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
  const store = writable({
    customComponentManifest: {},
    customComponentMap: {},
    mountedComponents: {},
  })

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
      const definition = getComponentDefinition(component?._component)

      // Derive the selected component path
      const path =
        findComponentPathById(asset?.props, selectedComponentId) || []

      return {
        customComponentManifest: $store.customComponentManifest,
        selectedComponentInstance:
          $store.mountedComponents[selectedComponentId],
        selectedComponent: component,
        selectedComponentDefinition: definition,
        selectedComponentPath: path?.map(component => component._id),
        mountedComponentCount: Object.keys($store.mountedComponents).length,
        currentAsset: asset,
      }
    }
  )

  const registerInstance = (id, instance) => {
    store.update(state => {
      // If this is a custom component, flag it so we can reload this component
      // later if required
      const component = instance.component
      if (component?.startsWith("plugin")) {
        if (!state.customComponentMap[component]) {
          state.customComponentMap[component] = [id]
        } else {
          state.customComponentMap[component].push(id)
        }
      }

      // Register to mounted components
      state.mountedComponents[id] = instance
      return state
    })
  }

  const unregisterInstance = id => {
    store.update(state => {
      // Remove from custom component map if required
      const component = state.mountedComponents[id]?.instance?.component
      let customComponentMap = state.customComponentMap
      if (component?.startsWith("plugin")) {
        customComponentMap[component] = customComponentMap[component].filter(
          x => {
            return x !== id
          }
        )
      }

      // Remove from mounted components
      delete state.mountedComponents[id]
      return state
    })
  }

  const isComponentRegistered = id => {
    return get(store).mountedComponents[id] != null
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

  const registerCustomComponent = ({ Component, schema, version }) => {
    if (!Component || !schema?.schema?.name || !version) {
      return
    }
    const component = `plugin/${schema.schema.name}`
    store.update(state => {
      state.customComponentManifest[component] = {
        Component,
        schema,
      }
      return state
    })

    // Reload any mounted instances of this custom component
    const state = get(store)
    if (state.customComponentMap[component]?.length) {
      state.customComponentMap[component].forEach(id => {
        state.mountedComponents[id]?.reload()
      })
    }
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
