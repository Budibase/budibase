import { tool, type ToolSet } from "ai"
import { z } from "zod"
import type { ExecutableTool } from "."

export function toAiSdkTools(tools: ExecutableTool[]): ToolSet {
  const mapped: ToolSet = {}

  for (const t of tools) {
    const schema = t.parameters ?? z.object({})

    mapped[t.name] = tool({
      description: t.description,
      inputSchema: schema,
      execute: async (input: unknown) => {
        return await t.handler(input)
      },
    })
  }

  return mapped
}
