import { writable } from "svelte/store"
import { API } from "api"
import { notifications } from "@budibase/bbui"

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
      try {
        const urls = await API.getHostingURLs()
        store.update(state => {
          state.appUrl = urls.app
          return state
        })
      } catch (error) {
        store.update(state => {
          state.appUrl = ""
          return state
        })
        notifications.error("Error fetching hosting URLs")
      }
    },
    fetchDeployedApps: async () => {
      try {
        const deployments = await API.getDeployedApps()
        store.update(state => {
          state.deployedApps = deployments
          state.deployedAppNames = Object.values(deployments).map(
            app => app.name
          )
          state.deployedAppUrls = Object.values(deployments).map(app => app.url)
          return state
        })
      } catch (error) {
        store.update(state => {
          state.deployedApps = {}
          state.deployedAppNames = []
          state.deployedAppUrls = []
          return state
        })
        notifications.error("Failed detching deployed apps")
      }
    },
  }
  return store
}
