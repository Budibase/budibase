import {
  Agent,
  AgentOperation,
  type ChatConversationChannel,
  ESCALATE_TOOL_NAME,
  EscalationSource,
  ToolType,
  ToolMetadata,
  SourceName,
  WebSearchProvider,
  EscalateToolResultStatus,
  ResolutionStrategy,
  ToolExecutionPrincipal,
  type AgentExecutionContext,
  type EscalationRecipient,
  EscalationNotificationChannel,
} from "@budibase/types"
import { ai } from "@budibase/pro"
import {
  createKnowledgeFilesTool,
  createKnowledgeSearchTool,
  getBudibaseTools,
} from "../../../../ai/tools/budibase"
import type {
  ModelMessage,
  ToolSet,
  UIMessage,
  TypedToolCall,
  TypedToolResult,
} from "ai"
import { isToolUIPart, getToolName } from "ai"
import {
  createRestQueryTool,
  createDatasourceQueryTool,
  toToolSet,
  type AiToolDefinition,
} from "../../../../ai/tools"
import sdk from "../../.."
import { createExaTool, createParallelTool } from "../../../../ai/tools/search"
import { context, HTTPError } from "@budibase/backend-core"
import { authorizeAgentToolCall } from "../../../../ai/tools/authorization"
import { escalationProcessor } from "../../../../escalation/processor"
import { resolutionStrategyBinding } from "../../../../escalation/resolutionStrategies"
import {
  getReadableQueryToolBinding,
  isQueryToolType,
} from "@budibase/shared-core"
import { isDeepStrictEqual } from "node:util"

const HELPER_TOOL_NAMES = new Set([
  "list_tables",
  "get_table",
  "list_automations",
  "get_automation",
  "list_knowledge_files",
  "search_knowledge",
  "list_session_escalations",
])

const DEFAULT_TOOL_APPROVAL_DELAY_MS = 60 * 60 * 1000

const isHelperTool = (tool: Pick<AiToolDefinition, "name">) =>
  HELPER_TOOL_NAMES.has(tool.name)

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export const replaceUnavailableToolBindings = ({
  promptInstructions,
  bindings,
}: {
  promptInstructions?: string
  bindings: Array<{ readableBinding: string; label: string }>
}) => {
  if (!promptInstructions || !bindings.length) {
    return promptInstructions
  }
  return bindings.reduce((instructions, binding) => {
    const expression = new RegExp(
      `\\{\\{\\s*${escapeRegExp(binding.readableBinding)}\\s*\\}\\}`,
      "g"
    )
    return instructions.replace(
      expression,
      `[Unavailable in this security context: ${binding.label}]`
    )
  }, promptInstructions)
}

const sanitizeBindingSegment = (value: string) =>
  value.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "")

const getToolReadableBinding = (tool: AiToolDefinition) => {
  const displayName = tool.readableName || tool.name
  if (isQueryToolType(tool.sourceType)) {
    return getReadableQueryToolBinding({
      sourceType: tool.sourceType,
      sourceLabel: tool.sourceLabel,
      queryName: displayName,
    })
  }
  let prefix = "tool"
  if (
    tool.sourceType === ToolType.INTERNAL_TABLE ||
    tool.sourceType === ToolType.AUTOMATION
  ) {
    prefix = "budibase"
  } else if (tool.sourceType === ToolType.EXTERNAL_TABLE) {
    prefix = tool.sourceLabel
      ? sanitizeBindingSegment(tool.sourceLabel)
      : "external"
  } else if (tool.sourceType === ToolType.SEARCH) {
    prefix = "search"
  } else if (tool.sourceType === ToolType.ESCALATION) {
    prefix = "escalation"
  }
  return `${prefix}.${displayName}`
}

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

export function toToolMetadata(tool: AiToolDefinition): ToolMetadata {
  return {
    name: tool.name,
    readableName: tool.readableName,
    description: tool.description,
    sourceType: tool.sourceType,
    sourceLabel: tool.sourceLabel,
    sourceIconType: tool.sourceIconType,
    authorization: tool.authorization
      ? {
          supportedPrincipals: tool.authorization.supportedPrincipals,
          permissionType: tool.authorization.permissionType,
          permissionLevel: tool.authorization.permissionLevel,
        }
      : undefined,
    supportsApproval: !!tool.approval,
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
  return tools.filter(tool => !isHelperTool(tool)).map(toToolMetadata)
}

export interface BuildPromptAndToolsOptions {
  baseSystemPrompt?: string
  includeGoal?: boolean
  fallbackPromptInstructions?: string
  execution?: {
    requestingUserId: string
    requestingUserIsPublic?: boolean
    sessionId: string
    channel?: ChatConversationChannel
    getRequestId?: () => string | undefined
  }
}

export async function buildPromptAndTools(
  agent: Agent,
  operation?: AgentOperation,
  options: BuildPromptAndToolsOptions = {}
): Promise<{
  systemPrompt: string
  tools: ToolSet
  toolDisplayNames: Record<string, string>
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

  const runtimes = new Map()
  if (operation && options.execution) {
    const workspaceId = context.getWorkspaceId()
    if (!workspaceId) {
      throw new HTTPError("Workspace context is required", 400)
    }
    const executionContext: AgentExecutionContext = {
      tenantId: context.getTenantId(),
      workspaceId,
      agentId,
      operationId: operation.id,
      conversationId: options.execution.sessionId,
      requestingUserId: options.execution.requestingUserId,
      requestingUserIsPublic: options.execution.requestingUserIsPublic,
    }
    for (const tool of enabledTools) {
      const config = toolConfigs.find(config => config.toolName === tool.name)
      const escalationConfig = agent.escalationConfigs?.find(
        escalation => escalation.id === config?.escalationConfigId
      )
      if (config?.escalationConfigId && !escalationConfig) {
        continue
      }
      const principal =
        config?.executionPrincipal ?? ToolExecutionPrincipal.REQUESTER
      if (
        !tool.authorization ||
        !tool.authorization.supportedPrincipals.includes(principal)
      ) {
        continue
      }
      const runtime = {
        executionContext,
        principal,
        authorize: authorizeAgentToolCall,
        ...(escalationConfig && {
          escalation: {
            recipient: escalationConfig.recipient,
            request: async ({
              input,
              summary,
              toolCallId,
              messages,
            }: {
              input: unknown
              summary: { title: string; summary: string }
              toolCallId: string
              messages: ModelMessage[]
            }) => {
              const result = await escalationProcessor.create({
                source: EscalationSource.TOOL,
                appId: workspaceId,
                tenantId: executionContext.tenantId,
                message: summary.summary,
                title: summary.title,
                summary: summary.summary,
                delay: DEFAULT_TOOL_APPROVAL_DELAY_MS,
                recipients: [escalationConfig.recipient],
                resolutionStrategy: resolutionStrategyBinding(
                  ResolutionStrategy.FIRST_RESPONSE
                ),
                agentId,
                operationId: operation.id,
                requestId: options.execution?.getRequestId?.(),
                escalationConfigId: escalationConfig.id,
                escalationConfigName: escalationConfig.name,
                context: {
                  agentId,
                  operationId: operation.id,
                  sessionId: options.execution?.sessionId || "",
                  messages,
                  channel: options.execution?.channel,
                  userId: options.execution?.requestingUserId,
                  tenantId: executionContext.tenantId,
                  workspaceId: executionContext.workspaceId,
                  toolName: tool.name,
                  toolCallId,
                  input,
                  executionPrincipal: principal,
                  escalationConfigId: escalationConfig.id,
                  escalationRecipient: escalationConfig.recipient,
                  requestingUserIsPublic:
                    executionContext.requestingUserIsPublic,
                },
              })
              console.log("Agent tool approval requested", {
                escalationId: result.escalationId,
                requesterId: executionContext.requestingUserId,
                effectivePrincipal: principal,
                agentId,
                operationId: operation.id,
                toolName: tool.name,
                escalationConfigId: escalationConfig.id,
                escalationConfigName: escalationConfig.name,
                recipientType: escalationConfig.recipient.type,
                workspaceId,
              })
              return result
            },
          },
        }),
      }
      try {
        await authorizeAgentToolCall({
          authorization: tool.authorization,
          input: undefined,
          executionContext,
          principal,
        })
        runtimes.set(tool.name, runtime)
      } catch {
        // Exposure is best-effort least privilege. The same authorization is
        // always repeated with the real input immediately before execution.
      }
    }
  }

  const authorizedTools = options.execution
    ? enabledTools.filter(tool => runtimes.has(tool.name))
    : enabledTools
  const authorizedToolNames = new Set(authorizedTools.map(tool => tool.name))
  const unavailableBindings = options.execution
    ? enabledTools
        .filter(
          tool =>
            enabledToolNames.has(tool.name) &&
            !authorizedToolNames.has(tool.name)
        )
        .map(tool => ({
          readableBinding: getToolReadableBinding(tool),
          label: tool.readableName || tool.name,
        }))
    : []
  const promptInstructions = operation
    ? replaceUnavailableToolBindings({
        promptInstructions: operation.promptInstructions,
        bindings: unavailableBindings,
      })
    : fallbackPromptInstructions
  const systemPrompt = ai.composeAutomationAgentSystemPrompt({
    baseSystemPrompt,
    goal: includeGoal ? agent.goal : undefined,
    promptInstructions: operation
      ? [`Current operation: ${operation.name}`, promptInstructions]
          .filter(Boolean)
          .join("\n\n")
      : promptInstructions,
    includeGoal,
  })

  let resolvedSystemPrompt = systemPrompt
  if (hasKnowledgeBases) {
    resolvedSystemPrompt += `\n\nWhen users ask about attached files (for example size, type, upload status, processing errors, or file counts), call list_knowledge_files with a filename when possible. Do not guess file metadata. If list_knowledge_files returns ambiguous results, ask a clarification question before answering. If it returns no matches, say that you couldn't find a matching file.\n\nFor any non-trivial user question, call search_knowledge before answering. Do not say the answer is unavailable, unknown, or unsupported until after you have searched knowledge. If search_knowledge returns no relevant context, say that you couldn't find supporting knowledge.\n\nIf you used search_knowledge context in your final answer, call report_used_sources immediately before your final response and pass only sourceIds that directly support the final answer. Do not include sources that were merely searched/consulted. If your conclusion is that the answer is not found in the documents, call report_used_sources with an empty sourceIds list.`
  }

  return {
    systemPrompt: resolvedSystemPrompt,
    tools: toToolSet(authorizedTools, runtimes),
    toolDisplayNames: getToolDisplayNames(authorizedTools),
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

export const assertAgentHasValidConfig = async (
  agent: Agent,
  options: { allowLegacyOperationEscalation?: boolean } = {}
) => {
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

  await assertAgentToolEscalationsValid(agent, options)
}

export const assertAgentToolEscalationsValid = async (
  agent: Agent,
  options: { allowLegacyOperationEscalation?: boolean } = {}
) => {
  const escalationConfigs = agent.escalationConfigs || []
  const names = new Set<string>()
  const configIds = new Set<string>()
  for (const escalationConfig of escalationConfigs) {
    const normalizedName = escalationConfig.name?.trim().toLowerCase()
    if (
      typeof escalationConfig.id !== "string" ||
      !escalationConfig.id.startsWith("escalation_config_") ||
      !normalizedName ||
      !escalationConfig.recipient ||
      !Object.values(EscalationNotificationChannel).includes(
        escalationConfig.recipient.type
      ) ||
      typeof escalationConfig.recipient.config !== "object" ||
      escalationConfig.recipient.config === null ||
      Array.isArray(escalationConfig.recipient.config) ||
      configIds.has(escalationConfig.id) ||
      names.has(normalizedName)
    ) {
      throw new HTTPError("Agent escalation configuration is invalid", 422)
    }
    configIds.add(escalationConfig.id)
    names.add(normalizedName)
  }

  for (const operation of agent.operations || []) {
    if (
      !options.allowLegacyOperationEscalation &&
      "escalation" in operation &&
      operation.escalation
    ) {
      throw new HTTPError(
        "Operation-level escalation is no longer supported. Configure approval on individual tools.",
        422
      )
    }
  }

  const configuredApprovalTools = (agent.operations || []).flatMap(operation =>
    (operation.enabledTools || []).filter(tool => !!tool.escalationConfigId)
  )
  if (!configuredApprovalTools.length) {
    return
  }

  for (const tool of configuredApprovalTools) {
    if (!configIds.has(tool.escalationConfigId!)) {
      throw new HTTPError(
        `Tool "${tool.toolName}" references an unknown escalation configuration`,
        422
      )
    }
  }

  const availableTools = await getAvailableTools(agent.aiconfig)
  const approvalTools = new Map(
    availableTools
      .filter(tool => !!tool.approval)
      .map(tool => [tool.name, tool])
  )
  for (const tool of configuredApprovalTools) {
    const definition = approvalTools.get(tool.toolName)
    if (!definition) {
      throw new HTTPError(
        `Tool "${tool.toolName}" does not support approval gates`,
        422
      )
    }
    if (
      !definition.authorization?.supportedPrincipals.includes(
        tool.executionPrincipal
      )
    ) {
      throw new HTTPError(
        `Tool "${tool.toolName}" does not support the selected execution principal`,
        422
      )
    }
  }
}

export const executeApprovedToolCall = async ({
  agent,
  operationId,
  toolName,
  input,
  toolCallId,
  messages,
  executionPrincipal,
  requestingUserId,
  sessionId,
  escalationConfigId,
  expectedRecipient,
  requestingUserIsPublic,
}: {
  agent: Agent
  operationId: string
  toolName: string
  input: unknown
  toolCallId: string
  messages: ModelMessage[]
  executionPrincipal: "requester" | "admin"
  requestingUserId: string
  sessionId: string
  escalationConfigId: string
  expectedRecipient: EscalationRecipient
  requestingUserIsPublic?: boolean
}) => {
  const principal =
    executionPrincipal === "admin"
      ? ToolExecutionPrincipal.ADMIN
      : ToolExecutionPrincipal.REQUESTER
  const operation = agent.operations?.find(item => item.id === operationId)
  const config = operation?.enabledTools?.find(
    item => item.toolName === toolName
  )
  const escalationConfig = agent.escalationConfigs?.find(
    item => item.id === escalationConfigId
  )
  if (
    !operation ||
    config?.escalationConfigId !== escalationConfigId ||
    !escalationConfig ||
    config.executionPrincipal !== principal ||
    !isDeepStrictEqual(escalationConfig.recipient, expectedRecipient)
  ) {
    throw new HTTPError("Approved tool configuration has changed", 403)
  }

  const definition = (await getAvailableTools(agent.aiconfig)).find(
    tool => tool.name === toolName
  )
  if (!definition?.authorization || !definition.approval) {
    throw new HTTPError("Approved tool is no longer available", 403)
  }
  if (!definition.authorization.supportedPrincipals.includes(principal)) {
    throw new HTTPError(
      "Approved execution principal is no longer supported",
      403
    )
  }

  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    throw new HTTPError("Workspace context is required", 400)
  }
  const executionContext: AgentExecutionContext = {
    tenantId: context.getTenantId(),
    workspaceId,
    agentId: agent._id!,
    operationId,
    conversationId: sessionId,
    requestingUserId,
    requestingUserIsPublic,
  }
  const preparedInput = definition.authorization.prepareInput
    ? await definition.authorization.prepareInput(input, executionContext)
    : input
  if (!isDeepStrictEqual(preparedInput, input)) {
    throw new HTTPError("Approved tool input is no longer valid", 403)
  }
  await authorizeAgentToolCall({
    authorization: definition.authorization,
    input: preparedInput,
    executionContext,
    principal,
  })

  if (!definition.tool.execute) {
    throw new HTTPError("Approved tool cannot be executed", 400)
  }
  const result = await definition.tool.execute(preparedInput, {
    toolCallId,
    messages,
  })
  if (
    result &&
    typeof result === "object" &&
    "error" in result &&
    result.error
  ) {
    throw new Error(String(result.error))
  }
  return result
}
