import { context, db, docIds, HTTPError } from "@budibase/backend-core"
import { ai } from "@budibase/pro"
import {
  AgentChat,
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
  streamText,
  wrapLanguageModel,
} from "ai"
import { toAiSdkTools } from "../../../ai/tools/toAiSdkTools"

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
    const result = await streamText({
      model: wrapLanguageModel({
        model,
        middleware: extractReasoningMiddleware({
          tagName: "think",
        }),
      }),
      messages: convertToModelMessages(chat.messages),
      system,
      tools: aiTools,
    })

    const title =
      chat.title ||
      (
        await generateText({
          model,
          messages: [convertToModelMessages(chat.messages)[0]],
          system: ai.agentHistoryTitleSystemPrompt(),
        })
      ).text

    ctx.respond = false
    result.pipeUIMessageStreamToResponse(ctx.res, {
      originalMessages: chat.messages,
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
