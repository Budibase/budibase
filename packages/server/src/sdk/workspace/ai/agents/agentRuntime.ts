import { cache, features } from "@budibase/backend-core"
import { ai, quotas } from "@budibase/pro"
import {
  ActionType,
  Agent,
  AgentOperation,
  AgentMessageMetadata,
  ChatConversationRequest,
  ContextUser,
  FeatureFlag,
} from "@budibase/types"
import {
  Output,
  extractReasoningMiddleware,
  stepCountIs,
  ToolLoopAgent,
  type LanguageModelUsage,
  type ModelMessage,
  type StreamTextResult,
  type ToolSet,
  wrapLanguageModel,
} from "ai"
import { z } from "zod"
import sdk from "../../.."
import { createSessionLogIndexer } from "../agentLogs"
import {
  findLatestUserQuestion,
  prepareModelMessages,
} from "../chatConversations"
import {
  updatePendingToolCalls,
  updateUnrecoveredToolFailures,
  partitionEscalateAwareToolResults,
  buildPromptAndTools,
  getLiveOperations,
  type BuildPromptAndToolsOptions,
} from "./utils"
import { estimateTokens } from "./usage"
import { createReportUsedSourcesTool } from "../../../../ai/tools/budibase/knowledge/reportUsedSources"
import {
  createEscalateTool,
  createResolvedEscalateTool,
} from "../../../../ai/tools/budibase/escalate"
import { createListSessionEscalationsTool } from "../../../../ai/tools/budibase/listSessionEscalations"
import type tracer from "dd-trace"
import { withLiteLLMSessionId } from "../llm/requestSession"

// How long to wait for a human response before the escalation expires, in
// seconds, when the operation doesn't specify its own delay.
const DEFAULT_ESCALATION_DELAY_SECONDS = 3600

interface PrepareAgentChatRunParams {
  agent: Agent
  agentId: string
  chat?: ChatConversationRequest
  modelMessages?: ModelMessage[]
  latestQuestion?: string
  aiConfigId?: string
  errorLabel: string
  sessionId: string
  user: ContextUser
  startedAt?: string
  // Pin the run to a specific operation instead of routing on the question.
  operationId?: string
  // On resume swap escalate for a resolved stub so the model can't trigger a fresh escalation
  escalationResolved?: boolean
  // Appended to the system prompt - a trusted channel for run-time directives
  // Puting it in the user input made it suspicious.
  additionalInstructions?: string
  // Resolves the AgentRequest id tracking this run, for the escalate tool to
  // stamp onto the escalation it raises. Read lazily since the caller only
  // knows it after this run's operation is resolved.
  getRequestId?: () => string | undefined
}

export interface AgentChatRun {
  latestQuestion: string
  selectedOperation?: AgentOperation
  getUsedKnowledgeSourcesMetadata: () => AgentMessageMetadata["ragSources"]
  sessionLogIndexer: ReturnType<typeof createSessionLogIndexer>
  stream: (
    options?: AgentChatStreamOptions
  ) => Promise<StreamTextResult<ToolSet, never>>
  toolDisplayNames: Record<string, string>
  contextWindowTokens?: number
  systemPromptTokens: number
  contextUsage: {
    input?: LanguageModelUsage
    output?: LanguageModelUsage
  }
}

export interface AgentChatStreamOptions {
  onFinish?: (responseId?: string) => void | Promise<void>
  // Fires with the names of tools that actually completed successfully in a
  // step, not merely attempted. A tool that errors, or escalate returning a
  // non-pending_approval status (e.g. no reviewers configured), is reported
  // through unrecoveredToolFailures instead, never here.
  onToolCalls?: (toolNames: string[]) => void
  pendingToolCalls?: Set<string>
  unrecoveredToolFailures?: Set<string>
}

const operationRoutingActionSchema = z.enum([
  "select_operation",
  "summarize_operations",
  "no_operation",
])

const operationRouterOutputSchema = z.object({
  action: operationRoutingActionSchema,
  operationId: z.string().nullable(),
  reason: z.string(),
})

type OperationRoutingAction = z.infer<typeof operationRoutingActionSchema>
type OperationRouterOutput = z.infer<typeof operationRouterOutputSchema>
type OperationRoute =
  | {
      action: "select_operation"
      operation: AgentOperation
    }
  | {
      action: Exclude<OperationRoutingAction, "select_operation">
      operation?: undefined
    }

const buildOperationRoutingInstructions = (
  operations: AgentOperation[]
) => `You decide whether the assistant should use one Budibase agent operation, summarize the available operations, or proceed without an operation.

Return action "select_operation" only when exactly one live operation is clearly the best match for the latest user request. In that case, return its operationId.
Return action "summarize_operations" when the user is asking broadly what the agent can do, what it can help with, or wants an overview of available capabilities across operations. In that case, return operationId as null.
Return action "no_operation" when the request does not fit any operation and should not trigger a capabilities summary. In that case, return operationId as null.
Be conservative. If the request is ambiguous, too broad, or unrelated to a specific operation, do not select one unless it is clearly a capabilities-overview request.
Use the operation name, instructions, tools, and knowledge setup as signals.
Return only the structured output.

Live operations:
${operations
  .map(
    operation => `- id: ${operation.id}
  name: ${operation.name}
  tools: ${(operation.enabledTools || []).length}
  hasKnowledge: ${operation.knowledgeBases?.length ? "yes" : "no"}
  instructions:
  ${(operation.promptInstructions || "None").trim() || "None"}`
  )
  .join("\n")}`

// Remembers the operation a conversation is currently in, so a follow-up turn
// the router can't classify ("yes", "ok") keeps the same operation/tools.
const sessionOperationKey = (sessionId: string) =>
  `agent_session_operation_${sessionId}`

const getSessionOperationId = async (
  sessionId: string
): Promise<string | undefined> => {
  const stored = await cache.get(sessionOperationKey(sessionId))
  return typeof stored === "string" ? stored : undefined
}

const setSessionOperationId = async (
  sessionId: string,
  operationId: string
) => {
  await cache.store(
    sessionOperationKey(sessionId),
    operationId,
    cache.TTL.ONE_HOUR
  )
}

export const chooseOperationForQuestion = async ({
  agent,
  latestQuestion,
  llm,
}: {
  agent: Agent
  latestQuestion: string
  llm: Awaited<ReturnType<typeof sdk.ai.llm.createLLM>>
}): Promise<OperationRoute> => {
  const liveOperations = getLiveOperations(agent)
  if (liveOperations.length === 0) {
    return {
      action: "no_operation",
    }
  }
  const multipleOperationsEnabled = await features.isEnabled(
    FeatureFlag.MULTIPLE_OPERATIONS
  )
  if (!multipleOperationsEnabled) {
    return {
      action: "select_operation",
      operation: liveOperations[0],
    }
  }
  if (!latestQuestion.trim()) {
    return {
      action: "no_operation",
    }
  }

  const router = new ToolLoopAgent({
    model: wrapLanguageModel({
      model: llm.chat,
      middleware: extractReasoningMiddleware({
        tagName: "think",
      }),
    }),
    instructions: buildOperationRoutingInstructions(liveOperations),
    stopWhen: stepCountIs(1),
    providerOptions: llm.providerOptions?.(false),
    output: Output.object({ schema: operationRouterOutputSchema }),
    headers: {
      "x-litellm-tags": "bb-operation-routing",
    },
  })

  try {
    const result = await router.stream({
      prompt: latestQuestion,
    })

    const route = (await result.output) as OperationRouterOutput
    if (route?.action === "summarize_operations") {
      return {
        action: "summarize_operations",
      }
    }

    if (route?.action !== "select_operation" || !route.operationId) {
      return {
        action: "no_operation",
      }
    }

    const operation = liveOperations.find(
      operation => operation.id === route.operationId
    )
    if (!operation) {
      return {
        action: "no_operation",
      }
    }

    return {
      action: "select_operation",
      operation,
    }
  } catch (error) {
    console.error("Operation routing failed", {
      agentId: agent._id,
      error,
    })
    return {
      action: "no_operation",
    }
  }
}

// Selects the operation for a run: pin to operationId when given (resume path),
// else route on the question, else fall back to the conversation's last
// operation (sticky - keeps the operation + its tools across "yes"/"ok"
// follow-ups). Records the choice so the next turn can stick to it.
const selectOperationForRun = async ({
  agent,
  sessionId,
  latestQuestion,
  operationId,
  llm,
}: {
  agent: Agent
  sessionId: string
  latestQuestion: string
  operationId?: string
  llm: Awaited<ReturnType<typeof sdk.ai.llm.createLLM>>
}): Promise<OperationRoute> => {
  let route: OperationRoute
  if (operationId) {
    const operation = getLiveOperations(agent).find(o => o.id === operationId)
    route = operation
      ? { action: "select_operation", operation }
      : { action: "no_operation" }
  } else {
    route = await chooseOperationForQuestion({ agent, latestQuestion, llm })
  }

  // Sticky
  if (route.action === "no_operation" && !operationId) {
    const lastOperationId = await getSessionOperationId(sessionId)
    const lastOperation = lastOperationId
      ? getLiveOperations(agent).find(o => o.id === lastOperationId)
      : undefined
    if (lastOperation) {
      route = { action: "select_operation", operation: lastOperation }
    }
  }

  if (route.action === "select_operation") {
    await setSessionOperationId(sessionId, route.operation.id)
  }

  return route
}

export interface PrepareAgentRunContextParams {
  agent: Agent
  agentId: string
  sessionId: string
  latestQuestion: string
  aiConfigId?: string
  span?: tracer.Span
  buildPromptOptions?: BuildPromptAndToolsOptions
  // When set, pin the run to this operation instead of routing on the question.
  operationId?: string
}

export interface AgentRunContext {
  llm: Awaited<ReturnType<typeof sdk.ai.llm.createLLM>>
  selectedOperation?: AgentOperation
  routingAction: OperationRoute["action"]
  systemPrompt: string
  tools: ToolSet
  toolDisplayNames: Record<string, string>
}

const buildOperationsSummaryPrompt = (operations: AgentOperation[]) =>
  [
    "The router decided this is a capabilities-overview request.",
    "Summarize the live operations below instead of picking one.",
    "Keep the answer user-facing and concise.",
    "",
    "Live operations:",
    ...operations.map(operation =>
      [
        `- ${operation.name}`,
        operation.promptInstructions?.trim()
          ? `  Focus: ${operation.promptInstructions.trim()}`
          : undefined,
      ]
        .filter(Boolean)
        .join("\n")
    ),
  ].join("\n")

export const prepareAgentRunContext = async ({
  agent,
  agentId,
  sessionId,
  latestQuestion,
  aiConfigId,
  span,
  buildPromptOptions,
  operationId,
}: PrepareAgentRunContextParams): Promise<AgentRunContext> => {
  const llm = await sdk.ai.llm.createLLM(
    aiConfigId ?? agent.aiconfig,
    sessionId,
    span,
    agentId
  )
  const routingDecision = await selectOperationForRun({
    agent,
    sessionId,
    latestQuestion,
    operationId,
    llm,
  })
  const promptAndTools = await buildPromptAndTools(
    agent,
    routingDecision.operation,
    {
      ...buildPromptOptions,
      fallbackPromptInstructions:
        routingDecision.action === "summarize_operations"
          ? buildOperationsSummaryPrompt(getLiveOperations(agent))
          : buildPromptOptions?.fallbackPromptInstructions,
    }
  )

  return {
    llm,
    selectedOperation: routingDecision.operation,
    routingAction: routingDecision.action,
    ...promptAndTools,
  }
}

export const prepareAgentChatRun = async ({
  agent,
  agentId,
  chat,
  modelMessages: providedModelMessages,
  latestQuestion: providedLatestQuestion,
  aiConfigId,
  errorLabel,
  sessionId,
  user,
  startedAt,
  operationId,
  escalationResolved,
  additionalInstructions,
  getRequestId,
}: PrepareAgentChatRunParams): Promise<AgentChatRun> => {
  const latestQuestion =
    providedLatestQuestion ?? (chat ? findLatestUserQuestion(chat) : "")
  const sessionLogIndexer = createSessionLogIndexer({
    agentId,
    sessionId,
    firstInput: latestQuestion,
    errorLabel,
    startedAt,
  })

  const [runContext, modelMessages] = await Promise.all([
    prepareAgentRunContext({
      agent,
      agentId,
      sessionId,
      latestQuestion,
      aiConfigId,
      operationId,
      buildPromptOptions: {
        baseSystemPrompt: ai.agentSystemPrompt(user),
        includeGoal: false,
      },
    }),
    providedModelMessages ?? prepareModelMessages(chat?.messages ?? []),
  ])
  const {
    llm,
    selectedOperation,
    tools,
    toolDisplayNames,
    systemPrompt: baseSystemPrompt,
  } = runContext
  const retrievedKnowledgeSourceById = new Map<
    string,
    NonNullable<AgentMessageMetadata["ragSources"]>[number]
  >()
  const usedKnowledgeSourceById = new Map<
    string,
    NonNullable<AgentMessageMetadata["ragSources"]>[number]
  >()
  const setUsedKnowledgeSources = (
    accepted?: AgentMessageMetadata["ragSources"]
  ) => {
    usedKnowledgeSourceById.clear()
    for (const source of accepted || []) {
      if (!source?.sourceId) {
        continue
      }
      usedKnowledgeSourceById.set(source.sourceId, source)
    }
  }
  const reportUsedSourcesTool = createReportUsedSourcesTool({
    getSourceById: sourceId => retrievedKnowledgeSourceById.get(sourceId),
    onAcceptedSources: accepted => setUsedKnowledgeSources(accepted),
  })
  if (tools.search_knowledge) {
    tools.report_used_sources = reportUsedSourcesTool
  }

  // Escalation gate: when off, strip the escalate tool entirely
  if (tools.escalate && !(await features.isEnabled(FeatureFlag.ESCALATION))) {
    delete tools.escalate
  }

  if (tools.escalate) {
    const recipients = selectedOperation?.escalation?.recipients
    if (escalationResolved) {
      // Resumed run: replace with a no-op so the model can't re-escalate.
      // The prior escalate call is in the message history, so the tool must
      // remain in the schema or the model will see an unresolved tool call.
      tools.escalate = createResolvedEscalateTool()
    } else if (selectedOperation && recipients?.length) {
      // Fresh run: escalation is configured per operation, so resolve it from
      // the operation this run actually selected - never a different one.
      tools.escalate = createEscalateTool({
        agentId,
        operationId: selectedOperation.id,
        sessionId,
        recipients,
        delayMs:
          (selectedOperation.escalation?.delay ??
            DEFAULT_ESCALATION_DELAY_SECONDS) * 1000,
        channel: chat?.channel,
        userId: user?._id,
        getMessages: () => modelMessages,
        getRequestId: () => getRequestId?.(),
      })
    }

    // Give the model read-only visibility of this session's escalations so it
    // can tell whether a request has already been raised/approved before
    // escalating again.
    tools.list_session_escalations = createListSessionEscalationsTool({
      sessionId,
    })
  }

  const systemPrompt = [baseSystemPrompt, additionalInstructions]
    .filter(Boolean)
    .join("\n\n")

  const hasTools = Object.keys(tools).length > 0
  const agentRunner = new ToolLoopAgent({
    model: wrapLanguageModel({
      model: llm.chat,
      middleware: extractReasoningMiddleware({
        tagName: "think",
      }),
    }),
    instructions: systemPrompt || undefined,
    tools: hasTools ? tools : undefined,
    ...(hasTools ? { toolChoice: "auto" as const } : {}),
    stopWhen: stepCountIs(30),
    providerOptions: llm.providerOptions?.(hasTools),
  })

  const contextUsage: AgentChatRun["contextUsage"] = {}
  const systemPromptTokens = estimateTokens(systemPrompt || "")

  return {
    latestQuestion,
    selectedOperation,
    sessionLogIndexer,
    getUsedKnowledgeSourcesMetadata: () =>
      Array.from(usedKnowledgeSourceById.values()),
    toolDisplayNames,
    contextWindowTokens: llm.contextWindowTokens,
    systemPromptTokens,
    contextUsage,
    stream: async ({
      onFinish,
      onToolCalls,
      pendingToolCalls,
      unrecoveredToolFailures,
    } = {}) =>
      await withLiteLLMSessionId(sessionId, () =>
        agentRunner.stream({
          messages: modelMessages,
          async onStepFinish({
            content,
            toolCalls,
            toolResults,
            response,
            usage,
          }) {
            if (!contextUsage.input) {
              contextUsage.input = usage
            }
            contextUsage.output = usage
            sessionLogIndexer.addRequestId(response?.id)
            const { successResults, successNames, semanticFailureNames } =
              partitionEscalateAwareToolResults(toolResults)

            if (onToolCalls && successNames.length) {
              onToolCalls(successNames)
            }
            if (pendingToolCalls) {
              updatePendingToolCalls(pendingToolCalls, toolCalls, toolResults)
            }

            if (unrecoveredToolFailures) {
              const erroredToolNames = content
                .filter(part => part.type === "tool-error")
                .map(part => part.toolName)
              updateUnrecoveredToolFailures(
                unrecoveredToolFailures,
                successResults,
                [...erroredToolNames, ...semanticFailureNames]
              )
            }

            for (const toolResult of toolResults) {
              if (
                toolResult.toolName === "search_knowledge" &&
                !toolResult.preliminary
              ) {
                const output = toolResult.output as
                  | { sources?: AgentMessageMetadata["ragSources"] }
                  | undefined
                for (const source of output?.sources || []) {
                  if (!source?.sourceId) {
                    continue
                  }
                  const existing = retrievedKnowledgeSourceById.get(
                    source.sourceId
                  )
                  retrievedKnowledgeSourceById.set(source.sourceId, {
                    ...existing,
                    ...source,
                  })
                }
              }
              if (
                toolResult.toolName === "report_used_sources" &&
                !toolResult.preliminary
              ) {
                const output = toolResult.output as
                  | { accepted?: AgentMessageMetadata["ragSources"] }
                  | undefined
                setUsedKnowledgeSources(output?.accepted)
              }
              await quotas.addAction(ActionType.AI_AGENT, async () => {})
            }

            for (const part of content) {
              if (part.type === "tool-error") {
                pendingToolCalls?.delete(part.toolCallId)
                unrecoveredToolFailures?.add(part.toolName)
              }
            }
          },
          async onFinish({ response }) {
            sessionLogIndexer.addRequestId(response?.id)
            await onFinish?.(response?.id)
          },
        })
      ),
  }
}
