import { createLocalStorageStore } from "@budibase/frontend-core"
import { initialise } from "./initialise"
import { authStore } from "./auth"
import { API } from "../api"
import { get } from "svelte/store"

interface DevToolsState {
  visible: boolean
  allowSelection: boolean
  role: string | null
  user: string | null
}

const createDevToolStore = () => {
  const store = createLocalStorageStore<DevToolsState>("bb-devtools", {
    visible: false,
    allowSelection: false,
    role: null,
    user: null,
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

  const refetch = async () => {
    API.invalidateCache()
    await authStore.actions.fetchUser()
    await initialise()
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
      user: null,
    }))

    await refetch()
  }

  const changeUser = async (user: string | null) => {
    store.update(state => ({
      ...state,
      user,
      role: null,
    }))

    await refetch()
  }

  return {
    subscribe: store.subscribe,
    actions: { setVisible, setAllowSelection, changeRole, changeUser },
  }
}

export const devToolsStore = createDevToolStore()
