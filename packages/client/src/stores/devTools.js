import { get } from "svelte/store"
import { localStorageStore } from "builder/src/builderStore/store/localStorage"
import { appStore } from "./app"
import { initialise } from "./initialise"
import { authStore } from "./auth"

const initialState = {
  visible: false,
  allowSelection: false,
  role: null,
}

const createDevToolStore = () => {
  const localStorageKey = `${get(appStore).appId}.devTools`
  const store = localStorageStore(localStorageKey, initialState)

  const setVisible = visible => {
    store.update(state => ({
      ...state,
      visible: visible,
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
    // location.reload()
    await authStore.actions.fetchUser()
    await initialise()
  }

  return {
    subscribe: store.subscribe,
    actions: { setVisible, setAllowSelection, changeRole },
  }
}

export const devToolsStore = createDevToolStore()
