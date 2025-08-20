import { API } from "@/api"
import { DerivedBudiStore } from "@/stores/BudiStore"
import {
  InsertWorkspaceAppRequest,
  PublishResourceState,
  RequiredKeys,
  UIWorkspaceApp,
  UpdateWorkspaceAppRequest,
  WorkspaceApp,
} from "@budibase/types"
import { derived, get, Readable } from "svelte/store"
import { appStore } from "./app"
import { sortedScreens } from "./screens"
import { workspaceDeploymentStore } from "./workspaceDeployment"

interface WorkspaceAppStoreState {
  workspaceApps: WorkspaceApp[]
  loading: boolean
  selectedWorkspaceAppId: string | undefined
}

interface DerivedWorkspaceAppStoreState extends WorkspaceAppStoreState {
  workspaceApps: UIWorkspaceApp[]
  selectedWorkspaceApp: UIWorkspaceApp | undefined
}

export class WorkspaceAppStore extends DerivedBudiStore<
  WorkspaceAppStoreState,
  DerivedWorkspaceAppStoreState
> {
  constructor() {
    const makeDerivedStore = (store: Readable<WorkspaceAppStoreState>) => {
      return derived(
        [store, sortedScreens, workspaceDeploymentStore],
        ([$store, $sortedScreens, $workspaceDeploymentStore]) => {
          const workspaceApps = $store.workspaceApps
            .map<UIWorkspaceApp>(workspaceApp => {
              return {
                ...workspaceApp,
                screens: $sortedScreens.filter(
                  s => s.workspaceAppId === workspaceApp._id
                ),
                publishStatus: $workspaceDeploymentStore.workspaceApps[
                  workspaceApp._id!
                ] || {
                  state: PublishResourceState.DISABLED,
                  unpublishedChanges: true,
                },
              }
            })
            .sort((a, b) => a.name.localeCompare(b.name))

          const selectedWorkspaceApp = $store.selectedWorkspaceAppId
            ? workspaceApps.find(a => a._id === $store.selectedWorkspaceAppId)
            : undefined

          return { ...$store, workspaceApps, selectedWorkspaceApp }
        }
      )
    }

    super(
      {
        workspaceApps: [],
        loading: true,
        selectedWorkspaceAppId: undefined,
      },
      makeDerivedStore
    )
  }

  async fetch() {
    const { workspaceApps } = await API.workspaceApp.fetch()
    this.update(state => ({
      ...state,
      workspaceApps,
      loading: false,
    }))
  }
  async refresh() {
    return this.fetch()
  }

  select(workspaceAppId: string) {
    const state = get(this.store)
    const workspaceApp = state.workspaceApps.find(
      app => app._id === workspaceAppId
    )
    if (!workspaceApp) {
      return
    }

    // Check screen isn't already selected
    if (state.selectedWorkspaceAppId === workspaceApp._id) {
      return
    }

    // Select new screen
    this.update(state => {
      state.selectedWorkspaceAppId = workspaceAppId
      return state
    })
  }

  async add(workspaceApp: InsertWorkspaceAppRequest) {
    const { workspaceApp: createdWorkspaceApp } =
      await API.workspaceApp.create(workspaceApp)
    this.store.update(state => ({
      ...state,
      workspaceApps: [...state.workspaceApps, createdWorkspaceApp],
    }))
    return createdWorkspaceApp
  }

  async edit(workspaceApp: WorkspaceApp) {
    const safeWorkspaceApp: RequiredKeys<UpdateWorkspaceAppRequest> = {
      _id: workspaceApp._id!,
      _rev: workspaceApp._rev!,
      name: workspaceApp.name,
      url: workspaceApp.url,
      navigation: workspaceApp.navigation,
      disabled: workspaceApp.disabled,
    }

    const updatedWorkspaceApp = await API.workspaceApp.update(safeWorkspaceApp)
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
      return {
        ...state,
        workspaceApps: state.workspaceApps.filter(app => app._id !== id),
      }
    })

    const { deploymentStore } = await import("./deployment")

    await deploymentStore.publishApp()
    appStore.refresh()
  }

  async toggleDisabled(workspaceAppId: string, state: boolean) {
    const workspaceApp = get(this.store).workspaceApps.find(
      app => app._id === workspaceAppId
    )
    if (!workspaceApp) {
      throw new Error(`Workspace app not found ${workspaceAppId}`)
    }
    workspaceApp.disabled = state
    await this.edit({
      ...workspaceApp,
      disabled: state,
    })

    const { deploymentStore } = await import("./deployment")
    await deploymentStore.publishApp()
    await workspaceDeploymentStore.fetch()
  }

  replaceDatasource(_id: string, workspaceApp: WorkspaceApp) {
    const index = get(this.store).workspaceApps.findIndex(
      x => x._id === workspaceApp._id
    )

    this.store.update(state => {
      state.workspaceApps[index] = workspaceApp
      return state
    })
  }
}

export const workspaceAppStore = new WorkspaceAppStore()
