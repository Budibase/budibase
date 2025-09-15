import { Component, CustomComponent } from "@budibase/types"
import Manifest from "manifest.json"
import { derived, get, writable } from "svelte/store"
import Router from "../components/Router.svelte"
import * as AppComponents from "../components/app/index.js"
import { ScreenslotID, ScreenslotType } from "../constants"
import { findComponentById, findComponentPathById } from "../utils/components"
import { builderStore } from "./builder"
import { devToolsStore } from "./devTools"
import { screenStore } from "./screens"

export const BudibasePrefix = "@budibase/standard-components/"

interface ComponentStore {
  customComponentManifest: Record<string, CustomComponent>
  customComponentMap: Record<string, string[]>
  mountedComponents: Record<string, Component>
}

const createComponentStore = () => {
  const store = writable<ComponentStore>({
    customComponentManifest: {},
    customComponentMap: {},
    mountedComponents: {},
  })

  const derivedStore = derived(
    [store, builderStore, devToolsStore, screenStore],
    ([$store, $builderStore, $devToolsStore, $screenStore]) => {
      const { inBuilder, selectedComponentId } = $builderStore

      // Avoid any of this logic if we aren't in the builder preview
      if (!inBuilder && !$devToolsStore.visible) {
        return {}
      }

      const root = $screenStore.activeScreen?.props
      const component = findComponentById(root, selectedComponentId)
      const definition = getComponentDefinition(component?._component)

      // Derive the selected component path
      const selectedPath =
        findComponentPathById(root, selectedComponentId) || []

      return {
        customComponentManifest: $store.customComponentManifest,
        selectedComponentInstance: selectedComponentId
          ? $store.mountedComponents[selectedComponentId]
          : undefined,
        selectedComponent: component,
        selectedComponentDefinition: definition,
        selectedComponentPath: selectedPath?.map(component => component._id),
        mountedComponentCount: Object.keys($store.mountedComponents).length,
        screenslotInstance: $store.mountedComponents[ScreenslotID],
      }
    }
  )

  const registerInstance = (id: string, instance: Component) => {
    if (!id) {
      return
    }
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

  const unregisterInstance = (id: string) => {
    if (!id) {
      return
    }
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

  const isComponentRegistered = (id: string) => {
    return get(store).mountedComponents[id] != null
  }

  const getComponentById = (id: string) => {
    const root = get(screenStore).activeScreen?.props
    return findComponentById(root, id)
  }

  const getComponentDefinition = (type: string | undefined) => {
    if (!type) {
      return null
    }

    // Screenslot is an edge case
    if (type === ScreenslotType) {
      type = `${BudibasePrefix}${type}`
    }

    // Handle built-in components
    if (type.startsWith(BudibasePrefix)) {
      type = type.replace(BudibasePrefix, "")
      return type ? Manifest[type as keyof typeof Manifest] : null
    }

    // Handle custom components
    const { customComponentManifest } = get(store)
    return customComponentManifest?.[type]?.schema?.schema
  }

  const getComponentConstructor = (type: string) => {
    if (!type) {
      return null
    }
    if (type === ScreenslotType) {
      return Router
    }

    // Handle budibase components
    if (type.startsWith(BudibasePrefix)) {
      const split = type.split("/")
      const name = split[split.length - 1]
      return AppComponents[name as keyof typeof AppComponents]
    }

    // Handle custom components
    const { customComponentManifest } = get(store)
    return customComponentManifest?.[type]?.Component
  }

  const getComponentInstance = (id: string) => {
    return derived(store, $store => $store.mountedComponents[id])
  }

  const registerCustomComponent = ({
    Component,
    schema,
    version,
  }: {
    Component: Component
    schema: CustomComponent["schema"]
    version: string
  }) => {
    if (!Component || !schema?.schema?.name || !version) {
      return
    }
    const component = `plugin/${schema.schema.name}`
    store.update(state => {
      state.customComponentManifest[component] = {
        Component,
        schema,
        version,
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
      getComponentInstance,
      registerCustomComponent,
    },
  }
}

export const componentStore = createComponentStore()
