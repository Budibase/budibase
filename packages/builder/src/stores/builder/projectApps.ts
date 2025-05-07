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
          name: "Default",
          icon: "Add",
        },
      ],
      loading: false,
    })
  }
}

export const projectAppStore = new ProjectAppStore()
