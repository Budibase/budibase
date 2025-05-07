import { BudiStore } from "@/stores/BudiStore"
import { ProjectApp } from "@budibase/types"

interface ProjectAppStoreState {
  projectApps: ProjectApp[]
  loading: boolean
}

export class ProjectAppStore extends BudiStore<ProjectAppStoreState> {
  constructor() {
    super({
      projectApps: [
        {
          _id: "default",
          urlPrefix: "/",
          name: "Default",
          icon: "Add",
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
}

export const projectAppStore = new ProjectAppStore()
