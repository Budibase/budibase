import {
  type ChatConversation,
  DocumentType,
  type GetWorkspaceHomeChatsResponse,
  type GetWorkspaceHomeMetricsResponse,
  type UserCtx,
} from "@budibase/types"

import { getWorkspaceHomeMetrics } from "../../services/workspaceHome/metrics"
import { context, docIds, HTTPError } from "@budibase/backend-core"
import sdk from "../../sdk"

export async function metrics(
  ctx: UserCtx<void, GetWorkspaceHomeMetricsResponse>
) {
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    ctx.throw(400, "Missing workspace context")
  }

  ctx.body = await getWorkspaceHomeMetrics(workspaceId)
}

const getGlobalUserId = (ctx: UserCtx) => {
  const userId = ctx.user?.globalId || ctx.user?.userId || ctx.user?._id
  if (!userId) {
    throw new HTTPError("userId is required", 400)
  }
  return userId
}

export async function chats(ctx: UserCtx<void, GetWorkspaceHomeChatsResponse>) {
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    ctx.throw(400, "Missing workspace context")
  }

  const chatApp = await sdk.ai.chatApps.getSingle()
  if (!chatApp?._id) {
    ctx.body = { chats: [] }
    return
  }

  const userId = getGlobalUserId(ctx)
  const db = context.getWorkspaceDB()
  const allChats = await db.allDocs<ChatConversation>(
    docIds.getDocParams(DocumentType.CHAT_CONVERSATION, undefined, {
      include_docs: true,
    })
  )

  const chats = allChats.rows
    .map(row => row.doc)
    .filter(
      (chat): chat is ChatConversation =>
        !!chat &&
        chat.chatAppId === chatApp._id &&
        (!chat.userId || chat.userId === userId)
    )
    .sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime()
      const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime()
      return timeB - timeA
    })
    .map(chat => ({
      _id: chat._id!,
      chatAppId: chat.chatAppId,
      agentId: chat.agentId,
      title: chat.title,
      createdAt: chat.createdAt == null ? undefined : String(chat.createdAt),
      updatedAt: chat.updatedAt == null ? undefined : String(chat.updatedAt),
    }))

  ctx.body = { chats }
}
