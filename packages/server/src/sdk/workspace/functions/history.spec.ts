const mockDbTryGet = jest.fn()
const mockDbPut = jest.fn()
const mockDbBulkDocs = jest.fn()
const mockQueryViewRaw = jest.fn()
const mockOldestLogDate = jest.fn()
const mockGetWorkspaceDB = jest.fn(() => ({
  tryGet: mockDbTryGet,
  put: mockDbPut,
  bulkDocs: mockDbBulkDocs,
}))
const mockGetDevWorkspaceDB = jest.fn(() => ({
  name: "development",
  tryGet: mockDbTryGet,
}))
const mockGetProdWorkspaceDB = jest.fn(() => ({
  name: "published",
  tryGet: mockDbTryGet,
}))

jest.mock("@budibase/pro", () => ({
  automations: {
    logs: {
      oldestLogDate: (...args: Parameters<typeof mockOldestLogDate>) =>
        mockOldestLogDate(...args),
    },
  },
}))

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getWorkspaceDB: (...args: Parameters<typeof mockGetWorkspaceDB>) =>
        mockGetWorkspaceDB(...args),
      getDevWorkspaceDB: (...args: Parameters<typeof mockGetDevWorkspaceDB>) =>
        mockGetDevWorkspaceDB(...args),
      getProdWorkspaceDB: (
        ...args: Parameters<typeof mockGetProdWorkspaceDB>
      ) => mockGetProdWorkspaceDB(...args),
    },
    db: {
      ...actual.db,
      queryViewRaw: (...args: Parameters<typeof mockQueryViewRaw>) =>
        mockQueryViewRaw(...args),
    },
  }
})

import { context, db as dbCore } from "@budibase/backend-core"
import { FunctionErrorCode, type FunctionRunSummary } from "@budibase/types"
import env, { withEnv } from "../../../environment"
import {
  finalizeRunSummary,
  getRunHistory,
  listRunHistory,
  reconcileRunning,
} from "./history"

const runningSummary: FunctionRunSummary = {
  _id: "function_run_log_test-run",
  runId: "test-run",
  functionId: "function-1",
  functionName: "Test Function",
  sourceHash: "source-hash",
  environment: "development",
  status: "running",
  invocation: {
    type: "automation",
    automationId: "automation-1",
    automationStepId: "step-1",
  },
  startedAt: "2026-01-01T00:00:00.000Z",
  queryCount: 0,
}

describe("Function run history", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDbPut.mockImplementation(async document => ({ doc: document }))
    mockOldestLogDate.mockResolvedValue("2026-01-02T00:00:00.000Z")
    mockQueryViewRaw.mockResolvedValue({ rows: [] })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("sanitizes errors to the configured service message length", async () => {
    await withEnv(
      {
        FUNCTIONS_LIMITS: {
          ...env.FUNCTIONS_LIMITS,
          service: {
            ...env.FUNCTIONS_LIMITS.service,
            maxRunSummaryErrorMessageLength: 8,
          },
        },
      },
      async () => {
        mockDbTryGet.mockResolvedValue(runningSummary)

        const result = await finalizeRunSummary("test-run", {
          status: "error",
          code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
        })

        expect(result.error).toEqual({
          code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
          message: "Function",
        })
        expect(mockDbPut).toHaveBeenCalledWith(
          expect.objectContaining({ error: result.error }),
          { returnDoc: true }
        )
      }
    )
  })

  it("uses the configured run timeout when reconciling running summaries", async () => {
    await withEnv(
      {
        FUNCTIONS_LIMITS: {
          ...env.FUNCTIONS_LIMITS,
          run: {
            ...env.FUNCTIONS_LIMITS.run,
            timeoutMs: 120_000,
          },
        },
      },
      async () => {
        jest.useFakeTimers().setSystemTime(new Date("2026-01-01T00:05:00.000Z"))
        mockQueryViewRaw.mockResolvedValue({ rows: [] })

        await reconcileRunning(context.getWorkspaceDB())

        expect(mockQueryViewRaw).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            endkey: "2026-01-01T00:02:00.000Z",
          }),
          expect.anything(),
          expect.any(Function)
        )
      }
    )
  })

  it("bounds list queries by retention even when cleanup finds no expired runs", async () => {
    const result = await listRunHistory({ functionId: "function-1" })

    expect(result).toEqual({ runs: [], hasMore: false })
    expect(mockOldestLogDate).toHaveBeenCalledTimes(1)
    expect(mockQueryViewRaw).toHaveBeenCalledWith(
      dbCore.ViewName.FUNCTION_RUNS_BY_FUNCTION,
      expect.objectContaining({
        endkey: ["function-1", "2026-01-02T00:00:00.000Z"],
      }),
      expect.anything(),
      expect.any(Function)
    )
  })

  it("hides expired detail records that remain after cleanup", async () => {
    mockDbTryGet.mockResolvedValue(runningSummary)

    const result = await getRunHistory({
      functionId: "function-1",
      runId: "test-run",
    })

    expect(result).toBeUndefined()
    expect(mockOldestLogDate).toHaveBeenCalledTimes(1)
  })
})
