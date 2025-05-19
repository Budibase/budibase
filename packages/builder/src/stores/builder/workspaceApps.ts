import { DerivedBudiStore } from "@/stores/BudiStore"
import {
  WorkspaceApp,
  UIWorkspaceApp,
  FetchAppPackageResponse,
  FeatureFlag,
} from "@budibase/types"
import { derived, Readable } from "svelte/store"
import { screenStore } from "./screens"
import { Helpers } from "@budibase/bbui"
import { featureFlag } from "@/helpers"

interface WorkspaceAppStoreState {
  workspaceApps: WorkspaceApp[]
  loading: boolean
}

interface DerivedWorkspaceAppStoreState {
  workspaceApps: UIWorkspaceApp[]
}

export class WorkspaceAppStore extends DerivedBudiStore<
  WorkspaceAppStoreState,
  DerivedWorkspaceAppStoreState
> {
  constructor() {
    const makeDerivedStore = (store: Readable<WorkspaceAppStoreState>) => {
      return derived([store, screenStore], ([$store, $screenStore]) => {
        const workspaceApps = $store.workspaceApps.map<UIWorkspaceApp>(
          workspaceApp => {
            return {
              ...workspaceApp,
              screens: $screenStore.screens.filter(
                s => s.workspaceAppId === workspaceApp._id
              ),
            }
          }
        )

        return { workspaceApps }
      })
    }

    super(
      {
        workspaceApps: [],
        loading: true,
      },
      makeDerivedStore
    )
  }

  syncWorkspaceApps(pkg: FetchAppPackageResponse) {
    let workspaceApps = featureFlag.isEnabled(FeatureFlag.WORKSPACE_APPS)
      ? pkg.workspaceApps
      : []
    this.update(state => ({
      ...state,
      workspaceApps,
      loading: false,
    }))
  }

  async add(workspaceApp: WorkspaceApp) {
    this.store.update(state => {
      state.workspaceApps.push({ ...workspaceApp, _id: Helpers.uuid() })
      return state
    })
  }

  async edit(workspaceApp: WorkspaceApp) {
    this.store.update(state => {
      const index = state.workspaceApps.findIndex(
        app => app._id === workspaceApp._id
      )
      if (index === -1) {
        throw new Error(`App not found with id "${workspaceApp._id}"`)
      }

      state.workspaceApps[index] = {
        ...workspaceApp,
      }
      return state
    })
  }

  async delete(_id: string | undefined, _rev: string | undefined) {
    this.store.update(state => {
      state.workspaceApps = state.workspaceApps.filter(app => app._id !== _id)
      return state
    })
  }
}

export const workspaceAppStore = new WorkspaceAppStore()
