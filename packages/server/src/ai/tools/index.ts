import { Tool } from "@budibase/types"
import { z } from "zod"

export { default as budibase } from "./budibase"

export interface ServerToolArgs<T extends z.ZodTypeAny> {
  name: string
  description: string
  parameters?: T
  handler: (args: z.infer<T>) => Promise<string>
  strict?: boolean
}

export function newTool<T extends z.ZodTypeAny>(
  tool: ServerToolArgs<T>
): Tool<T> {
  const parameters = tool.parameters ?? (z.object({}) as unknown as T)

  // Create error-aware handler that validates and logs failures to server logs
  const errorAwareHandler = async (rawArgs: unknown): Promise<string> => {
    console.debug(`[TOOL DEBUG] Executing tool: ${tool.name}`)
    try {
      const parsed = parameters.parse(rawArgs) as z.infer<T>
      const result = await tool.handler(parsed)
      console.debug(`[TOOL DEBUG] Tool ${tool.name} succeeded`)
      return result
    } catch (error: any) {
      console.error(`[TOOL ERROR] Tool '${tool.name}' failed:`, error)

      if (error.validation) {
        const validationMessages = Object.entries(error.validation)
          .map(([field, messages]) => `${field}: ${messages}`)
          .join(", ")
        return `Error executing ${tool.name}: Validation failed - ${validationMessages}`
      }

      const message =
        error.message ||
        (typeof error === "object" ? JSON.stringify(error) : String(error))
      return `Error executing ${tool.name}: ${message}`
    }
  }

  return {
    strict: tool.strict ?? true,
    parameters,
    description: tool.description,
    handler: errorAwareHandler,
    name: tool.name,
  }
}
