import { BudiStore } from "@/stores/BudiStore"
import { PublishStatusResponse } from "@budibase/types"
import { API } from "@/api"

interface WorkspaceDeploymentStoreState extends PublishStatusResponse {}

export class WorkspaceDeploymentStore extends BudiStore<WorkspaceDeploymentStoreState> {
  constructor() {
    super({ automations: {}, workspaceApps: {} })

    this.fetch = this.fetch.bind(this)
    this.reset = this.reset.bind(this)
  }

  async fetch() {
    const { automations, workspaceApps } =
      await API.deployment.getPublishStatus()
    this.store.update(state => {
      state.automations = automations
      state.workspaceApps = workspaceApps
      return state
    })
  }

  reset() {
    this.store.set({ automations: {}, workspaceApps: {} })
  }
}

export const workspaceDeploymentStore = new WorkspaceDeploymentStore()
