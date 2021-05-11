import { writable } from "svelte/store"
import api, { get } from "../api"

const INITIAL_HOSTING_UI_STATE = {
  appUrl: "",
  deployedApps: {},
  deployedAppNames: [],
  deployedAppUrls: [],
}

export const getHostingStore = () => {
  const store = writable({ ...INITIAL_HOSTING_UI_STATE })
  store.actions = {
    fetch: async () => {
      const response = await api.get("/api/hosting/urls")
      const urls = await response.json()
      store.update(state => {
        state.appUrl = urls.app
        return state
      })
    },
    fetchDeployedApps: async () => {
      let deployments = await (await get("/api/hosting/apps")).json()
      store.update(state => {
        state.deployedApps = deployments
        state.deployedAppNames = Object.values(deployments).map(app => app.name)
        state.deployedAppUrls = Object.values(deployments).map(app => app.url)
        return state
      })
      return deployments
    },
  }
  return store
}
