import { FetchAppPackageResponse, ProjectApp } from "@budibase/types"
import { derived } from "svelte/store"
import { BudiStore } from "../BudiStore"

interface ProjectAppStoreState {
  projectApps: ProjectApp[]
  loading: boolean
}

export class ProjectAppStore extends BudiStore<ProjectAppStoreState> {
  constructor() {
    super({
      projectApps: [],
      loading: true,
    })
  }

  syncAppProjectApps(pkg: FetchAppPackageResponse) {
    this.update(state => ({
      ...state,
      loading: false,
      projectApps: [...pkg.projectApps],
    }))
  }
}

export const projectAppStore = new ProjectAppStore()

export const selectedProjectAppId = derived(
  projectAppStore,
  $projectAppStore => {
    return $projectAppStore.projectApps[0]._id!
  }
)
