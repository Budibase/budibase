import { ChatAgentRequest, ChatAgentResponse } from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface AgentEndpoints {
  agentChat: (req: string) => Promise<ChatAgentResponse>
}

export const buildAgentEndpoints = (API: BaseAPIClient): AgentEndpoints => ({
  /**
   * Generates a cron expression from a prompt
   */
  agentChat: async prompt => {
    const body: ChatAgentRequest = {
      userPrompt: prompt,
    }
    return await API.post({
      url: "/api/global/agent/chat",
      body,
    })
  },
})
