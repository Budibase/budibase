import { Tool } from "@budibase/types"
import { z } from "zod"

export { default as budibase } from "./budibase"

export interface ServerToolArgs<T extends z.ZodTypeAny> {
  name: string
  description: string
  parameters?: T
  handler: (args: z.infer<T>) => Promise<unknown>
  strict?: boolean
}

export function newTool<T extends z.ZodTypeAny>(
  tool: ServerToolArgs<T>
): Tool<T> {
  const parameters = tool.parameters ?? (z.object({}) as unknown as T)

  const errorAwareHandler = async (rawArgs: unknown): Promise<unknown> => {
    console.debug(`[TOOL DEBUG] Executing tool: ${tool.name}`)
    try {
      const parsed = parameters.parse(rawArgs) as z.infer<T>
      const result = await tool.handler(parsed)
      console.debug(`[TOOL DEBUG] Tool ${tool.name} succeeded`)
      return result
    } catch (error: any) {
      const message =
        error.message ||
        (typeof error === "object" ? JSON.stringify(error) : String(error))
      console.error(`[TOOL ERROR] ${tool.name}: ${message}`)
      return { error: message }
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
