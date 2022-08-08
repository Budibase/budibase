import { writable } from "svelte/store"
import { AppStatus } from "../../constants"
import { API } from "api"

const extractAppId = id => {
  const split = id?.split("_") || []
  return split.length ? split[split.length - 1] : null
}

const getProdAppID = appId => {
  if (!appId || !appId.startsWith("app_dev")) {
    return appId
  }
  // split to take off the app_dev element, then join it together incase any other app_ exist
  const split = appId.split("app_dev")
  split.shift()
  const rest = split.join("app_dev")
  return `${"app"}${rest}`
}

export function createAppStore() {
  const store = writable([])

  async function load() {
    const json = await API.getApps()
    if (Array.isArray(json)) {
      // Merge apps into one sensible list
      let appMap = {}
      let devApps = json.filter(app => app.status === AppStatus.DEV)
      let deployedApps = json.filter(app => app.status === AppStatus.DEPLOYED)

      // First append all dev app version
      devApps.forEach(app => {
        const id = extractAppId(app.appId)
        appMap[id] = {
          ...app,
          devId: app.appId,
          devRev: app._rev,
        }
      })

      // Then merge with all prod app versions
      deployedApps.forEach(app => {
        const id = extractAppId(app.appId)

        // Skip any deployed apps which don't have a dev counterpart
        if (!appMap[id]) {
          return
        }

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
        app.appId = extractAppId(app.devId)
        delete app._id
        delete app._rev
      })
      store.set(apps)
    } else {
      store.set([])
    }
  }

  async function update(appId, value) {
    await API.saveAppMetadata({
      appId,
      metadata: value,
    })
    store.update(state => {
      const updatedAppIndex = state.findIndex(app => app.instance._id === appId)
      if (updatedAppIndex !== -1) {
        let updatedApp = state[updatedAppIndex]
        updatedApp = { ...updatedApp, ...value }
        state.apps = state.splice(updatedAppIndex, 1, updatedApp)
      }
      return state
    })
  }

  return {
    subscribe: store.subscribe,
    load,
    update,
    extractAppId,
    getProdAppID,
  }
}

export const apps = createAppStore()
