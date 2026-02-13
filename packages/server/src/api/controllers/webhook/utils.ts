import { db as dbCore } from "@budibase/backend-core"
import type { ChatConversation, Ctx } from "@budibase/types"

export const ensureProdWorkspaceWebhookRoute = ({
  ctx,
  instance,
  providerName,
}: {
  ctx: Ctx<any, any>
  instance: string
  providerName: string
}) => {
  const prodWorkspaceId = dbCore.getProdWorkspaceID(instance)
  if (instance !== prodWorkspaceId) {
    ctx.status = 400
    ctx.body = {
      error: `${providerName} webhook must target a production workspace ID`,
    }
    return
  }
  return prodWorkspaceId
}

const toSortTimestamp = (chat: ChatConversation): number => {
  const latest = chat.updatedAt || chat.createdAt
  if (!latest) return 0
  const parsed = new Date(latest).getTime()
  return Number.isFinite(parsed) ? parsed : 0
}

export const isConversationExpired = ({
  chat,
  idleTimeoutMs,
  nowMs = Date.now(),
}: {
  chat: ChatConversation
  idleTimeoutMs: number
  nowMs?: number
}) => {
  if (idleTimeoutMs <= 0) return false
  const lastActivity = toSortTimestamp(chat)
  if (!lastActivity) return false
  return nowMs - lastActivity > idleTimeoutMs
}

export const pickLatestConversation = <TScope>({
  chats,
  scope,
  idleTimeoutMs,
  matchesConversationScope,
  nowMs = Date.now(),
}: {
  chats: ChatConversation[]
  scope: TScope
  idleTimeoutMs: number
  matchesConversationScope: (args: {
    chat: ChatConversation
    scope: TScope
  }) => boolean
  nowMs?: number
}) =>
  chats
    .filter(
      chat =>
        matchesConversationScope({ chat, scope }) &&
        !isConversationExpired({ chat, idleTimeoutMs, nowMs })
    )
    .sort((a, b) => toSortTimestamp(b) - toSortTimestamp(a))[0]

export const touchConversationCache = ({
  cache,
  cacheKey,
  chatId,
  maxSize,
}: {
  cache: Map<string, string>
  cacheKey: string
  chatId: string
  maxSize: number
}) => {
  if (!chatId) {
    return
  }

  if (cache.has(cacheKey)) {
    cache.delete(cacheKey)
  }
  cache.set(cacheKey, chatId)

  while (cache.size > maxSize) {
    const firstKey = cache.keys().next().value
    if (!firstKey) {
      break
    }
    cache.delete(firstKey)
  }
}
