import { ToolType } from "@budibase/types"
import { z } from "zod"
import { tool } from "ai"
import { BudibaseToolDefinition } from "../budibase"

const parallelSearchParams = z.object({
  objective: z
    .string()
    .describe("Natural language description of what to search for"),
  search_queries: z.array(z.string()).describe("Array of search query strings"),
  max_results: z
    .number()
    .optional()
    .default(10)
    .describe("Maximum number of results to return"),
})

export const createParallelTool = (apiKey: string): BudibaseToolDefinition => ({
  name: "parallel_search",
  description: "Search the web using Parallel AI",
  sourceType: ToolType.SEARCH,
  sourceLabel: "Parallel Search",
  tool: tool({
    description: "Search the web using Parallel AI",
    inputSchema: parallelSearchParams,
    execute: async args => {
      const response = await fetch("https://api.parallel.ai/v1beta/search", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "parallel-beta": "search-extract-2025-10-10",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          objective: args.objective,
          search_queries: args.search_queries,
          max_results: args.max_results,
          excerpts: { max_chars_per_result: 2000 },
        }),
      })

      if (!response.ok) {
        throw new Error(
          `Parallel error: ${response.status} ${response.statusText}`
        )
      }
      return response.json()
    },
  }),
})
