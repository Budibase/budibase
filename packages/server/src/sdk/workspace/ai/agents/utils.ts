import {
  Agent,
  ToolType,
  ToolMetadata,
  SourceName,
  WebSearchProvider,
  ESCALATE_TOOL_NAME,
  EscalateToolResultStatus,
  ToolExecutionPrincipal,
  type AgentExecutionContext,
  type AgentOperation,
  type AgentToolRequestInputParameter,
} from "@budibase/types"
import type { JSONSchema7 } from "json-schema"
import { asSchema } from "ai"
import { ai } from "@budibase/pro"
import {
  createKnowledgeFilesTool,
  createKnowledgeSearchTool,
  createEscalatePlaceholderTool,
  createTableTools,
  getBudibaseTools,
} from "../../../../ai/tools/budibase"
import type { ToolSet, UIMessage, TypedToolCall, TypedToolResult } from "ai"
import { isToolUIPart, getToolName } from "ai"
import {
  createRestQueryTool,
  createDatasourceQueryTool,
  resolveToolExecutionPrincipal,
  toToolSet,
  type AiToolDefinition,
  type ToolAuthorizationRuntime,
} from "../../../../ai/tools"
import sdk from "../../.."
import { createExaTool, createParallelTool } from "../../../../ai/tools/search"
import { HTTPError } from "@budibase/backend-core"
import { authorizeAgentToolCall } from "../../../../ai/tools/authorization"
import type { ToolRequestInputRuntimeConfig } from "./toolRequestInputs"

const HELPER_TOOL_NAMES = new Set([
  "list_tables",
  "get_table",
  "list_automations",
  "get_automation",
  "list_knowledge_files",
  "search_knowledge",
  "list_session_escalations",
])

const isHelperTool = (tool: Pick<AiToolDefinition, "name">) =>
  HELPER_TOOL_NAMES.has(tool.name)

export const getLiveOperations = (agent: Agent): AgentOperation[] =>
  (agent.operations || []).filter(operation => operation.live === true)

export const getLiveOperation = (agent: Agent): AgentOperation | undefined =>
  getLiveOperations(agent)[0]

export function getToolDisplayNames(
  tools: AiToolDefinition[]
): Record<string, string> {
  return Object.fromEntries(
    tools.flatMap(tool =>
      tool.readableName ? [[tool.name, tool.readableName]] : []
    )
  )
}

export async function toToolMetadata(
  tool: AiToolDefinition
): Promise<ToolMetadata> {
  const derivedParameters = getRequestInputParameters({
    schema: await asSchema(tool.tool.inputSchema).jsonSchema,
  })
  const requestInputParameters = new Map(
    [...derivedParameters, ...(tool.requestInputParameters ?? [])].map(
      parameter => [JSON.stringify(parameter.parameterPath), parameter]
    )
  )
  return {
    name: tool.name,
    readableName: tool.readableName,
    description: tool.description,
    sourceType: tool.sourceType,
    sourceLabel: tool.sourceLabel,
    sourceIconType: tool.sourceIconType,
    executionPolicy: tool.executionPolicy,
    requestInputParameters: Array.from(requestInputParameters.values()),
  }
}

const getSchemaType = (schema: JSONSchema7) =>
  Array.isArray(schema.type)
    ? schema.type.find(type => type !== "null")
    : schema.type

const getRequestInputParameters = ({
  schema,
  parameterPath = [],
  nativeRequired = true,
}: {
  schema: JSONSchema7
  parameterPath?: string[]
  nativeRequired?: boolean
}): AgentToolRequestInputParameter[] => {
  const nonNullAlternatives = schema.anyOf?.filter(
    alternative =>
      typeof alternative !== "boolean" && getSchemaType(alternative) !== "null"
  )
  if (nonNullAlternatives?.length === 1) {
    return getRequestInputParameters({
      schema: nonNullAlternatives[0] as JSONSchema7,
      parameterPath,
      nativeRequired,
    })
  }

  const schemaType = getSchemaType(schema)
  if (schemaType === "object" || schema.properties) {
    const required = new Set(schema.required ?? [])
    return Object.entries(schema.properties ?? {}).flatMap(
      ([name, definition]) => {
        if (typeof definition === "boolean") {
          return []
        }
        return getRequestInputParameters({
          schema: definition,
          parameterPath: [...parameterPath, name],
          nativeRequired: nativeRequired && required.has(name),
        })
      }
    )
  }

  const name = schema.title || parameterPath.at(-1)
  if (!name || !parameterPath.length) {
    return []
  }
  if (
    schema.enum?.length &&
    schema.enum.every(option => typeof option === "string")
  ) {
    return [
      {
        parameterPath,
        name,
        type: "select",
        options: schema.enum,
        nativeRequired,
      },
    ]
  }
  if (schemaType === "string") {
    return [{ parameterPath, name, type: "text", nativeRequired }]
  }
  if (schemaType === "number" || schemaType === "integer") {
    return [{ parameterPath, name, type: "number", nativeRequired }]
  }
  return []
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

  const datasourcesById = new Map(
    datasources.filter(ds => !!ds._id).map(ds => [ds._id!, ds])
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

  const restQueryTools = queries.flatMap(query => {
    const datasource = datasourcesById.get(query.datasourceId)
    if (!datasource || datasource.source !== SourceName.REST) {
      return []
    }
    return [createRestQueryTool(query, datasource.name || "API")]
  })

  const datasourceQueryTools = queries.flatMap(query => {
    const datasource = datasourcesById.get(query.datasourceId)
    if (!datasource || datasource.source === SourceName.REST) {
      return []
    }
    return [
      createDatasourceQueryTool(
        query,
        datasource.name || "Datasource",
        datasource.source || "CUSTOM"
      ),
    ]
  })

  const tools: AiToolDefinition[] = [
    ...getBudibaseTools(
      tables,
      datasourceNamesById,
      datasourceIconTypesById,
      automations
    ),
    ...restQueryTools,
    ...datasourceQueryTools,
    createEscalatePlaceholderTool(),
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
  return Promise.all(
    tools.filter(tool => !isHelperTool(tool)).map(toToolMetadata)
  )
}

export interface BuildPromptAndToolsOptions {
  baseSystemPrompt?: string
  includeGoal?: boolean
  fallbackPromptInstructions?: string
  executionContext?: AgentExecutionContext
  toolSecurityEnabled?: boolean
  toolRequestInputsEnabled?: boolean
}

export async function buildPromptAndTools(
  agent: Agent,
  operation?: AgentOperation,
  options: BuildPromptAndToolsOptions = {}
): Promise<{
  systemPrompt: string
  tools: ToolSet
  toolDisplayNames: Record<string, string>
  toolRequestInputConfigs: Map<string, ToolRequestInputRuntimeConfig>
}> {
  const {
    baseSystemPrompt,
    includeGoal = true,
    fallbackPromptInstructions,
  } = options
  const agentId = agent._id
  if (!agentId) {
    throw new Error("Agent _id is required")
  }
  const hasKnowledgeBases = operation?.knowledgeBases?.some(Boolean) ?? false

  const allTools = await getAvailableTools(agent.aiconfig)
  const toolConfigs = operation?.enabledTools || []
  const enabledToolNames = new Set(toolConfigs.map(config => config.toolName))
  const enabledTools = addHelperTools(
    allTools.filter(
      tool => enabledToolNames.has(tool.name) && !isHelperTool(tool)
    ),
    allTools
  )

  if (
    operation &&
    hasKnowledgeBases &&
    !enabledTools.some(tool => tool.name === "list_knowledge_files")
  ) {
    enabledTools.push(createKnowledgeFilesTool(agentId, operation.id))
  }
  if (
    operation &&
    hasKnowledgeBases &&
    !enabledTools.some(tool => tool.name === "search_knowledge")
  ) {
    enabledTools.push(createKnowledgeSearchTool(agentId, operation.id))
  }

  const runtimes = new Map<string, ToolAuthorizationRuntime>()
  if (operation && options.executionContext) {
    const { executionContext } = options
    for (const tool of enabledTools) {
      const config = toolConfigs.find(config => config.toolName === tool.name)
      const principal = options.toolSecurityEnabled
        ? resolveToolExecutionPrincipal(tool, config)
        : ToolExecutionPrincipal.ADMIN
      runtimes.set(tool.name, {
        executionContext,
        principal,
        authorize: authorizeAgentToolCall,
      })
    }
  }

  const systemPrompt = ai.composeAutomationAgentSystemPrompt({
    baseSystemPrompt,
    goal: includeGoal ? agent.goal : undefined,
    promptInstructions: operation
      ? [`Current operation: ${operation.name}`, operation.promptInstructions]
          .filter(Boolean)
          .join("\n\n")
      : fallbackPromptInstructions,
    includeGoal,
  })

  let resolvedSystemPrompt = systemPrompt
  if (options.toolSecurityEnabled) {
    resolvedSystemPrompt += `\n\nA configured tool may still be unavailable to the requesting user. If a tool call fails because it is unavailable in the security context, do not substitute a different tool or resource and do not claim the action succeeded. Tell the user that they do not have permission to perform the requested action.`
  }
  if (hasKnowledgeBases) {
    resolvedSystemPrompt += `\n\nWhen users ask about attached files (for example size, type, upload status, processing errors, or file counts), call list_knowledge_files with a filename when possible. Do not guess file metadata. If list_knowledge_files returns ambiguous results, ask a clarification question before answering. If it returns no matches, say that you couldn't find a matching file.\n\nFor any non-trivial user question, call search_knowledge before answering. Do not say the answer is unavailable, unknown, or unsupported until after you have searched knowledge. If search_knowledge returns no relevant context, say that you couldn't find supporting knowledge.\n\nIf you used search_knowledge context in your final answer, call report_used_sources immediately before your final response and pass only sourceIds that directly support the final answer. Do not include sources that were merely searched/consulted. If your conclusion is that the answer is not found in the documents, call report_used_sources with an empty sourceIds list.`
  }
  if (enabledToolNames.has("escalate")) {
    resolvedSystemPrompt += `\n\nBefore calling escalate, call list_session_escalations to check whether this same request is already awaiting approval or has already been approved in this conversation. If an equivalent request is still pending, do not escalate again - tell the user it is already awaiting approval. If it has already been approved, proceed instead of escalating again. Only escalate genuinely new requests.`
  }

  const toolRequestInputConfigs = options.toolRequestInputsEnabled
    ? new Map(
        await Promise.all(
          enabledTools.flatMap(tool => {
            const requestInputs = toolConfigs.find(
              config => config.toolName === tool.name
            )?.requestInputs
            if (!requestInputs?.length) {
              return []
            }
            return [
              toToolMetadata(tool).then(
                metadata =>
                  [
                    tool.name,
                    {
                      requestInputs,
                      parameters: metadata.requestInputParameters ?? [],
                    },
                  ] as const
              ),
            ]
          })
        )
      )
    : new Map<string, ToolRequestInputRuntimeConfig>()

  return {
    systemPrompt: resolvedSystemPrompt,
    tools: toToolSet(enabledTools, runtimes),
    toolDisplayNames: getToolDisplayNames(enabledTools),
    toolRequestInputConfigs,
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

  if (enabledTools.some(tool => tool.tableId)) {
    const tableIds = enabledTools.flatMap(tool =>
      tool.tableId ? [tool.tableId] : []
    )
    for (const tool of createTableTools(tableIds)) {
      if (seenTools.has(tool.name)) continue
      enabledTools.push(tool)
      seenTools.add(tool.name)
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

export function updateUnrecoveredToolFailures(
  unrecoveredToolFailures: Set<string>,
  toolResults: TypedToolResult<ToolSet>[],
  erroredToolNames: string[]
): void {
  for (const toolResult of toolResults) {
    unrecoveredToolFailures.delete(toolResult.toolName)
  }

  for (const toolName of erroredToolNames) {
    unrecoveredToolFailures.add(toolName)
  }
}

// escalate can return a technically-successful tool-result that isn't a real
// escalation (e.g. the "no reviewers configured" placeholder responds with
// status "unavailable" instead of throwing). Split tool results so callers
// can treat that case as a failure rather than a genuine success, while every
// other tool keeps its normal success/failure handling untouched.
export function groupToolResultsByOutcome(
  toolResults: TypedToolResult<ToolSet>[]
): {
  successResults: TypedToolResult<ToolSet>[]
  successNames: string[]
  semanticFailureNames: string[]
  semanticFailureResults: TypedToolResult<ToolSet>[]
} {
  const successResults: TypedToolResult<ToolSet>[] = []
  const successNames: string[] = []
  const semanticFailureNames: string[] = []
  const semanticFailureResults: TypedToolResult<ToolSet>[] = []

  for (const toolResult of toolResults) {
    if (toolResult.toolName !== ESCALATE_TOOL_NAME) {
      successResults.push(toolResult)
      successNames.push(toolResult.toolName)
      continue
    }

    const status = (toolResult.output as { status?: string } | undefined)
      ?.status

    if (status === EscalateToolResultStatus.UNAVAILABLE) {
      semanticFailureNames.push(toolResult.toolName)
      semanticFailureResults.push(toolResult)
      continue
    }

    successResults.push(toolResult)
    if (status === EscalateToolResultStatus.PENDING_APPROVAL) {
      successNames.push(toolResult.toolName)
    }
  }

  return {
    successResults,
    successNames,
    semanticFailureNames,
    semanticFailureResults,
  }
}

export function formatIncompleteToolCallError(
  incompleteTools: IncompleteToolCall[]
): string {
  const toolNames = incompleteTools.map(t => t.toolName).join(", ")
  return `The AI model failed to complete tool execution${toolNames ? ` for: ${toolNames}` : ""}. This may be due to a compatibility issue with the selected model. Please try a different model or try again.`
}

export const assertAgentHasValidConfig = async (agent: Agent) => {
  if (!agent.aiconfig) {
    throw new HTTPError(
      "Agent is not properly configured: missing AI config",
      422
    )
  }

  const aiConfig = await sdk.ai.configs.find(agent.aiconfig)
  if (!aiConfig) {
    throw new HTTPError(
      `Agent is not properly configured: AI config "${agent.aiconfig}" not found`,
      422
    )
  }
}
