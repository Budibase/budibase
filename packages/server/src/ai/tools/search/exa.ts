import { ToolType } from "@budibase/types"
import { newTool } from ".."
import { z } from "zod"

const exaSearchParams = z.object({
  query: z.string(),
  num_results: z.number(),
})

export const createExaTool = () =>
  newTool({
    name: "exa",
    description: "Search the web using Exa",
    sourceType: ToolType.SEARCH,
    sourceLabel: "Exa Search",
    parameters: exaSearchParams,
    handler: async args => {
      const response = await fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.EXA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: args.query,
          num_results: args.num_results,
        }),
      })

      if (!response.ok) {
        throw new Error(`Exa error: ${response.status} ${response.statusText}`)
      }
      return response.json()
    },
  })
