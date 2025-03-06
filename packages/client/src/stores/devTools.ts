import { createLocalStorageStore } from "@budibase/frontend-core"
import { initialise } from "./initialise"
import { authStore } from "./auth"
import { API } from "../api"
import { get } from "svelte/store"

interface DevToolsState {
  visible: boolean
  allowSelection: boolean
  role: string | null
}

const createDevToolStore = () => {
  const store = createLocalStorageStore<DevToolsState>("bb-devtools", {
    visible: false,
    allowSelection: false,
    role: null,
  })

  const setVisible = (visible: boolean) => {
    store.update(state => ({
      ...state,
      visible,
    }))
  }

  const setAllowSelection = (allowSelection: boolean) => {
    store.update(state => ({
      ...state,
      allowSelection,
    }))
  }

  const changeRole = async (role: string | null) => {
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
