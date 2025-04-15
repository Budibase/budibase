import { GenerateJsRequest, GenerateJsResponse } from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface AIEndpoints {
  generateCronExpression: (prompt: string) => Promise<{ message: string }>
  generateJs: (req: GenerateJsRequest) => Promise<GenerateJsResponse>
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

  generateJs: async req => {
    return await API.post({
      url: "/api/ai/js",
      body: req,
    })
  },
})
