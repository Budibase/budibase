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

interface QueryToolOptions {
  query: Query
  sourceType: ToolType
  sourceLabel?: string
  sourceIconType?: string
  description: string
  namePrefix: "rest" | "ds"
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

const sanitiseNameSegment = (name: string, maxLength: number): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .substring(0, maxLength)
}

const buildScopedToolName = (
  query: Query,
  datasourceName: string | undefined,
  prefix: QueryToolOptions["namePrefix"]
): string => {
  const datasourceSegment =
    sanitiseNameSegment(datasourceName || "datasource", 20) || "datasource"
  const querySegment = sanitiseNameSegment(query.name || "query", 24) || "query"
  return `${prefix}_${datasourceSegment}_${querySegment}`
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

const createQueryTool = ({
  query,
  sourceType,
  sourceLabel,
  sourceIconType,
  description,
  namePrefix,
}: QueryToolOptions): AiToolDefinition => {
  const toolName = buildScopedToolName(query, sourceLabel, namePrefix)
  const parametersSchema = buildParametersSchema(query)

  return {
    name: toolName,
    readableName: query.name,
    description,
    sourceType,
    sourceLabel,
    sourceIconType,
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

export const createRestQueryTool = (
  query: Query,
  datasourceName?: string
): AiToolDefinition => {
  const description = query.restTemplateMetadata?.description
    ? `${query.name}: ${query.restTemplateMetadata.description}`
    : `Execute REST query: ${query.name}`

  return createQueryTool({
    query,
    description,
    sourceType: ToolType.REST_QUERY,
    sourceLabel: datasourceName || "API",
    namePrefix: "rest",
  })
}

export const createDatasourceQueryTool = (
  query: Query,
  datasourceName?: string,
  sourceIconType?: string
): AiToolDefinition => {
  return createQueryTool({
    query,
    description: `Execute datasource query: ${query.name}`,
    sourceType: ToolType.DATASOURCE_QUERY,
    sourceLabel: datasourceName || "Datasource",
    sourceIconType,
    namePrefix: "ds",
  })
}
