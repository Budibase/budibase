import { ai, quotas } from "@budibase/pro"
import {
  ActionType,
  Agent,
  AgentMessageMetadata,
  ChatConversationChannel,
  ChatConversationRequest,
  ContextUser,
  EscalationRecipient,
} from "@budibase/types"
import {
  extractReasoningMiddleware,
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
import {
  createEscalateTool,
  createResolvedEscalateTool,
} from "../../../../ai/tools/budibase/escalate"

export interface OperationEscalationConfig {
  operationId: string
  recipients: EscalationRecipient[]
  // How long to wait for a human response before the escalation expires, in ms.
  delayMs: number
  channel?: ChatConversationChannel
}

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
  escalation?: OperationEscalationConfig
  // On resume swap escalate for a resolved stub so the model can't trigger a fresh escalation
  escalationResolved?: boolean
  // Appended to the system prompt - a trusted channel for run-time directives
  // Puting it in the user input made it suspicious.
  additionalInstructions?: string
}

export interface AgentChatRun {
  latestQuestion: string
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
  escalation,
  escalationResolved,
  additionalInstructions,
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

  const [promptAndTools, llm, modelMessages] = await Promise.all([
    sdk.ai.agents.buildPromptAndTools(agent, {
      baseSystemPrompt: ai.agentSystemPrompt(user),
      includeGoal: false,
    }),
    sdk.ai.llm.createLLM(
      aiConfigId ?? agent.aiconfig,
      sessionId,
      undefined,
      agentId
    ),
    providedModelMessages ?? prepareModelMessages(chat?.messages ?? []),
  ])

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

  if (tools.escalate) {
    if (escalationResolved) {
      // Resumed run: replace with a no-op so the model can't re-escalate.
      // The prior escalate call is in the message history, so the tool must
      // remain in the schema or the model will see an unresolved tool call.
      tools.escalate = createResolvedEscalateTool()
    } else if (escalation) {
      // Fresh run
      tools.escalate = createEscalateTool({
        agentId,
        operationId: escalation.operationId,
        sessionId,
        recipients: escalation.recipients,
        delayMs: escalation.delayMs,
        channel: escalation.channel,
        userId: user?._id,
        getMessages: () => modelMessages,
      })
    }
  }

  const systemPrompt = [promptAndTools.systemPrompt, additionalInstructions]
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
    toolChoice: hasTools ? "auto" : "none",
    stopWhen: stepCountIs(30),
    providerOptions: llm.providerOptions?.(hasTools),
  })

  const contextUsage: AgentChatRun["contextUsage"] = {}
  const systemPromptTokens = estimateTokens(systemPrompt)

  return {
    latestQuestion,
    sessionLogIndexer,
    getUsedKnowledgeSourcesMetadata: () =>
      Array.from(usedKnowledgeSourceById.values()),
    toolDisplayNames: promptAndTools.toolDisplayNames,
    contextWindowTokens: llm.contextWindowTokens,
    systemPromptTokens,
    contextUsage,
    stream: async ({ onFinish, onToolCalls, pendingToolCalls } = {}) =>
      await agentRunner.stream({
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
      }),
  }
}
