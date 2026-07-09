import {
  context,
  events,
  docIds,
  features,
  getErrorMessage,
  HTTPError,
} from "@budibase/backend-core"
import { v4 } from "uuid"
import {
  ActionFailureReason,
  Agent,
  ChatAgentRequest,
  ChatApp,
  ChatConversation,
  ChatConversationRequest,
  CreateChatConversationRequest,
  DocumentType,
  ESCALATE_TOOL_NAME,
  FeatureFlag,
  FetchAgentHistoryResponse,
  FetchAgentFileUrlResponse,
  ContextUser,
  UserCtx,
  WebhookChatCompleteResult,
} from "@budibase/types"
import {
  consumeStream,
  readUIMessageStream,
  type LanguageModelUsage,
  type UIMessage,
  type UIMessageChunk,
} from "ai"
import sdk from "../../../sdk"
import {
  buildAgentMessageUsage,
  formatIncompleteToolCallError,
  getLiveOperations,
  prepareAgentChatRun,
  type AgentChatRun,
} from "../../../sdk/workspace/ai/agents"
import { sdk as usersSdk } from "@budibase/shared-core"
import {
  assertChatAppIsLiveForUser,
  canAccessChatAppAgentForUser,
} from "./chatApps"
import {
  prepareChatConversationForSave,
  truncateTitle,
} from "../../../sdk/workspace/ai/chatConversations"
import { determineTrigger } from "../../../sdk/workspace/ai/agentLogs/shared"

const getGlobalUserId = (ctx: UserCtx) => {
  const userId = ctx.user?.globalId || ctx.user?.userId || ctx.user?._id
  if (!userId) {
    throw new HTTPError("userId is required", 400)
  }
  return userId as string
}

const getRecentChatContext = (
  messages: ChatConversation["messages"],
  limit = 6
) => {
  return messages
    .flatMap(message => {
      if (message.role !== "user" && message.role !== "assistant") {
        return []
      }

      const content = (message.parts || [])
        .filter(
          (
            part
          ): part is Extract<
            (typeof message.parts)[number],
            { type: "text" }
          > => part.type === "text"
        )
        .map(part => part.text)
        .join("\n")
        .trim()

      if (!content) {
        return []
      }

      return [{ role: message.role, content }]
    })
    .slice(-limit)
}

type AgentRequestTrackingHandle = { requestId: string } | undefined

const startAgentRequestTracking = async ({
  agentId,
  sessionId,
  run,
  userId,
  chatMessages,
}: {
  agentId: string
  sessionId: string
  run: AgentChatRun
  userId: string
  chatMessages: ChatConversation["messages"]
}): Promise<AgentRequestTrackingHandle> => {
  if (
    !context.isProdWorkspace() ||
    !(await features.isEnabled(FeatureFlag.AI_AGENT_ACTIVITY))
  ) {
    return undefined
  }

  let trackingHandle: AgentRequestTrackingHandle

  if (run.selectedOperation) {
    trackingHandle = await sdk.ai.agentRequests
      .initActiveRequest({
        agentId,
        sessionId,
        latestPrompt: run.latestQuestion,
        operation: {
          name: run.selectedOperation.name,
          prompt: run.selectedOperation.promptInstructions || "",
        },
        userId,
        source: determineTrigger(sessionId),
      })
      .catch(error => {
        console.error("Failed to init active agent request", {
          agentId,
          sessionId,
          error,
        })
        return undefined
      })
  }

  sdk.ai.agentRequests
    .enqueueRequestTracking({
      agentId,
      sessionId,
      latestUserPrompt: run.latestQuestion,
      recentChatContext: getRecentChatContext(chatMessages),
      operation: run.selectedOperation
        ? {
            name: run.selectedOperation.name,
            prompt: run.selectedOperation.promptInstructions || "",
          }
        : undefined,
      userId,
      existingRequestId: trackingHandle?.requestId,
    })
    .catch(error => {
      console.error("Failed to enqueue agent request tracking", {
        agentId,
        sessionId,
        userId,
        error,
      })
    })

  return trackingHandle
}

const buildEscalateToolCallHandler =
  ({
    trackingHandle,
    agentId,
    sessionId,
  }: {
    trackingHandle: AgentRequestTrackingHandle
    agentId: string
    sessionId: string
  }) =>
  (toolNames: string[]) => {
    if (trackingHandle && toolNames.includes(ESCALATE_TOOL_NAME)) {
      sdk.ai.agentRequests
        .updateRequestStatus({
          requestId: trackingHandle.requestId,
          status: "needs_input",
        })
        .catch(error => {
          console.error(
            "Failed to update agent request status to needs_input",
            { agentId, sessionId, error }
          )
        })
    }
  }

const markAgentRequestFailed = async ({
  trackingHandle,
  agentId,
  sessionId,
  errorMessage,
}: {
  trackingHandle: AgentRequestTrackingHandle
  agentId: string
  sessionId: string
  errorMessage: string
}) => {
  if (!trackingHandle) {
    return
  }
  await sdk.ai.agentRequests
    .updateRequestStatus({
      requestId: trackingHandle.requestId,
      status: "failed",
      error: errorMessage,
    })
    .catch(updateError => {
      console.error("Failed to update agent request status on error", {
        agentId,
        sessionId,
        error: updateError,
      })
    })
}

const finalizeAgentRequestTracking = async ({
  trackingHandle,
  agentId,
  sessionId,
  toolCallsIncomplete,
  unrecoveredToolFailures,
}: {
  trackingHandle: AgentRequestTrackingHandle
  agentId: string
  sessionId: string
  toolCallsIncomplete: boolean
  unrecoveredToolFailures: Set<string>
}) => {
  if (!trackingHandle) {
    return
  }
  const { status, error } = sdk.ai.agentRequests.resolveFinalRequestStatus({
    toolCallsIncomplete,
    unrecoveredToolFailures,
  })
  await sdk.ai.agentRequests
    .updateRequestStatus({
      requestId: trackingHandle.requestId,
      status,
      ...(error !== undefined ? { error } : {}),
    })
    .catch(updateError => {
      console.error("Failed to update agent request status on finish", {
        agentId,
        sessionId,
        error: updateError,
      })
    })
}

const findLiveOperation = (agent: Agent, operationId: string) =>
  getLiveOperations(agent).find(operation => operation.id === operationId)

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

const getConfiguredChatAgentConfig = (chatApp: ChatApp, agentId: string) => {
  const chatAgentConfig = chatApp.agents?.find(
    agent => agent.agentId === agentId
  )
  if (!chatAgentConfig) {
    throw new HTTPError("agentId is not configured for this chat app", 400)
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

interface ResolvedChatStreamRequest {
  agentId: string
  canUsePreview: boolean
  chat: ChatAgentRequest
  chatAppId?: string
  existingChat?: ChatConversation
  userId: string
}

interface getExistingChatForStreamParams {
  canUsePreview: boolean
  chat: ChatAgentRequest
  chatAppId?: string
  db: ReturnType<typeof context.getWorkspaceDB>
  userId: string
}

const applyChatStreamPathParams = (
  chat: ChatAgentRequest,
  params: UserCtx<ChatAgentRequest, void>["params"]
) => {
  const chatAppId = params?.chatAppId
  if (chatAppId && chat.chatAppId && chat.chatAppId !== chatAppId) {
    throw new HTTPError("chatAppId in body does not match path", 400)
  }

  const chatConversationId = params?.chatConversationId
  if (
    chatConversationId &&
    chatConversationId !== "new" &&
    chat._id &&
    chat._id !== chatConversationId
  ) {
    throw new HTTPError("chatConversationId in body does not match path", 400)
  }

  if (chatAppId) {
    chat.chatAppId = chatAppId
  }
  if (chatConversationId && chatConversationId !== "new") {
    chat._id = chatConversationId
  }
}

const getExistingChatForStream = async ({
  canUsePreview,
  chat,
  chatAppId,
  db,
  userId,
}: getExistingChatForStreamParams) => {
  if (!chat._id) {
    return undefined
  }

  const existingChat = await db.tryGet<ChatConversation>(chat._id)
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

  return existingChat
}

const resolveChatStreamRequest = async (
  ctx: UserCtx<ChatAgentRequest, void>
): Promise<ResolvedChatStreamRequest> => {
  const chat = ctx.request.body
  const userId = getGlobalUserId(ctx)
  applyChatStreamPathParams(chat, ctx.params)

  const db = context.getWorkspaceDB()
  const chatAppId = chat.chatAppId
  const isBuilderOrAdmin = usersSdk.users.isAdminOrBuilder(ctx.user)
  const requestedPreview = chat.isPreview === true

  if (requestedPreview && !isBuilderOrAdmin) {
    throw new HTTPError("Forbidden", 403)
  }

  const canUsePreview = requestedPreview

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

  const existingChat = await getExistingChatForStream({
    canUsePreview,
    chat,
    chatAppId,
    db,
    userId,
  })

  const agentId = existingChat?.agentId || chat.agentId
  if (!agentId) {
    throw new HTTPError("agentId is required", 400)
  }

  if (!canUsePreview && chatApp) {
    const chatAgentConfig = getEnabledChatAgentConfig(chatApp, agentId)
    await assertCanAccessChatAgent(ctx, chatAgentConfig)
  }

  chat.agentId = agentId

  return {
    agentId,
    canUsePreview,
    chat,
    chatAppId,
    existingChat,
    userId,
  }
}

export type WebhookAssistantStream = AsyncIterable<string>

const getAssistantMessageText = (assistantMessage?: UIMessage) =>
  assistantMessage?.parts
    ?.flatMap(part => (part.type === "text" ? [part.text] : []))
    .join("") || ""

const createAssistantTextStream = async function* (
  stream: ReadableStream<UIMessageChunk>
): AsyncGenerator<string, void, void> {
  let previousText = ""
  for await (const assistantMessage of readUIMessageStream({ stream })) {
    const currentText = getAssistantMessageText(assistantMessage)
    if (!currentText || currentText === previousText) {
      continue
    }

    if (currentText.startsWith(previousText)) {
      const delta = currentText.slice(previousText.length)
      if (delta) {
        yield delta
      }
    } else {
      yield currentText
    }

    previousText = currentText
  }
}

export async function webhookChat({
  chat,
  user,
  onAssistantStream,
}: {
  chat: ChatConversationRequest
  user: ContextUser
  onAssistantStream?: (stream: WebhookAssistantStream) => Promise<void>
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

  getConfiguredChatAgentConfig(chatApp, agentId)
  const agent = await sdk.ai.agents.getOrThrow(agentId)
  const providerPrefix = chat.channel?.provider || "chat"
  const chatId = chat._id ?? docIds.generateChatConversationID()
  const sessionId = `${providerPrefix}:${chatId}`
  let trackingHandle: AgentRequestTrackingHandle
  const run = await prepareAgentChatRun({
    agent,
    agentId,
    chat,
    errorLabel: "webhook chat",
    sessionId,
    user,
    getRequestId: () => trackingHandle?.requestId,
  })
  const title = run.latestQuestion
    ? truncateTitle(run.latestQuestion)
    : chat.title

  const userId = user.globalId || user.userId || user._id || ""
  trackingHandle = await startAgentRequestTracking({
    agentId,
    sessionId,
    run,
    userId,
    chatMessages: chat.messages,
  })

  const pendingToolCalls = new Set<string>()
  const unrecoveredToolFailures = new Set<string>()

  const result = await run.stream({
    pendingToolCalls,
    unrecoveredToolFailures,
    onToolCalls: buildEscalateToolCallHandler({
      trackingHandle,
      agentId,
      sessionId,
    }),
  })

  const uiMessageStream = result.toUIMessageStream({
    generateMessageId: v4,
    sendReasoning: true,
  })
  let assistantStreamForCapture: ReadableStream<UIMessageChunk> =
    uiMessageStream
  let streamTask: Promise<void> = Promise.resolve()
  if (onAssistantStream) {
    const [deliveryStream, captureStream] = uiMessageStream.tee()
    assistantStreamForCapture = captureStream
    streamTask = onAssistantStream(createAssistantTextStream(deliveryStream))
  }

  const assistantMessageTask = (async () => {
    let assistantMessage: ChatConversation["messages"][number] | undefined
    for await (const message of readUIMessageStream<
      ChatConversation["messages"][number]
    >({
      stream: assistantStreamForCapture,
    })) {
      assistantMessage = message
    }
    return assistantMessage
  })()

  const [
    assistantMessageResult,
    responseResult,
    streamOutcome,
    finishReasonResult,
  ] = await Promise.allSettled([
    assistantMessageTask,
    result.response,
    streamTask,
    result.finishReason,
  ])

  if (streamOutcome.status === "rejected") {
    console.error("Chat webhook stream delivery failed", streamOutcome.reason)
    events.action.aiAgentFailed({
      agentId,
      reason: ActionFailureReason.ERROR,
      errorMessage: getErrorMessage(streamOutcome.reason),
    })
    await markAgentRequestFailed({
      trackingHandle,
      agentId,
      sessionId,
      errorMessage: getErrorMessage(streamOutcome.reason),
    })
    throw streamOutcome.reason
  }
  const requestId =
    responseResult.status === "fulfilled"
      ? (responseResult.value.id ?? undefined)
      : undefined
  run.sessionLogIndexer.addRequestId(requestId)
  await run.sessionLogIndexer.index()

  if (assistantMessageResult.status === "rejected") {
    console.error("Agent streaming error", {
      agentId,
      chatAppId,
      sessionId,
      error: assistantMessageResult.reason,
    })
    events.action.aiAgentFailed({
      agentId,
      reason: ActionFailureReason.ERROR,
      errorMessage: getErrorMessage(assistantMessageResult.reason),
    })
    await markAgentRequestFailed({
      trackingHandle,
      agentId,
      sessionId,
      errorMessage: getErrorMessage(assistantMessageResult.reason),
    })
    throw assistantMessageResult.reason
  }
  if (responseResult.status === "rejected") {
    console.error("Agent response metadata error", {
      agentId,
      chatAppId,
      sessionId,
      error: responseResult.reason,
    })
    events.action.aiAgentFailed({
      agentId,
      reason: ActionFailureReason.ERROR,
      errorMessage: getErrorMessage(responseResult.reason),
    })
    await markAgentRequestFailed({
      trackingHandle,
      agentId,
      sessionId,
      errorMessage: getErrorMessage(responseResult.reason),
    })
    throw responseResult.reason
  }

  events.action.aiAgentExecuted({ agentId })
  const ragSources = run.getUsedKnowledgeSourcesMetadata()

  const finalAssistantMessage =
    assistantMessageResult.value ||
    ({
      id: v4(),
      role: "assistant",
      parts: [{ type: "text", text: "" }],
    } satisfies ChatConversation["messages"][number])
  const assistantText = getAssistantMessageText(finalAssistantMessage)
  const assistantMessage: ChatConversation["messages"][number] = {
    ...finalAssistantMessage,
  }

  const toolCallsIncomplete =
    pendingToolCalls.size > 0 ||
    (finishReasonResult.status === "fulfilled" &&
      finishReasonResult.value === "tool-calls")
  await finalizeAgentRequestTracking({
    trackingHandle,
    agentId,
    sessionId,
    toolCallsIncomplete,
    unrecoveredToolFailures,
  })

  return {
    messages: [...chat.messages, assistantMessage],
    assistantText: assistantText || "",
    ragSources: run.getUsedKnowledgeSourcesMetadata(),
    allowKnowledgeSourceDownload:
      run.selectedOperation?.allowKnowledgeSourceDownload,
    title,
    ...(ragSources?.length ? { ragSources } : {}),
  }
}

export async function agentChatStream(ctx: UserCtx<ChatAgentRequest, void>) {
  const db = context.getWorkspaceDB()
  const { agentId, chat, chatAppId, userId } =
    await resolveChatStreamRequest(ctx)

  ctx.status = 200
  ctx.set("Content-Type", "text/event-stream")
  ctx.set("Cache-Control", "no-cache")
  ctx.set("Connection", "keep-alive")

  ctx.res.setHeader("X-Accel-Buffering", "no")
  ctx.res.setHeader("Transfer-Encoding", "chunked")

  const agent = await sdk.ai.agents.getOrThrow(agentId)
  await sdk.ai.agents.assertAgentHasValidConfig(agent)

  let trackingHandle: AgentRequestTrackingHandle
  let sessionId = ""

  try {
    const chatId = chat._id ?? docIds.generateChatConversationID()
    sessionId = chat.transient ? chat.sessionId || chatId : chatId
    const run = await prepareAgentChatRun({
      agent,
      agentId,
      chat,
      errorLabel: "chat stream",
      sessionId,
      user: ctx.user,
      getRequestId: () => trackingHandle?.requestId,
    })

    trackingHandle = await startAgentRequestTracking({
      agentId,
      sessionId,
      run,
      userId,
      chatMessages: chat.messages,
    })

    const pendingToolCalls = new Set<string>()
    const unrecoveredToolFailures = new Set<string>()
    const streamResult = { toolCallsIncomplete: false }

    const result = await run.stream({
      pendingToolCalls,
      unrecoveredToolFailures,
      onToolCalls: buildEscalateToolCallHandler({
        trackingHandle,
        agentId,
        sessionId,
      }),
    })

    const title = run.latestQuestion
      ? truncateTitle(run.latestQuestion)
      : chat.title

    ctx.respond = false
    const streamStartTime = Date.now()
    const sharedMetadata = {
      ...(Object.keys(run.toolDisplayNames).length > 0
        ? { toolDisplayNames: run.toolDisplayNames }
        : {}),
      ...(run.selectedOperation
        ? {
            selectedOperationId: run.selectedOperation.id,
            selectedOperationName: run.selectedOperation.name,
            allowKnowledgeSourceDownload:
              run.selectedOperation.allowKnowledgeSourceDownload,
          }
        : {}),
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
          const usedKnowledgeSources = run.getUsedKnowledgeSourcesMetadata()
          // Check if model ended in a tool-call state or steps were incomplete
          const finishReason = (part as { finishReason?: string }).finishReason
          streamResult.toolCallsIncomplete =
            pendingToolCalls.size > 0 || finishReason === "tool-calls"

          const finishPart = part as {
            totalUsage?: LanguageModelUsage | undefined
          }
          const usage = buildAgentMessageUsage({
            inputUsage: run.contextUsage.input ?? finishPart.totalUsage,
            outputUsage: run.contextUsage.output ?? finishPart.totalUsage,
            maxTokens: run.contextWindowTokens,
            systemPromptTokens: run.systemPromptTokens,
          })

          return {
            ...sharedMetadata,
            ...(usedKnowledgeSources?.length
              ? { ragSources: usedKnowledgeSources }
              : {}),
            createdAt: streamStartTime,
            completedAt: Date.now(),
            ...(usage ? { usage } : {}),
            ...(streamResult.toolCallsIncomplete && {
              error: formatIncompleteToolCallError([]),
            }),
          }
        }
      },
      onError: error => {
        run.sessionLogIndexer.index().catch(indexError => {
          console.error("Failed to index agent session after stream error", {
            agentId,
            chatAppId,
            sessionId,
            error: indexError,
          })
        })
        console.error("Agent streaming error", {
          agentId,
          chatAppId,
          sessionId,
          error,
        })
        events.action.aiAgentFailed({
          agentId,
          reason: ActionFailureReason.ERROR,
          errorMessage: getErrorMessage(error),
        })
        markAgentRequestFailed({
          trackingHandle,
          agentId,
          sessionId,
          errorMessage: getErrorMessage(error),
        })
        return getErrorMessage(error)
      },
      onFinish: async ({ messages }) => {
        await run.sessionLogIndexer.index()
        events.action.aiAgentExecuted({ agentId })

        await finalizeAgentRequestTracking({
          trackingHandle,
          agentId,
          sessionId,
          toolCallsIncomplete: streamResult.toolCallsIncomplete,
          unrecoveredToolFailures,
        })

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
      consumeSseStream: consumeStream,
      sendReasoning: true,
    })
    return
  } catch (error: any) {
    const message = error?.message || "Agent action failed"
    markAgentRequestFailed({
      trackingHandle,
      agentId,
      sessionId,
      errorMessage: message,
    })
    ctx.res.write(
      `data: ${JSON.stringify({ type: "error", errorText: message })}\n\n`
    )
    ctx.res.end()
  }
}

export async function fetchChatAppAgentFileUrl(
  ctx: UserCtx<
    void,
    FetchAgentFileUrlResponse,
    {
      chatAppId: string
      agentId: string
      operationId: string
      fileId: string
    }
  >
) {
  const { chatAppId, agentId, operationId, fileId } = ctx.params

  const chatApp = await sdk.ai.chatApps.getOrThrow(chatAppId)
  assertChatAppIsLiveForUser(ctx, chatApp)

  const chatAgentConfig = chatApp.agents?.find(
    agent => agent.agentId === agentId
  )
  if (!chatAgentConfig?.isEnabled) {
    throw new HTTPError("chat agent not found", 404)
  }

  if (!(await canAccessChatAppAgentForUser(ctx, chatAgentConfig))) {
    throw new HTTPError("Forbidden", 403)
  }

  const agent = await sdk.ai.agents.getOrThrow(agentId)
  const operation = findLiveOperation(agent, operationId)

  if (!operation) {
    throw new HTTPError("Operation not found", 404)
  }

  if (!operation.allowKnowledgeSourceDownload) {
    throw new HTTPError(
      "Knowledge source downloads are disabled for this agent",
      403
    )
  }

  const url = await sdk.ai.rag.getFileUrlForOperation(
    agentId,
    operation.id,
    fileId
  )
  ctx.body = { url }
  ctx.status = 200
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
