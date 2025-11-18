import { Tool as BudibaseTool } from "@budibase/types"
import { tool } from "ai"
import { z } from "zod"

export function toAiSdkTools(tools: BudibaseTool[]) {
  const mapped: Record<string, ReturnType<typeof tool>> = {}
  for (const t of tools) {
    const inputSchema = t.parameters ?? z.object({})
    mapped[t.name] = tool({
      description: t.description,
      inputSchema: inputSchema as z.ZodType<any, any, any>,
      execute: async args => {
        return await t.handler(args)
      },
    })
  }
  return mapped
}
