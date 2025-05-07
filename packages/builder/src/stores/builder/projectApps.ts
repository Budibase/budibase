import { BudiStore } from "@/stores/BudiStore"
import { FetchAppPackageResponse, ProjectApp, Screen } from "@budibase/types"

interface ProjectAppStoreState {
  projectApps: (ProjectApp & { screens: Screen[] })[]
  loading: boolean
}

export class ProjectAppStore extends BudiStore<ProjectAppStoreState> {
  constructor() {
    super({
      projectApps: [],
      loading: true,
    })
  }

  syncFromAppPackage(pkg: FetchAppPackageResponse) {
    this.set({
      projectApps: [
        {
          _id: "default",
          urlPrefix: "/",
          name: "Default",
          icon: "Add",
          iconColor: "",
          screens: pkg.screens,
        },
      ],
      loading: false,
    })
  }

  async add(projectApp: ProjectApp) {
    this.store.update(state => {
      state.projectApps.push(projectApp)
      return state
    })
  }

  async edit(projectApp: ProjectApp) {
    this.store.update(state => {
      const index = state.projectApps.findIndex(
        app => app._id === projectApp._id
      )
      state.projectApps[index] = projectApp
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
