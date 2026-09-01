import {
  FunctionErrorCode,
  type ExecuteFunctionStepInputs,
  type FunctionDocument,
  type FunctionRunResult,
} from "@budibase/types"
import {
  executeFunction,
  type ExecuteFunctionDependencies,
} from "../../steps/executeFunction"

const artifact = {
  compiledJavaScript: "export default async function run() {}",
  capabilityIds: ["capability-1"],
  sourceHash: "source-hash",
  declarationsHash: "declarations-hash",
  compiledAt: "2026-01-01T00:00:00.000Z",
}

const fn: FunctionDocument = {
  _id: "fn_test",
  name: "Test Function",
  appId: "app_dev_test",
  source: "export default async function run() {}",
  capabilities: [
    {
      capabilityId: "capability-1",
      queryId: "query-1",
      datasourceAlias: "Data",
      queryAlias: "find",
      parameterNames: ["id"],
    },
  ],
  artifact,
  lastBuild: {
    status: "success",
    sourceHash: artifact.sourceHash,
    declarationsHash: artifact.declarationsHash,
    attemptedAt: artifact.compiledAt,
  },
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
}

const successResult: FunctionRunResult = {
  runId: "run-1",
  status: "success",
  output: { answer: 42 },
  metrics: {
    durationMs: 10,
    queryCount: 1,
    outputBytes: 13,
    logBytes: 0,
  },
}

const dependencies = (
  overrides: Partial<ExecuteFunctionDependencies> = {}
): ExecuteFunctionDependencies => ({
  orchestrate: jest.fn().mockResolvedValue(successResult),
  functionsEnabled: jest.fn().mockResolvedValue(true),
  getFunction: jest.fn().mockResolvedValue(fn),
  getReadiness: jest.fn().mockResolvedValue("ready"),
  createRunSummary: jest.fn().mockResolvedValue(undefined),
  finalizeRunSummary: jest.fn().mockResolvedValue(undefined),
  createRunId: jest.fn().mockReturnValue("run-1"),
  ...overrides,
})

const run = (
  deps: ExecuteFunctionDependencies,
  inputs: ExecuteFunctionStepInputs = {
    functionId: fn._id,
    inputs: { name: "Ada" },
  },
  options: {
    automationId?: string
    stepId?: string
    signal?: AbortSignal
  } = {}
) =>
  executeFunction(
    {
      inputs,
      appId: fn.appId,
      automationId: options.automationId ?? "automation-1",
      stepId: options.stepId ?? "step-1",
      context: {
        user: { _id: "user-1" },
      },
      signal: options.signal,
    },
    deps
  )

describe("Run Function automation action", () => {
  it("executes a ready Function through the run orchestrator", async () => {
    const deps = dependencies()

    await expect(run(deps)).resolves.toEqual({
      success: true,
      status: "success",
      output: { answer: 42 },
    })
    expect(deps.orchestrate).toHaveBeenCalledWith({
      request: {
        runId: "run-1",
        artifact,
        inputs: { name: "Ada" },
        limits: expect.any(Object),
      },
      capabilityScope: expect.objectContaining({
        runId: "run-1",
        workspaceId: fn.appId,
        functionId: fn._id,
        sourceHash: artifact.sourceHash,
        invocation: {
          type: "automation",
          automationId: "automation-1",
          automationStepId: "step-1",
        },
        capabilities: fn.capabilities,
      }),
      signal: undefined,
    })
    expect(deps.createRunSummary).toHaveBeenCalledWith({
      runId: "run-1",
      functionId: fn._id,
      functionName: fn.name,
      sourceHash: artifact.sourceHash,
      automationId: "automation-1",
      stepId: "step-1",
    })
    expect(deps.finalizeRunSummary).toHaveBeenCalledWith("run-1", successResult)
  })

  it("passes plain JSON input through to the run orchestrator", async () => {
    const deps = dependencies()

    await run(deps, {
      functionId: fn._id,
      inputs: { bound: "value" },
    })

    expect(deps.orchestrate).toHaveBeenCalledWith(
      expect.objectContaining({
        request: expect.objectContaining({ inputs: { bound: "value" } }),
      })
    )
  })

  it("preserves a real input object with a value property", async () => {
    const deps = dependencies()

    await run(deps, {
      functionId: fn._id,
      inputs: { value: "not-json" },
    })

    expect(deps.orchestrate).toHaveBeenCalledWith(
      expect.objectContaining({
        request: expect.objectContaining({ inputs: { value: "not-json" } }),
      })
    )
  })

  it.each([
    [
      "disabled",
      { functionsEnabled: jest.fn().mockResolvedValue(false) },
      FunctionErrorCode.FUNCTIONS_DISABLED,
    ],
    [
      "missing",
      { getFunction: jest.fn().mockResolvedValue(undefined) },
      FunctionErrorCode.FUNCTION_BUILD_REQUIRED,
    ],
    [
      "build required",
      { getReadiness: jest.fn().mockResolvedValue("build_required") },
      FunctionErrorCode.FUNCTION_BUILD_REQUIRED,
    ],
    [
      "build failed",
      { getReadiness: jest.fn().mockResolvedValue("build_failed") },
      FunctionErrorCode.FUNCTION_BUILD_FAILED,
    ],
  ])(
    "returns a stable error when the Function is %s",
    async (_name, overrides, code) => {
      const deps = dependencies(overrides)

      await expect(run(deps)).resolves.toMatchObject({
        success: false,
        status: "error",
        error: { code },
      })
      expect(deps.orchestrate).not.toHaveBeenCalled()
    }
  )

  it("returns a deterministic configuration error", async () => {
    const deps = dependencies()

    await expect(run(deps, { functionId: "", inputs: {} })).resolves.toEqual({
      success: false,
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_CONFIGURATION_ERROR,
        message:
          "The Function automation step is missing required configuration",
      },
    })
  })

  it("passes stable executor failures to the automation", async () => {
    const deps = dependencies({
      orchestrate: jest.fn().mockResolvedValue({
        ...successResult,
        status: "error",
        output: undefined,
        error: {
          code: FunctionErrorCode.FUNCTION_EXECUTOR_BUSY,
          message: "Function executor is busy",
        },
      }),
    })

    await expect(run(deps)).resolves.toMatchObject({
      success: false,
      status: "error",
      error: { code: FunctionErrorCode.FUNCTION_EXECUTOR_BUSY },
    })
  })

  it("returns stopped as a successful terminal step status", async () => {
    const deps = dependencies({
      orchestrate: jest.fn().mockResolvedValue({
        ...successResult,
        status: "stopped",
        output: undefined,
      }),
    })

    await expect(run(deps)).resolves.toEqual({
      success: true,
      status: "stopped",
    })
  })

  it("passes cancellation through to the run orchestrator", async () => {
    const outerController = new AbortController()
    let receivedSignal: AbortSignal | undefined
    const deps = dependencies({
      orchestrate: jest.fn().mockImplementation(async execution => {
        receivedSignal = execution.signal
        outerController.abort()
        return { ...successResult, status: "stopped", output: undefined }
      }),
    })

    await expect(
      run(deps, undefined, { signal: outerController.signal })
    ).resolves.toEqual({ success: true, status: "stopped" })
    expect(receivedSignal).toBe(outerController.signal)
  })

  it("rejects a mismatched executor result", async () => {
    const deps = dependencies({
      orchestrate: jest.fn().mockResolvedValue({
        ...successResult,
        runId: "another-run",
      }),
    })

    await expect(run(deps)).resolves.toMatchObject({
      success: false,
      error: { code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR },
    })
    expect(deps.finalizeRunSummary).toHaveBeenCalledWith("run-1", {
      status: "error",
      code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
    })
  })
})
