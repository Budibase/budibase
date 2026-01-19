import { context, docIds, HTTPError } from "@budibase/backend-core"
import { ai } from "@budibase/pro"
import {
  AgentFile,
  AgentFileStatus,
  AgentMessageMetadata,
  AgentMessageRagSource,
  ChatAgentRequest,
  ChatApp,
  ChatConversation,
  ChatConversationRequest,
  CreateChatConversationRequest,
  DocumentType,
  FetchAgentHistoryResponse,
  UserCtx,
} from "@budibase/types"
import {
  convertToModelMessages,
  extractReasoningMiddleware,
  ModelMessage,
  streamText,
  wrapLanguageModel,
} from "ai"
import sdk from "../../../sdk"
import {
  retrieveContextForSources,
  RetrievedContextChunk,
} from "../../../sdk/workspace/ai/rag"

interface PrepareChatConversationForSaveParams {
  chatId: string
  chatAppId: string
  userId: string
  title?: string
  messages: ChatConversation["messages"]
  chat: Partial<ChatConversationRequest>
  existingChat?: ChatConversation | null
}

export const prepareChatConversationForSave = ({
  chatId,
  chatAppId,
  userId,
  title,
  messages,
  chat,
  existingChat,
}: PrepareChatConversationForSaveParams): ChatConversation => {
  const now = new Date().toISOString()
  const createdAt = existingChat?.createdAt || chat.createdAt || now
  const updatedAt = now
  const rev = existingChat?._rev || chat._rev
  const agentId = existingChat?.agentId || chat.agentId

  if (!agentId) {
    throw new HTTPError("agentId is required", 400)
  }

  return {
    _id: chatId,
    ...(rev && { _rev: rev }),
    chatAppId,
    agentId,
    userId,
    title: title ?? chat.title,
    messages,
    createdAt,
    updatedAt,
  }
}

const getGlobalUserId = (ctx: UserCtx) => {
  const userId = ctx.user?.globalId || ctx.user?.userId || ctx.user?._id
  if (!userId) {
    throw new HTTPError("userId is required", 400)
  }
  return userId as string
}

const toSourceMetadata = (
  chunks: RetrievedContextChunk[],
  files: AgentFile[]
): AgentMessageRagSource[] => {
  const fileBySourceId = new Map(files.map(file => [file.ragSourceId, file]))
  const summary = new Map<string, AgentMessageRagSource>()

  for (const chunk of chunks) {
    const file = fileBySourceId.get(chunk.sourceId)
    if (!summary.has(chunk.sourceId)) {
      summary.set(chunk.sourceId, {
        sourceId: chunk.sourceId,
        fileId: file?._id,
        filename: file?.filename ?? chunk.sourceId,
        chunkCount: 0,
      })
    }
    const entry = summary.get(chunk.sourceId)!
    entry.chunkCount += 1
  }
  return Array.from(summary.values())
}

export const extractUserText = (
  message?: ChatConversation["messages"][number]
) => {
  if (!message || !Array.isArray(message.parts)) {
    return ""
  }
  return message.parts
    .filter(part => part && typeof part === "object" && part["type"] === "text")
    .map(part => (typeof part["text"] === "string" ? part["text"] : ""))
    .join(" ")
    .trim()
}

export const findLatestUserQuestion = (chat: ChatConversationRequest) => {
  const messages = chat.messages || []
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const current = messages[i]
    if (current?.role === "user") {
      const text = extractUserText(current)
      if (text) {
        return text
      }
    }
  }
  return ""
}

export const truncateTitle = (value: string, maxLength = 120) => {
  const trimmed = value.trim()
  if (trimmed.length <= maxLength) {
    return trimmed
  }
  return `${trimmed.slice(0, maxLength - 3).trimEnd()}...`
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

  if (!chatAppId) {
    throw new HTTPError("chatAppId is required", 400)
  }

  const chatApp = await db.tryGet<ChatApp>(chatAppId)
  if (!chatApp) {
    throw new HTTPError("Chat app not found", 404)
  }

  let existingChat: ChatConversation | undefined
  if (chat._id) {
    existingChat = await db.tryGet<ChatConversation>(chat._id)
    if (!existingChat) {
      throw new HTTPError("chat not found", 404)
    }
    if (existingChat.chatAppId !== chatAppId) {
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

  if (!chatApp.enabledAgents?.some(agent => agent.agentId === agentId)) {
    throw new HTTPError("agentId is not enabled for this chat app", 400)
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
  const agentFiles = await sdk.ai.agents.listAgentFiles(agent._id!)
  const readyFileSources = agentFiles
    .filter(file => file.status === AgentFileStatus.READY && file.ragSourceId)
    .map(file => file.ragSourceId)

  const latestQuestion = findLatestUserQuestion(chat)
  let retrievedContext = ""
  let ragSourcesMetadata: AgentMessageMetadata["ragSources"] | undefined

  if (agent.ragConfigId && latestQuestion && readyFileSources.length > 0) {
    try {
      const ragConfig = await sdk.ai.rag.getAgentRagConfig(agent)
      const result = await retrieveContextForSources(
        ragConfig,
        latestQuestion,
        readyFileSources
      )
      retrievedContext = result.text
      if (result.chunks.length > 0) {
        ragSourcesMetadata = toSourceMetadata(result.chunks, agentFiles)
      }
    } catch (error) {
      // TODO: implement logging and fallbacks
      console.error("Failed to retrieve agent context", error)
    }
  }

  const { systemPrompt: system, tools } =
    await sdk.ai.agents.buildPromptAndTools(agent, {
      baseSystemPrompt: ai.agentSystemPrompt(ctx.user),
      includeGoal: false,
    })

  try {
    const { modelId, apiKey, baseUrl } =
      await sdk.aiConfigs.getLiteLLMModelConfigOrThrow(agent.aiconfig)

    const openai = ai.createLiteLLMOpenAI({
      apiKey,
      baseUrl,
    })
    const model = openai.chat(modelId)

    const modelMessages = await convertToModelMessages(chat.messages)
    const messagesWithContext: ModelMessage[] =
      retrievedContext.trim().length > 0
        ? [
            {
              role: "system",
              content: `Relevant knowledge:\n${retrievedContext}\n\nUse this content when answering the user.`,
            },
            ...modelMessages,
          ]
        : modelMessages

    const result = streamText({
      model: wrapLanguageModel({
        model,
        middleware: extractReasoningMiddleware({
          tagName: "think",
        }),
      }),
      messages: messagesWithContext,
      system,
      tools,
    })

    const title = latestQuestion ? truncateTitle(latestQuestion) : chat.title

    ctx.respond = false
    const messageMetadata =
      ragSourcesMetadata && ragSourcesMetadata.length > 0
        ? { ragSources: ragSourcesMetadata }
        : undefined

    result.pipeUIMessageStreamToResponse(ctx.res, {
      originalMessages: chat.messages,
      ...(messageMetadata && {
        messageMetadata: () => messageMetadata,
      }),
      onFinish: async ({ messages }) => {
        const chatId = chat._id ?? docIds.generateChatConversationID()
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
    })
    return
  } catch (error: any) {
    const message = error?.message || "Agent action failed"
    ctx.res.write(
      `data: ${JSON.stringify({ type: "error", errorText: message, content: message })}\n\n`
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
  if (!chatApp.enabledAgents?.some(agent => agent.agentId === agentId)) {
    throw new HTTPError("agentId is not enabled for this chat app", 400)
  }

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

  await sdk.ai.chatApps.getOrThrow(chatAppId)

  const chat = await db.tryGet<ChatConversation>(chatConversationId)
  if (!chat || chat.chatAppId !== chatAppId) {
    throw new HTTPError("chat not found", 404)
  }
  if (chat.userId && chat.userId !== userId) {
    throw new HTTPError("Forbidden", 403)
  }

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

  await sdk.ai.chatApps.getOrThrow(chatAppId)

  const allChats = await db.allDocs<ChatConversation>(
    docIds.getDocParams(DocumentType.CHAT_CONVERSATION, undefined, {
      include_docs: true,
    })
  )

  ctx.body = allChats.rows
    .map(row => row.doc!)
    .filter(
      chat =>
        chat.chatAppId === chatAppId && (!chat.userId || chat.userId === userId)
    )
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

  await sdk.ai.chatApps.getOrThrow(chatAppId)

  const chat = await db.tryGet<ChatConversation>(chatConversationId)
  if (!chat || chat.chatAppId !== chatAppId) {
    throw new HTTPError("chat not found", 404)
  }
  if (chat.userId && chat.userId !== userId) {
    throw new HTTPError("Forbidden", 403)
  }

  ctx.body = chat
}
