import {
  context,
  events,
  docIds,
  features,
  getErrorMessage,
  HTTPError,
  roles,
} from "@budibase/backend-core"
import { v4 } from "uuid"
import {
  ActionFailureReason,
  ChatAgentRequest,
  ChatConversation,
  ChatConversationRequest,
  ESCALATE_TOOL_NAME,
  FeatureFlag,
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
import { isDevWorkspaceID } from "../../../db/utils"
import {
  buildAgentMessageUsage,
  formatIncompleteToolCallError,
  prepareAgentChatRun,
  type AgentChatRun,
} from "../../../sdk/workspace/ai/agents"
import { sdk as usersSdk } from "@budibase/shared-core"
import { truncateTitle } from "../../../sdk/workspace/ai/chatConversations"
import {
  determineTrigger,
  resolvePreviewSessionId,
} from "../../../sdk/workspace/ai/agentLogs/shared"

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

  const operation =
    run.selectedOperation && run.operationIntent !== "query"
      ? {
          name: run.selectedOperation.name,
          prompt: run.selectedOperation.promptInstructions || "",
        }
      : undefined

  let trackingHandle: AgentRequestTrackingHandle

  if (operation) {
    trackingHandle = await sdk.ai.agentRequests
      .initActiveRequest({
        agentId,
        sessionId,
        latestPrompt: run.latestQuestion,
        operation,
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

    sdk.ai.agentRequests
      .enqueueRequestTracking({
        agentId,
        sessionId,
        latestUserPrompt: run.latestQuestion,
        recentChatContext: getRecentChatContext(chatMessages),
        operation,
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
  }

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

const buildToolCallTrackingHandler = ({
  trackingHandle,
  agentId,
  sessionId,
  toolDisplayNames,
}: {
  trackingHandle: AgentRequestTrackingHandle
  agentId: string
  sessionId: string
  toolDisplayNames: Record<string, string>
}) => {
  // recordToolCall awaits an LLM summary internally, and the runtime awaits
  // onToolCallCompleted between steps. Returning its promise would stall
  // every step on that summary. Instead, chain the calls in the background
  // (preserving completion order) and let finalization flush() the tail
  // before writing the terminal status.
  let chain = Promise.resolve()

  const onToolCallCompleted = ({
    toolName,
    status,
    input,
    output,
  }: {
    toolName: string
    status: "success" | "error"
    input?: unknown
    output?: unknown
  }) => {
    if (!trackingHandle) {
      return
    }
    chain = chain.then(() =>
      sdk.ai.agentRequests
        .recordToolCall({
          requestId: trackingHandle.requestId,
          agentId,
          sessionId,
          toolName,
          status,
          readableName: toolDisplayNames[toolName],
          input,
          output,
        })
        .catch(error => {
          console.error("Failed to record agent request tool call", {
            agentId,
            sessionId,
            toolName,
            error,
          })
        })
    )
  }

  return { onToolCallCompleted, flush: () => chain }
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
  finalResponse,
}: {
  trackingHandle: AgentRequestTrackingHandle
  agentId: string
  sessionId: string
  toolCallsIncomplete: boolean
  unrecoveredToolFailures: Set<string>
  finalResponse: string
}) => {
  if (!trackingHandle) {
    return
  }
  const outcome = await sdk.ai.agentRequests.resolveFinalRequestOutcome({
    requestId: trackingHandle.requestId,
    agentId,
    sessionId,
    toolCallsIncomplete,
    unrecoveredToolFailures,
    finalResponse,
  })
  if (!outcome) {
    return
  }
  await sdk.ai.agentRequests
    .updateRequestStatus({
      requestId: trackingHandle.requestId,
      status: outcome.status,
      ...(outcome.error !== undefined ? { error: outcome.error } : {}),
    })
    .catch(updateError => {
      console.error("Failed to update agent request status on finish", {
        agentId,
        sessionId,
        error: updateError,
      })
    })
}

interface ResolvedChatStreamRequest {
  agentId: string
  chat: ChatAgentRequest
  userId: string
  user: ContextUser
}

const applyChatStreamPathParams = (
  chat: ChatAgentRequest,
  params: UserCtx<ChatAgentRequest, void>["params"]
) => {
  const agentId = params?.agentId
  if (agentId && chat.agentId && chat.agentId !== agentId) {
    throw new HTTPError("agentId in body does not match path", 400)
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

  if (agentId) {
    chat.agentId = agentId
  }
  if (chatConversationId && chatConversationId !== "new") {
    chat._id = chatConversationId
  }
}

const resolveChatStreamRequest = async (
  ctx: UserCtx<ChatAgentRequest, void>
): Promise<ResolvedChatStreamRequest> => {
  const chat = ctx.request.body
  const userId = getGlobalUserId(ctx)
  applyChatStreamPathParams(chat, ctx.params)

  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    throw new HTTPError("Workspace context is required", 400)
  }
  const isBuilderOrAdmin = usersSdk.users.isAdminOrBuilder(
    ctx.user,
    workspaceId
  )

  if (chat.isPreview !== true) {
    throw new HTTPError("Preview mode is required", 400)
  }

  if (!isBuilderOrAdmin) {
    throw new HTTPError("Forbidden", 403)
  }

  if (!isDevWorkspaceID(workspaceId)) {
    throw new HTTPError("Preview mode requires a development workspace", 400)
  }

  let user = ctx.user
  if (chat.previewRoleId) {
    const previewRole = await roles.getRole(chat.previewRoleId)
    if (!previewRole?._id) {
      throw new HTTPError("Preview role not found", 400)
    }
    user = {
      ...ctx.user,
      roleId: previewRole._id,
    }
  }

  const agentId = chat.agentId
  if (!agentId) {
    throw new HTTPError("agentId is required", 400)
  }

  return {
    agentId,
    chat,
    userId,
    user,
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
  const agentId = chat.agentId
  if (!agentId) {
    throw new HTTPError("agentId is required", 400)
  }

  const agent = await sdk.ai.agents.getOrThrow(agentId)
  const provider = chat.channel?.provider
  if (!provider) {
    throw new HTTPError("channel.provider is required", 400)
  }
  const chatId = chat._id ?? docIds.generateChatConversationID()
  const sessionId = `${provider}:${chatId}`
  const suspendedModelMessages =
    await sdk.ai.chatConversations.prepareModelMessages(chat.messages)
  const modelMessages =
    await sdk.ai.chatConversations.addConversationAttachmentsToModelMessages({
      messages: suspendedModelMessages,
      conversation: chat,
    })
  let trackingHandle: AgentRequestTrackingHandle
  const run = await prepareAgentChatRun({
    agent,
    agentId,
    chat,
    errorLabel: "webhook chat",
    sessionId,
    user,
    modelMessages,
    suspendedModelMessages,
    conversationAttachmentIds: chat.attachments?.map(file => file.id),
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
  const toolCallTracking = buildToolCallTrackingHandler({
    trackingHandle,
    agentId,
    sessionId,
    toolDisplayNames: run.toolDisplayNames,
  })

  const result = await run.stream({
    pendingToolCalls,
    unrecoveredToolFailures,
    onToolCalls: buildEscalateToolCallHandler({
      trackingHandle,
      agentId,
      sessionId,
    }),
    onToolCallCompleted: toolCallTracking.onToolCallCompleted,
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
    await toolCallTracking.flush()
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
      sessionId,
      error: assistantMessageResult.reason,
    })
    events.action.aiAgentFailed({
      agentId,
      reason: ActionFailureReason.ERROR,
      errorMessage: getErrorMessage(assistantMessageResult.reason),
    })
    await toolCallTracking.flush()
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
      sessionId,
      error: responseResult.reason,
    })
    events.action.aiAgentFailed({
      agentId,
      reason: ActionFailureReason.ERROR,
      errorMessage: getErrorMessage(responseResult.reason),
    })
    await toolCallTracking.flush()
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
  await toolCallTracking.flush()
  await finalizeAgentRequestTracking({
    trackingHandle,
    agentId,
    sessionId,
    toolCallsIncomplete,
    unrecoveredToolFailures,
    finalResponse: assistantText,
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
  const { agentId, chat, userId, user } = await resolveChatStreamRequest(ctx)

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
    sessionId = resolvePreviewSessionId({
      sessionId: chat.sessionId,
      fallbackId: chatId,
    })
    const run = await prepareAgentChatRun({
      agent,
      agentId,
      chat,
      errorLabel: "chat stream",
      sessionId,
      user,
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
    const toolCallTracking = buildToolCallTrackingHandler({
      trackingHandle,
      agentId,
      sessionId,
      toolDisplayNames: run.toolDisplayNames,
    })

    const result = await run.stream({
      pendingToolCalls,
      unrecoveredToolFailures,
      onToolCalls: buildEscalateToolCallHandler({
        trackingHandle,
        agentId,
        sessionId,
      }),
      onToolCallCompleted: toolCallTracking.onToolCallCompleted,
    })

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
            sessionId,
            error: indexError,
          })
        })
        console.error("Agent streaming error", {
          agentId,
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

        await toolCallTracking.flush()

        const finalAssistantMessage = [...messages]
          .reverse()
          .find(message => message.role === "assistant")
        const finalizeTask = finalizeAgentRequestTracking({
          trackingHandle,
          agentId,
          sessionId,
          toolCallsIncomplete: streamResult.toolCallsIncomplete,
          unrecoveredToolFailures,
          finalResponse: getAssistantMessageText(finalAssistantMessage),
        })

        await finalizeTask
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
