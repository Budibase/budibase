import { createHash, randomBytes, timingSafeEqual } from "node:crypto"
import { redis, type RedisClient } from "@budibase/backend-core"
import type {
  FunctionExecutor,
  FunctionRunGrant,
  FunctionRunLimits,
  FunctionRunRequest,
} from "@budibase/types"
import { FunctionErrorCode } from "@budibase/types"
import { FunctionExecutionError } from "./errors"

const GRANT_EXPIRY_GRACE_MS = 5_000

interface StoredFunctionRunGrant
  extends Omit<FunctionRunGrant, "remainingQueryCalls"> {
  tokenHash: string
}

export type FunctionRunGrantScope = Omit<
  FunctionRunGrant,
  "remainingQueryCalls" | "limits" | "expiresAt"
>

export interface CreatedFunctionRunGrant {
  grant: FunctionRunGrant
  grantToken: string
}

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex")

const tokensMatch = (actual: string, expected: string) => {
  const encoder = new TextEncoder()
  const actualHash = encoder.encode(hashToken(actual))
  const expectedHash = encoder.encode(expected)
  return (
    actualHash.byteLength === expectedHash.byteLength &&
    timingSafeEqual(actualHash, expectedHash)
  )
}

const getClient = async (client?: RedisClient) =>
  client || (await redis.clients.getFunctionRunGrantClient())

const getQueryCallCountKey = (runId: string) => `${runId}:query-call-count`

export const createFunctionRunGrant = async (
  scope: FunctionRunGrantScope,
  limits: FunctionRunLimits,
  client?: RedisClient
): Promise<CreatedFunctionRunGrant> => {
  const grantToken = randomBytes(32).toString("base64url")
  const expiresAt = Date.now() + limits.timeoutMs + GRANT_EXPIRY_GRACE_MS
  const grant: FunctionRunGrant = {
    ...scope,
    remainingQueryCalls: limits.maxQueryCalls,
    limits,
    expiresAt,
  }
  const { remainingQueryCalls: _remainingQueryCalls, ...persistedGrant } = grant
  const storedGrant: StoredFunctionRunGrant = {
    ...persistedGrant,
    tokenHash: hashToken(grantToken),
  }
  const ttlSeconds = Math.ceil((expiresAt - Date.now()) / 1_000)
  const redisClient = await getClient(client)

  const stored = await redisClient.storeIfNotExists(
    scope.runId,
    storedGrant,
    ttlSeconds
  )
  if (!stored) {
    throw new FunctionExecutionError(FunctionErrorCode.FUNCTION_PROTOCOL_ERROR)
  }
  try {
    const counterStored = await redisClient.storeIfNotExists(
      getQueryCallCountKey(scope.runId),
      0,
      ttlSeconds
    )
    if (!counterStored) {
      throw new FunctionExecutionError(
        FunctionErrorCode.FUNCTION_PROTOCOL_ERROR
      )
    }
  } catch (error) {
    try {
      await redisClient.delete(scope.runId)
    } catch {
      // The grant retains its short TTL if rollback fails.
    }
    throw error
  }
  return { grant, grantToken }
}

export const getFunctionRunGrant = async (
  runId: string,
  grantToken: string,
  client?: RedisClient
): Promise<FunctionRunGrant | null> => {
  const redisClient = await getClient(client)
  const storedGrant = await redisClient.get<StoredFunctionRunGrant>(runId)
  if (
    !storedGrant ||
    storedGrant.expiresAt <= Date.now() ||
    !tokensMatch(grantToken, storedGrant.tokenHash)
  ) {
    return null
  }

  const queryCallCount = await redisClient.increment(
    getQueryCallCountKey(runId)
  )
  if (queryCallCount > storedGrant.limits.maxQueryCalls) {
    return null
  }

  const { tokenHash: _tokenHash, ...grant } = storedGrant
  return {
    ...grant,
    remainingQueryCalls: grant.limits.maxQueryCalls - queryCallCount,
  }
}

export const deleteFunctionRunGrant = async (
  runId: string,
  client?: RedisClient
) => {
  const redisClient = await getClient(client)
  await Promise.all([
    redisClient.delete(runId),
    redisClient.delete(getQueryCallCountKey(runId)),
  ])
}

export const executeWithFunctionRunGrant = async (
  executor: Pick<FunctionExecutor, "execute">,
  request: Omit<FunctionRunRequest, "grantToken">,
  scope: FunctionRunGrantScope,
  client?: RedisClient
) => {
  if (
    request.runId !== scope.runId ||
    request.artifact.sourceHash !== scope.sourceHash
  ) {
    throw new FunctionExecutionError(FunctionErrorCode.FUNCTION_PROTOCOL_ERROR)
  }

  const { grantToken } = await createFunctionRunGrant(
    scope,
    request.limits,
    client
  )
  try {
    return await executor.execute({
      ...request,
      grantToken,
    })
  } finally {
    try {
      await deleteFunctionRunGrant(scope.runId, client)
    } catch {
      console.log(
        `Function run grant cleanup failed for run ${scope.runId}; awaiting TTL expiry`
      )
    }
  }
}
