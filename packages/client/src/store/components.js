import { writable, get } from "svelte/store"
import { getAppId } from "@budibase/component-sdk"
import Router from "../components/Router.svelte"

const initialState = {}

export const createComponentStore = () => {
  const store = writable(initialState)

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
    const split = componentName.split("/")
    const strippedName = split[split.length - 1]

    // Edge case for screen slot
    if (strippedName === "screenslot") {
      return Router
    }
    return get(store)[strippedName]
  }

  // Attach actions to the store
  store.actions = { getComponent, loadComponentLibrary }

  return store
}
