import {
  DEFAULT_FUNCTION_LIMITS,
  FUNCTION_RUN_REQUEST_FIXTURE,
  FunctionErrorCode,
} from "@budibase/types"
import { spawn } from "node:child_process"
import type { FunctionQueryHandler } from "./isolatedVmRuntime"
import { FunctionSupervisor } from "./supervisor"

const childFixture = String.raw`
const mode = process.argv[1]
if (mode === "ignore-termination" || mode === "malformed-ignore-termination") {
  process.on("SIGTERM", () => {})
}
process.on("message", request => {
  if (request.type === "queryResult") {
    const result = {
      runId: globalThis.runRequest.runId,
      status: "success",
      output: { query: request.result },
      metrics: { durationMs: 1, queryCount: 1, outputBytes: 0, logBytes: 0 },
    }
    process.send({ type: "result", result }, () => process.disconnect())
    return
  }
  request = request.request
  globalThis.runRequest = request
  if (mode === "crash") process.exit(2)
  if (mode === "memory-abort") process.abort()
  if (mode === "no-result") process.exit(0)
  if (mode === "malformed" || mode === "malformed-ignore-termination") {
    process.send({ invalid: true })
    if (mode === "malformed-ignore-termination") setInterval(() => {}, 1000)
    else process.disconnect()
    return
  }
  if (mode === "hang" || mode === "ignore-termination") {
    setInterval(() => {}, 1000)
    return
  }
  if (mode === "query") {
    process.send({
      type: "query",
      requestId: "query-1",
      capabilityId: "capability-1",
      parameters: { value: "input" },
    })
    return
  }
  if (mode === "queries") {
    process.send({
      type: "query",
      requestId: "query-1",
      capabilityId: "capability-1",
      parameters: {},
    })
    process.send({
      type: "query",
      requestId: "query-2",
      capabilityId: "capability-2",
      parameters: {},
    })
    return
  }
  let output = { pid: process.pid }
  if (mode === "limits") {
    output = { limits: request.limits }
  }
  const result = {
    runId: mode === "wrong-run-id" ? "another-run" : request.runId,
    status: "success",
    output,
    metrics: { durationMs: 1, queryCount: 0, outputBytes: 0, logBytes: 0 },
  }
  if (mode === "extra-message") {
    let pending = 2
    const sent = () => {
      pending -= 1
      if (pending === 0) process.disconnect()
    }
    process.send({ type: "result", result }, sent)
    process.send({ type: "result", result }, sent)
    return
  }
  process.send({ type: "result", result }, () => process.disconnect())
})
`

const createSupervisor = (
  mode: string,
  terminationGraceMs = 25,
  queryHandler?: FunctionQueryHandler
) =>
  new FunctionSupervisor({
    childFactory: () =>
      spawn(process.execPath, ["-e", childFixture, mode], {
        stdio: ["ignore", "ignore", "ignore", "ipc"],
      }),
    queryHandler,
    terminationGraceMs,
  })

const request = (runId: string, timeoutMs = 1_000) => ({
  ...FUNCTION_RUN_REQUEST_FIXTURE,
  runId,
  limits: {
    ...FUNCTION_RUN_REQUEST_FIXTURE.limits,
    timeoutMs,
  },
})

describe("FunctionSupervisor", () => {
  it("uses a fresh child process for every sequential invocation", async () => {
    const supervisor = createSupervisor("success")

    const first = await supervisor.execute(request("run-1"))
    const second = await supervisor.execute(request("run-2"))

    expect(first.output?.pid).not.toEqual(second.output?.pid)
    expect(supervisor.activeRunCount()).toBe(0)
  })

  it("returns a stable result when a child crashes", async () => {
    const supervisor = createSupervisor("crash")

    await expect(
      supervisor.execute(request("run-crash"))
    ).resolves.toMatchObject({
      runId: "run-crash",
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
        message: "Function child process exited unexpectedly",
      },
    })
    expect(supervisor.activeRunCount()).toBe(0)
  })

  it("returns a stable result when a child hits its memory ceiling", async () => {
    const supervisor = createSupervisor("memory-abort")

    await expect(
      supervisor.execute(request("run-memory", 10_000))
    ).resolves.toMatchObject({
      runId: "run-memory",
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_MEMORY_LIMIT,
        message: "Function memory limit exceeded",
      },
    })
    expect(supervisor.activeRunCount()).toBe(0)
  })

  it("returns a stable result when a child exits without a result", async () => {
    const supervisor = createSupervisor("no-result")

    await expect(
      supervisor.execute(request("run-no-result"))
    ).resolves.toMatchObject({
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
        message: "Function child process exited without a result",
      },
    })
  })

  it.each([
    ["malformed", "Malformed Function child result"],
    ["malformed-ignore-termination", "Malformed Function child result"],
    ["extra-message", "Malformed Function child result"],
    ["wrong-run-id", "Function child result run ID does not match request"],
  ])("rejects %s child result", async (mode, message) => {
    const supervisor = createSupervisor(mode)

    await expect(
      supervisor.execute(request(`run-${mode}`))
    ).resolves.toMatchObject({
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_PROTOCOL_ERROR,
        message,
      },
    })
    expect(supervisor.activeRunCount()).toBe(0)
  })

  it("returns a stable result when spawning a child fails", async () => {
    const supervisor = new FunctionSupervisor({
      childFactory: () => {
        throw new Error("host path that must not be exposed")
      },
    })

    await expect(
      supervisor.execute(request("run-spawn-failure"))
    ).resolves.toMatchObject({
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
        message: "Function child process exited unexpectedly",
      },
    })
  })

  it("forwards query capabilities without exposing the run envelope", async () => {
    const queryHandler = jest.fn(async () => ({ rows: [{ id: "row-1" }] }))
    const supervisor = createSupervisor("query", 25, queryHandler)

    await expect(
      supervisor.execute(request("run-query"))
    ).resolves.toMatchObject({
      status: "success",
      output: {
        query: { rows: [{ id: "row-1" }] },
      },
      metrics: { queryCount: 1 },
    })
    expect(queryHandler).toHaveBeenCalledWith({
      runId: "run-query",
      grantToken: FUNCTION_RUN_REQUEST_FIXTURE.grantToken,
      capabilityId: "capability-1",
      parameters: { value: "input" },
      signal: expect.any(AbortSignal),
    })
  })

  it("clamps request limits to runner-owned maximums", async () => {
    const childFactory = jest.fn(() =>
      spawn(process.execPath, ["-e", childFixture, "limits"], {
        stdio: ["ignore", "ignore", "ignore", "ipc"],
      })
    )
    const supervisor = new FunctionSupervisor({ childFactory })
    const runRequest = request("run-clamped-limits")
    for (const key of Object.keys(runRequest.limits)) {
      runRequest.limits[key as keyof typeof runRequest.limits] =
        Number.MAX_SAFE_INTEGER
    }

    await expect(supervisor.execute(runRequest)).resolves.toMatchObject({
      status: "success",
      output: { limits: DEFAULT_FUNCTION_LIMITS.run },
    })
    expect(childFactory).toHaveBeenCalledWith(
      DEFAULT_FUNCTION_LIMITS.run.isolateMemoryLimitMb
    )
  })

  it("rejects input over its byte limit before spawning", async () => {
    const childFactory = jest.fn(() => {
      throw new Error("must not spawn")
    })
    const supervisor = new FunctionSupervisor({ childFactory })
    const runRequest = request("run-large-input")
    runRequest.inputs = { value: "too large" }
    runRequest.limits = { ...runRequest.limits, maxInputBytes: 10 }

    await expect(supervisor.execute(runRequest)).resolves.toMatchObject({
      error: {
        code: FunctionErrorCode.FUNCTION_PROTOCOL_ERROR,
        message: "Function input is invalid",
      },
    })
    expect(childFactory).not.toHaveBeenCalled()
  })

  it("fails fast when runner capacity is exhausted and releases it", async () => {
    const supervisor = new FunctionSupervisor({
      childFactory: () =>
        spawn(process.execPath, ["-e", childFixture, "hang"], {
          stdio: ["ignore", "ignore", "ignore", "ipc"],
        }),
      maxConcurrentRuns: 1,
      terminationGraceMs: 10,
    })
    const first = supervisor.execute(request("run-capacity-1", 5_000))

    await expect(
      supervisor.execute(request("run-capacity-busy"))
    ).resolves.toMatchObject({
      error: {
        code: FunctionErrorCode.FUNCTION_RUNNER_BUSY,
        message: "Functions runner is busy",
      },
    })
    supervisor.terminate("run-capacity-1")
    await first

    const second = supervisor.execute(request("run-capacity-2", 5_000))
    expect(supervisor.activeRunCount()).toBe(1)
    supervisor.terminate("run-capacity-2")
    await second
    expect(supervisor.activeRunCount()).toBe(0)
  })

  it("enforces the query count at the supervisor boundary", async () => {
    const supervisor = createSupervisor("queries", 10, async () => ({}))
    const runRequest = request("run-query-limit")
    runRequest.limits = {
      ...runRequest.limits,
      maxQueryCalls: 1,
      maxConcurrentQueryCalls: 2,
    }

    await expect(supervisor.execute(runRequest)).resolves.toMatchObject({
      error: { code: FunctionErrorCode.FUNCTION_QUERY_LIMIT },
    })
    expect(supervisor.activeRunCount()).toBe(0)
  })

  it("rejects oversized query results at the supervisor boundary", async () => {
    const supervisor = createSupervisor("query", 10, async () => ({
      value: "too large",
    }))
    const runRequest = request("run-query-response-limit")
    runRequest.limits = {
      ...runRequest.limits,
      maxQueryResponseBytes: 10,
    }

    await expect(supervisor.execute(runRequest)).resolves.toMatchObject({
      error: {
        code: FunctionErrorCode.FUNCTION_PROTOCOL_ERROR,
        message: "Function query payload is invalid",
      },
    })
    expect(supervisor.activeRunCount()).toBe(0)
  })

  it("aborts outstanding queries when a run times out", async () => {
    let querySignal: AbortSignal | undefined
    let notifyQueryStarted: (() => void) | undefined
    let notifyQueryCancelled: (() => void) | undefined
    const queryStarted = new Promise<void>(resolve => {
      notifyQueryStarted = resolve
    })
    const queryCancelled = new Promise<void>(resolve => {
      notifyQueryCancelled = resolve
    })
    const supervisor = createSupervisor("query", 10, request => {
      querySignal = request.signal
      notifyQueryStarted?.()
      return new Promise((_resolve, reject) => {
        request.signal.addEventListener(
          "abort",
          () => {
            notifyQueryCancelled?.()
            reject(new Error("Query cancelled"))
          },
          { once: true }
        )
      })
    })
    const resultPromise = supervisor.execute(request("run-query-timeout", 500))

    await queryStarted
    expect(querySignal?.aborted).toBe(false)
    await expect(resultPromise).resolves.toMatchObject({
      error: { code: FunctionErrorCode.FUNCTION_TIMEOUT },
    })
    await queryCancelled
    expect(querySignal?.aborted).toBe(true)
    expect(supervisor.activeRunCount()).toBe(0)
  })

  it("cancels an active child and cleans up its state", async () => {
    const supervisor = createSupervisor("hang")
    const resultPromise = supervisor.execute(request("run-cancel", 5_000))

    supervisor.terminate("run-cancel")

    await expect(resultPromise).resolves.toMatchObject({
      status: "stopped",
      error: {
        code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
        message: "Function run was cancelled",
      },
    })
    expect(supervisor.activeRunCount()).toBe(0)
  })

  it("escalates a timed-out child that ignores graceful termination", async () => {
    const supervisor = createSupervisor("ignore-termination", 10)

    await expect(
      supervisor.execute(request("run-timeout", 10))
    ).resolves.toMatchObject({
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_TIMEOUT,
        message: "Function run timed out",
      },
    })
    expect(supervisor.activeRunCount()).toBe(0)
  })

  it("terminates and reaps every child during shutdown", async () => {
    const supervisor = createSupervisor("ignore-termination", 10)
    const first = supervisor.execute(request("run-shutdown-1", 5_000))
    const second = supervisor.execute(request("run-shutdown-2", 5_000))

    await supervisor.shutdown()

    await expect(Promise.all([first, second])).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          status: "error",
          error: expect.objectContaining({
            code: FunctionErrorCode.FUNCTION_RUNNER_UNAVAILABLE,
            message: "Functions runner is shutting down",
          }),
        }),
      ])
    )
    expect(supervisor.activeRunCount()).toBe(0)
    expect(supervisor.isHealthy()).toBe(false)
  })
})
