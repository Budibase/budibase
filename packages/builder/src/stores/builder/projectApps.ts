import { BudiStore } from "@/stores/BudiStore"
import {
  FetchAppPackageResponse,
  ProjectApp,
  UIProjectApp,
} from "@budibase/types"

interface ProjectAppStoreState {
  projectApps: UIProjectApp[]
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
          icon: "Monitoring",
          iconColor: "",
          screens: pkg.screens,
        },
      ],
      loading: false,
    })
  }

  async add(projectApp: ProjectApp) {
    this.store.update(state => {
      state.projectApps.push({ ...projectApp, screens: [] })
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
        screens: state.projectApps[index].screens,
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
