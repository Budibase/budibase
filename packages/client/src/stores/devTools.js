import { createLocalStorageStore } from "@budibase/frontend-core"
import { initialise } from "./initialise"
import { authStore } from "./auth"
import { API } from "../api"
import { get } from "svelte/store"

const initialState = {
  visible: false,
  allowSelection: false,
  role: null,
}

const createDevToolStore = () => {
  const store = createLocalStorageStore("bb-devtools", initialState)

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
    if (role === "self") {
      role = null
    }
    if (role === get(store).role) {
      return
    }
    store.update(state => ({
      ...state,
      role,
    }))
    API.invalidateCache()
    await authStore.actions.fetchUser()
    await initialise()
  }

  return {
    subscribe: store.subscribe,
    actions: { setVisible, setAllowSelection, changeRole },
  }
}

export const devToolsStore = createDevToolStore()
