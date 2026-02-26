import { createIoRedisState } from "@chat-adapter/state-ioredis"
import { createMemoryState } from "@chat-adapter/state-memory"
import { ConsoleLogger } from "chat"

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

  return createIoRedisState({
    url: redisUrl,
    keyPrefix: `${CHAT_SDK_KEY_PREFIX}:${provider}`,
    logger: new ConsoleLogger("silent"),
  })
}

export const discordState = createWebhookState("discord")
export const teamsState = createWebhookState("msteams")
