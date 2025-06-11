import { ai } from "@budibase/pro"
import { context, docIds, HTTPError } from "@budibase/backend-core"
import {
  ChatAgentRequest,
  ChatAgentResponse,
  DocumentType,
  Tool,
  UserCtx,
  FetchAgentHistoryResponse,
  AgentChat,
  AgentToolSource,
  AgentToolSourceWithTools,
  CreateToolSourceRequest,
  Message,
} from "@budibase/types"
import { createToolSource as createToolSourceInstance } from "../../../ai/tools/base/ToolSourceRegistry"

function addDebugInformation(messages: Message[]) {
  const processedMessages = [...messages]
  for (let i = 0; i < processedMessages.length; i++) {
    const message = processedMessages[i]
    if (message.role === "assistant" && message.tool_calls?.length) {
      // For each tool call, add debug information to the assistant message content
      let toolDebugInfo = "\n\n**Tool Calls:**\n"

      for (const toolCall of message.tool_calls) {
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

export async function agentChat(
  ctx: UserCtx<ChatAgentRequest, ChatAgentResponse>
) {
  const model = await ai.getLLMOrThrow()
  const chat = ctx.request.body
  const db = context.getAppDB()

  const toolSources = await db.allDocs<AgentToolSource>(
    docIds.getDocParams(DocumentType.AGENT_TOOL_SOURCE, undefined, {
      include_docs: true,
    })
  )

  let prompt = new ai.LLMRequest()
    .addSystemMessage(ai.agentSystemPrompt(ctx.user))
    .addMessages(chat.messages)

  let toolGuidelines = ""

  for (const row of toolSources.rows) {
    const toolSource = row.doc!
    const toolSourceInstance = createToolSourceInstance(toolSource)

    if (!toolSourceInstance) {
      console.warn(`Skipping unknown tool source type: ${toolSource.type}`)
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

  const response = await model.chat(prompt)

  // Process tool calls to add debug information to messages instead of using separate tool messages
  // TODO: replace with better debug UI
  response.messages = addDebugInformation(response.messages)

  if (!chat._id) {
    chat._id = docIds.generateAgentChatID()
  }

  if (!chat.title || chat.title === "") {
    const titlePrompt = new ai.LLMRequest()
      .addSystemMessage(ai.agentHistoryTitleSystemPrompt())
      .addMessages(response.messages)
    const { message } = await model.prompt(titlePrompt)
    chat.title = message
  }

  const newChat: AgentChat = {
    _id: chat._id,
    _rev: chat._rev,
    title: chat.title,
    messages: response.messages,
  }

  const { rev } = await db.put(newChat)
  newChat._rev = rev
  ctx.body = newChat
}

export async function remove(ctx: UserCtx<void, void>) {
  const db = context.getGlobalDB()
  const historyId = ctx.params.historyId
  await db.remove(historyId)
  ctx.status = 201
}

export async function fetchHistory(
  ctx: UserCtx<void, FetchAgentHistoryResponse>
) {
  const db = context.getAppDB()
  const history = await db.allDocs<AgentChat>(
    docIds.getDocParams(DocumentType.AGENT_CHAT, undefined, {
      include_docs: true,
    })
  )
  ctx.body = history.rows.map(row => row.doc!)
}

export async function fetchToolSources(
  ctx: UserCtx<void, AgentToolSourceWithTools[]>
) {
  const db = context.getAppDB()
  const toolSources = await db.allDocs<AgentToolSource>(
    docIds.getDocParams(DocumentType.AGENT_TOOL_SOURCE, undefined, {
      include_docs: true,
    })
  )

  ctx.body = toolSources.rows.map(row => {
    const doc = row.doc!
    const toolSourceInstance = createToolSourceInstance(doc)

    const tools: Tool[] = toolSourceInstance
      ? toolSourceInstance.getTools()
      : []

    return {
      ...doc,
      tools,
    }
  })
}

export async function createToolSource(
  ctx: UserCtx<CreateToolSourceRequest, { created: true }>
) {
  const db = context.getAppDB()
  const toolSource = ctx.request.body
  toolSource._id = docIds.generateAgentToolSourceID()

  await db.put(toolSource)
  // TODO: handle PH events
  // await events.toolsource.created(toolSource)
  ctx.body = { created: true }
  ctx.status = 201
}

export async function updateToolSource(
  ctx: UserCtx<CreateToolSourceRequest, AgentToolSource>
) {
  const toolSource = ctx.request.body

  if (!toolSource._id || !toolSource._rev) {
    throw new HTTPError("_id or _rev fields missing", 400)
  }

  const db = context.getAppDB()

  const response = await db.put(toolSource)
  toolSource._rev = response.rev

  ctx.body = toolSource
  ctx.status = 200
}

export async function deleteToolSource(ctx: UserCtx<void, { deleted: true }>) {
  const toolSourceId = ctx.params.toolSourceId
  const db = context.getAppDB()

  try {
    const toolSource = await db.get(toolSourceId)
    await db.remove(toolSource)
    ctx.body = { deleted: true }
    ctx.status = 200
  } catch (error: any) {
    if (error.status === 404) {
      throw new HTTPError("Tool source not found", 404)
    }
    throw error
  }
}
