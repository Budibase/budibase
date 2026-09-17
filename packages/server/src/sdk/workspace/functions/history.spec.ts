const mockDbTryGet = jest.fn()
const mockDbPut = jest.fn()
const mockDbBulkDocs = jest.fn()
const mockQueryViewRaw = jest.fn()
const mockGetWorkspaceDB = jest.fn(() => ({
  tryGet: mockDbTryGet,
  put: mockDbPut,
  bulkDocs: mockDbBulkDocs,
}))

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getWorkspaceDB: (...args: Parameters<typeof mockGetWorkspaceDB>) =>
        mockGetWorkspaceDB(...args),
    },
    db: {
      ...actual.db,
      queryViewRaw: (...args: Parameters<typeof mockQueryViewRaw>) =>
        mockQueryViewRaw(...args),
    },
  }
})

import { context } from "@budibase/backend-core"
import { FunctionErrorCode, type FunctionRunSummary } from "@budibase/types"
import env from "../../../environment"
import { finalizeRunSummary, reconcileRunning } from "./history"

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
  const configuredErrorMessageLength =
    env.FUNCTIONS_LIMITS.service.maxRunSummaryErrorMessageLength
  const configuredRunTimeout = env.FUNCTIONS_LIMITS.run.timeoutMs

  beforeEach(() => {
    jest.clearAllMocks()
    mockDbPut.mockImplementation(async document => ({ doc: document }))
  })

  afterEach(() => {
    env.FUNCTIONS_LIMITS.service.maxRunSummaryErrorMessageLength =
      configuredErrorMessageLength
    env.FUNCTIONS_LIMITS.run.timeoutMs = configuredRunTimeout
    jest.useRealTimers()
  })

  it("sanitizes errors to the configured service message length", async () => {
    env.FUNCTIONS_LIMITS.service.maxRunSummaryErrorMessageLength = 8
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
  })

  it("uses the configured run timeout when reconciling running summaries", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-01-01T00:05:00.000Z"))
    env.FUNCTIONS_LIMITS.run.timeoutMs = 120_000
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
  })
})
