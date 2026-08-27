import type {
  FunctionExecutionContext,
  FunctionExecutor,
  FunctionRunResult,
} from "@budibase/types"
import { FunctionRunSupervisor } from "./supervisor"
import {
  FUNCTION_RUN_REQUEST_FIXTURE,
  FUNCTION_RUN_RESULT_FIXTURE,
} from "./testFixtures"

const context: FunctionExecutionContext = {
  invokeCapability: async () => ({}),
}

const executor = (
  overrides: Partial<FunctionExecutor> = {}
): FunctionExecutor => ({
  health: jest.fn().mockResolvedValue({ healthy: true }),
  execute: jest.fn().mockResolvedValue(FUNCTION_RUN_RESULT_FIXTURE),
  terminate: jest.fn().mockResolvedValue(undefined),
  ...overrides,
})

const stoppedResult: FunctionRunResult = {
  runId: FUNCTION_RUN_RESULT_FIXTURE.runId,
  status: "stopped",
  metrics: {
    ...FUNCTION_RUN_RESULT_FIXTURE.metrics,
    outputBytes: 0,
    logBytes: 0,
  },
}

describe("FunctionRunSupervisor", () => {
  it("executes a run without adding cancellation to its context", async () => {
    const runExecutor = executor()
    const supervisor = new FunctionRunSupervisor({ executor: runExecutor })

    await expect(
      supervisor.execute({
        request: FUNCTION_RUN_REQUEST_FIXTURE,
        context,
      })
    ).resolves.toEqual(FUNCTION_RUN_RESULT_FIXTURE)

    expect(runExecutor.execute).toHaveBeenCalledWith(
      FUNCTION_RUN_REQUEST_FIXTURE,
      context
    )
    expect(runExecutor.terminate).not.toHaveBeenCalled()
  })

  it("terminates an active run when its containing automation is cancelled", async () => {
    const abortController = new AbortController()
    let finishRun = (_result: FunctionRunResult) => {}
    const execution = new Promise<FunctionRunResult>(resolve => {
      finishRun = resolve
    })
    const terminate = jest.fn().mockImplementation(async () => {
      finishRun(FUNCTION_RUN_RESULT_FIXTURE)
    })
    const supervisor = new FunctionRunSupervisor({
      executor: executor({
        execute: jest.fn().mockReturnValue(execution),
        terminate,
      }),
    })

    const result = supervisor.execute({
      request: FUNCTION_RUN_REQUEST_FIXTURE,
      context,
      signal: abortController.signal,
    })
    abortController.abort()

    await expect(result).resolves.toEqual(stoppedResult)
    expect(terminate).toHaveBeenCalledTimes(1)
    expect(terminate).toHaveBeenCalledWith(FUNCTION_RUN_REQUEST_FIXTURE.runId)
  })

  it("starts and then terminates a run when cancellation was already requested", async () => {
    const abortController = new AbortController()
    abortController.abort()
    let finishRun = (_result: FunctionRunResult) => {}
    const execution = new Promise<FunctionRunResult>(resolve => {
      finishRun = resolve
    })
    const execute = jest.fn().mockReturnValue(execution)
    const terminate = jest.fn().mockImplementation(async () => {
      finishRun(FUNCTION_RUN_RESULT_FIXTURE)
    })
    const supervisor = new FunctionRunSupervisor({
      executor: executor({ execute, terminate }),
    })

    await expect(
      supervisor.execute({
        request: FUNCTION_RUN_REQUEST_FIXTURE,
        context,
        signal: abortController.signal,
      })
    ).resolves.toEqual(stoppedResult)

    expect(execute).toHaveBeenCalledTimes(1)
    expect(terminate).toHaveBeenCalledTimes(1)
  })
})
