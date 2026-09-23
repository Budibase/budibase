import { HTTPError, redis } from "@budibase/backend-core"

const DEFAULT_COOLDOWN_MS = 60_000
const COOLDOWN_KEY = "gemini:rag:cooldown"

export class GeminiRateLimitError extends HTTPError {
  readonly retryAt: number

  constructor({
    message = "Gemini ingestion is waiting for capacity",
    retryAt,
  }: {
    message?: string
    retryAt: number
  }) {
    super(message, 429)
    this.retryAt = retryAt
  }
}

export const getGeminiRetryAt = (retryAfter: string | null): number => {
  const now = Date.now()
  if (!retryAfter?.trim()) {
    return now + DEFAULT_COOLDOWN_MS
  }

  const seconds = Number(retryAfter)
  const delayMs = Number.isNaN(seconds)
    ? Date.parse(retryAfter) - now
    : seconds * 1000

  if (!Number.isFinite(delayMs) || delayMs < 0) {
    return now + DEFAULT_COOLDOWN_MS
  }

  return now + Math.max(1000, Math.ceil(delayMs))
}

export const throwIfGeminiIngestionCoolingDown = async () => {
  const client = await redis.clients.getCacheClient()
  const retryAt = await client.get<number>(COOLDOWN_KEY)
  if (retryAt && retryAt > Date.now()) {
    throw new GeminiRateLimitError({ retryAt })
  }
}

export const extendGeminiIngestionCooldown = async ({
  retryAt,
}: {
  retryAt: number
}): Promise<number> => {
  const client = await redis.clients.getCacheClient()
  const key = `${client.db}${redis.utils.SEPARATOR}${COOLDOWN_KEY}`
  const deadline = await client.client.eval(
    `
    local deadline = math.max(tonumber(redis.call("GET", KEYS[1])) or 0, tonumber(ARGV[1]))
    redis.call("PSETEX", KEYS[1], math.max(1, deadline - tonumber(ARGV[2])), deadline)
    return deadline
    `,
    1,
    key,
    retryAt,
    Date.now()
  )
  return Number(deadline)
}
