import {
  Agent,
  ToolType,
  ToolMetadata,
  SourceName,
  WebSearchProvider,
} from "@budibase/types"
import { ai } from "@budibase/pro"
import { getBudibaseTools } from "../../../../ai/tools/budibase"
import type { ToolSet, UIMessage, TypedToolCall, TypedToolResult } from "ai"
import { isToolUIPart, getToolName } from "ai"
import {
  createRestQueryTool,
  toToolSet,
  type AiToolDefinition,
} from "../../../../ai/tools"
import sdk from "../../.."
import { createExaTool, createParallelTool } from "../../../../ai/tools/search"

export function toToolMetadata(tool: AiToolDefinition): ToolMetadata {
  return {
    name: tool.name,
    readableName: tool.readableName,
    description: tool.description,
    sourceType: tool.sourceType,
    sourceLabel: tool.sourceLabel,
    sourceIconType: tool.sourceIconType,
  }
}

export async function getAvailableTools(
  aiconfigId?: string
): Promise<AiToolDefinition[]> {
  const [queries, datasources, aiConfig, tables, automations] =
    await Promise.all([
      sdk.queries.fetch(),
      sdk.datasources.fetch(),
      aiconfigId ? sdk.ai.configs.find(aiconfigId) : Promise.resolve(undefined),
      sdk.tables.getAllTables(),
      sdk.automations.fetch(),
    ])
  const webSearchConfig = aiConfig?.webSearchConfig

  const restDatasourceNames = new Map(
    datasources
      .filter(ds => ds.source === SourceName.REST)
      .map(ds => [ds._id, ds.name || "API"])
  )

  const datasourceNamesById = Object.fromEntries(
    datasources
      .filter(ds => !!ds._id)
      .map(ds => [ds._id, ds.name || "Datasource"])
  )

  const datasourceIconTypesById = Object.fromEntries(
    datasources
      .filter(ds => !!ds._id)
      .map(ds => [ds._id!, ds.source || "CUSTOM"])
  )

  const restQueryTools = queries
    .filter(query => restDatasourceNames.has(query.datasourceId))
    .map(query =>
      createRestQueryTool(query, restDatasourceNames.get(query.datasourceId))
    )

  const tools: AiToolDefinition[] = [
    ...getBudibaseTools(
      tables,
      datasourceNamesById,
      datasourceIconTypesById,
      automations
    ),
    ...restQueryTools,
  ]
  if (webSearchConfig?.apiKey) {
    if (webSearchConfig.provider === WebSearchProvider.EXA) {
      tools.push(createExaTool(webSearchConfig.apiKey))
    } else if (webSearchConfig.provider === WebSearchProvider.PARALLEL) {
      tools.push(createParallelTool(webSearchConfig.apiKey))
    }
  }

  return tools
}

export async function getAvailableToolsMetadata(
  aiconfigId?: string
): Promise<ToolMetadata[]> {
  const tools = await getAvailableTools(aiconfigId)
  return tools.map(toToolMetadata)
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
  tools: ToolSet
}> {
  const { baseSystemPrompt, includeGoal = true } = options

  const allTools = await getAvailableTools(agent.aiconfig)
  const enabledToolNames = new Set(agent.enabledTools || [])
  const enabledTools = addHelperTools(
    allTools.filter(tool => enabledToolNames.has(tool.name)),
    allTools
  )

  const systemPrompt = ai.composeAutomationAgentSystemPrompt({
    baseSystemPrompt,
    goal: includeGoal ? agent.goal : undefined,
    promptInstructions: agent.promptInstructions,
    includeGoal,
  })

  return {
    systemPrompt,
    tools: toToolSet(enabledTools),
  }
}

/*
We want to add these tools for automations / tables if user has added related tools.
This abstracts the decision of what tools to add away from the user.
*/
function addHelperTools(
  enabledTools: AiToolDefinition[],
  allTools: AiToolDefinition[]
) {
  const seenTools = new Set(enabledTools.map(tool => tool.name))
  const toolByName = new Map(allTools.map(tool => [tool.name, tool]))

  if (
    enabledTools.some(
      tool =>
        tool.sourceType === ToolType.EXTERNAL_TABLE ||
        tool.sourceType === ToolType.INTERNAL_TABLE
    )
  ) {
    for (const toolName of ["get_table", "list_tables"]) {
      if (seenTools.has(toolName)) continue
      let tool = toolByName.get(toolName)
      if (tool) {
        enabledTools.push(tool)
        seenTools.add(tool.name)
      }
    }
  }

  if (enabledTools.some(tool => tool.sourceType === ToolType.AUTOMATION)) {
    for (const toolName of ["get_automation", "list_automations"]) {
      if (seenTools.has(toolName)) continue
      let tool = toolByName.get(toolName)
      if (tool) {
        enabledTools.push(tool)
        seenTools.add(tool.name)
      }
    }
  }

  return enabledTools
}

export interface IncompleteToolCall {
  toolName: string
  toolCallId: string
  state: string
}

const COMPLETED_TOOL_STATES = new Set([
  "output-available",
  "output-error",
  "output-denied",
])

export function findIncompleteToolCalls(
  messages: UIMessage[]
): IncompleteToolCall[] {
  const incomplete: IncompleteToolCall[] = []
  for (const message of messages) {
    if (message.role !== "assistant" || !message.parts) {
      continue
    }
    for (const part of message.parts) {
      if (isToolUIPart(part) && !COMPLETED_TOOL_STATES.has(part.state)) {
        incomplete.push({
          toolName: getToolName(part),
          toolCallId: part.toolCallId,
          state: part.state,
        })
      }
    }
  }
  return incomplete
}

export function updatePendingToolCalls(
  pendingToolCalls: Set<string>,
  toolCalls: TypedToolCall<ToolSet>[],
  toolResults: TypedToolResult<ToolSet>[]
): void {
  for (const toolCall of toolCalls) {
    if (toolCall.toolCallId) {
      pendingToolCalls.add(toolCall.toolCallId)
    }
  }

  for (const toolResult of toolResults) {
    if (toolResult.toolCallId) {
      pendingToolCalls.delete(toolResult.toolCallId)
    }
  }
}

export function formatIncompleteToolCallError(
  incompleteTools: IncompleteToolCall[]
): string {
  const toolNames = incompleteTools.map(t => t.toolName).join(", ")
  return `The AI model failed to complete tool execution${toolNames ? ` for: ${toolNames}` : ""}. This may be due to a compatibility issue with the selected model. Please try a different model or try again.`
}
