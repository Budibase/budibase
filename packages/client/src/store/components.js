import { writable, get } from "svelte/store"
import { getAppId } from "@budibase/component-sdk"
import Router from "../components/Router.svelte"

const createComponentStore = () => {
  const store = writable({})

  /**
   * Loads the component library from the server
   */
  const loadComponentLibrary = async () => {
    const appId = getAppId()
    const library = await import(
      `/componentlibrary?library=@budibase/standard-components&appId=${appId}`
    )
    store.set(library)
  }

  /**
   * Fetches a Svelte component from the standard-components library.
   */
  const getComponent = componentName => {
    if (!componentName) {
      return null
    }

    // Edge case for screen slot
    if (componentName === "screenslot") {
      return Router
    }

    return get(store)[componentName]
  }

  // Attach actions to the store
  store.actions = { getComponent, loadComponentLibrary }

  return store
}

export const componentStore = createComponentStore()
