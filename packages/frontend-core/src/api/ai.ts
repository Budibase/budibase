import {
  GenerateAgentInstructionsRequest,
  GenerateAgentInstructionsResponse,
  GenerateJsRequest,
  GenerateJsResponse,
  GenerateTablesRequest,
  GenerateTablesResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

const SSE_EVENT_DELIMITER = "\n\n"
const SSE_DATA_PREFIX = "data:"

type TablesStreamEvent =
  | {
      type: "progress"
      message: string
    }
  | {
      type: "result"
      createdTables?: GenerateTablesResponse["createdTables"]
    }
  | {
      type: "error"
      message?: string
    }

const parseSSEEventChunk = (chunk: string): TablesStreamEvent | null => {
  const dataLines = chunk
    .split("\n")
    .map(line => line.trimEnd())
    .filter(line => line.startsWith(SSE_DATA_PREFIX))
    .map(line => line.slice(SSE_DATA_PREFIX.length).trim())

  if (dataLines.length === 0) {
    return null
  }

  return JSON.parse(dataLines.join("\n")) as TablesStreamEvent
}

export interface AIEndpoints {
  generateAgentInstructions: (
    req: GenerateAgentInstructionsRequest
  ) => Promise<GenerateAgentInstructionsResponse>
  generateCronExpression: (prompt: string) => Promise<{ message: string }>
  generateJs: (req: GenerateJsRequest) => Promise<GenerateJsResponse>
  generateTables: (
    req: GenerateTablesRequest,
    onProgress?: (message: string) => void
  ) => Promise<GenerateTablesResponse>
}

export const buildAIEndpoints = (API: BaseAPIClient): AIEndpoints => ({
  generateAgentInstructions: async req => {
    return await API.post({
      url: "/api/ai/agent-instructions",
      body: req,
    })
  },

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

            let boundary = buffer.indexOf(SSE_EVENT_DELIMITER)
            while (boundary !== -1) {
              const eventChunk = buffer.slice(0, boundary)
              buffer = buffer.slice(boundary + SSE_EVENT_DELIMITER.length)

              const event = parseSSEEventChunk(eventChunk)
              if (event?.type === "progress" && onProgress) {
                onProgress(event.message)
              }
              if (event?.type === "result") {
                finalResponse = { createdTables: event.createdTables || [] }
              }
              if (event?.type === "error") {
                throw new Error(event.message || "Error generating tables")
              }

              boundary = buffer.indexOf(SSE_EVENT_DELIMITER)
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
