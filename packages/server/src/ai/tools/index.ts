import { Tool, ToolArgs } from "@budibase/types"
import { z } from "zod"

export { BambooHRClient } from "./bamboohr"
export { default as budibase } from "./budibase"
export { ConfluenceClient } from "./confluence"
export { GitHubClient } from "./github"

export function newTool<T extends z.ZodType>(tool: ToolArgs<T>): Tool<T> {
  // Create error-aware handler that logs failures to server logs
  const errorAwareHandler = async (args: z.infer<T>): Promise<string> => {
    console.debug(`[TOOL DEBUG] Executing tool: ${tool.name}`)
    try {
      const result = await tool.handler(args)
      console.debug(`[TOOL DEBUG] Tool ${tool.name} succeeded`)
      return result
    } catch (error: any) {
      console.error(`[TOOL ERROR] Tool '${tool.name}' failed:`, error)

      // Still return the error message for the Agent
      return `Error executing ${tool.name}: ${error.message}`
    }
  }

  return {
    strict: tool.strict ?? true,
    parameters: tool.parameters ?? (z.object({}) as unknown as T),
    description: tool.description,
    handler: errorAwareHandler,
    name: tool.name,
  }
}
