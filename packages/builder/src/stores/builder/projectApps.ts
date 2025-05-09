import { DerivedBudiStore } from "@/stores/BudiStore"
import { ProjectApp, UIProjectApp } from "@budibase/types"
import { derived, Readable } from "svelte/store"
import { screenStore } from "./screens"
import { Helpers } from "@budibase/bbui"

interface ProjectAppStoreState {
  projectApps: ProjectApp[]
  loading: boolean
}

interface DerivedProjectAppStoreState {
  projectApps: UIProjectApp[]
}

const DEFAULT_PROJECT_APP_ID = "default"

export class ProjectAppStore extends DerivedBudiStore<
  ProjectAppStoreState,
  DerivedProjectAppStoreState
> {
  constructor() {
    const makeDerivedStore = (store: Readable<ProjectAppStoreState>) => {
      return derived([store, screenStore], ([$store, $screenStore]) => {
        const projectApps = $store.projectApps.map<UIProjectApp>(projectApp => {
          return {
            ...projectApp,
            screens: $screenStore.screens.filter(
              s => (s.projectAppId || DEFAULT_PROJECT_APP_ID) === projectApp._id
            ),
          }
        })

        return { projectApps }
      })
    }

    super(
      {
        projectApps: [
          {
            _id: DEFAULT_PROJECT_APP_ID,
            urlPrefix: "/",
            name: "Default",
            icon: "Monitoring",
            iconColor: "",
          },
        ],
        loading: true,
      },
      makeDerivedStore
    )
  }

  async add(projectApp: ProjectApp) {
    this.store.update(state => {
      state.projectApps.push({ ...projectApp, _id: Helpers.uuid() })
      return state
    })
  }

  async edit(projectApp: ProjectApp) {
    this.store.update(state => {
      const index = state.projectApps.findIndex(
        app => app._id === projectApp._id
      )
      if (index === -1) {
        throw new Error(`App not found with id "${projectApp._id}"`)
      }

      state.projectApps[index] = {
        ...projectApp,
      }
      return state
    })
  }

  async delete(_id: string | undefined, _rev: string | undefined) {
    this.store.update(state => {
      state.projectApps = state.projectApps.filter(app => app._id !== _id)
      return state
    })
  }
}

export const projectAppStore = new ProjectAppStore()
