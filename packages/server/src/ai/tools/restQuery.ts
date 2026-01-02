import { context } from "@budibase/backend-core"
import { Query, ToolType } from "@budibase/types"
import { tool } from "ai"
import { z } from "zod"
import { type AiToolDefinition } from "."
import * as queryController from "../../api/controllers/query"
import { buildCtx } from "../../automations/steps/utils"

export interface RestQueryToolsConfig {
  queryIds: string[]
  datasourceName?: string
}

type RestQueryToolResult =
  | {
      success: true
      data: unknown
      info: Record<string, unknown>
    }
  | {
      success: false
      error: string
    }

const sanitiseToolName = (name: string): string => {
  if (name.length > 64) {
    return name.substring(0, 64) + "..."
  }
  return name.replace(/[^a-zA-Z0-9_-]/g, "_")
}

const buildParametersSchema = (query: Query) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {}

  for (const param of query.parameters || []) {
    schemaFields[param.name] = z
      .string()
      .optional()
      .describe(`Parameter: ${param.name}`)
  }

  return z.object(schemaFields)
}

export const createRestQueryTool = (
  query: Query,
  datasourceName?: string
): AiToolDefinition => {
  const toolName = sanitiseToolName(query.name)
  const parametersSchema = buildParametersSchema(query)

  const description = query.restTemplateMetadata?.description
    ? `${query.name}: ${query.restTemplateMetadata.description}`
    : `Execute REST query: ${query.name}`

  return {
    name: toolName,
    description,
    sourceType: ToolType.REST_QUERY,
    sourceLabel: datasourceName || "API",
    tool: tool({
      description,
      inputSchema: parametersSchema,
      execute: async (params): Promise<RestQueryToolResult> => {
        const workspaceId = context.getWorkspaceId()
        if (!workspaceId) {
          return { success: false, error: "No app context available" }
        }

        const ctx: any = buildCtx(workspaceId, null, {
          body: {
            parameters: params,
          },
          params: {
            queryId: query._id,
          },
        })

        try {
          await queryController.executeV2AsAutomation(ctx)
          const { data, ...info } = (ctx.body || {}) as Record<string, unknown>
          return { success: true, data, info }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err)
          return {
            success: false,
            error: message || "Query execution failed",
          }
        }
      },
    }),
  }
}
