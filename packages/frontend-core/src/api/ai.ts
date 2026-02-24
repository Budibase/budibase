import {
  GenerateJsRequest,
  GenerateJsResponse,
  GenerateTablesRequest,
  GenerateTablesResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface AIEndpoints {
  generateCronExpression: (prompt: string) => Promise<{ message: string }>
  generateJs: (req: GenerateJsRequest) => Promise<GenerateJsResponse>
  generateTables: (
    req: GenerateTablesRequest,
    onProgress?: (message: string) => void
  ) => Promise<GenerateTablesResponse>
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

  generateTables: async (req, onProgress) => {
    return await API.post({
      url: "/api/ai/tables",
      body: req,
      parseResponse: async response => {
        try {
          const reader = response.body?.getReader()
          if (!reader) {
            throw new Error("Streaming not supported in this browser")
          }

          const decoder = new TextDecoder()
          let buffer = ""
          let finalResponse: GenerateTablesResponse | undefined

          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              break
            }
            buffer += decoder.decode(value, { stream: true })

            let boundary = buffer.indexOf("\n\n")
            while (boundary !== -1) {
              const eventChunk = buffer.slice(0, boundary)
              buffer = buffer.slice(boundary + 2)

              const dataLines = eventChunk
                .split("\n")
                .filter(line => line.startsWith("data:"))
                .map(line => line.slice(5).trim())

              if (dataLines.length) {
                const event = JSON.parse(dataLines.join("\n"))
                if (event?.type === "progress" && onProgress) {
                  onProgress(event.message)
                }
                if (event?.type === "result") {
                  finalResponse = { createdTables: event.createdTables || [] }
                }
                if (event?.type === "error") {
                  throw new Error(event.message || "Error generating tables")
                }
              }

              boundary = buffer.indexOf("\n\n")
            }
          }

          if (!finalResponse) {
            throw new Error("No result received from table generation stream")
          }

          return finalResponse
        } catch (error: any) {
          throw new Error(error?.message || "Error generating tables")
        }
      },
    })
  },
})
