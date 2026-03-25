import { BudiStore } from "@/stores/BudiStore"
import { PublishStatusResponse, PublishResourceState } from "@budibase/types"
import { API } from "@/api"

interface WorkspaceDeploymentStoreState extends PublishStatusResponse {}

export class WorkspaceDeploymentStore extends BudiStore<WorkspaceDeploymentStoreState> {
  constructor() {
    super({ agents: {}, automations: {}, workspaceApps: {}, tables: {} })

    this.fetch = this.fetch.bind(this)
    this.reset = this.reset.bind(this)
    this.setAgentUnpublishedChanges = this.setAgentUnpublishedChanges.bind(this)
    this.setAutomationUnpublishedChanges =
      this.setAutomationUnpublishedChanges.bind(this)
    this.setTableUnpublishedChanges = this.setTableUnpublishedChanges.bind(this)
    this.setWorkspaceAppUnpublishedChanges =
      this.setWorkspaceAppUnpublishedChanges.bind(this)
  }

  async fetch() {
    const { agents, automations, workspaceApps, tables } =
      await API.deployment.getPublishStatus()
    this.store.update(state => {
      state.agents = agents
      state.automations = automations
      state.workspaceApps = workspaceApps
      state.tables = tables
      return state
    })
  }

  reset() {
    this.store.set({ agents: {}, automations: {}, workspaceApps: {}, tables: {} })
  }

  setAgentUnpublishedChanges(agentId: string) {
    this.store.update(state => {
      if (!state.agents[agentId]) {
        state.agents[agentId] = {
          published: false,
          name: "Agent",
          state: PublishResourceState.DISABLED,
        }
      }
      state.agents[agentId].unpublishedChanges = true
      return state
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

  setTableUnpublishedChanges(tableId: string) {
    this.store.update(state => {
      if (!state.tables[tableId]) {
        state.tables[tableId] = {
          published: false,
          name: "Table",
          state: PublishResourceState.DISABLED,
        }
      }
      state.tables[tableId].unpublishedChanges = true
      return state
    })
  }

  setWorkspaceAppUnpublishedChanges(workspaceAppId: string) {
    this.store.update(state => {
      if (!state.workspaceApps[workspaceAppId]) {
        state.workspaceApps[workspaceAppId] = {
          published: false,
          name: "Workspace app",
          state: PublishResourceState.DISABLED,
        }
      }
      state.workspaceApps[workspaceAppId].unpublishedChanges = true
      return state
    })
  }
}

export const workspaceDeploymentStore = new WorkspaceDeploymentStore()
