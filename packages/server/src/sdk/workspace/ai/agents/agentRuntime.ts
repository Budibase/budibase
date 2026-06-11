import { features } from "@budibase/backend-core"
import { ai, quotas } from "@budibase/pro"
import { helpers } from "@budibase/shared-core"
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
  jsonSchema,
  stepCountIs,
  ToolLoopAgent,
  type LanguageModelUsage,
  type ModelMessage,
  type StreamTextResult,
  type ToolSet,
  wrapLanguageModel,
} from "ai"
import sdk from "../../.."
import { createSessionLogIndexer } from "../agentLogs"
import {
  findLatestUserQuestion,
  prepareModelMessages,
} from "../chatConversations"
import { updatePendingToolCalls } from "./utils"
import { estimateTokens } from "./usage"
import { createReportUsedSourcesTool } from "../../../../ai/tools/budibase/knowledge/reportUsedSources"
import { getLiveOperations } from "./utils"
import { withLiteLLMSessionId } from "../llm/requestSession"

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
  onToolCalls?: (toolNames: string[]) => void
  pendingToolCalls?: Set<string>
}

interface OperationRoute {
  operationId?: string
  reason?: string
}

const OPERATION_ROUTER_SCHEMA =
  helpers.structuredOutput.normalizeSchemaForStructuredOutput({
    type: "object",
    properties: {
      operationId: {
        anyOf: [{ type: "string" }, { type: "null" }],
      },
      reason: { type: "string" },
    },
    required: ["operationId", "reason"],
  })

const buildOperationRoutingInstructions = (
  operations: AgentOperation[]
) => `You route a user request to one Budibase agent operation.

Choose exactly one live operation only when it is clearly the best match for the latest user request.
If the request does not fit any operation, return operationId as null.
Be conservative. If the request is ambiguous, too broad, or unrelated, return null.
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

const chooseOperationForQuestion = async ({
  agent,
  latestQuestion,
  llm,
}: {
  agent: Agent
  latestQuestion: string
  llm: Awaited<ReturnType<typeof sdk.ai.llm.createLLM>>
}): Promise<AgentOperation | undefined> => {
  const liveOperations = getLiveOperations(agent)
  if (liveOperations.length === 0) {
    return undefined
  }
  const multipleOperationsEnabled = await features.isEnabled(
    FeatureFlag.MULTIPLE_OPERATIONS
  )
  if (!multipleOperationsEnabled || liveOperations.length === 1) {
    return liveOperations[0]
  }
  if (!latestQuestion.trim()) {
    return undefined
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
    output: Output.object({ schema: jsonSchema(OPERATION_ROUTER_SCHEMA) }),
  })

  const result = await router.stream({
    prompt: latestQuestion,
  })

  const route = (await result.output) as OperationRoute
  if (!route?.operationId) {
    return undefined
  }

  return liveOperations.find(operation => operation.id === route.operationId)
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

  const [llm, modelMessages] = await Promise.all([
    sdk.ai.llm.createLLM(
      aiConfigId ?? agent.aiconfig,
      sessionId,
      undefined,
      agentId
    ),
    providedModelMessages ?? prepareModelMessages(chat?.messages ?? []),
  ])
  const selectedOperation = await chooseOperationForQuestion({
    agent,
    latestQuestion,
    llm,
  })
  const promptAndTools = await sdk.ai.agents.buildPromptAndTools(
    agent,
    selectedOperation,
    {
      baseSystemPrompt: ai.agentSystemPrompt(user),
      includeGoal: false,
    }
  )

  const tools = promptAndTools.tools
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

  const hasTools = Object.keys(tools).length > 0
  const agentRunner = new ToolLoopAgent({
    model: wrapLanguageModel({
      model: llm.chat,
      middleware: extractReasoningMiddleware({
        tagName: "think",
      }),
    }),
    instructions: promptAndTools.systemPrompt || undefined,
    tools: hasTools ? tools : undefined,
    ...(hasTools ? { toolChoice: "auto" as const } : {}),
    stopWhen: stepCountIs(30),
    providerOptions: llm.providerOptions?.(hasTools),
  })

  const contextUsage: AgentChatRun["contextUsage"] = {}
  const systemPromptTokens = estimateTokens(promptAndTools.systemPrompt || "")

  return {
    latestQuestion,
    selectedOperation,
    sessionLogIndexer,
    getUsedKnowledgeSourcesMetadata: () =>
      Array.from(usedKnowledgeSourceById.values()),
    toolDisplayNames: promptAndTools.toolDisplayNames,
    contextWindowTokens: llm.contextWindowTokens,
    systemPromptTokens,
    contextUsage,
    stream: async ({ onFinish, onToolCalls, pendingToolCalls } = {}) =>
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
            if (onToolCalls) {
              const toolNames = toolCalls
                .map(toolCall => toolCall.toolName)
                .filter(Boolean)
              if (toolNames.length) {
                onToolCalls(toolNames)
              }
            }
            if (pendingToolCalls) {
              updatePendingToolCalls(pendingToolCalls, toolCalls, toolResults)
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

            if (!pendingToolCalls) {
              return
            }

            for (const part of content) {
              if (part.type === "tool-error") {
                pendingToolCalls.delete(part.toolCallId)
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
