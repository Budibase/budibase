import { Tool as BudibaseTool } from "@budibase/types"
import { tool, zodSchema, type ToolSet } from "ai"
import { z } from "zod"

export function toAiSdkTools(tools: BudibaseTool[]): ToolSet {
  const mapped: ToolSet = {}

  for (const t of tools) {
    const schema = t.parameters ?? z.object({})

    mapped[t.name] = tool({
      description: t.description,
      inputSchema: zodSchema(schema),
      execute: async (input: unknown) => {
        return await t.handler(input)
      },
    })
  }

  return mapped
}
