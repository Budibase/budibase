import { redis } from "@budibase/backend-core"
import { AgentChannelProvider } from "@budibase/types"
import { createIoRedisState } from "@chat-adapter/state-ioredis"
import { createMemoryState } from "@chat-adapter/state-memory"
import { ConsoleLogger, type StateAdapter } from "chat"

const CHAT_SDK_KEY_PREFIX = "budibase:chat-sdk"
type IoRedisClient = Extract<
  Parameters<typeof createIoRedisState>[0],
  { client: unknown }
>["client"]

const isTestEnvironment = () => process.env.NODE_ENV === "test"

const stateByProvider: Partial<
  Record<AgentChannelProvider, Promise<StateAdapter>>
> = {}

const createWebhookState = async (
  provider: AgentChannelProvider
): Promise<StateAdapter> => {
  if (isTestEnvironment()) {
    return createMemoryState()
  }

  const redisUrl = process.env.REDIS_URL?.trim()
  if (!redisUrl) {
    return createMemoryState()
  }

  const cacheClient = await redis.clients.getCacheClient()
  const client = cacheClient.client as unknown as IoRedisClient

  return createIoRedisState({
    client,
    keyPrefix: `${CHAT_SDK_KEY_PREFIX}:${provider}`,
    logger: new ConsoleLogger("silent"),
  })
}

const getWebhookState = async (provider: AgentChannelProvider) => {
  if (!stateByProvider[provider]) {
    stateByProvider[provider] = createWebhookState(provider)
  }
  try {
    return await stateByProvider[provider]
  } catch (error) {
    delete stateByProvider[provider]
    throw error
  }
}

export const getDiscordState = () =>
  getWebhookState(AgentChannelProvider.DISCORD)
export const getTeamsState = () => getWebhookState(AgentChannelProvider.MSTEAMS)
export const getSlackState = () => getWebhookState(AgentChannelProvider.SLACK)
export const getTelegramState = () =>
  getWebhookState(AgentChannelProvider.TELEGRAM)
