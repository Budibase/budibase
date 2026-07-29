import { API } from "@/api"
import { AppStatus } from "@/constants"
import { EnrichedApp, StoreApp } from "@/types"
import { UpdateWorkspaceRequest, Workspace } from "@budibase/types"
import { derived } from "svelte/store"
import { BudiStore } from "../BudiStore"
import { auth } from "./auth"
import { sdk } from "@budibase/shared-core"

export interface PortalWorkspacesStore {
  apps: StoreApp[]
  sortBy?: string
}

export class WorkspacesStore extends BudiStore<PortalWorkspacesStore> {
  constructor() {
    super({
      apps: [],
    })

    this.extractAppId = this.extractAppId.bind(this)
    this.getProdWorkspaceID = this.getProdWorkspaceID.bind(this)
    this.updateSort = this.updateSort.bind(this)
    this.load = this.load.bind(this)
    this.save = this.save.bind(this)
  }

  extractAppId(appId?: string) {
    const split = appId?.split("_") || []
    return split.length ? split[split.length - 1] : null
  }

  getProdWorkspaceID(workspaceId: string) {
    if (!workspaceId) {
      return workspaceId
    }
    let rest,
      separator = ""
    if (workspaceId.startsWith("app_dev")) {
      // split to take off the app_dev element, then join it together incase any other app_ exist
      const split = workspaceId.split("app_dev")
      split.shift()
      rest = split.join("app_dev")
    } else if (!workspaceId.startsWith("app")) {
      rest = workspaceId
      separator = "_"
    } else {
      return workspaceId
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
    this.update(state => ({
      ...state,
    }))
    const json = await API.getApps()
    if (Array.isArray(json)) {
      // Merge development and deployed workspaces into one sensible list.
      let workspaceMap: Record<string, StoreApp> = {}
      const devWorkspaces = json.filter(
        workspace => workspace.status === AppStatus.DEV
      )
      const deployedWorkspaces = json.filter(
        workspace => workspace.status === AppStatus.DEPLOYED
      )

      // First append all development workspace versions.
      devWorkspaces.forEach(workspace => {
        const id = this.extractAppId(workspace.appId)
        if (!id) {
          return
        }
        workspaceMap[id] = {
          ...workspace,
          devId: workspace.appId,
          devRev: workspace._rev,
        }
      })

      // Then merge in all deployed workspace versions.
      deployedWorkspaces.forEach(workspace => {
        const id = this.extractAppId(workspace.appId)
        if (!id) {
          return
        }

        // Skip deployed workspaces without a development counterpart.
        if (!workspaceMap[id]) {
          return
        }

        // Preserve selected development metadata on the deployed workspace.
        let devProps: Pick<Workspace, "updatedBy" | "updatedAt"> = {}
        if (workspaceMap[id]) {
          devProps = {
            updatedBy: workspaceMap[id].updatedBy,
            updatedAt: workspaceMap[id].updatedAt,
          }
        }
        workspaceMap[id] = {
          ...workspaceMap[id],
          ...workspace,
          ...devProps,
          prodId: workspace.appId,
          prodRev: workspace._rev,
        }
      })

      // Transform into an array and clean up
      const apps = Object.values(workspaceMap)
      apps.forEach(workspace => {
        const workspaceId = this.extractAppId(workspace.devId)
        if (workspaceId) {
          workspace.appId = workspaceId
        }
        delete workspace._id
        delete workspace._rev
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

  async save(workspaceId: string, value: UpdateWorkspaceRequest) {
    await API.saveAppMetadata(workspaceId, value)
    this.update(state => {
      const updatedWorkspaceIndex = state.apps.findIndex(
        workspace => workspace.instance._id === workspaceId
      )
      if (updatedWorkspaceIndex !== -1) {
        let updatedWorkspace = state.apps[updatedWorkspaceIndex]
        updatedWorkspace = { ...updatedWorkspace, ...value }
        state.apps.splice(updatedWorkspaceIndex, 1, updatedWorkspace)
      }
      return state
    })
  }
}

export const workspacesStore = new WorkspacesStore()

export const sortBy = derived([workspacesStore, auth], ([$store, $auth]) => {
  return $store.sortBy || $auth.user?.appSort || "name"
})

// Centralise the logic that enriches the workspace list.
export const enrichedApps = derived(
  [workspacesStore, auth, sortBy],
  ([$store, $auth, $sortBy]) => {
    const enrichedApps: EnrichedApp[] = $store.apps.map(workspace => {
      const user = $auth.user
      return {
        ...workspace,
        deployed: workspace.status === AppStatus.DEPLOYED,
        lockedYou:
          workspace.lockedBy != null &&
          workspace.lockedBy.email === user?.email,
        lockedOther:
          workspace.lockedBy != null &&
          workspace.lockedBy.email !== user?.email,
        favourite: !!user?.appFavourites?.includes(workspace.appId),
        editable: sdk.users.isBuilder(user, workspace?.devId),
      }
    })

    if ($sortBy === "status") {
      return enrichedApps.sort((a, b) => {
        if (a.status === b.status) {
          return a.name?.toLowerCase() < b.name?.toLowerCase() ? -1 : 1
        }
        return a.status === AppStatus.DEPLOYED ? -1 : 1
      })
    } else if ($sortBy === "updated") {
      return enrichedApps?.sort((a, b) => {
        const aUpdated = a.updatedAt || "9999"
        const bUpdated = b.updatedAt || "9999"
        return aUpdated < bUpdated ? 1 : -1
      })
    } else {
      return enrichedApps?.sort((a, b) => {
        return a.name?.toLowerCase() < b.name?.toLowerCase() ? -1 : 1
      })
    }
  }
)
