import { ai } from "@budibase/pro"
import * as tools from "../../../ai/tools"
import { context, docIds, events, HTTPError } from "@budibase/backend-core"
import {
  ChatAgentRequest,
  ChatAgentResponse,
  DocumentType,
  UserCtx,
  FetchAgentHistoryResponse,
  AgentChat,
  AgentToolSource,
  CreateToolSourceRequest
} from "@budibase/types"
import {
  ConfluenceClient,
  GitHubClient,
  budibase
} from "../../../ai/tools"

export async function agentChat(
  ctx: UserCtx<ChatAgentRequest, ChatAgentResponse>
) {
  const model = await ai.getLLMOrThrow()
  const chat = ctx.request.body


  let prompt = new ai.LLMRequest()
    .addSystemMessage(ai.agentSystemPrompt(ctx.user))
    .addMessages(chat.messages)
    .addTools(tools.budibase)

  // TODO: temporary until dynamically loaded from DB
  // TODO: need to read the DB, check the tool sources
  // TODO: For the connected ones
  // TODO: inject toolsources API keys into the clients
  // TODO: filter out the tools that aren't needed
  const ghClient = new GitHubClient()
  const confluenceClient = new ConfluenceClient()
  prompt = prompt
    .addTools(ghClient.getTools())
    .addTools(confluenceClient.getTools())

  const response = await model.chat(prompt)

  // Process tool calls to add debug information to messages instead of using separate tool messages
  const processedMessages = [...response.messages]
  for (let i = 0; i < processedMessages.length; i++) {
    const message = processedMessages[i]
    if (message.role === 'assistant' && message.tool_calls?.length) {
      // For each tool call, add debug information to the assistant message content
      let toolDebugInfo = "\n\n**Tool Calls:**\n"
      
      for (const toolCall of message.tool_calls) {
        let toolParams = '{}'
        try {
          // Try to parse and prettify the JSON arguments
          toolParams = JSON.stringify(JSON.parse(toolCall.function.arguments), null, 2)
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
  response.messages = processedMessages

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

  const db = context.getAppDB()
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

export async function fetchToolSources(ctx: UserCtx<void, void>) {
  const db = context.getAppDB()
  const toolSources = await db.allDocs<AgentToolSource>(
    docIds.getDocParams(DocumentType.AGENT_TOOL_SOURCE, undefined, {
      include_docs: true,
    })
  )

  // TODO: review, could probably be better
  const SourceToToolMap = {
    BUDIBASE: budibase,
    GITHUB: new GitHubClient().getTools(),
    CONFLUENCE: new ConfluenceClient().getTools()
  }

  const sourcesWithTools = toolSources.rows.map(row => {
    const doc = row.doc!
    return {
      ...doc,
      tools: SourceToToolMap[doc.type as keyof typeof SourceToToolMap] || []
    }
  })

  ctx.body = sourcesWithTools
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
  ctx: UserCtx<CreateToolSourceRequest, void>
) {
  const toolSource = ctx.request.body

  if (!toolSource._id || !toolSource._rev) {
    throw new HTTPError("_id or _rev fields missing", 400)
  }

  const db = context.getAppDB()

  const response = await db.put(toolSource)
  toolSource._rev = response.rev

  await db.put(toolSource)
  // TODO: Needs a proper type for the return
  ctx.body = {
    message: `Toolsource updated successfully`,
    toolSource
  }
  ctx.status = 200
}
