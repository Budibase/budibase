import { context, docIds, HTTPError } from "@budibase/backend-core"
import { ai } from "@budibase/pro"
import {
  Agent,
  AgentChat,
  AgentToolSource,
  AgentToolSourceWithTools,
  ChatAgentRequest,
  CreateAgentRequest,
  CreateAgentResponse,
  CreateToolSourceRequest,
  DocumentType,
  FetchAgentHistoryResponse,
  FetchAgentsResponse,
  Message,
  RequiredKeys,
  Tool,
  UpdateAgentRequest,
  UpdateAgentResponse,
  UpdateToolSourceRequest,
  UserCtx,
} from "@budibase/types"
import { createToolSource as createToolSourceInstance } from "../../../ai/tools/base"
import sdk from "../../../sdk"

function addDebugInformation(messages: Message[]) {
  const processedMessages = [...messages]
  for (let i = 0; i < processedMessages.length; i++) {
    const message = processedMessages[i]
    if (message.role === "assistant" && message.tool_calls?.length) {
      // For each tool call, add debug information to the assistant message content
      let toolDebugInfo = "\n\n**Tool Calls:**\n"

      for (const toolCall of message.tool_calls) {
        if (toolCall.type !== "function" || !toolCall.function) {
          console.warn(
            `[OPENAI TOOL WARN] Unsupported tool call type: ${toolCall.type}`
          )
          continue
        }

        let toolParams = "{}"
        try {
          // Try to parse and prettify the JSON arguments
          toolParams = JSON.stringify(
            JSON.parse(toolCall.function.arguments),
            null,
            2
          )
        } catch (e) {
          // If not valid JSON, use as is
          toolParams = toolCall.function.arguments
        }

        toolDebugInfo += `\n**Tool:** ${toolCall.function.name}\n**Parameters:**\n\`\`\`json\n${toolParams}\n\`\`\`\n`
      }

      // Append tool debug info to the message content
      if (message.content) {
        message.content += toolDebugInfo
      } else {
        message.content = toolDebugInfo
      }
    }
  }
  return processedMessages
}

export async function agentChatStream(ctx: UserCtx<ChatAgentRequest, void>) {
  const model = await sdk.aiConfigs.getLLMOrThrow()
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

  let prompt = new ai.LLMRequest()
    .addSystemMessage(ai.agentSystemPrompt(ctx.user))
    .addMessages(chat.messages)

  let toolGuidelines = ""

  for (const toolSource of agent.allowedTools || []) {
    const toolSourceInstance = createToolSourceInstance(
      toolSource as AgentToolSource
    )

    if (!toolSourceInstance) {
      continue
    }

    const guidelines = toolSourceInstance.getGuidelines()
    if (guidelines) {
      toolGuidelines += `\n\nWhen using ${toolSourceInstance.getName()} tools, ensure you follow these guidelines:\n${guidelines}`
    }

    const toolsToAdd = toolSourceInstance.getEnabledTools()

    if (toolsToAdd.length > 0) {
      prompt = prompt.addTools(toolsToAdd)
    }
  }

  // Append tool guidelines to the system prompt if any exist
  if (toolGuidelines) {
    prompt = prompt.addSystemMessage(toolGuidelines)
  }

  try {
    let finalMessages: Message[] = []
    let totalTokens = 0

    for await (const chunk of model.chatStream(prompt)) {
      // Send chunk to client
      ctx.res.write(`data: ${JSON.stringify(chunk)}\n\n`)

      if (chunk.type === "done") {
        finalMessages = chunk.messages || []
        totalTokens = chunk.tokensUsed || 0
        break
      } else if (chunk.type === "error") {
        ctx.res.write(
          `data: ${JSON.stringify({
            type: "error",
            content: chunk.content,
          })}\n\n`
        )
        ctx.res.end()
        return
      }
    }

    // Save chat to database after streaming is complete
    if (finalMessages.length > 0) {
      if (!chat._id) {
        chat._id = docIds.generateAgentChatID()
      }

      if (!chat.title || chat.title === "") {
        const titlePrompt = new ai.LLMRequest()
          .addSystemMessage(ai.agentHistoryTitleSystemPrompt())
          .addMessages(finalMessages)
        const { message } = await model.prompt(titlePrompt)
        chat.title = message
      }

      const newChat: AgentChat = {
        _id: chat._id,
        _rev: chat._rev,
        agentId,
        title: chat.title,
        messages: addDebugInformation(finalMessages),
      }

      const { rev } = await db.put(newChat)

      // Send final chat info
      ctx.res.write(
        `data: ${JSON.stringify({
          type: "chat_saved",
          chat: { ...newChat, _rev: rev },
          tokensUsed: totalTokens,
        })}\n\n`
      )
    }

    ctx.res.end()
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
  ctx.status = 201
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

export async function fetchToolSources(
  ctx: UserCtx<void, AgentToolSourceWithTools[], { agentId: string }>
) {
  const agentId = ctx.params.agentId

  if (!agentId) {
    throw new HTTPError("agentId is required", 400)
  }

  const agent = await sdk.ai.agents.getOrThrow(agentId)

  ctx.body = (agent.allowedTools || []).map(toolSource => {
    const toolSourceInstance = createToolSourceInstance(toolSource)

    const tools: Tool[] = toolSourceInstance
      ? toolSourceInstance.getTools()
      : []

    return {
      ...toolSource,
      tools,
    }
  })
}

export async function createToolSource(
  ctx: UserCtx<CreateToolSourceRequest, { created: true }>
) {
  const toolSourceRequest = ctx.request.body

  if (!toolSourceRequest.agentId) {
    throw new HTTPError("agentId is required", 400)
  }

  const agent = await sdk.ai.agents.getOrThrow(toolSourceRequest.agentId)

  // Generate a unique ID for the tool source
  const toolSourceId = docIds.generateAgentToolSourceID()

  // Remove agentId from tool source as it's not part of the tool source structure
  const { agentId: _, ...toolSourceData } = toolSourceRequest

  const toolSource: AgentToolSource = {
    ...toolSourceData,
    id: toolSourceId,
  } as AgentToolSource

  // Add tool source to agent's allowedTools
  const updatedAgent: Agent = {
    ...agent,
    allowedTools: [...(agent.allowedTools || []), toolSource],
  }

  await sdk.ai.agents.update(updatedAgent)

  ctx.body = { created: true }
  ctx.status = 201
}

export async function updateToolSource(
  ctx: UserCtx<UpdateToolSourceRequest, AgentToolSource>
) {
  const toolSourceRequest = ctx.request.body

  if (!toolSourceRequest.id) {
    throw new HTTPError("id field missing", 400)
  }

  if (!toolSourceRequest.agentId) {
    throw new HTTPError("agentId is required", 400)
  }

  const agent = await sdk.ai.agents.getOrThrow(toolSourceRequest.agentId)

  // Remove agentId from tool source as it's not part of the tool source structure
  const { agentId: _, ...toolSourceData } = toolSourceRequest

  // Find and update the tool source in allowedTools
  const updatedAllowedTools = (agent.allowedTools || []).map(ts => {
    if ((ts as any).id === toolSourceRequest.id) {
      return {
        ...toolSourceData,
        id: toolSourceRequest.id,
      } as AgentToolSource
    }
    return ts
  })

  const updatedAgent: Agent = {
    ...agent,
    allowedTools: updatedAllowedTools,
  }

  await sdk.ai.agents.update(updatedAgent)

  // Return the updated tool source
  const updatedToolSource = updatedAllowedTools.find(
    ts => (ts as any).id === toolSourceRequest.id
  ) as AgentToolSource

  ctx.body = updatedToolSource
  ctx.status = 200
}

export async function deleteToolSource(ctx: UserCtx<void, { deleted: true }>) {
  const toolSourceId = ctx.params.toolSourceId

  // Find agent that contains this tool source
  const agents = await sdk.ai.agents.fetch()
  const agentWithToolSource = agents.find(agent =>
    (agent.allowedTools || []).some(ts => (ts as any).id === toolSourceId)
  )

  if (!agentWithToolSource) {
    throw new HTTPError("Tool source not found", 404)
  }

  // Remove tool source from agent's allowedTools
  const updatedAgent: Agent = {
    ...agentWithToolSource,
    allowedTools: (agentWithToolSource.allowedTools || []).filter(
      ts => (ts as any).id !== toolSourceId
    ),
  }

  await sdk.ai.agents.update(updatedAgent)

  ctx.body = { deleted: true }
  ctx.status = 200
}

export async function fetchAgents(ctx: UserCtx<void, FetchAgentsResponse>) {
  const agents = await sdk.ai.agents.fetch()
  ctx.body = { agents }
}

export async function createAgent(
  ctx: UserCtx<CreateAgentRequest, CreateAgentResponse>
) {
  const body = ctx.request.body

  const createRequest: RequiredKeys<CreateAgentRequest> = {
    name: body.name,
    description: body.description,
    aiconfig: body.aiconfig,
    promptInstructions: body.promptInstructions,
    allowedTools: body.allowedTools || [],
    _deleted: false,
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
    allowedTools: body.allowedTools,
    _deleted: false,
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
