import type { FunctionRunRequest, FunctionRunResult } from "@budibase/types"
import { FunctionRunOrchestrator } from "./orchestrator"

const request: FunctionRunRequest = {
  runId: "run-1",
  artifact: {
    compiledJavaScript: "export default async function run() {}",
    capabilityIds: ["capability-1"],
    sourceHash: "source-hash",
    declarationsHash: "declarations-hash",
    compiledAt: "2026-01-01T00:00:00.000Z",
  },
  inputs: {},
  limits: {
    maxInputBytes: 1_024,
    maxInputDepth: 10,
    isolateMemoryLimitMb: 64,
    timeoutMs: 30_000,
    maxQueryCalls: 10,
    maxConcurrentQueryCalls: 2,
    maxQueryResponseBytes: 1_024,
    maxQueryResponseDepth: 10,
    maxOutputBytes: 1_024,
    maxOutputDepth: 10,
    maxLogEntries: 100,
    maxLogBytes: 1_024,
    maxLogEntryBytes: 256,
  },
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

describe("FunctionRunOrchestrator", () => {
  const capabilityScope = { invocationId: "invocation-1" }

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
