import {
  DEFAULT_FUNCTION_LIMITS,
  FunctionErrorCode,
  type FunctionDocument,
  type FunctionRunRequest,
  type FunctionRunResult,
  type FunctionRunSummary,
} from "@budibase/types"
import {
  FunctionRunOrchestrator,
  type FunctionInvocationScopeInput,
} from "@budibase/functions-runtime"
import {
  createRunSummary,
  finalizeRunSummary,
} from "../../sdk/workspace/functions/history"
import { functionRunSupervisor } from "./supervisor"
import { functionRunOrchestrator } from "./orchestrator"

jest.mock("../../sdk/workspace/functions/history", () => ({
  createRunSummary: jest.fn(),
  finalizeRunSummary: jest.fn(),
}))

jest.mock("./supervisor", () => ({
  functionRunSupervisor: {
    execute: jest.fn(),
  },
}))

const request: FunctionRunRequest = {
  runId: "run-1",
  artifact: {
    compiledJavaScript: "export default async function run() {}",
    capabilityIds: [],
    sourceHash: "source-hash",
    declarationsHash: "declarations-hash",
    compiledAt: "2026-01-01T00:00:00.000Z",
  },
  inputs: {},
  limits: DEFAULT_FUNCTION_LIMITS.run,
}

const capabilityScope: FunctionInvocationScopeInput = {
  runId: request.runId,
  workspaceId: "workspace-1",
  functionId: "function-1",
  sourceHash: request.artifact.sourceHash,
  invocation: {
    type: "automation",
    automationId: "automation-1",
    automationStepId: "step-1",
  },
  capabilities: [],
  limits: DEFAULT_FUNCTION_LIMITS.run,
}

const fn: FunctionDocument = {
  _id: capabilityScope.functionId,
  name: "Test Function",
  appId: capabilityScope.workspaceId,
  source: "export default async function run() {}",
  capabilities: [],
  artifact: request.artifact,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
}

const result: FunctionRunResult = {
  runId: request.runId,
  status: "success",
  output: {},
  metrics: {
    durationMs: 10,
    queryCount: 0,
    outputBytes: 2,
    logBytes: 0,
  },
}

const summary: FunctionRunSummary = {
  _id: "run-log-1",
  runId: request.runId,
  functionId: capabilityScope.functionId,
  functionName: "Test Function",
  sourceHash: capabilityScope.sourceHash,
  environment: "development",
  status: "running",
  invocation: capabilityScope.invocation,
  startedAt: "2026-01-01T00:00:00.000Z",
  queryCount: 0,
}

const execute = jest.mocked(functionRunSupervisor.execute)
const mockedCreateRunSummary = jest.mocked(createRunSummary)
const mockedFinalizeRunSummary = jest.mocked(finalizeRunSummary)
const consoleError = jest.spyOn(console, "error").mockImplementation()

afterAll(() => {
  consoleError.mockRestore()
})

const run = () =>
  functionRunOrchestrator.execute({
    runId: request.runId,
    workspaceId: capabilityScope.workspaceId,
    definition: {
      id: fn._id,
      name: fn.name,
      artifact: request.artifact,
      capabilities: fn.capabilities,
    },
    inputs: request.inputs,
    invocation: capabilityScope.invocation,
  })

describe("server FunctionRunOrchestrator", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedCreateRunSummary.mockResolvedValue(summary)
    mockedFinalizeRunSummary.mockResolvedValue(summary)
  })

  it("creates and finalizes a run summary around a successful run", async () => {
    execute.mockResolvedValue(result)

    await expect(run()).resolves.toEqual(result)

    expect(mockedCreateRunSummary).toHaveBeenCalledWith({
      runId: request.runId,
      functionId: capabilityScope.functionId,
      functionName: "Test Function",
      sourceHash: capabilityScope.sourceHash,
      automationId: capabilityScope.invocation.automationId,
      stepId: capabilityScope.invocation.automationStepId,
    })
    expect(mockedFinalizeRunSummary).toHaveBeenCalledWith(request.runId, result)
    expect(execute).toHaveBeenCalledWith({
      request,
      context: expect.any(Object),
      signal: undefined,
    })
  })

  it("finalizes an error summary when execution fails", async () => {
    const error = new Error("execution failed")
    execute.mockRejectedValue(error)

    await expect(run()).rejects.toBe(error)

    expect(mockedFinalizeRunSummary).toHaveBeenCalledWith(request.runId, {
      status: "error",
      code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
    })
  })

  it("executes without finalizing when run summary creation fails", async () => {
    mockedCreateRunSummary.mockRejectedValue(new Error("creation failed"))
    execute.mockResolvedValue(result)

    await expect(run()).resolves.toEqual(result)

    expect(execute).toHaveBeenCalledTimes(1)
    expect(mockedFinalizeRunSummary).not.toHaveBeenCalled()
  })

  it("preserves a successful result when run summary finalization fails", async () => {
    mockedFinalizeRunSummary.mockRejectedValue(new Error("finalization failed"))
    execute.mockResolvedValue(result)

    await expect(run()).resolves.toEqual(result)
  })
})

describe("shared FunctionRunOrchestrator", () => {
  it("executes a supervised run with a scoped capability session", async () => {
    const abortController = new AbortController()
    const invokeCapability = jest.fn(async () => ({}))
    const close = jest.fn()
    const createCapabilitySession = jest.fn().mockResolvedValue({
      invokeCapability,
      close,
    })
    const execute = jest.fn().mockResolvedValue(result)
    const orchestrator = new FunctionRunOrchestrator({
      createCapabilitySession,
      execute,
    })

    await expect(
      orchestrator.execute({
        request,
        capabilityScope,
        signal: abortController.signal,
      })
    ).resolves.toEqual(result)

    expect(createCapabilitySession).toHaveBeenCalledWith(capabilityScope)
    expect(execute).toHaveBeenCalledWith({
      request,
      context: { invokeCapability },
      signal: abortController.signal,
    })
    expect(close).toHaveBeenCalledTimes(1)
  })

  it("closes the capability session when execution fails", async () => {
    const executionError = new Error("execution failed")
    const close = jest.fn()
    const orchestrator = new FunctionRunOrchestrator({
      createCapabilitySession: jest.fn().mockResolvedValue({
        invokeCapability: jest.fn(async () => ({})),
        close,
      }),
      execute: jest.fn().mockRejectedValue(executionError),
    })

    await expect(
      orchestrator.execute({ request, capabilityScope })
    ).rejects.toBe(executionError)
    expect(close).toHaveBeenCalledTimes(1)
  })
})
