import { DerivedBudiStore } from "@/stores/BudiStore"
import {
  WorkspaceApp,
  UIWorkspaceApp,
  FeatureFlag,
  UpdateWorkspaceAppRequest,
} from "@budibase/types"
import { derived, Readable } from "svelte/store"
import { screenStore } from "./screens"
import { featureFlag } from "@/helpers"
import { API } from "@/api"

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
        const workspaceApps = $store.workspaceApps
          .map<UIWorkspaceApp>(workspaceApp => {
            return {
              ...workspaceApp,
              screens: $screenStore.screens.filter(
                s => s.workspaceAppId === workspaceApp._id
              ),
            }
          })
          .sort((a, b) => a.name.localeCompare(b.name))

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

  async fetch() {
    if (!featureFlag.isEnabled(FeatureFlag.WORKSPACE_APPS)) {
      return
    }
    const { workspaceApps } = await API.workspaceApp.fetch()
    this.update(state => ({
      ...state,
      workspaceApps,
      loading: false,
    }))
  }

  async add(workspaceApp: WorkspaceApp) {
    const createdWorkspaceApp = await API.workspaceApp.create(workspaceApp)
    this.store.update(state => {
      state.workspaceApps.push(createdWorkspaceApp.workspaceApp)
      return state
    })
  }

  async edit(workspaceApp: UpdateWorkspaceAppRequest) {
    const updatedWorkspaceApp = await API.workspaceApp.update(workspaceApp)
    this.store.update(state => {
      const index = state.workspaceApps.findIndex(
        app => app._id === workspaceApp._id
      )
      if (index === -1) {
        throw new Error(`App not found with id "${workspaceApp._id}"`)
      }

      state.workspaceApps[index] = {
        ...updatedWorkspaceApp.workspaceApp,
      }
      return state
    })
  }

  async delete(id: string, rev: string) {
    await API.workspaceApp.delete(id, rev)
    this.store.update(state => {
      state.workspaceApps = state.workspaceApps.filter(app => app._id !== id)
      return state
    })
  }
}

export const workspaceAppStore = new WorkspaceAppStore()
