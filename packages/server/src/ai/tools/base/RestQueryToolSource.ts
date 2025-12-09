import { Query, ToolType } from "@budibase/types"
import { ToolSource } from "./ToolSource"
import { context } from "@budibase/backend-core"
import { z } from "zod"
import { type ExecutableTool } from ".."
import * as queryController from "../../../api/controllers/query"
import { buildCtx } from "../../../automations/steps/utils"

type RestQueryToolSourceType = {
  queryIds?: string[]
  datasourceId?: string
  datasourceName?: string
}

export class RestQueryToolSource extends ToolSource {
  private queries: Query[] = []
  private loaded = false

  getType(): string {
    return "REST_QUERY"
  }

  getName(): string {
    return "REST Queries"
  }

  private async loadQueries(): Promise<void> {
    if (this.loaded) {
      return
    }

    const toolSourceConfig = this.toolSource as RestQueryToolSourceType
    const { queryIds } = toolSourceConfig

    if (!queryIds || queryIds.length === 0) {
      this.loaded = true
      return
    }

    const db = context.getWorkspaceDB()
    const queries: Query[] = []

    for (const queryId of queryIds) {
      try {
        const query = await db.tryGet<Query>(queryId)
        if (query) {
          queries.push(query)
        }
      } catch (err) {
        console.warn(`Failed to load query ${queryId}:`, err)
      }
    }

    this.queries = queries
    this.loaded = true
  }

  private sanitiseToolName(name: string): string {
    if (name.length > 64) {
      return name.substring(0, 64) + "..."
    }
    return name.replace(/[^a-zA-Z0-9_-]/g, "_")
  }

  private buildParametersSchema(query: Query): z.ZodObject<any> {
    const schemaFields: Record<string, z.ZodTypeAny> = {}

    for (const param of query.parameters || []) {
      schemaFields[param.name] = z
        .string()
        .optional()
        .describe(`Parameter: ${param.name}`)
    }

    return z.object(schemaFields)
  }

  private createQueryTool(query: Query): ExecutableTool {
    const toolName = this.sanitiseToolName(query.name)
    const parametersSchema = this.buildParametersSchema(query)
    const config = this.toolSource

    const description = query.restTemplateMetadata?.description
      ? `${query.name}: ${query.restTemplateMetadata.description}`
      : `Execute REST query: ${query.name}`

    return {
      name: toolName,
      description,
      parameters: parametersSchema,
      sourceType: ToolType.REST_QUERY,
      sourceLabel: config.datasourceName || "API",
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

  getTools(): ExecutableTool[] {
    // Note: This is synchronous but we need async loading
    // The tools are loaded lazily when first accessed
    // For now, return empty if not loaded - the async version should be used
    if (!this.loaded) {
      return []
    }

    return this.queries.map(query => this.createQueryTool(query))
  }

  async getToolsAsync(): Promise<ExecutableTool[]> {
    await this.loadQueries()
    return this.queries.map(query => this.createQueryTool(query))
  }

  validate(): boolean {
    const config = this.toolSource as RestQueryToolSourceType
    return !!config.datasourceId && Array.isArray(config.queryIds)
  }
}
