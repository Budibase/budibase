import { HTTPError, locks, redis } from "@budibase/backend-core"
import { LockName, LockType } from "@budibase/types"

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
  const { result } = await locks.doWithLock(
    {
      name: LockName.GEMINI_INGESTION_COOLDOWN,
      type: LockType.DEFAULT,
      systemLock: true,
      ttl: 10_000,
    },
    async () => {
      const existing = await client.get<number>(COOLDOWN_KEY)
      const deadline = Math.max(existing ?? 0, retryAt)
      const expirySeconds = Math.max(
        1,
        Math.ceil((deadline - Date.now()) / 1000)
      )
      await client.store(COOLDOWN_KEY, deadline, expirySeconds)
      return deadline
    }
  )
  return result
}
