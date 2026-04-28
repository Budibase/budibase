import { features } from "@budibase/backend-core"
import { ai, quotas } from "@budibase/pro"
import {
  Agent,
  AgentMessageMetadata,
  ChatConversationRequest,
  ContextUser,
  FeatureFlag,
} from "@budibase/types"
import {
  extractReasoningMiddleware,
  stepCountIs,
  ToolLoopAgent,
  type StreamTextResult,
  type ToolSet,
  wrapLanguageModel,
} from "ai"
import sdk from "../../.."
import { createSessionLogIndexer } from "../agentLogs"
import {
  addRetrievedContextToMessages,
  findLatestUserQuestion,
  prepareModelMessages,
} from "../chatConversations"
import { retrieveContextForAgent } from "../rag"
import { updatePendingToolCalls } from "./utils"

interface PrepareAgentChatRunParams {
  agent: Agent
  agentId: string
  chat: ChatConversationRequest
  errorLabel: string
  sessionId: string
  user: ContextUser
}

export interface AgentChatRun {
  latestQuestion: string
  ragSourcesMetadata?: AgentMessageMetadata["ragSources"]
  sessionLogIndexer: ReturnType<typeof createSessionLogIndexer>
  stream: (
    options?: AgentChatStreamOptions
  ) => Promise<StreamTextResult<ToolSet, never>>
  toolDisplayNames: Record<string, string>
}

export interface AgentChatStreamOptions {
  onFinish?: (responseId?: string) => void | Promise<void>
  onKnowledgeFilesListed?: () => void
  pendingToolCalls?: Set<string>
}

const getRetrievedAgentContext = async (
  agent: Agent,
  latestQuestion: string
) => {
  if (
    !latestQuestion ||
    !agent.knowledgeBases?.length ||
    !(await features.isEnabled(FeatureFlag.AI_RAG))
  ) {
    return {
      text: "",
      sources: undefined as AgentMessageMetadata["ragSources"] | undefined,
    }
  }

  try {
    return await retrieveContextForAgent(agent, latestQuestion)
  } catch (error) {
    console.error("Failed to retrieve agent context", error)
    return {
      text: "",
      sources: undefined as AgentMessageMetadata["ragSources"] | undefined,
    }
  }
}

export const prepareAgentChatRun = async ({
  agent,
  agentId,
  chat,
  errorLabel,
  sessionId,
  user,
}: PrepareAgentChatRunParams): Promise<AgentChatRun> => {
  const latestQuestion = findLatestUserQuestion(chat)
  const sessionLogIndexer = createSessionLogIndexer({
    agentId,
    sessionId,
    firstInput: latestQuestion,
    errorLabel,
  })

  const [retrievedContext, promptAndTools, llm, modelMessages] =
    await Promise.all([
      getRetrievedAgentContext(agent, latestQuestion),
      sdk.ai.agents.buildPromptAndTools(agent, {
        baseSystemPrompt: ai.agentSystemPrompt(user),
        includeGoal: false,
      }),
      sdk.ai.llm.createLLM(agent.aiconfig, sessionId, undefined, agentId),
      prepareModelMessages(chat.messages),
    ])

  const trimmedRetrievedContext = retrievedContext.text.trim()
  const ragSourcesMetadata =
    trimmedRetrievedContext.length > 0 ? retrievedContext.sources : undefined
  const tools = promptAndTools.tools
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
    toolChoice: hasTools ? "auto" : "none",
    stopWhen: stepCountIs(30),
    providerOptions: llm.providerOptions?.(hasTools),
  })

  return {
    latestQuestion,
    ragSourcesMetadata,
    sessionLogIndexer,
    toolDisplayNames: promptAndTools.toolDisplayNames,
    stream: async ({
      onFinish,
      onKnowledgeFilesListed,
      pendingToolCalls,
    } = {}) =>
      await agentRunner.stream({
        messages: addRetrievedContextToMessages(
          modelMessages,
          trimmedRetrievedContext
        ),
        async onStepFinish({ content, toolCalls, toolResults, response }) {
          sessionLogIndexer.addRequestId(response?.id)
          if (pendingToolCalls) {
            updatePendingToolCalls(pendingToolCalls, toolCalls, toolResults)
          }

          for (const toolResult of toolResults) {
            if (
              toolResult.toolName === "list_knowledge_files" &&
              !toolResult.preliminary
            ) {
              onKnowledgeFilesListed?.()
            }
            await quotas.addAction(async () => {})
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
