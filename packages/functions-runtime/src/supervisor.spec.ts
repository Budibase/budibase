import { FunctionErrorCode } from "@budibase/types"
import type {
  FunctionExecutionContext,
  FunctionExecutor,
  FunctionRunRequest,
  FunctionRunResult,
} from "@budibase/types"
import { LocalFunctionRunSupervisor } from "./supervisor"

const request: FunctionRunRequest = {
  runId: "run-fixture-1",
  artifact: {
    compiledJavaScript:
      "export default async function run() { return { output: {} } }",
    capabilityIds: ["capability-1"],
    sourceMap: "{}",
    sourceHash: "source-hash-fixture",
    declarationsHash: "declarations-hash-fixture",
    compiledAt: "2026-01-01T00:00:00.000Z",
  },
  inputs: { message: "hello" },
  limits: {
    maxInputBytes: 256 * 1024,
    maxInputDepth: 20,
    isolateMemoryLimitMb: 64,
    timeoutMs: 30_000,
    maxQueryCalls: 10,
    maxConcurrentQueryCalls: 2,
    maxQueryResponseBytes: 1024 * 1024,
    maxQueryResponseDepth: 30,
    maxOutputBytes: 1024 * 1024,
    maxOutputDepth: 30,
    maxLogEntries: 100,
    maxLogBytes: 64 * 1024,
    maxLogEntryBytes: 4 * 1024,
  },
}

const result: FunctionRunResult = {
  runId: request.runId,
  status: "success",
  output: { message: "hello" },
  metrics: {
    durationMs: 10,
    queryCount: 0,
    outputBytes: 19,
    logBytes: 11,
  },
}

const context: FunctionExecutionContext = {
  invokeCapability: async () => ({}),
}

const executor = (
  overrides: Partial<FunctionExecutor> = {}
): FunctionExecutor => ({
  health: jest.fn().mockResolvedValue({ healthy: true }),
  execute: jest.fn().mockResolvedValue(result),
  terminate: jest.fn().mockResolvedValue(undefined),
  ...overrides,
})

const stoppedResult: FunctionRunResult = {
  runId: result.runId,
  status: "stopped",
  metrics: {
    ...result.metrics,
    outputBytes: 0,
    logBytes: 0,
  },
}

describe("LocalFunctionRunSupervisor", () => {
  it("executes a run without adding cancellation to its context", async () => {
    const runExecutor = executor()
    const supervisor = new LocalFunctionRunSupervisor({ executor: runExecutor })

    expect(supervisor.isHealthy()).toBe(true)
    expect(supervisor.activeRunCount()).toBe(0)

    await expect(
      supervisor.execute({
        request,
        context,
      })
    ).resolves.toEqual(result)

    expect(runExecutor.execute).toHaveBeenCalledWith(request, context)
    expect(runExecutor.terminate).not.toHaveBeenCalled()
    expect(supervisor.activeRunCount()).toBe(0)
  })

  it("terminates an active run when its containing automation is cancelled", async () => {
    const abortController = new AbortController()
    let finishRun = (_result: FunctionRunResult) => {}
    const execution = new Promise<FunctionRunResult>(resolve => {
      finishRun = resolve
    })
    const terminate = jest.fn().mockImplementation(() => {
      finishRun(result)
      return Promise.resolve()
    })
    const supervisor = new LocalFunctionRunSupervisor({
      executor: executor({
        execute: jest.fn().mockReturnValue(execution),
        terminate,
      }),
    })

    const supervisedRun = supervisor.execute({
      request,
      context,
      signal: abortController.signal,
    })
    abortController.abort()

    await expect(supervisedRun).resolves.toEqual(stoppedResult)
    expect(terminate).toHaveBeenCalledTimes(1)
    expect(terminate).toHaveBeenCalledWith(request.runId)
  })

  it("starts and then terminates a run when cancellation was already requested", async () => {
    const abortController = new AbortController()
    abortController.abort()
    let finishRun = (_result: FunctionRunResult) => {}
    const execution = new Promise<FunctionRunResult>(resolve => {
      finishRun = resolve
    })
    const execute = jest.fn().mockReturnValue(execution)
    const terminate = jest.fn().mockImplementation(() => {
      finishRun(result)
      return Promise.resolve()
    })
    const supervisor = new LocalFunctionRunSupervisor({
      executor: executor({ execute, terminate }),
    })

    await expect(
      supervisor.execute({
        request,
        context,
        signal: abortController.signal,
      })
    ).resolves.toEqual(stoppedResult)

    expect(execute).toHaveBeenCalledTimes(1)
    expect(terminate).toHaveBeenCalledTimes(1)
  })

  it("reports active runs and terminates them during shutdown", async () => {
    let finishRun = (_result: FunctionRunResult) => {}
    const execution = new Promise<FunctionRunResult>(resolve => {
      finishRun = resolve
    })
    const terminate = jest.fn().mockImplementation(() => {
      finishRun(result)
      return Promise.resolve()
    })
    const supervisor = new LocalFunctionRunSupervisor({
      executor: executor({
        execute: jest.fn().mockReturnValue(execution),
        terminate,
      }),
    })

    const supervisedRun = supervisor.execute({ request, context })

    expect(supervisor.activeRunCount()).toBe(1)
    await expect(supervisor.shutdown()).resolves.toBeUndefined()
    await expect(supervisedRun).resolves.toEqual(stoppedResult)

    expect(supervisor.isHealthy()).toBe(false)
    expect(supervisor.activeRunCount()).toBe(0)
    expect(terminate).toHaveBeenCalledWith(request.runId)
    await expect(
      supervisor.execute({ request, context })
    ).resolves.toMatchObject({
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_ORCHESTRATOR_INTERRUPTED,
      },
    })
  })

  it("reports termination failures", async () => {
    const terminationError = new Error("termination failed")
    const log = jest.spyOn(console, "error").mockImplementation(() => {})
    const supervisor = new LocalFunctionRunSupervisor({
      executor: executor({
        terminate: jest.fn().mockRejectedValue(terminationError),
      }),
    })

    supervisor.terminate(request.runId)
    await Promise.resolve()

    expect(log).toHaveBeenCalledWith(
      `Failed to terminate function run ${request.runId}`,
      terminationError
    )
    log.mockRestore()
  })
})
