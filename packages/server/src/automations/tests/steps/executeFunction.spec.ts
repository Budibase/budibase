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
import { FunctionExecutionError } from "../../../functions/errors"

const artifact = {
  compiledJavaScript: "export default async function run() {}",
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
  output: {
    answer: 42,
  },
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
  executor: {
    health: jest.fn(),
    execute: jest.fn(),
    terminate: jest.fn(),
  },
  functionsEnabled: jest.fn().mockResolvedValue(true),
  getFunction: jest.fn().mockResolvedValue(fn),
  getReadiness: jest.fn().mockResolvedValue("ready"),
  execute: jest.fn().mockResolvedValue(successResult),
  createRunId: jest.fn().mockReturnValue("run-1"),
  ...overrides,
})

const run = (
  deps: ExecuteFunctionDependencies,
  inputs: ExecuteFunctionStepInputs = {
    functionId: fn._id,
    inputs: { name: "Ada" },
  }
) =>
  executeFunction(
    {
      inputs,
      appId: fn.appId,
      automationId: "automation-1",
      stepId: "step-1",
      context: {
        user: {
          _id: "user-1",
        },
      },
    },
    deps
  )

describe("Run Function automation action", () => {
  it("executes a ready Function and returns generic JSON output", async () => {
    const deps = dependencies()

    await expect(run(deps)).resolves.toEqual({
      success: true,
      status: "success",
      output: {
        answer: 42,
      },
    })
    expect(deps.execute).toHaveBeenCalledWith(
      deps.executor,
      {
        runId: "run-1",
        artifact,
        inputs: {
          name: "Ada",
        },
        limits: expect.any(Object),
      },
      {
        runId: "run-1",
        workspaceId: fn.appId,
        functionId: fn._id,
        sourceHash: artifact.sourceHash,
        automationId: "automation-1",
        automationStepId: "step-1",
        executionUser: {
          _id: "user-1",
        },
        capabilities: {
          "capability-1": fn.capabilities[0],
        },
      }
    )
  })

  it("parses JSON editor input", async () => {
    const deps = dependencies()

    await run(deps, {
      functionId: fn._id,
      inputs: {
        value: '{"bound":"value"}',
      },
    })

    expect(deps.execute).toHaveBeenCalledWith(
      deps.executor,
      expect.objectContaining({
        inputs: {
          bound: "value",
        },
      }),
      expect.any(Object)
    )
  })

  it.each([
    [
      "disabled",
      dependencies({
        functionsEnabled: jest.fn().mockResolvedValue(false),
      }),
      FunctionErrorCode.FUNCTIONS_DISABLED,
    ],
    [
      "missing",
      dependencies({
        getFunction: jest.fn().mockResolvedValue(undefined),
      }),
      FunctionErrorCode.FUNCTION_BUILD_REQUIRED,
    ],
    [
      "build required",
      dependencies({
        getReadiness: jest.fn().mockResolvedValue("build_required"),
      }),
      FunctionErrorCode.FUNCTION_BUILD_REQUIRED,
    ],
    [
      "build failed",
      dependencies({
        getReadiness: jest.fn().mockResolvedValue("build_failed"),
      }),
      FunctionErrorCode.FUNCTION_BUILD_FAILED,
    ],
  ])(
    "returns a stable error when the Function is %s",
    async (_name, deps, code) => {
      await expect(run(deps)).resolves.toMatchObject({
        success: false,
        status: "error",
        error: {
          code,
        },
      })
      expect(deps.executor.execute).not.toHaveBeenCalled()
    }
  )

  it("rejects invalid inputs before invoking the executor", async () => {
    const deps = dependencies()

    await expect(
      run(deps, {
        functionId: fn._id,
        inputs: {
          // @ts-expect-error - intentionally testing non-JSON input
          invalid: undefined,
        },
      })
    ).resolves.toMatchObject({
      success: false,
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_PROTOCOL_ERROR,
      },
    })
    expect(deps.execute).not.toHaveBeenCalled()
  })

  it("returns sanitized executor errors", async () => {
    const deps = dependencies({
      execute: jest
        .fn()
        .mockRejectedValue(
          new FunctionExecutionError(
            FunctionErrorCode.FUNCTION_RUNNER_UNAVAILABLE
          )
        ),
    })

    await expect(run(deps)).resolves.toEqual({
      success: false,
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_RUNNER_UNAVAILABLE,
        message: "The Function runner is unavailable",
      },
    })
  })

  it("returns stable Function errors from the runner", async () => {
    const deps = dependencies({
      execute: jest.fn().mockResolvedValue({
        ...successResult,
        status: "error",
        output: undefined,
        error: {
          code: FunctionErrorCode.FUNCTION_OUTPUT_INVALID,
          message: "Function output is invalid",
        },
      }),
    })

    await expect(run(deps)).resolves.toEqual({
      success: false,
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_OUTPUT_INVALID,
        message: "Function output is invalid",
      },
    })
  })

  it("rejects invalid executor results", async () => {
    const deps = dependencies({
      execute: jest.fn().mockResolvedValue({
        ...successResult,
        runId: "another-run",
      }),
    })

    await expect(run(deps)).resolves.toMatchObject({
      success: false,
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_PROTOCOL_ERROR,
      },
    })
  })

  it("returns the stopped status", async () => {
    const deps = dependencies({
      execute: jest.fn().mockResolvedValue({
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
})
