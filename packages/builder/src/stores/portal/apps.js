import { writable } from "svelte/store"
import { get } from "builderStore/api"
import { AppStatus } from "../../constants"
import api from "../../builderStore/api"

export function createAppStore() {
  const store = writable([])

  async function load() {
    try {
      const res = await get(`/api/applications?status=all`)
      const json = await res.json()
      if (res.ok && Array.isArray(json)) {
        // Merge apps into one sensible list
        let appMap = {}
        let devApps = json.filter(app => app.status === AppStatus.DEV)
        let deployedApps = json.filter(app => app.status === AppStatus.DEPLOYED)

        // First append all dev app version
        devApps.forEach(app => {
          const id = app.appId.substring(8)
          appMap[id] = {
            ...app,
            devId: app.appId,
            devRev: app._rev,
          }
        })

        // Then merge with all prod app versions
        deployedApps.forEach(app => {
          const id = app.appId.substring(4)
          appMap[id] = {
            ...appMap[id],
            ...app,
            prodId: app.appId,
            prodRev: app._rev,
          }
        })

        // Transform into an array and clean up
        const apps = Object.values(appMap)
        apps.forEach(app => {
          app.appId = app.devId.substring(8)
          delete app._id
          delete app._rev
        })
        store.set(apps)
      } else {
        store.set([])
      }
      return json
    } catch (error) {
      store.set([])
    }
  }

  async function update(appId, name) {
    const response = await api.put(`/api/applications/${appId}`, { name })
    if (response.status === 200) {
      store.update(state => {
        const updatedAppIndex = state.findIndex(
          app => app.instance._id === appId
        )
        if (updatedAppIndex !== -1) {
          const updatedApp = state[updatedAppIndex]
          updatedApp.name = name
          state.apps = state.splice(updatedAppIndex, 1, updatedApp)
        }
        return state
      })
    } else {
      throw new Error("Error updating name")
    }
  }

  return {
    subscribe: store.subscribe,
    load,
    update,
  }
}

export const apps = createAppStore()
