import { ToolType } from "@budibase/types"
import { z } from "zod"

export { default as budibase } from "./budibase"
export * from "./restQuery"

export interface ToolError {
  error: string
}

export type ToolResult<T> = T | ToolError

export interface ExecutableTool<
  T extends z.ZodTypeAny = z.ZodTypeAny,
  R = unknown,
> {
  name: string
  description: string
  parameters: T
  handler: (args: z.input<T>) => Promise<ToolResult<R>>
  sourceType: ToolType
  sourceLabel?: string
}

export interface ServerToolArgs<T extends z.ZodTypeAny, R = unknown> {
  name: string
  sourceType: ToolType
  sourceLabel: string
  description: string
  parameters?: T
  handler: (args: z.infer<T>) => Promise<R>
}

export function newTool<T extends z.ZodTypeAny, R = unknown>(
  tool: ServerToolArgs<T, R>
): ExecutableTool<T, R> {
  const parameters = tool.parameters ?? (z.object({}) as unknown as T)

  const errorAwareHandler = async (
    rawArgs: unknown
  ): Promise<ToolResult<R>> => {
    console.debug(`[TOOL DEBUG] Executing tool: ${tool.name}`)
    try {
      const parsed = parameters.parse(rawArgs) as z.infer<T>
      const result = await tool.handler(parsed)
      console.debug(`[TOOL DEBUG] Tool ${tool.name} succeeded`)
      return result
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const flattened = error.flatten()
        const message = JSON.stringify({
          fieldErrors: flattened.fieldErrors,
          formErrors: flattened.formErrors,
        })
        console.error(`[TOOL ERROR] ${tool.name}: ${message}`)
        return { error: message }
      }

      const message =
        error instanceof Error
          ? error.message
          : typeof error === "object"
            ? JSON.stringify(error)
            : String(error)
      console.error(`[TOOL ERROR] ${tool.name}: ${message}`)
      return { error: message }
    }
  }

  return {
    parameters,
    description: tool.description,
    handler: errorAwareHandler,
    name: tool.name,
    sourceType: tool.sourceType,
    sourceLabel: tool.sourceLabel,
  }
}
