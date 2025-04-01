import { ChatAgentRequest, ChatAgentResponse } from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface AgentEndpoints {
  agentChat: (
    messages: { message: string; system?: boolean }[],
    appIds: string[]
  ) => Promise<ChatAgentResponse>
}

export const buildAgentEndpoints = (API: BaseAPIClient): AgentEndpoints => ({
  /**
   * Generates a cron expression from a prompt
   */
  agentChat: async (messages, appIds) => {
    const body: ChatAgentRequest = {
      messages,
      appIds,
    }
    return await API.post({
      url: "/api/global/agent/chat",
      body,
    })
  },
})
