import { Query, ToolType } from "@budibase/types"
import { context } from "@budibase/backend-core"
import { z } from "zod"
import type { ExecutableTool } from "."
import * as queryController from "../../api/controllers/query"
import { buildCtx } from "../../automations/steps/utils"

export interface RestQueryToolsConfig {
  queryIds: string[]
  datasourceName?: string
}

const sanitiseToolName = (name: string): string => {
  if (name.length > 64) {
    return name.substring(0, 64) + "..."
  }
  return name.replace(/[^a-zA-Z0-9_-]/g, "_")
}

const buildParametersSchema = (query: Query): z.ZodObject<any> => {
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
): ExecutableTool => {
  const toolName = sanitiseToolName(query.name)
  const parametersSchema = buildParametersSchema(query)

  const description = query.restTemplateMetadata?.description
    ? `${query.name}: ${query.restTemplateMetadata.description}`
    : `Execute REST query: ${query.name}`

  return {
    name: toolName,
    description,
    parameters: parametersSchema,
    sourceType: ToolType.REST_QUERY,
    sourceLabel: datasourceName || "API",
    handler: async (params: unknown) => {
      const workspaceId = context.getWorkspaceId()
      if (!workspaceId) {
        return { error: "No app context available" }
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
        const { data, ...rest } = ctx.body
        return { success: true, data, info: rest }
      } catch (err: any) {
        return {
          success: false,
          error: err.message || "Query execution failed",
        }
      }
    },
  }
}
