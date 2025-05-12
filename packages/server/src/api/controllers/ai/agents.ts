import { ai } from "@budibase/pro"
import * as tools from "../../../ai/tools"
import { context, docIds } from "@budibase/backend-core"
import {
  ChatAgentRequest,
  ChatAgentResponse,
  DocumentType,
  UserCtx,
  FetchAgentHistoryResponse,
  AgentChat,
} from "@budibase/types"

export async function agentChat(
  ctx: UserCtx<ChatAgentRequest, ChatAgentResponse>
) {
  const model = await ai.getLLMOrThrow()
  const chat = ctx.request.body

  const prompt = new ai.LLMRequest()
    .addSystemMessage(ai.agentSystemPrompt(ctx.user))
    .addMessages(chat.messages)
    .addTools(tools.budibase)
  const response = await model.chat(prompt)

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
