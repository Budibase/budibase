import { context, db, docIds, HTTPError } from "@budibase/backend-core"
import { ai } from "@budibase/pro"
import {
  AgentChat,
  AgentFile,
  AgentFileStatus,
  AgentMessageMetadata,
  AgentMessageRagSource,
  ChatAgentRequest,
  CreateAgentRequest,
  CreateAgentResponse,
  DocumentType,
  FetchAgentHistoryResponse,
  FetchAgentsResponse,
  RequiredKeys,
  ToolMetadata,
  UpdateAgentRequest,
  UpdateAgentResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"
import {
  convertToModelMessages,
  extractReasoningMiddleware,
  generateText,
  ModelMessage,
  streamText,
  wrapLanguageModel,
} from "ai"
import { toAiSdkTools } from "../../../ai/tools/toAiSdkTools"
import {
  retrieveContextForSources,
  RetrievedContextChunk,
} from "../../../sdk/workspace/ai/rag"

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

const extractUserText = (message?: AgentChat["messages"][number]) => {
  if (!message || !Array.isArray(message.parts)) {
    return ""
  }
  return message.parts
    .filter(part => part && typeof part === "object" && part["type"] === "text")
    .map(part => (typeof part["text"] === "string" ? part["text"] : ""))
    .join(" ")
    .trim()
}

const findLatestUserQuestion = (chat: AgentChat) => {
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

export async function agentChatStream(ctx: UserCtx<ChatAgentRequest, void>) {
  const chat = ctx.request.body
  const db = context.getWorkspaceDB()
  const agentId = chat.agentId

  // Set SSE headers and status
  ctx.status = 200
  ctx.set("Content-Type", "text/event-stream")
  ctx.set("Cache-Control", "no-cache")
  ctx.set("Connection", "keep-alive")
  ctx.set("Access-Control-Allow-Origin", "*")
  ctx.set("Access-Control-Allow-Headers", "Cache-Control")

  // Disable buffering for better streaming
  ctx.res.setHeader("X-Accel-Buffering", "no") // Nginx
  ctx.res.setHeader("Transfer-Encoding", "chunked")

  const agent = await sdk.ai.agents.getOrThrow(agentId)
  const agentFiles = await sdk.ai.agents.listAgentFiles(agent._id!)
  const readyFileSources = agentFiles
    .filter(file => file.status === AgentFileStatus.READY && file.ragSourceId)
    .map(file => file.ragSourceId)

  const latestQuestion = findLatestUserQuestion(chat)
  let retrievedContext = ""
  let ragSourcesMetadata: AgentMessageMetadata["ragSources"] | undefined
  const minSimilarity = agent.ragMinDistance
  const topK = agent.ragTopK ?? 4

  if (latestQuestion && readyFileSources.length > 0) {
    try {
      const result = await retrieveContextForSources(
        latestQuestion,
        readyFileSources,
        topK,
        minSimilarity
      )
      retrievedContext = result.text
      if (result.chunks.length > 0) {
        ragSourcesMetadata = toSourceMetadata(result.chunks, agentFiles)
      }
    } catch (error) {
      console.log("Failed to retrieve agent context", error)
    }
  }

  const { systemPrompt: system, tools: allTools } =
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

    const aiTools = toAiSdkTools(allTools)
    const convertedMessages = convertToModelMessages(chat.messages)
    const messagesWithContext: ModelMessage[] =
      retrievedContext.trim().length > 0
        ? [
            {
              role: "system",
              content: `Relevant knowledge:\n${retrievedContext}\n\nUse this content when answering the user.`,
            },
            ...convertedMessages,
          ]
        : convertedMessages

    const result = streamText({
      model: wrapLanguageModel({
        model,
        middleware: extractReasoningMiddleware({
          tagName: "think",
        }),
      }),
      messages: messagesWithContext,
      system,
      tools: aiTools,
    })

    const title =
      chat.title ||
      (convertedMessages.length > 0
        ? (
            await generateText({
              model,
              messages: [convertedMessages[0]],
              system: ai.agentHistoryTitleSystemPrompt(),
            })
          ).text
        : "Conversation")

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
        const chatId = chat._id ?? docIds.generateAgentChatID(agent._id!)
        const existingChat = chat._id
          ? await db.tryGet<AgentChat>(chat._id)
          : null

        const updatedChat: AgentChat = {
          _id: chatId,
          ...(existingChat?._rev && { _rev: existingChat._rev }),
          agentId,
          title,
          messages,
        }
        await db.put(updatedChat)
      },
    })
    return
  } catch (error: any) {
    ctx.res.write(
      `data: ${JSON.stringify({ type: "error", content: error.message })}\n\n`
    )
    ctx.res.end()
  }
}

export async function remove(ctx: UserCtx<void, void>) {
  const db = context.getWorkspaceDB()

  const chatId = ctx.params.chatId
  if (!chatId) {
    throw new HTTPError("chatId is required", 400)
  }

  const chat = await db.tryGet<AgentChat>(chatId)
  if (!chat) {
    throw new HTTPError("chat not found", 404)
  }

  await db.remove(chat)
  ctx.status = 204
}

export async function fetchHistory(
  ctx: UserCtx<void, FetchAgentHistoryResponse>
) {
  const db = context.getWorkspaceDB()
  const agentId = ctx.params.agentId
  await sdk.ai.agents.getOrThrow(agentId)

  const allChats = await db.allDocs<AgentChat>(
    docIds.getDocParams(DocumentType.AGENT_CHAT, undefined, {
      include_docs: true,
    })
  )

  ctx.body = allChats.rows
    .map(row => row.doc!)
    .filter(chat => chat.agentId === agentId)
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return timeB - timeA // Newest first
    })
}

export async function fetchTools(ctx: UserCtx<void, ToolMetadata[]>) {
  ctx.body = await sdk.ai.agents.getAvailableToolsMetadata()
}

export async function fetchAgents(ctx: UserCtx<void, FetchAgentsResponse>) {
  const agents = await sdk.ai.agents.fetch()
  ctx.body = { agents }
}

export async function createAgent(
  ctx: UserCtx<CreateAgentRequest, CreateAgentResponse>
) {
  const body = ctx.request.body
  const createdBy = ctx.user?._id!
  const globalId = db.getGlobalIDFromUserMetadataID(createdBy)

  const createRequest: RequiredKeys<CreateAgentRequest> = {
    name: body.name,
    description: body.description,
    aiconfig: body.aiconfig,
    promptInstructions: body.promptInstructions,
    goal: body.goal,
    icon: body.icon,
    iconColor: body.iconColor,
    live: body.live,
    _deleted: false,
    createdBy: globalId,
    enabledTools: body.enabledTools,
    ragMinDistance: body.ragMinDistance,
    ragTopK: body.ragTopK,
  }

  const agent = await sdk.ai.agents.create(createRequest)

  ctx.body = agent
  ctx.status = 201
}

export async function updateAgent(
  ctx: UserCtx<UpdateAgentRequest, UpdateAgentResponse>
) {
  const body = ctx.request.body

  const updateRequest: RequiredKeys<UpdateAgentRequest> = {
    _id: body._id,
    _rev: body._rev,
    name: body.name,
    description: body.description,
    aiconfig: body.aiconfig,
    promptInstructions: body.promptInstructions,
    goal: body.goal,
    _deleted: false,
    icon: body.icon,
    iconColor: body.iconColor,
    live: body.live,
    createdBy: body.createdBy,
    enabledTools: body.enabledTools,
    ragMinDistance: body.ragMinDistance,
    ragTopK: body.ragTopK,
  }

  const agent = await sdk.ai.agents.update(updateRequest)

  ctx.body = agent
  ctx.status = 200
}

export async function deleteAgent(
  ctx: UserCtx<void, { deleted: true }, { agentId: string }>
) {
  const agentId = ctx.params.agentId
  await sdk.ai.agents.remove(agentId ?? "")
  ctx.body = { deleted: true }
  ctx.status = 200
}
