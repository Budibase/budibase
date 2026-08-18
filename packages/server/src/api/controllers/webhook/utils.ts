import { configs, context, db as dbCore } from "@budibase/backend-core"
import type { ChatConversation, Ctx } from "@budibase/types"

// Escalations created in builder preview live in the dev workspace, while a
// channel webhook resolves to the prod workspace. Rather than trust a
// user-supplied appId, find which environment of the trusted app actually holds
// the notification and record the response there. Returns the holding app id
// variant, or undefined if neither has it.
export const resolveEscalationWorkspaceId = async (
  workspaceId: string,
  notificationDocId: string
): Promise<string | undefined> => {
  const candidates = [
    dbCore.getProdWorkspaceID(workspaceId),
    dbCore.getDevWorkspaceID(workspaceId),
  ]
  for (const appId of candidates) {
    const exists = await context.doInContext(appId, async () => {
      const db = context.getWorkspaceDB()
      return !!(await db.tryGet(notificationDocId))
    })
    if (exists) {
      return appId
    }
  }
  return undefined
}

export const isAbsoluteUrl = (url: string) =>
  url.startsWith("http://") || url.startsWith("https://")

export const toAbsoluteUrl = async (url: string) => {
  if (isAbsoluteUrl(url)) {
    return url
  }

  if (!url.startsWith("/")) {
    return url
  }

  const platformUrl = await configs.getPlatformUrl({ tenantAware: true })
  return `${platformUrl.replace(/\/$/, "")}${url}`
}

export const ensureProdWorkspaceWebhookRoute = ({
  ctx,
  instance,
  providerName,
}: {
  ctx: Ctx<unknown, unknown>
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

export const touchBoundedCache = <TValue>({
  cache,
  cacheKey,
  value,
  maxSize,
}: {
  cache: Map<string, TValue>
  cacheKey: string
  value: TValue
  maxSize: number
}) => {
  if (cache.has(cacheKey)) {
    cache.delete(cacheKey)
  }
  cache.set(cacheKey, value)

  while (cache.size > maxSize) {
    const firstKey = cache.keys().next().value
    if (!firstKey) {
      break
    }
    cache.delete(firstKey)
  }
}

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

  touchBoundedCache({
    cache,
    cacheKey,
    value: chatId,
    maxSize,
  })
}

export interface TimedCacheEntry<TValue> {
  value: TValue
  lastAccessedAt: number
}

export const touchTimedCache = <TValue>({
  cache,
  cacheKey,
  value,
  maxSize,
  nowMs = Date.now(),
}: {
  cache: Map<string, TimedCacheEntry<TValue>>
  cacheKey: string
  value: TValue
  maxSize: number
  nowMs?: number
}) => {
  touchBoundedCache({
    cache,
    cacheKey,
    value: {
      value,
      lastAccessedAt: nowMs,
    },
    maxSize,
  })
}

export const evictExpiredTimedCache = <TValue>({
  cache,
  ttlMs,
  nowMs = Date.now(),
}: {
  cache: Map<string, TimedCacheEntry<TValue>>
  ttlMs: number
  nowMs?: number
}) => {
  if (ttlMs <= 0 || cache.size === 0) {
    return
  }

  for (const [cacheKey, entry] of cache.entries()) {
    if (nowMs - entry.lastAccessedAt > ttlMs) {
      cache.delete(cacheKey)
    }
  }
}
