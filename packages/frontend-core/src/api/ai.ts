import { BaseAPIClient } from "./types"

export interface AIEndpoints {
  generateCronExpression: (prompt: string) => Promise<{ message: string }>
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
})
