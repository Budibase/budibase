import { createIORedisState } from "@chat-adapter/state-ioredis"
import { createMemoryState } from "@chat-adapter/state-memory"

const CHAT_SDK_KEY_PREFIX = "budibase:chat-sdk"

const isTestEnvironment = () => process.env.NODE_ENV === "test"

const resolveRedisUrl = () => {
  const value = process.env.REDIS_URL?.trim()
  return value?.length ? value : undefined
}

const createWebhookState = (provider: "discord" | "msteams") => {
  if (isTestEnvironment()) {
    return createMemoryState()
  }

  const redisUrl = resolveRedisUrl()
  if (!redisUrl) {
    return createMemoryState()
  }

  return createIORedisState({
    url: redisUrl,
    keyPrefix: `${CHAT_SDK_KEY_PREFIX}:${provider}`,
  })
}

export const discordState = createWebhookState("discord")
export const teamsState = createWebhookState("msteams")
