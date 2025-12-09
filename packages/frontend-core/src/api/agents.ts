import {
  AgentToolSource,
  AgentToolSourceWithTools,
  CreateAgentRequest,
  CreateAgentResponse,
  CreateToolSourceRequest,
  FetchAgentsResponse,
  Tool,
  UpdateAgentRequest,
  UpdateAgentResponse,
} from "@budibase/types"

import { BaseAPIClient } from "./types"

export interface AgentEndpoints {
  fetchToolSources: (agentId: string) => Promise<AgentToolSourceWithTools[]>
  fetchAvailableTools: (toolSourceType: string) => Promise<Tool[]>
  createToolSource: (
    toolSource: CreateToolSourceRequest
  ) => Promise<{ created: true }>
  updateToolSource: (toolSource: AgentToolSource) => Promise<AgentToolSource>
  deleteToolSource: (toolSourceId: string) => Promise<{ deleted: true }>
  fetchAgents: () => Promise<FetchAgentsResponse>
  createAgent: (agent: CreateAgentRequest) => Promise<CreateAgentResponse>
  updateAgent: (agent: UpdateAgentRequest) => Promise<UpdateAgentResponse>
  deleteAgent: (agentId: string) => Promise<{ deleted: true }>
}

export const buildAgentEndpoints = (API: BaseAPIClient): AgentEndpoints => ({
  fetchToolSources: async (agentId: string) => {
    return await API.get({
      url: `/api/agent/${agentId}/toolsource`,
    })
  },

  fetchAvailableTools: async (toolSourceType: string) => {
    return await API.get({
      url: `/api/agent/toolsource/${toolSourceType}/tools`,
    })
  },

  createToolSource: async (toolSource: CreateToolSourceRequest) => {
    return await API.post({
      url: "/api/agent/toolsource",
      body: toolSource as any,
    })
  },

  updateToolSource: async (toolSource: AgentToolSource) => {
    return await API.put({
      url: "/api/agent/toolsource",
      body: toolSource as any,
    })
  },

  deleteToolSource: async (toolSourceId: string) => {
    return await API.delete({
      url: `/api/agent/toolsource/${toolSourceId}`,
    })
  },

  fetchAgents: async () => {
    return await API.get({
      url: "/api/agent",
    })
  },

  createAgent: async (agent: CreateAgentRequest) => {
    return await API.post({
      url: "/api/agent",
      body: agent,
    })
  },

  updateAgent: async (agent: UpdateAgentRequest) => {
    return await API.put({
      url: "/api/agent",
      body: agent,
    })
  },

  deleteAgent: async (agentId: string) => {
    return await API.delete({
      url: `/api/agent/${agentId}`,
    })
  },
})
