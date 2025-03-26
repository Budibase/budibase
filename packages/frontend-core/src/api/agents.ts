import { ChatAgentRequest, ChatAgentResponse } from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface AgentEndpoints {
  chat: (req: string) => Promise<ChatAgentResponse>
}

export const buildAgentEndpoints = (API: BaseAPIClient): AgentEndpoints => ({
  /**
   * Generates a cron expression from a prompt
   */
  chat: async prompt => {
    const body: ChatAgentRequest = {
      userPrompt: prompt,
    }
    return await API.post({
      url: "/api/global/agents/chat",
      body,
    })
  },
})
