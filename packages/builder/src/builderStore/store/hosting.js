import { writable } from "svelte/store"
import api from "../api"

const INITIAL_BACKEND_UI_STATE = {
  hostingInfo: {},
  appUrl: "",
}

export const getHostingStore = () => {
  const store = writable({ ...INITIAL_BACKEND_UI_STATE })
  store.actions = {
    fetch: async () => {
      const response = await api.get("/api/hosting/")
      const info = await response.json()
      store.update(state => {
        state.hostingInfo = info
        return state
      })
      return info
    },
    save: async hostingInfo => {
      const response = await api.post("/api/hosting", hostingInfo)
      const revision = (await response.json()).rev
      store.update(state => {
        state.hostingInfo = {
          ...hostingInfo,
          _rev: revision,
        }
        return state
      })
    },
  }

  return store
}
