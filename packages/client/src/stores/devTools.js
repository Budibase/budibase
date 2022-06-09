import { createLocalStorageStore } from "@budibase/frontend-core"
import { initialise } from "./initialise"
import { authStore } from "./auth"
import { API } from "../api"

const initialState = {
  enabled: false,
  visible: false,
  allowSelection: false,
  role: null,
}

const createDevToolStore = () => {
  const store = createLocalStorageStore("bb-devtools", initialState)

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
    API.invalidateCache()
    await authStore.actions.fetchUser()
    await initialise()
  }

  return {
    subscribe: store.subscribe,
    actions: { setEnabled, setVisible, setAllowSelection, changeRole },
  }
}

export const devToolsStore = createDevToolStore()
