import { writable } from "svelte/store"
import api, {get} from "../api"

const INITIAL_HOSTING_UI_STATE = {
  hostingInfo: {},
  appUrl: "",
  deployedApps: {},
  deployedAppNames: [],
  deployedAppUrls: [],
}

export const getHostingStore = () => {
  const store = writable({ ...INITIAL_HOSTING_UI_STATE })
  store.actions = {
    fetch: async () => {
      const responses = await Promise.all([
        api.get("/api/hosting/"),
        api.get("/api/hosting/urls"),
      ])
      const [info, urls] = await Promise.all(responses.map(resp => resp.json()))
      store.update(state => {
        state.hostingInfo = info
        state.appUrl = urls.app
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
    fetchDeployedApps: async () => {
      let deployments = await (await get("/api/hosting/apps")).json()
      store.update(state => {
        state.deployedApps = deployments
        state.deployedAppNames = Object.values(deployments).map(app => app.name)
        state.deployedAppUrls = Object.values(deployments).map(app => app.url)
        return state
      })
      return deployments
    }
  }
  return store
}
