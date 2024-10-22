import { derived } from "svelte/store"
import { AppStatus } from "constants"
import { API } from "api"
import { auth } from "./auth"
import BudiStore from "../BudiStore" // move this

// properties that should always come from the dev app, not the deployed
const DEV_PROPS = ["updatedBy", "updatedAt"]

export const INITIAL_APPS_STATE = {
  apps: [],
}

export class AppsStore extends BudiStore {
  constructor() {
    super({ ...INITIAL_APPS_STATE })

    this.extractAppId = this.extractAppId.bind(this)
    this.getProdAppID = this.getProdAppID.bind(this)
    this.updateSort = this.updateSort.bind(this)
    this.load = this.load.bind(this)
    this.save = this.save.bind(this)
  }

  extractAppId(id) {
    const split = id?.split("_") || []
    return split.length ? split[split.length - 1] : null
  }

  getProdAppID(appId) {
    if (!appId) {
      return appId
    }
    let rest,
      separator = ""
    if (appId.startsWith("app_dev")) {
      // split to take off the app_dev element, then join it together incase any other app_ exist
      const split = appId.split("app_dev")
      split.shift()
      rest = split.join("app_dev")
    } else if (!appId.startsWith("app")) {
      rest = appId
      separator = "_"
    } else {
      return appId
    }
    return `app${separator}${rest}`
  }

  updateSort(sortBy) {
    this.update(state => ({
      ...state,
      sortBy,
    }))
    this.updateUserSort(sortBy)
  }

  async updateUserSort(sortBy) {
    try {
      await auth.updateSelf({ appSort: sortBy })
    } catch (err) {
      console.error("couldn't save user sort: ", err)
    }
  }

  async load() {
    const json = await API.getApps()
    if (Array.isArray(json)) {
      // Merge apps into one sensible list
      let appMap = {}
      let devApps = json.filter(app => app.status === AppStatus.DEV)
      let deployedApps = json.filter(app => app.status === AppStatus.DEPLOYED)

      // First append all dev app version
      devApps.forEach(app => {
        const id = this.extractAppId(app.appId)
        appMap[id] = {
          ...app,
          devId: app.appId,
          devRev: app._rev,
        }
      })

      // Then merge with all prod app versions
      deployedApps.forEach(app => {
        const id = this.extractAppId(app.appId)

        // Skip any deployed apps which don't have a dev counterpart
        if (!appMap[id]) {
          return
        }

        let devProps = {}
        if (appMap[id]) {
          const entries = Object.entries(appMap[id]).filter(
            ([key]) => DEV_PROPS.indexOf(key) !== -1
          )
          entries.forEach(entry => {
            devProps[entry[0]] = entry[1]
          })
        }
        appMap[id] = {
          ...appMap[id],
          ...app,
          ...devProps,
          prodId: app.appId,
          prodRev: app._rev,
        }
      })

      // Transform into an array and clean up
      const apps = Object.values(appMap)
      apps.forEach(app => {
        app.appId = this.extractAppId(app.devId)
        delete app._id
        delete app._rev
      })
      this.update(state => ({
        ...state,
        apps,
      }))
    } else {
      this.update(state => ({
        ...state,
        apps: [],
      }))
    }
  }

  async save(appId, value) {
    await API.saveAppMetadata({
      appId,
      metadata: value,
    })
    this.update(state => {
      const updatedAppIndex = state.apps.findIndex(
        app => app.instance._id === appId
      )
      if (updatedAppIndex !== -1) {
        let updatedApp = state.apps[updatedAppIndex]
        updatedApp = { ...updatedApp, ...value }
        state.apps.splice(updatedAppIndex, 1, updatedApp)
      }
      return state
    })
  }
}

export const appsStore = new AppsStore()

export const sortBy = derived([appsStore, auth], ([$store, $auth]) => {
  return $store.sortBy || $auth.user?.appSort || "name"
})

// Centralise any logic that enriches the apps list
export const enrichedApps = derived(
  [appsStore, auth, sortBy],
  ([$store, $auth, $sortBy]) => {
    const enrichedApps = $store.apps
      ? $store.apps.map(app => ({
          ...app,
          deployed: app.status === AppStatus.DEPLOYED,
          lockedYou: app.lockedBy && app.lockedBy.email === $auth.user?.email,
          lockedOther: app.lockedBy && app.lockedBy.email !== $auth.user?.email,
          favourite: $auth.user?.appFavourites?.includes(app.appId),
        }))
      : []

    if ($sortBy === "status") {
      return enrichedApps.sort((a, b) => {
        if (a.favourite === b.favourite) {
          if (a.status === b.status) {
            return a.name?.toLowerCase() < b.name?.toLowerCase() ? -1 : 1
          }
          return a.status === AppStatus.DEPLOYED ? -1 : 1
        }
        return a.favourite ? -1 : 1
      })
    } else if ($sortBy === "updated") {
      return enrichedApps?.sort((a, b) => {
        if (a.favourite === b.favourite) {
          const aUpdated = a.updatedAt || "9999"
          const bUpdated = b.updatedAt || "9999"
          return aUpdated < bUpdated ? 1 : -1
        }
        return a.favourite ? -1 : 1
      })
    } else {
      return enrichedApps?.sort((a, b) => {
        if (a.favourite === b.favourite) {
          return a.name?.toLowerCase() < b.name?.toLowerCase() ? -1 : 1
        }
        return a.favourite ? -1 : 1
      })
    }
  }
)
