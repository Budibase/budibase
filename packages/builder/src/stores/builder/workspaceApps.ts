import { API } from "@/api"
import { DerivedBudiStore } from "@/stores/BudiStore"
import * as screenTemplating from "@/templates/screenTemplating"
import {
  InsertWorkspaceAppRequest,
  RequiredKeys,
  UIWorkspaceApp,
  UpdateWorkspaceAppRequest,
  WorkspaceApp,
} from "@budibase/types"
import { derived, Readable } from "svelte/store"
import { appStore } from "./app"
import { screenStore, selectedScreen, sortedScreens } from "./screens"

interface WorkspaceAppStoreState {
  workspaceApps: WorkspaceApp[]
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
        [store, sortedScreens, selectedScreen],
        ([$store, $sortedScreens, $selectedScreen]) => {
          const workspaceApps = $store.workspaceApps
            .map<UIWorkspaceApp>(workspaceApp => {
              return {
                ...workspaceApp,
                screens: $sortedScreens.filter(
                  s => s.workspaceAppId === workspaceApp._id
                ),
              }
            })
            .sort((a, b) => a.name.localeCompare(b.name))

          const selectedWorkspaceApp = $selectedScreen
            ? workspaceApps.find(a => a._id === $selectedScreen.workspaceAppId)
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

    await screenStore.save({
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
      icon: workspaceApp.icon,
      iconColor: workspaceApp.iconColor,
      navigation: workspaceApp.navigation,
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

    appStore.refresh()
  }
}

export const workspaceAppStore = new WorkspaceAppStore()
