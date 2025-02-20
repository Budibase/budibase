import { BaseAPIClient } from "./types"
import { AIPromptResponse } from "@budibase/types"

export interface AIEndpoints {
  generateCronExpression: (prompt: string) => Promise<{ message: string }>
  globalPrompt: (prompt: string) => Promise<AIPromptResponse>
}

export const buildAIEndpoints = (API: BaseAPIClient): AIEndpoints => ({
  /**
   * Generates a cron expression from a prompt
   */
  generateCronExpression: async prompt => {
    return await API.post({
      url: "/api/ai/cron",
      body: { prompt },
    })
  },

  globalPrompt: async prompt => {
    return await API.post({
      url: "/api/global/ai/prompt",
      body: { userInput: prompt },
    })
  },
})
