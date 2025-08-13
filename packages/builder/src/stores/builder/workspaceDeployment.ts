import { BudiStore } from "@/stores/BudiStore"
import { PublishStatusResponse, PublishResourceState } from "@budibase/types"
import { API } from "@/api"

interface WorkspaceDeploymentStoreState extends PublishStatusResponse {}

export class WorkspaceDeploymentStore extends BudiStore<WorkspaceDeploymentStoreState> {
  constructor() {
    super({ automations: {}, workspaceApps: {} })

    this.fetch = this.fetch.bind(this)
    this.reset = this.reset.bind(this)
    this.setAutomationUnpublishedChanges =
      this.setAutomationUnpublishedChanges.bind(this)
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

  setAutomationUnpublishedChanges(automationId: string) {
    this.store.update(state => {
      if (!state.automations[automationId]) {
        state.automations[automationId] = {
          published: false,
          name: "Automation",
          state: PublishResourceState.UNPUBLISHED,
        }
      }
      state.automations[automationId].unpublishedChanges = true
      return state
    })
  }
}

export const workspaceDeploymentStore = new WorkspaceDeploymentStore()
