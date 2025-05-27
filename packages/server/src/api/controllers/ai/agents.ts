import { ai } from "@budibase/pro"
import * as tools from "../../../ai/tools"
import { context, docIds, events } from "@budibase/backend-core"
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
import { atlassianClient, githubClient } from "../../../ai/tools/mcp"
import { generateAgentChatID, generateAgentToolSourceID } from "@budibase/backend-core/src/docIds"

export async function agentChat(
  ctx: UserCtx<ChatAgentRequest, ChatAgentResponse>
) {
  const model = await ai.getLLMOrThrow()
  const chat = ctx.request.body

  // Initialize Atlassian client to fetch MCP tools dynamically
  const atlassianTools = await atlassianClient.fetchTools()
  const githubTools = await githubClient.fetchTools()

  const prompt = new ai.LLMRequest()
    .addSystemMessage(ai.agentSystemPrompt(ctx.user))
    .addMessages(chat.messages)
    .addTools(tools.budibase)
    .addTools([...atlassianTools, ...githubTools])
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

  const db = context.getGlobalDB()
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
  const db = context.getGlobalDB()
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
  // TODO: pull back all the tools for each tool source

  ctx.body = toolSources.rows.map(row => row.doc!)
}

export async function createToolSource(
  ctx: UserCtx<CreateToolSourceRequest, { created: true }>
) {
  const db = context.getAppDB()
  const toolSource = ctx.request.body
  toolSource._id = generateAgentToolSourceID()

  await db.put(toolSource)
  // TODO: handle PH events
  // await events.toolsource.created(toolSource)
  ctx.body = { created: true }
  ctx.status = 201
}

// export async function updateToolSource(ctx: UserCtx<void, void>) {
//   const db = context.getAppDB()
//   const history = await db.allDocs<AgentChat>(
//     docIds.getDocParams(DocumentType.AGENT_TOOL_SOURCE, undefined, {
//       include_docs: true,
//     })
//   )
//   ctx.body = history.rows.map(row => row.doc!)
// }
