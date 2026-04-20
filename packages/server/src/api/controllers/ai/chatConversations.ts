import {
  context,
  events,
  features,
  docIds,
  getErrorMessage,
  HTTPError,
} from "@budibase/backend-core"
import { v4 } from "uuid"
import { ai, quotas } from "@budibase/pro"
import {
  AgentMessageMetadata,
  ChatAgentRequest,
  ChatApp,
  ChatConversation,
  ChatConversationRequest,
  CreateChatConversationRequest,
  DocumentType,
  FetchAgentHistoryResponse,
  ContextUser,
  FeatureFlag,
  UserCtx,
  WebhookChatCompleteResult,
} from "@budibase/types"
import {
  extractReasoningMiddleware,
  stepCountIs,
  streamText,
  wrapLanguageModel,
} from "ai"
import sdk from "../../../sdk"
import {
  formatIncompleteToolCallError,
  updatePendingToolCalls,
} from "../../../sdk/workspace/ai/agents"
import { createSessionLogIndexer } from "../../../sdk/workspace/ai/agentLogs"
import { sdk as usersSdk } from "@budibase/shared-core"
import { retrieveContextForAgent } from "../../../sdk/workspace/ai/rag"
import {
  assertChatAppIsLiveForUser,
  canAccessChatAppAgentForUser,
} from "./chatApps"
import {
  addRetrievedContextToMessages,
  findLatestUserQuestion,
  prepareChatConversationForSave,
  prepareModelMessages,
  truncateTitle,
} from "../../../sdk/workspace/ai/chatConversations"

const getGlobalUserId = (ctx: UserCtx) => {
  const userId = ctx.user?.globalId || ctx.user?.userId || ctx.user?._id
  if (!userId) {
    throw new HTTPError("userId is required", 400)
  }
  return userId as string
}

const resolveRequestedAgentId = async (ctx: UserCtx, chatApp: ChatApp) => {
  const rawAgentId = ctx.query.agentId
  if (rawAgentId === undefined) {
    return undefined
  }
  if (typeof rawAgentId !== "string" || rawAgentId.trim().length === 0) {
    throw new HTTPError("agentId must be a non-empty string", 400)
  }

  const agentId = rawAgentId.trim()
  const chatAgentConfig = getEnabledChatAgentConfig(chatApp, agentId)
  await assertCanAccessChatAgent(ctx, chatAgentConfig)
  return agentId
}

const getEnabledChatAgentConfig = (chatApp: ChatApp, agentId: string) => {
  const chatAgentConfig = chatApp.agents?.find(
    agent => agent.agentId === agentId
  )
  if (!chatAgentConfig?.isEnabled) {
    throw new HTTPError("agentId is not enabled for this chat app", 400)
  }

  return chatAgentConfig
}

const assertCanAccessChatAgent = async (
  ctx: UserCtx,
  chatAgentConfig: NonNullable<NonNullable<ChatApp["agents"]>[number]>
) => {
  if (!(await canAccessChatAppAgentForUser(ctx, chatAgentConfig))) {
    throw new HTTPError("Forbidden", 403)
  }
}

const getRetrievedAgentContext = async (
  agent: Awaited<ReturnType<typeof sdk.ai.agents.getOrThrow>>,
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

const prepareAgentChatRun = async ({
  agent,
  agentId,
  chat,
  errorLabel,
  sessionId,
  user,
}: {
  agent: Awaited<ReturnType<typeof sdk.ai.agents.getOrThrow>>
  agentId: string
  chat: ChatConversationRequest
  errorLabel: string
  sessionId: string
  user: ContextUser
}) => {
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

  return {
    chatLLM: llm.chat,
    latestQuestion,
    messagesWithContext: addRetrievedContextToMessages(
      modelMessages,
      trimmedRetrievedContext
    ),
    providerOptions: llm.providerOptions,
    ragSourcesMetadata,
    sessionLogIndexer,
    system: promptAndTools.systemPrompt,
    toolDisplayNames: promptAndTools.toolDisplayNames,
    tools: promptAndTools.tools,
  }
}

const getChatConversation = async (
  db: ReturnType<typeof context.getWorkspaceDB>,
  ctx: UserCtx,
  chatApp: ChatApp,
  chatAppId: string,
  chatConversationId: string,
  requestedAgentId: string | undefined,
  userId: string
) => {
  const chat = await db.tryGet<ChatConversation>(chatConversationId)
  if (
    !chat ||
    chat.chatAppId !== chatAppId ||
    !!chat.channel ||
    (requestedAgentId && chat.agentId !== requestedAgentId)
  ) {
    throw new HTTPError("chat not found", 404)
  }

  if (chat.userId && chat.userId !== userId) {
    throw new HTTPError("Forbidden", 403)
  }

  const chatAgentConfig = chatApp.agents?.find(
    agent => agent.agentId === chat.agentId
  )
  if (
    !chatAgentConfig ||
    !(await canAccessChatAppAgentForUser(ctx, chatAgentConfig))
  ) {
    throw new HTTPError("chat not found", 404)
  }

  return chat
}

export async function webhookChat({
  chat,
  user,
}: {
  chat: ChatConversationRequest
  user: ContextUser
}): Promise<WebhookChatCompleteResult> {
  const db = context.getWorkspaceDB()
  const chatAppId = chat.chatAppId

  if (!chatAppId) {
    throw new HTTPError("chatAppId is required", 400)
  }

  const chatApp = await db.tryGet<ChatApp>(chatAppId)
  if (!chatApp) {
    throw new HTTPError("Chat app not found", 404)
  }

  const agentId = chat.agentId
  if (!agentId) {
    throw new HTTPError("agentId is required", 400)
  }

  getEnabledChatAgentConfig(chatApp, agentId)
  const agent = await sdk.ai.agents.getOrThrow(agentId)
  const providerPrefix = chat.channel?.provider || "chat"
  const chatId = chat._id ?? docIds.generateChatConversationID()
  const sessionId = `${providerPrefix}:${chatId}`
  const {
    chatLLM,
    latestQuestion,
    messagesWithContext,
    providerOptions,
    sessionLogIndexer,
    system,
    tools,
  } = await prepareAgentChatRun({
    agent,
    agentId,
    chat,
    errorLabel: "webhook chat",
    sessionId,
    user,
  })
  const title = latestQuestion ? truncateTitle(latestQuestion) : chat.title

  const hasTools = Object.keys(tools).length > 0
  const result = streamText({
    model: wrapLanguageModel({
      model: chatLLM,
      middleware: extractReasoningMiddleware({
        tagName: "think",
      }),
    }),
    messages: messagesWithContext,
    system,
    tools: hasTools ? tools : undefined,
    toolChoice: hasTools ? "auto" : "none",
    stopWhen: stepCountIs(30),
    providerOptions: providerOptions?.(hasTools),
    async onStepFinish({ toolResults, response }) {
      sessionLogIndexer.addRequestId(response?.id)
      for (const _toolResult of toolResults) {
        await quotas.addAction(async () => {})
      }
    },
    onError({ error }) {
      console.error("Agent streaming error", {
        agentId,
        chatAppId,
        sessionId,
        error,
      })
    },
  })

  const [textResult, responseResult] = await Promise.allSettled([
    result.text,
    result.response,
  ])
  const requestId =
    responseResult.status === "fulfilled"
      ? (responseResult.value.id ?? undefined)
      : undefined
  sessionLogIndexer.addRequestId(requestId)
  await sessionLogIndexer.index()

  if (textResult.status === "rejected") {
    throw textResult.reason
  }
  if (responseResult.status === "rejected") {
    throw responseResult.reason
  }

  events.action.aiAgentExecuted({ agentId })

  const assistantText = textResult.value
  const assistantMessage: ChatConversation["messages"][number] = {
    id: v4(),
    role: "assistant",
    parts: [{ type: "text", text: assistantText || "" }],
  }

  return {
    messages: [...chat.messages, assistantMessage],
    assistantText: assistantText || "",
    title,
  }
}

export async function agentChatStream(ctx: UserCtx<ChatAgentRequest, void>) {
  const chat = ctx.request.body
  const chatAppIdFromPath = ctx.params?.chatAppId
  const chatConversationIdFromPath = ctx.params?.chatConversationId
  const userId = getGlobalUserId(ctx)
  if (
    chatAppIdFromPath &&
    chat.chatAppId &&
    chat.chatAppId !== chatAppIdFromPath
  ) {
    throw new HTTPError("chatAppId in body does not match path", 400)
  }
  if (
    chatConversationIdFromPath &&
    chatConversationIdFromPath !== "new" &&
    chat._id &&
    chat._id !== chatConversationIdFromPath
  ) {
    throw new HTTPError("chatConversationId in body does not match path", 400)
  }
  if (chatAppIdFromPath) {
    chat.chatAppId = chatAppIdFromPath
  }
  if (chatConversationIdFromPath && chatConversationIdFromPath !== "new") {
    chat._id = chatConversationIdFromPath
  }
  const db = context.getWorkspaceDB()
  const chatAppId = chat.chatAppId
  const isBuilderOrAdmin = usersSdk.users.isAdminOrBuilder(ctx.user)
  const canUsePreview = chat.isPreview === true && isBuilderOrAdmin

  if (!canUsePreview && !chatAppId) {
    throw new HTTPError("chatAppId is required", 400)
  }

  let chatApp: ChatApp | undefined
  if (!canUsePreview) {
    chatApp = await db.tryGet<ChatApp>(chatAppId)
    if (!chatApp) {
      throw new HTTPError("Chat app not found", 404)
    }
    assertChatAppIsLiveForUser(ctx, chatApp)
  }

  let existingChat: ChatConversation | undefined
  if (chat._id) {
    existingChat = await db.tryGet<ChatConversation>(chat._id)
    if (!existingChat) {
      throw new HTTPError("chat not found", 404)
    }
    if (!canUsePreview && existingChat.chatAppId !== chatAppId) {
      throw new HTTPError("chat does not belong to this chat app", 400)
    }
    if (existingChat.userId && existingChat.userId !== userId) {
      throw new HTTPError("Forbidden", 403)
    }
    if (chat.agentId && chat.agentId !== existingChat.agentId) {
      throw new HTTPError("agentId cannot be changed", 400)
    }
  }

  const agentId = existingChat?.agentId || chat.agentId

  if (!agentId) {
    throw new HTTPError("agentId is required", 400)
  }

  if (!canUsePreview && chatApp) {
    const chatAgentConfig = getEnabledChatAgentConfig(chatApp, agentId)
    await assertCanAccessChatAgent(ctx, chatAgentConfig)
  }

  if (!chat.agentId) {
    chat.agentId = agentId
  }

  ctx.status = 200
  ctx.set("Content-Type", "text/event-stream")
  ctx.set("Cache-Control", "no-cache")
  ctx.set("Connection", "keep-alive")

  ctx.res.setHeader("X-Accel-Buffering", "no")
  ctx.res.setHeader("Transfer-Encoding", "chunked")

  const agent = await sdk.ai.agents.getOrThrow(agentId)

  try {
    const chatId = chat._id ?? docIds.generateChatConversationID()
    const sessionId = chat.transient ? chat.sessionId || chatId : chatId
    const {
      chatLLM,
      latestQuestion,
      messagesWithContext,
      providerOptions,
      ragSourcesMetadata,
      sessionLogIndexer,
      system,
      toolDisplayNames,
      tools,
    } = await prepareAgentChatRun({
      agent,
      agentId,
      chat,
      errorLabel: "chat stream",
      sessionId,
      user: ctx.user,
    })

    const pendingToolCalls = new Set<string>()
    let listedKnowledgeFiles = false

    const hasTools = Object.keys(tools).length > 0
    const result = streamText({
      model: wrapLanguageModel({
        model: chatLLM,
        middleware: extractReasoningMiddleware({
          tagName: "think",
        }),
      }),
      messages: messagesWithContext,
      system,
      tools: hasTools ? tools : undefined,
      toolChoice: hasTools ? "auto" : "none",
      stopWhen: stepCountIs(30),
      async onStepFinish({ content, toolCalls, toolResults, response }) {
        sessionLogIndexer.addRequestId(response?.id)
        updatePendingToolCalls(pendingToolCalls, toolCalls, toolResults)
        for (const toolResult of toolResults) {
          if (
            toolResult.toolName === "list_knowledge_files" &&
            !toolResult.preliminary
          ) {
            listedKnowledgeFiles = true
          }
          await quotas.addAction(async () => {})
        }
        for (const part of content) {
          if (part.type === "tool-error") {
            pendingToolCalls.delete(part.toolCallId)
          }
        }
      },
      onFinish({ response }) {
        sessionLogIndexer.addRequestId(response?.id)
      },
      providerOptions: providerOptions?.(hasTools),
      async onError({ error }) {
        await sessionLogIndexer.index()
        console.error("Agent streaming error", {
          agentId,
          chatAppId,
          sessionId,
          error,
        })
      },
    })

    const title = latestQuestion ? truncateTitle(latestQuestion) : chat.title

    ctx.respond = false
    const streamStartTime = Date.now()
    const sharedMetadata = {
      ...(Object.keys(toolDisplayNames).length > 0 ? { toolDisplayNames } : {}),
    }
    result.pipeUIMessageStreamToResponse(ctx.res, {
      originalMessages: chat.messages,
      messageMetadata: ({ part }) => {
        if (part.type === "start") {
          return {
            ...sharedMetadata,
            createdAt: streamStartTime,
          }
        }
        if (part.type === "finish") {
          // Check if model ended in a tool-call state or steps were incomplete
          const finishReason = (part as { finishReason?: string }).finishReason
          const toolCallsIncomplete =
            pendingToolCalls.size > 0 || finishReason === "tool-calls"

          return {
            ...sharedMetadata,
            ...(ragSourcesMetadata?.length && !listedKnowledgeFiles
              ? { ragSources: ragSourcesMetadata }
              : {}),
            createdAt: streamStartTime,
            completedAt: Date.now(),
            ...(toolCallsIncomplete && {
              error: formatIncompleteToolCallError([]),
            }),
          }
        }
      },
      onError: error => getErrorMessage(error),
      onFinish: async ({ messages }) => {
        await sessionLogIndexer.index()
        events.action.aiAgentExecuted({ agentId })

        if (chat.transient || !chatAppId) {
          return
        }

        const existingChat = chat._id
          ? await db.tryGet<ChatConversation>(chat._id)
          : null

        const chatToSave = prepareChatConversationForSave({
          chatId,
          chatAppId,
          userId,
          title,
          messages,
          chat,
          existingChat,
        })

        await db.put(chatToSave)
      },
      sendReasoning: true,
    })
    return
  } catch (error: any) {
    const message = error?.message || "Agent action failed"
    ctx.res.write(
      `data: ${JSON.stringify({ type: "error", errorText: message })}\n\n`
    )
    ctx.res.end()
  }
}

export async function createChatConversation(
  ctx: UserCtx<CreateChatConversationRequest, ChatConversation>
) {
  const { title, agentId } = ctx.request.body
  const chatAppId = ctx.request.body.chatAppId || ctx.params.chatAppId
  const userId = getGlobalUserId(ctx)

  if (!chatAppId) {
    throw new HTTPError("chatAppId is required", 400)
  }

  if (!agentId) {
    throw new HTTPError("agentId is required", 400)
  }

  const chatApp = await sdk.ai.chatApps.getOrThrow(chatAppId)
  assertChatAppIsLiveForUser(ctx, chatApp)
  const chatAgentConfig = getEnabledChatAgentConfig(chatApp, agentId)
  await assertCanAccessChatAgent(ctx, chatAgentConfig)

  const db = context.getWorkspaceDB()
  const chatId = docIds.generateChatConversationID()

  const newChat = prepareChatConversationForSave({
    chatId,
    chatAppId,
    userId,
    title,
    messages: [],
    chat: {
      _id: chatId,
      chatAppId,
      agentId,
      title,
      messages: [],
    },
  })

  await db.put(newChat)

  ctx.status = 201
  ctx.body = newChat
}

export async function removeChatConversation(ctx: UserCtx<void, void>) {
  const db = context.getWorkspaceDB()

  const chatConversationId = ctx.params.chatConversationId
  const chatAppId = ctx.params.chatAppId
  const userId = getGlobalUserId(ctx)
  if (!chatConversationId) {
    throw new HTTPError("chatConversationId is required", 400)
  }
  if (!chatAppId) {
    throw new HTTPError("chatAppId is required", 400)
  }

  const chatApp = await sdk.ai.chatApps.getOrThrow(chatAppId)
  assertChatAppIsLiveForUser(ctx, chatApp)
  const requestedAgentId = await resolveRequestedAgentId(ctx, chatApp)
  const chat = await getChatConversation(
    db,
    ctx,
    chatApp,
    chatAppId,
    chatConversationId,
    requestedAgentId,
    userId
  )

  await db.remove(chat)
  ctx.status = 204
}

export async function fetchChatHistory(
  ctx: UserCtx<void, FetchAgentHistoryResponse, { chatAppId: string }>
) {
  const db = context.getWorkspaceDB()
  const chatAppId = ctx.params.chatAppId
  const userId = getGlobalUserId(ctx)

  if (!chatAppId) {
    throw new HTTPError("chatAppId is required", 400)
  }

  const chatApp = await sdk.ai.chatApps.getOrThrow(chatAppId)
  assertChatAppIsLiveForUser(ctx, chatApp)
  const requestedAgentId = await resolveRequestedAgentId(ctx, chatApp)
  const accessibleAgentIds = new Set<string>()
  for (const chatAgent of chatApp.agents || []) {
    if (!chatAgent.isEnabled) {
      continue
    }
    if (await canAccessChatAppAgentForUser(ctx, chatAgent)) {
      accessibleAgentIds.add(chatAgent.agentId)
    }
  }

  const allChats = await db.allDocs<ChatConversation>(
    docIds.getDocParams(DocumentType.CHAT_CONVERSATION, undefined, {
      include_docs: true,
    })
  )

  ctx.body = allChats.rows
    .map(row => row.doc!)
    .filter(
      chat =>
        chat.chatAppId === chatAppId &&
        !chat.channel &&
        (!chat.userId || chat.userId === userId) &&
        (!requestedAgentId || chat.agentId === requestedAgentId)
    )
    .filter(chat => accessibleAgentIds.has(chat.agentId))
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return timeB - timeA
    })
}

export async function fetchChatConversation(
  ctx: UserCtx<
    void,
    ChatConversation,
    { chatAppId: string; chatConversationId: string }
  >
) {
  const db = context.getWorkspaceDB()
  const chatAppId = ctx.params.chatAppId
  const chatConversationId = ctx.params.chatConversationId
  const userId = getGlobalUserId(ctx)

  if (!chatAppId) {
    throw new HTTPError("chatAppId is required", 400)
  }
  if (!chatConversationId) {
    throw new HTTPError("chatConversationId is required", 400)
  }

  const chatApp = await sdk.ai.chatApps.getOrThrow(chatAppId)
  assertChatAppIsLiveForUser(ctx, chatApp)
  const requestedAgentId = await resolveRequestedAgentId(ctx, chatApp)

  const chat = await getChatConversation(
    db,
    ctx,
    chatApp,
    chatAppId,
    chatConversationId,
    requestedAgentId,
    userId
  )

  ctx.body = chat
}
