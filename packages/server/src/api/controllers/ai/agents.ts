import { ai } from "@budibase/pro"
import * as tools from "../../../ai/tools"
import { context, docIds, HTTPError } from "@budibase/backend-core"
import {
  ChatAgentRequest,
  ChatAgentResponse,
  DocumentType,
  UserCtx,
  FetchAgentHistoryResponse,
  AgentChat,
  AgentToolSource,
  AgentToolSourceWithTools,
  CreateToolSourceRequest,
  Message,
} from "@budibase/types"
import { ConfluenceClient, GitHubClient, BambooHRClient, budibase } from "../../../ai/tools"

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
    const disabledTools = toolSource.disabledTools || []

    if (toolSource.auth?.guidelines) {
      toolGuidelines += `\n\nWhen using ${toolSource.type} tools, ensure you follow these guidelines:\n${toolSource.auth.guidelines}`
    }

    let toolsToAdd: any[] = []

    switch (toolSource.type) {
      case "BUDIBASE": {
        toolsToAdd = tools.budibase.filter(
          tool => !disabledTools.includes(tool.name)
        )
        break
      }
      case "GITHUB": {
        const ghClient = new GitHubClient(toolSource.auth?.apiKey)
        toolsToAdd = ghClient
          .getTools()
          .filter(tool => !disabledTools.includes(tool.name))
        break
      }
      case "CONFLUENCE": {
        const confluenceClient = new ConfluenceClient(
          toolSource.auth?.apiKey,
          toolSource.auth?.email,
          toolSource.auth?.baseUrl
        )
        toolsToAdd = confluenceClient
          .getTools()
          .filter(tool => !disabledTools.includes(tool.name))
        break
      }
      case "BAMBOOHR": {
        const bamboohrClient = new BambooHRClient(
          toolSource.auth?.apiKey,
          toolSource.auth?.subdomain
        )
        toolsToAdd = bamboohrClient
          .getTools()
          .filter(tool => !disabledTools.includes(tool.name))
        break
      }
    }

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
    let tools: any[] = []

    switch (doc.type) {
      case "BUDIBASE":
        tools = budibase
        break
      case "GITHUB":
        const ghClient = new GitHubClient(doc.auth?.apiKey)
        tools = ghClient.getTools()
        break
      case "CONFLUENCE":
        const confluenceClient = new ConfluenceClient(
          doc.auth?.apiKey,
          doc.auth?.email,
          doc.auth?.baseUrl
        )
        tools = confluenceClient.getTools()
        break
      case "BAMBOOHR":
        const bamboohrClient = new BambooHRClient(
          doc.auth?.apiKey,
          doc.auth?.subdomain,
        )
        tools = bamboohrClient.getTools()
        break
    }

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

export async function deleteToolSource(
  ctx: UserCtx<void, { deleted: true }>
) {
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
