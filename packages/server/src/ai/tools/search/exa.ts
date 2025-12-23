import { ToolType } from "@budibase/types"
import { newTool } from ".."
import { z } from "zod"

const exaSearchParams = z.object({
  query: z.string().describe("The search query to find relevant information"),
  num_results: z
    .number()
    .optional()
    .default(10)
    .describe("Number of results to return"),
})

export const createExaTool = (apiKey: string) =>
  newTool({
    name: "exa_search",
    description: "Search the web using Exa",
    sourceType: ToolType.SEARCH,
    sourceLabel: "Exa Search",
    parameters: exaSearchParams,
    handler: async args => {
      const response = await fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: args.query,
          num_results: args.num_results,
        }),
      })

      if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(
          `Exa error: ${response.status} ${response.statusText} - ${errorBody}`
        )
      }
      return response.json()
    },
  })
