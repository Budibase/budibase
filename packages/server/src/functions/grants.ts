import { createHash, randomBytes, timingSafeEqual } from "node:crypto"
import { locks, redis, type RedisClient } from "@budibase/backend-core"
import type {
  FunctionExecutor,
  FunctionRunGrant,
  FunctionRunLimits,
  FunctionRunRequest,
} from "@budibase/types"
import { FunctionErrorCode, LockName, LockType } from "@budibase/types"
import { FunctionExecutionError } from "./errors"

const GRANT_EXPIRY_GRACE_MS = 5_000
const GRANT_LOCK_TTL_MS = 5_000

interface StoredFunctionRunGrant extends FunctionRunGrant {
  tokenHash: string
  activeQueryCalls: number
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

type FunctionQueryGrantStatus =
  | "allowed"
  | "denied"
  | "budget_exceeded"
  | "concurrency_exceeded"

export interface FunctionQueryGrantResult {
  status: FunctionQueryGrantStatus
  grant?: FunctionRunGrant
}

const withGrantLock = async <T>(runId: string, task: () => Promise<T>) => {
  const { result } = await locks.doWithLock(
    {
      name: LockName.FUNCTION_QUERY_GRANT,
      resource: runId,
      systemLock: true,
      type: LockType.DEFAULT,
      ttl: GRANT_LOCK_TTL_MS,
    },
    task
  )
  return result
}

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
  const storedGrant: StoredFunctionRunGrant = {
    ...grant,
    tokenHash: hashToken(grantToken),
    activeQueryCalls: 0,
  }
  const ttlSeconds = Math.ceil((expiresAt - Date.now()) / 1_000)

  const stored = await (
    await getClient(client)
  ).storeIfNotExists(scope.runId, storedGrant, ttlSeconds)
  if (!stored) {
    throw new FunctionExecutionError(FunctionErrorCode.FUNCTION_PROTOCOL_ERROR)
  }
  return { grant, grantToken }
}

export const getFunctionRunGrant = async (
  runId: string,
  grantToken: string,
  client?: RedisClient
): Promise<FunctionRunGrant | null> => {
  const storedGrant = await (
    await getClient(client)
  ).get<StoredFunctionRunGrant>(runId)
  if (
    !storedGrant ||
    storedGrant.expiresAt <= Date.now() ||
    !tokensMatch(grantToken, storedGrant.tokenHash)
  ) {
    return null
  }

  const {
    tokenHash: _tokenHash,
    activeQueryCalls: _activeQueryCalls,
    ...grant
  } = storedGrant
  return grant
}

export const consumeFunctionQueryGrant = async (
  runId: string,
  grantToken: string,
  capabilityId: string,
  parameterNames: string[],
  workspaceId?: string,
  client?: RedisClient
): Promise<FunctionQueryGrantResult> => {
  const redisClient = await getClient(client)
  return withGrantLock(runId, async () => {
    const storedGrant = await redisClient.get<StoredFunctionRunGrant>(runId)
    if (
      !storedGrant ||
      storedGrant.runId !== runId ||
      storedGrant.expiresAt <= Date.now() ||
      !tokensMatch(grantToken, storedGrant.tokenHash) ||
      (workspaceId && storedGrant.workspaceId !== workspaceId)
    ) {
      return { status: "denied" }
    }

    const capability = storedGrant.capabilities[capabilityId]
    if (
      !capability ||
      parameterNames.some(
        parameterName => !capability.parameterNames.includes(parameterName)
      )
    ) {
      return { status: "denied" }
    }
    if (storedGrant.remainingQueryCalls <= 0) {
      return { status: "budget_exceeded" }
    }
    if (
      storedGrant.activeQueryCalls >= storedGrant.limits.maxConcurrentQueryCalls
    ) {
      return { status: "concurrency_exceeded" }
    }

    const updatedGrant: StoredFunctionRunGrant = {
      ...storedGrant,
      remainingQueryCalls: storedGrant.remainingQueryCalls - 1,
      activeQueryCalls: storedGrant.activeQueryCalls + 1,
    }
    const ttlSeconds = await redisClient.getTTL(runId)
    if (ttlSeconds <= 0) {
      return { status: "denied" }
    }
    await redisClient.store(runId, updatedGrant, ttlSeconds)

    const {
      tokenHash: _tokenHash,
      activeQueryCalls: _activeQueryCalls,
      ...grant
    } = updatedGrant
    return {
      status: "allowed",
      grant,
    }
  })
}

export const releaseFunctionQueryGrant = async (
  runId: string,
  grantToken: string,
  client?: RedisClient
) => {
  const redisClient = await getClient(client)
  await withGrantLock(runId, async () => {
    const storedGrant = await redisClient.get<StoredFunctionRunGrant>(runId)
    if (
      !storedGrant ||
      storedGrant.runId !== runId ||
      !tokensMatch(grantToken, storedGrant.tokenHash)
    ) {
      return
    }
    const updatedGrant: StoredFunctionRunGrant = {
      ...storedGrant,
      activeQueryCalls: Math.max(storedGrant.activeQueryCalls - 1, 0),
    }
    const ttlSeconds = await redisClient.getTTL(runId)
    if (ttlSeconds <= 0) {
      return
    }
    await redisClient.store(runId, updatedGrant, ttlSeconds)
  })
}

export const deleteFunctionRunGrant = async (
  runId: string,
  client?: RedisClient
) => {
  await (await getClient(client)).delete(runId)
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
