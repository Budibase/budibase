import { get } from "svelte/store"
import { createLocalStorageStore } from "@budibase/frontend-core"
import { appStore } from "./app"
import { initialise } from "./initialise"
import { authStore } from "./auth"

const initialState = {
  enabled: false,
  visible: false,
  allowSelection: false,
  role: null,
}

const createDevToolStore = () => {
  const localStorageKey = `${get(appStore).appId}.devTools`
  const store = createLocalStorageStore(localStorageKey, initialState)

  const setEnabled = enabled => {
    store.update(state => ({
      ...state,
      enabled,
    }))
  }

  const setVisible = visible => {
    store.update(state => ({
      ...state,
      visible,
    }))
  }

  const setAllowSelection = allowSelection => {
    store.update(state => ({
      ...state,
      allowSelection,
    }))
  }

  const changeRole = async role => {
    store.update(state => ({
      ...state,
      role: role === "self" ? null : role,
    }))
    await authStore.actions.fetchUser()
    await initialise()
  }

  return {
    subscribe: store.subscribe,
    actions: { setEnabled, setVisible, setAllowSelection, changeRole },
  }
}

export const devToolsStore = createDevToolStore()
