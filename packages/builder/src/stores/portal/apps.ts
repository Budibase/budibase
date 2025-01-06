import { derived } from "svelte/store"
import { AppStatus } from "@/constants"
import { API } from "@/api"
import { auth } from "./auth"
import { BudiStore } from "../BudiStore"
import { App, UpdateAppRequest } from "@budibase/types"

interface AppIdentifierMetadata {
  devId?: string
  devRev?: string
  prodId?: string
  prodRev?: string
}

interface AppUIMetadata {
  deployed: boolean
  lockedYou: boolean
  lockedOther: boolean
  favourite: boolean
}

interface StoreApp extends App, AppIdentifierMetadata {}

interface EnrichedApp extends StoreApp, AppUIMetadata {}

interface PortalAppsStore {
  apps: StoreApp[]
  sortBy?: string
}

export class AppsStore extends BudiStore<PortalAppsStore> {
  constructor() {
    super({
      apps: [],
    })

    this.extractAppId = this.extractAppId.bind(this)
    this.getProdAppID = this.getProdAppID.bind(this)
    this.updateSort = this.updateSort.bind(this)
    this.load = this.load.bind(this)
    this.save = this.save.bind(this)
  }

  extractAppId(appId?: string) {
    const split = appId?.split("_") || []
    return split.length ? split[split.length - 1] : null
  }

  getProdAppID(appId: string) {
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

  async updateSort(sortBy: string) {
    this.update(state => ({
      ...state,
      sortBy,
    }))
    await this.updateUserSort(sortBy)
  }

  async updateUserSort(sortBy: string) {
    try {
      await auth.updateSelf({ appSort: sortBy })
    } catch (err) {
      console.error("couldn't save user sort: ", err)
    }
  }

  async load() {
    const json = (await API.getApps()) as App[]
    if (Array.isArray(json)) {
      // Merge apps into one sensible list
      let appMap: Record<string, StoreApp> = {}
      let devApps = json.filter(app => app.status === AppStatus.DEV)
      let deployedApps = json.filter(app => app.status === AppStatus.DEPLOYED)

      // First append all dev app version
      devApps.forEach(app => {
        const id = this.extractAppId(app.appId)
        if (!id) {
          return
        }
        appMap[id] = {
          ...app,
          devId: app.appId,
          devRev: app._rev,
        }
      })

      // Then merge with all prod app versions
      deployedApps.forEach(app => {
        const id = this.extractAppId(app.appId)
        if (!id) {
          return
        }

        // Skip any deployed apps which don't have a dev counterpart
        if (!appMap[id]) {
          return
        }

        // Extract certain properties from the dev app to override the prod app
        let devProps: Pick<App, "updatedBy" | "updatedAt"> = {}
        if (appMap[id]) {
          devProps = {
            updatedBy: appMap[id].updatedBy,
            updatedAt: appMap[id].updatedAt,
          }
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
        const appId = this.extractAppId(app.devId)
        if (appId) {
          app.appId = appId
        }
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

  async save(appId: string, value: UpdateAppRequest) {
    await API.saveAppMetadata(appId, value)
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
    const enrichedApps: EnrichedApp[] = $store.apps.map(app => {
      const user = $auth.user
      return {
        ...app,
        deployed: app.status === AppStatus.DEPLOYED,
        lockedYou: app.lockedBy != null && app.lockedBy.email === user?.email,
        lockedOther: app.lockedBy != null && app.lockedBy.email !== user?.email,
        favourite: !!user?.appFavourites?.includes(app.appId),
      }
    })

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
