import { BudiStore } from "@/stores/BudiStore"
import { PublishStatusResponse, PublishResourceState } from "@budibase/types"
import { API } from "@/api"

interface WorkspaceDeploymentStoreState extends PublishStatusResponse {}

export class WorkspaceDeploymentStore extends BudiStore<WorkspaceDeploymentStoreState> {
  constructor() {
    super({ automations: {}, workspaceApps: {}, tables: {}, agents: {} })

    this.fetch = this.fetch.bind(this)
    this.reset = this.reset.bind(this)
    this.setAutomationUnpublishedChanges =
      this.setAutomationUnpublishedChanges.bind(this)
  }

  async fetch() {
    const { automations, workspaceApps, tables, agents } =
      await API.deployment.getPublishStatus()
    this.store.update(state => {
      state.automations = automations
      state.workspaceApps = workspaceApps
      state.tables = tables
      state.agents = agents
      return state
    })
  }

  reset() {
    this.store.set({
      automations: {},
      workspaceApps: {},
      tables: {},
      agents: {},
    })
  }

  setAutomationUnpublishedChanges(automationId: string) {
    this.store.update(state => {
      if (!state.automations[automationId]) {
        state.automations[automationId] = {
          published: false,
          name: "Automation",
          state: PublishResourceState.DISABLED,
        }
      }
      state.automations[automationId].unpublishedChanges = true
      return state
    })
  }
}

export const workspaceDeploymentStore = new WorkspaceDeploymentStore()
