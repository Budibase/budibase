import {
  Agent,
  Tool,
  SourceName,
  type Query,
  type Datasource,
} from "@budibase/types"
import { ai } from "@budibase/pro"
import type { StepResult, ToolSet } from "ai"
import budibaseTools from "../../../../ai/tools/budibase"
import { newTool } from "../../../../ai/tools"
import { z } from "zod"
import { context } from "@budibase/backend-core"
import * as queryController from "../../../../api/controllers/query"
import { buildCtx } from "../../../../automations/steps/utils"
import sdk from "../../.."

type ToolWithSource = Tool & {
  sourceType?: "BUDIBASE" | "REST"
  sourceLabel?: string
}

const sanitiseToolName = (name: string): string => {
  if (name.length > 64) {
    return name.substring(0, 64) + "..."
  }
  return name.replace(/[^a-zA-Z0-9_-]/g, "_")
}

const buildParametersSchema = (parameters: { name: string }[] = []) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {}

  for (const param of parameters) {
    schemaFields[param.name] = z
      .string()
      .optional()
      .describe(`Parameter: ${param.name}`)
  }

  return z.object(schemaFields)
}

const createQueryTool = (
  query: { name: string; _id?: string; parameters?: { name: string }[] },
  datasourceName?: string
): ToolWithSource => {
  const toolName = sanitiseToolName(query.name)
  const parametersSchema = buildParametersSchema(query.parameters || [])

  const description = query.name

  const tool = newTool({
    name: toolName,
    description,
    parameters: parametersSchema,
    handler: async (params: Record<string, any>) => {
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
  })

  return {
    ...tool,
    sourceType: "REST",
    sourceLabel: datasourceName || "API",
  }
}

export async function getAvailableTools(): Promise<ToolWithSource[]> {
  const [queries, datasources] = await Promise.all([
    sdk.queries.fetch(),
    sdk.datasources.fetch(),
  ])

  const restDatasourceNames = new Map(
    (datasources as Datasource[])
      .filter(ds => ds.source === SourceName.REST)
      .map(ds => [ds._id, ds.name || "API"])
  )

  const restQueryTools = (queries as Query[])
    .filter(query => restDatasourceNames.has(query.datasourceId))
    .map(query =>
      createQueryTool(query, restDatasourceNames.get(query.datasourceId))
    )

  const budibaseToolsWithMeta: ToolWithSource[] = budibaseTools.map(tool => ({
    ...tool,
    sourceType: "BUDIBASE",
    sourceLabel: "Budibase",
  }))

  return [...budibaseToolsWithMeta, ...restQueryTools]
}

export interface BuildPromptAndToolsOptions {
  baseSystemPrompt?: string
  includeGoal?: boolean
}

export async function buildPromptAndTools(
  agent: Agent,
  options: BuildPromptAndToolsOptions = {}
): Promise<{
  systemPrompt: string
  tools: Tool[]
}> {
  const { baseSystemPrompt, includeGoal = true } = options
  const allTools = await getAvailableTools()

  const systemPrompt = ai.composeAutomationAgentSystemPrompt({
    baseSystemPrompt,
    goal: includeGoal ? agent.goal : undefined,
    promptInstructions: agent.promptInstructions,
    includeGoal,
  })

  return {
    systemPrompt,
    tools: allTools,
  }
}

export function createLiteLLMFetch(sessionId: string) {
  return (
    input: Parameters<typeof fetch>[0],
    init?: Parameters<typeof fetch>[1]
  ) => {
    if (typeof init?.body === "string") {
      try {
        const body = JSON.parse(init.body)
        body.litellm_session_id = sessionId
        return fetch(input, { ...init, body: JSON.stringify(body) })
      } catch {
        // Not JSON, pass through
      }
    }
    return fetch(input, init)
  }
}

/**
 * Extracts reasoning text from an agent step result. First checks if reasoningText
 * is already present on the step, otherwise attempts to extract it from the response
 * body structure (choices[0].message.reasoning). Returns undefined if no reasoning
 * text is found or if extraction fails.
 */
export const extractReasoningTextFromStep = (
  step: StepResult<ToolSet>
): string | undefined => {
  const existing = step.reasoningText
  if (existing && existing.trim().length > 0) {
    return existing
  }

  const body = step.response?.body
  if (!body || typeof body !== "object" || !("choices" in body)) {
    return undefined
  }

  try {
    const choices = body.choices
    if (!Array.isArray(choices) || choices.length === 0) {
      return undefined
    }
    const message = choices[0]?.message
    const reasoning = message?.reasoning
    if (typeof reasoning === "string" && reasoning.trim().length > 0) {
      return reasoning
    }
  } catch (error) {
    console.log("Error extracting reasoning text from step: ", error)
  }

  return undefined
}

export const attachReasoningToSteps = (
  steps?: Array<StepResult<ToolSet>>
): Array<StepResult<ToolSet>> | undefined => {
  if (!steps || steps.length === 0) {
    return steps
  }

  return steps.map(step => {
    const reasoningText = extractReasoningTextFromStep(step)
    if (!reasoningText) {
      return step
    }
    return {
      ...step,
      reasoningText,
    }
  })
}
