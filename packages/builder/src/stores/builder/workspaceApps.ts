import { API } from "@/api"
import { DerivedBudiStore } from "@/stores/BudiStore"
import * as screenTemplating from "@/templates/screenTemplating"
import {
  InsertWorkspaceAppRequest,
  PublishResourceState,
  RequiredKeys,
  UIWorkspaceApp,
  UpdateWorkspaceAppRequest,
  WorkspaceApp,
} from "@budibase/types"
import { derived, Readable, get } from "svelte/store"
import { appStore } from "./app"
import { screenStore, selectedScreen, sortedScreens } from "./screens"
import { workspaceDeploymentStore } from "./workspaceDeployment"

interface WorkspaceAppStoreState {
  workspaceApps: WorkspaceApp[]
  workspaceAppId?: string
  loading: boolean
}

interface DerivedWorkspaceAppStoreState {
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
        [store, sortedScreens, selectedScreen, workspaceDeploymentStore],
        ([
          $store,
          $sortedScreens,
          $selectedScreen,
          $workspaceDeploymentStore,
        ]) => {
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

          const selectedWorkspaceApp =
            $store.workspaceAppId || $selectedScreen
              ? workspaceApps.find(
                  a =>
                    a._id ===
                    ($store.workspaceAppId || $selectedScreen?.workspaceAppId)
                )
              : undefined

          return { workspaceApps, selectedWorkspaceApp }
        }
      )
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

  async add(workspaceApp: InsertWorkspaceAppRequest) {
    const { workspaceApp: createdWorkspaceApp } =
      await API.workspaceApp.create(workspaceApp)
    this.store.update(state => ({
      ...state,
      workspaceApps: [...state.workspaceApps, createdWorkspaceApp],
    }))
    return await screenStore.save({
      ...screenTemplating.blank({
        route: "/",
        screens: [],
        workspaceAppId: createdWorkspaceApp._id,
      })[0].data,
      workspaceAppId: createdWorkspaceApp._id,
    })
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

  /**
   * Explicitly set this id and set the selcted app accordingly
   * If not specified, current workspace app is derived from the selected screen
   * @param id
   */
  setWorkspaceAppId(id?: string) {
    this.store.update(state => {
      if (!id) {
        delete state.workspaceAppId
        return state
      }
      return { ...state, workspaceAppId: id }
    })
  }
}

export const workspaceAppStore = new WorkspaceAppStore()
