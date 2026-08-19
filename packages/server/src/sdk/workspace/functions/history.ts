import {
  context,
  db as dbCore,
  docIds,
  HTTPError,
} from "@budibase/backend-core"
import { automations } from "@budibase/pro"
import {
  DEFAULT_FUNCTION_LIMITS,
  DocumentType,
  FunctionErrorCode,
  SEPARATOR,
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
const FUNCTION_RUN_PREFIX = `${DocumentType.FUNCTION_RUN_LOG}${SEPARATOR}`
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
    runId: z.string().min(1),
  })
  .strict()

const conflictErrorSchema = z.object({ status: z.literal(409) }).passthrough()

type WorkspaceDatabase = ReturnType<typeof context.getWorkspaceDB>

const buildRunsByFunctionView = () => `function(doc) {
  if (
    doc._id &&
    doc._id.startsWith("${FUNCTION_RUN_PREFIX}") &&
    doc.functionId &&
    doc.startedAt &&
    doc.runId
  ) {
    emit([doc.functionId, doc.startedAt, doc.runId], null)
  }
}`

const buildRunsByStartedAtView = () => `function(doc) {
  if (
    doc._id &&
    doc._id.startsWith("${FUNCTION_RUN_PREFIX}") &&
    doc.status !== "running" &&
    doc.startedAt
  ) {
    emit(doc.startedAt, null)
  }
}`

const buildRunningRunsByStartedAtView = () => `function(doc) {
  if (
    doc._id &&
    doc._id.startsWith("${FUNCTION_RUN_PREFIX}") &&
    doc.status === "running" &&
    doc.startedAt
  ) {
    emit(doc.startedAt, null)
  }
}`

const queryRunView = async ({
  database,
  viewName,
  buildView,
  params,
}: {
  database: WorkspaceDatabase
  viewName: dbCore.ViewName
  buildView: () => string
  params: Parameters<WorkspaceDatabase["query"]>[1]
}): Promise<FunctionRunSummary[]> => {
  const createView = async () => {
    await dbCore.createView(database, buildView(), viewName)
  }
  const response = await dbCore.queryViewRaw<FunctionRunSummary>(
    viewName,
    params,
    database,
    createView
  )
  return response.rows.flatMap(row => (row.doc ? [row.doc] : []))
}

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
  const database = context.getWorkspaceDB()
  const response = await database.put(summary, {
    returnDoc: true,
  })
  void clearOldHistory(database)
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
  for (let attempt = 0; attempt < 3; attempt++) {
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
    try {
      const response = await database.put(updated, { returnDoc: true })
      return sanitizeSummary(response.doc)
    } catch (error) {
      if (conflictErrorSchema.safeParse(error).success && attempt < 2) {
        continue
      }
      throw error
    }
  }
  throw new FunctionExecutionError(FunctionErrorCode.FUNCTION_RUNTIME_ERROR)
}

export const reconcileRunning = async (database: WorkspaceDatabase) => {
  const cutoff =
    Date.now() - DEFAULT_FUNCTION_LIMITS.run.timeoutMs - ORPHAN_GRACE_MS
  const running = await queryRunView({
    database,
    viewName: dbCore.ViewName.RUNNING_FUNCTION_RUNS_BY_STARTED_AT,
    buildView: buildRunningRunsByStartedAtView,
    params: {
      include_docs: true,
      endkey: new Date(cutoff).toISOString(),
      limit: CLEANUP_LIMIT,
    },
  })
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
  database: WorkspaceDatabase,
  oldestDate?: string
) => {
  try {
    await reconcileRunning(database)
    const retentionDate = oldestDate || (await automations.logs.oldestLogDate())
    const expired = (
      await queryRunView({
        database,
        viewName: dbCore.ViewName.COMPLETED_FUNCTION_RUNS_BY_STARTED_AT,
        buildView: buildRunsByStartedAtView,
        params: {
          include_docs: true,
          endkey: retentionDate,
          limit: CLEANUP_LIMIT,
        },
      })
    ).filter(summary => summary.startedAt < retentionDate)
    if (expired.length) {
      await database.bulkRemove(expired)
    }
  } catch (error) {
    console.error(
      `Failed to cleanup Function run history for database "${database.name}"`,
      error
    )
  }
}

const compareRunsNewestFirst = (
  a: Pick<FunctionRunSummary, "startedAt" | "runId">,
  b: Pick<FunctionRunSummary, "startedAt" | "runId">
) => b.startedAt.localeCompare(a.startedAt) || b.runId.localeCompare(a.runId)

const encodeCursor = (summary: FunctionRunSummary) =>
  Buffer.from(
    JSON.stringify({
      startedAt: summary.startedAt,
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

const getRunHistoryDatabase = (environment: FunctionEnvironment) =>
  environment === "development"
    ? context.getDevWorkspaceDB()
    : context.getProdWorkspaceDB()

export const listRunHistory = async ({
  functionId,
  environment,
  bookmark,
  requestedLimit = DEFAULT_PAGE_SIZE,
}: {
  functionId: string
  environment: FunctionEnvironment
  bookmark?: string
  requestedLimit?: number
}) => {
  const limit = Math.min(Math.max(1, requestedLimit), MAX_PAGE_SIZE)
  const database = getRunHistoryDatabase(environment)
  await clearOldHistory(database)
  const cursor = bookmark ? decodeCursor(bookmark) : undefined
  const runs = (
    await queryRunView({
      database,
      viewName: dbCore.ViewName.FUNCTION_RUNS_BY_FUNCTION,
      buildView: buildRunsByFunctionView,
      params: {
        include_docs: true,
        descending: true,
        startkey: [functionId, cursor?.startedAt || {}, cursor?.runId || {}],
        endkey: [functionId],
        limit: limit + 2,
      },
    })
  )
    .filter(summary => !cursor || compareRunsNewestFirst(summary, cursor) > 0)
    .map(sanitizeSummary)
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

export const getRunHistory = async ({
  functionId,
  environment,
  runId,
}: {
  functionId: string
  environment: FunctionEnvironment
  runId: string
}): Promise<FunctionRunSummary | undefined> => {
  const database = getRunHistoryDatabase(environment)
  await clearOldHistory(database)
  const id = docIds.generateFunctionRunLogID(runId)
  const summary = await database.tryGet<FunctionRunSummary>(id)
  if (summary?.functionId !== functionId) {
    return undefined
  }
  return sanitizeSummary(summary)
}
