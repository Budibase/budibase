import {
  context,
  db as dbCore,
  docIds,
  HTTPError,
} from "@budibase/backend-core"
import { automations } from "@budibase/pro"
import {
  DEFAULT_FUNCTION_LIMITS,
  FunctionErrorCode,
  type FunctionEnvironment,
  type FunctionRunResult,
  type FunctionRunSummary,
} from "@budibase/types"
import { z } from "zod"
import { FunctionExecutionError } from "../../../functions/errors"

const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100
const CLEANUP_LIMIT = 100
const MAX_ERROR_MESSAGE_LENGTH = 512
const ORPHAN_GRACE_MS = 60_000
const functionErrorCodes = new Set<FunctionErrorCode>(
  Object.values(FunctionErrorCode)
)

interface CreateRunSummaryInput {
  runId: string
  functionId: string
  functionName: string
  sourceHash: string
  automationId: string
  stepId: string
}

const runCursorSchema = z
  .object({
    startedAt: z.iso.datetime(),
    environment: z.enum(["development", "published"]),
    runId: z.string().min(1),
  })
  .strict()

const getEnvironment = (): FunctionEnvironment =>
  dbCore.isDevWorkspaceID(context.getWorkspaceId())
    ? "development"
    : "published"

const sanitizeError = (
  code: FunctionErrorCode
): FunctionRunSummary["error"] => {
  const safeCode = functionErrorCodes.has(code)
    ? code
    : FunctionErrorCode.FUNCTION_RUNTIME_ERROR
  return {
    code: safeCode,
    message: new FunctionExecutionError(safeCode).message.slice(
      0,
      MAX_ERROR_MESSAGE_LENGTH
    ),
  }
}

const sanitizeSummary = (summary: FunctionRunSummary): FunctionRunSummary => ({
  _id: summary._id,
  runId: summary.runId,
  functionId: summary.functionId,
  functionName: summary.functionName,
  sourceHash: summary.sourceHash,
  environment: summary.environment,
  status: summary.status,
  invocation: {
    type: "automation",
    automationId: summary.invocation.automationId,
    stepId: summary.invocation.stepId,
  },
  startedAt: summary.startedAt,
  ...(summary.finishedAt ? { finishedAt: summary.finishedAt } : {}),
  ...(summary.durationMs !== undefined
    ? { durationMs: summary.durationMs }
    : {}),
  queryCount: summary.queryCount,
  ...(summary.error ? { error: sanitizeError(summary.error.code) } : {}),
})

const getRunDocs = async (
  database: ReturnType<typeof context.getWorkspaceDB>
) => {
  const response = await database.allDocs<FunctionRunSummary>(
    docIds.getFunctionRunLogParams(null, { include_docs: true })
  )
  return response.rows
    .map(row => row.doc)
    .filter((doc): doc is FunctionRunSummary => !!doc)
}

export const createRunSummary = async ({
  runId,
  functionId,
  functionName,
  sourceHash,
  automationId,
  stepId,
}: CreateRunSummaryInput): Promise<FunctionRunSummary> => {
  const summary: FunctionRunSummary = {
    _id: docIds.generateFunctionRunLogID(runId),
    runId,
    functionId,
    functionName,
    sourceHash,
    environment: getEnvironment(),
    status: "running",
    invocation: {
      type: "automation",
      automationId,
      stepId,
    },
    startedAt: new Date().toISOString(),
    queryCount: 0,
  }
  const response = await context.getWorkspaceDB().put(summary, {
    returnDoc: true,
  })
  return sanitizeSummary(response.doc)
}

export const finalizeRunSummary = async (
  runId: string,
  result:
    | FunctionRunResult
    | {
        status: "error"
        code: FunctionErrorCode
      }
): Promise<FunctionRunSummary> => {
  const database = context.getWorkspaceDB()
  const id = docIds.generateFunctionRunLogID(runId)
  const summary = await database.tryGet<FunctionRunSummary>(id)
  if (!summary) {
    throw new FunctionExecutionError(FunctionErrorCode.FUNCTION_RUNTIME_ERROR)
  }
  if (summary.status !== "running") {
    return sanitizeSummary(summary)
  }

  const finishedAt = new Date().toISOString()
  const durationMs =
    "metrics" in result
      ? result.metrics.durationMs
      : Math.max(0, Date.parse(finishedAt) - Date.parse(summary.startedAt))
  let errorCode: FunctionErrorCode | undefined
  if (result.status === "error") {
    if ("error" in result && result.error) {
      errorCode = result.error.code
    } else if ("code" in result) {
      errorCode = result.code
    } else {
      errorCode = FunctionErrorCode.FUNCTION_RUNTIME_ERROR
    }
  } else if (result.status === "stopped" && result.error) {
    errorCode = result.error.code
  }
  const updated: FunctionRunSummary = {
    ...summary,
    status: result.status,
    finishedAt,
    durationMs,
    queryCount: "metrics" in result ? result.metrics.queryCount : 0,
    ...(errorCode ? { error: sanitizeError(errorCode) } : {}),
  }
  const response = await database.put(updated, { returnDoc: true })
  return sanitizeSummary(response.doc)
}

export const reconcileRunning = async (
  database: ReturnType<typeof context.getWorkspaceDB>
) => {
  const cutoff =
    Date.now() - DEFAULT_FUNCTION_LIMITS.run.timeoutMs - ORPHAN_GRACE_MS
  const running = (await getRunDocs(database)).filter(
    summary =>
      summary.status === "running" && Date.parse(summary.startedAt) <= cutoff
  )
  if (!running.length) {
    return
  }
  const finishedAt = new Date().toISOString()
  await database.bulkDocs(
    running.map(summary => ({
      ...summary,
      status: "error" as const,
      finishedAt,
      durationMs: Math.max(
        0,
        Date.parse(finishedAt) - Date.parse(summary.startedAt)
      ),
      queryCount: summary.queryCount || 0,
      error: sanitizeError(FunctionErrorCode.FUNCTION_ORCHESTRATOR_INTERRUPTED),
    }))
  )
}

export const clearOldHistory = async (
  database: ReturnType<typeof context.getWorkspaceDB>,
  oldestDate?: string
) => {
  try {
    const retentionDate = oldestDate || (await automations.logs.oldestLogDate())
    const expired = (await getRunDocs(database))
      .filter(summary => summary.startedAt < retentionDate)
      .sort((a, b) => a.startedAt.localeCompare(b.startedAt))
      .slice(0, CLEANUP_LIMIT)
    if (expired.length) {
      await database.bulkRemove(expired)
    }
  } catch (error) {
    console.log(
      `Failed to cleanup Function run history for database "${database.name}"`,
      error
    )
  }
}

const compareRunsNewestFirst = (
  a: Pick<FunctionRunSummary, "startedAt" | "environment" | "runId">,
  b: Pick<FunctionRunSummary, "startedAt" | "environment" | "runId">
) =>
  b.startedAt.localeCompare(a.startedAt) ||
  a.environment.localeCompare(b.environment) ||
  b.runId.localeCompare(a.runId)

const encodeCursor = (summary: FunctionRunSummary) =>
  Buffer.from(
    JSON.stringify({
      startedAt: summary.startedAt,
      environment: summary.environment,
      runId: summary.runId,
    })
  ).toString("base64url")

const invalidBookmark = () =>
  new HTTPError("Invalid Function run history bookmark.", 400)

const decodeCursor = (bookmark: string) => {
  let decoded: unknown
  try {
    decoded = JSON.parse(Buffer.from(bookmark, "base64url").toString("utf8"))
  } catch {
    throw invalidBookmark()
  }

  const result = runCursorSchema.safeParse(decoded)
  if (!result.success) {
    throw invalidBookmark()
  }
  return result.data
}

export const listRunHistory = async (
  functionId: string,
  bookmark?: string,
  requestedLimit = DEFAULT_PAGE_SIZE
) => {
  const limit = Math.min(Math.max(1, requestedLimit), MAX_PAGE_SIZE)
  const databases = [context.getDevWorkspaceDB(), context.getProdWorkspaceDB()]
  await Promise.all(
    databases.map(async database => {
      await reconcileRunning(database)
      await clearOldHistory(database)
    })
  )
  const histories = await Promise.all(databases.map(getRunDocs))
  const cursor = bookmark ? decodeCursor(bookmark) : undefined
  const runs = histories
    .flat()
    .filter(summary => summary.functionId === functionId)
    .map(sanitizeSummary)
    .sort(compareRunsNewestFirst)
    .filter(summary => !cursor || compareRunsNewestFirst(summary, cursor) > 0)
    .slice(0, limit + 1)
  const hasMore = runs.length > limit
  if (hasMore) {
    runs.pop()
  }
  return {
    runs,
    hasMore,
    ...(hasMore && runs.length
      ? { nextBookmark: encodeCursor(runs[runs.length - 1]) }
      : {}),
  }
}

export const getRunHistory = async (
  functionId: string,
  runId: string
): Promise<FunctionRunSummary | undefined> => {
  const databases = [context.getDevWorkspaceDB(), context.getProdWorkspaceDB()]
  await Promise.all(
    databases.map(async database => {
      await reconcileRunning(database)
      await clearOldHistory(database)
    })
  )
  const id = docIds.generateFunctionRunLogID(runId)
  const summaries = await Promise.all(
    databases.map(database => database.tryGet<FunctionRunSummary>(id))
  )
  const summary = summaries.find(item => item?.functionId === functionId)
  return summary ? sanitizeSummary(summary) : undefined
}
