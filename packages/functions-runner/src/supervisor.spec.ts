import { DEFAULT_FUNCTION_LIMITS, FunctionErrorCode } from "@budibase/types"
import { spawn } from "node:child_process"
import type { ChildProcess } from "node:child_process"
import type { FunctionQueryHandler } from "./isolatedVmRuntime"
import { FunctionSupervisor } from "./supervisor"
import { FUNCTION_RUN_REQUEST_FIXTURE } from "./testFixtures"

const childFixture = String.raw`
const mode = process.argv[1]
if (
  mode === "ignore-termination" ||
  mode === "malformed-ignore-termination" ||
  mode === "result-delayed-close" ||
  mode === "result-never-closes"
) {
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
  if (mode === "result-delayed-close") {
    // Send the result immediately, but simulate teardown completing after the deadline.
    process.send(
      { type: "result", result },
      () => setTimeout(() => process.disconnect(), 1100)
    )
    return
  }
  if (mode === "result-never-closes") {
    process.send({ type: "result", result }, () =>
      setInterval(() => {}, 1000)
    )
    return
  }
  process.send({ type: "result", result }, () => process.disconnect())
})
`

// Scenarios used to test child process supervision.
type ChildMode =
  | "success"
  | "crash"
  | "memory-abort"
  | "no-result"
  | "malformed"
  | "malformed-ignore-termination"
  | "extra-message"
  | "wrong-run-id"
  | "hang"
  | "ignore-termination"
  | "result-delayed-close"
  | "result-never-closes"
  | "query"
  | "queries"
  | "limits"

const createSupervisor = ({
  mode,
  terminationGraceMs = 25,
  queryHandler,
}: {
  mode: ChildMode
  terminationGraceMs?: number
  queryHandler?: FunctionQueryHandler
}) =>
  new FunctionSupervisor({
    childFactory: () =>
      spawn(process.execPath, ["-e", childFixture, mode], {
        stdio: ["ignore", "ignore", "ignore", "ipc"],
      }),
    queryHandler,
    terminationGraceMs,
  })

const request = ({
  runId,
  timeoutMs = 1_000,
}: {
  runId: string
  timeoutMs?: number
}) => ({
  ...FUNCTION_RUN_REQUEST_FIXTURE,
  runId,
  limits: {
    ...FUNCTION_RUN_REQUEST_FIXTURE.limits,
    timeoutMs,
  },
})

describe("FunctionSupervisor", () => {
  it("uses a fresh child process for every sequential invocation", async () => {
    const supervisor = createSupervisor({ mode: "success" })

    const first = await supervisor.execute(request({ runId: "run-1" }))
    const second = await supervisor.execute(request({ runId: "run-2" }))

    expect(first.output?.pid).not.toEqual(second.output?.pid)
    expect(supervisor.activeRunCount()).toBe(0)
  })

  it("returns a stable result when a child crashes", async () => {
    const supervisor = createSupervisor({ mode: "crash" })

    await expect(
      supervisor.execute(request({ runId: "run-crash" }))
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

  it("reports a SIGABRT child exit as a runtime error", async () => {
    const supervisor = createSupervisor({ mode: "memory-abort" })

    await expect(
      supervisor.execute(request({ runId: "run-memory", timeoutMs: 10_000 }))
    ).resolves.toMatchObject({
      runId: "run-memory",
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
        message: "Function child process exited unexpectedly",
      },
    })
    expect(supervisor.activeRunCount()).toBe(0)
  })

  it("returns a stable result when a child exits without a result", async () => {
    const supervisor = createSupervisor({ mode: "no-result" })

    await expect(
      supervisor.execute(request({ runId: "run-no-result" }))
    ).resolves.toMatchObject({
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
        message: "Function child process exited without a result",
      },
    })
  })

  const malformedModes: Array<[ChildMode, string]> = [
    ["malformed", "Malformed Function child result"],
    ["malformed-ignore-termination", "Malformed Function child result"],
    ["extra-message", "Malformed Function child result"],
    ["wrong-run-id", "Function child result run ID does not match request"],
  ]

  it.each(malformedModes)("rejects %s child result", async (mode, message) => {
    const supervisor = createSupervisor({ mode })

    await expect(
      supervisor.execute(request({ runId: `run-${mode}` }))
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
      supervisor.execute(request({ runId: "run-spawn-failure" }))
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
    const supervisor = createSupervisor({ mode: "query", queryHandler })

    await expect(
      supervisor.execute(request({ runId: "run-query" }))
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
    const runRequest = request({ runId: "run-clamped-limits" })
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
    const runRequest = request({ runId: "run-large-input" })
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
    const first = supervisor.execute(
      request({ runId: "run-capacity-1", timeoutMs: 5_000 })
    )

    await expect(
      supervisor.execute(request({ runId: "run-capacity-busy" }))
    ).resolves.toMatchObject({
      error: {
        code: FunctionErrorCode.FUNCTION_RUNNER_BUSY,
        message: "Functions runner is busy",
      },
    })
    supervisor.terminate("run-capacity-1")
    await first

    const second = supervisor.execute(
      request({ runId: "run-capacity-2", timeoutMs: 5_000 })
    )
    expect(supervisor.activeRunCount()).toBe(1)
    supervisor.terminate("run-capacity-2")
    await second
    expect(supervisor.activeRunCount()).toBe(0)
  })

  it("enforces the query count at the supervisor boundary", async () => {
    const supervisor = createSupervisor({
      mode: "queries",
      terminationGraceMs: 10,
      queryHandler: async () => ({}),
    })
    const runRequest = request({ runId: "run-query-limit" })
    runRequest.limits = {
      ...runRequest.limits,
      maxQueryCalls: 1,
      maxConcurrentQueryCalls: 2,
    }

    await expect(supervisor.execute(runRequest)).resolves.toMatchObject({
      metrics: { queryCount: 1 },
      error: { code: FunctionErrorCode.FUNCTION_QUERY_LIMIT },
    })
    expect(supervisor.activeRunCount()).toBe(0)
  })

  it("rejects oversized query results at the supervisor boundary", async () => {
    const supervisor = createSupervisor({
      mode: "query",
      terminationGraceMs: 10,
      queryHandler: async () => ({ value: "too large" }),
    })
    const runRequest = request({ runId: "run-query-response-limit" })
    runRequest.limits = {
      ...runRequest.limits,
      maxQueryResponseBytes: 10,
    }

    await expect(supervisor.execute(runRequest)).resolves.toMatchObject({
      metrics: { queryCount: 1 },
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
    const supervisor = createSupervisor({
      mode: "query",
      terminationGraceMs: 10,
      queryHandler: request => {
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
      },
    })
    const resultPromise = supervisor.execute(
      request({ runId: "run-query-timeout", timeoutMs: 500 })
    )

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
    const supervisor = createSupervisor({ mode: "hang" })
    const resultPromise = supervisor.execute(
      request({ runId: "run-cancel", timeoutMs: 5_000 })
    )

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
    const supervisor = createSupervisor({
      mode: "ignore-termination",
      terminationGraceMs: 10,
    })

    await expect(
      supervisor.execute(request({ runId: "run-timeout", timeoutMs: 10 }))
    ).resolves.toMatchObject({
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_TIMEOUT,
        message: "Function run timed out",
      },
    })
    expect(supervisor.activeRunCount()).toBe(0)
  })

  it("does not replace a completed result with a timeout during child teardown", async () => {
    const supervisor = createSupervisor({
      mode: "result-delayed-close",
      terminationGraceMs: 1_500,
    })

    await expect(
      supervisor.execute(
        request({ runId: "run-result-before-timeout", timeoutMs: 1_000 })
      )
    ).resolves.toMatchObject({
      runId: "run-result-before-timeout",
      status: "success",
    })
    expect(supervisor.activeRunCount()).toBe(0)
  })

  it("terminates a child that remains alive after returning a result", async () => {
    const supervisor = createSupervisor({
      mode: "result-never-closes",
      terminationGraceMs: 10,
    })

    await expect(
      supervisor.execute(request({ runId: "run-result-stuck-child" }))
    ).resolves.toMatchObject({
      runId: "run-result-stuck-child",
      status: "success",
    })
    expect(supervisor.activeRunCount()).toBe(0)
  })

  it("does not replace a protocol failure with a timeout during child teardown", async () => {
    const supervisor = createSupervisor({
      mode: "malformed-ignore-termination",
      terminationGraceMs: 1_000,
    })

    await expect(
      supervisor.execute(
        request({ runId: "run-protocol-failure", timeoutMs: 500 })
      )
    ).resolves.toMatchObject({
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_PROTOCOL_ERROR,
        message: "Malformed Function child result",
      },
    })
    expect(supervisor.activeRunCount()).toBe(0)
  })

  it("terminates and reaps every child during shutdown", async () => {
    const supervisor = createSupervisor({
      mode: "ignore-termination",
      terminationGraceMs: 10,
    })
    const first = supervisor.execute(
      request({ runId: "run-shutdown-1", timeoutMs: 5_000 })
    )
    const second = supervisor.execute(
      request({ runId: "run-shutdown-2", timeoutMs: 5_000 })
    )

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

  it("waits for close when shutdown starts after child exit", async () => {
    let resolveChild: ((child: ChildProcess) => void) | undefined
    const childCreated = new Promise<ChildProcess>(resolve => {
      resolveChild = resolve
    })
    const supervisor = new FunctionSupervisor({
      childFactory: () => {
        const child = spawn(process.execPath, ["-e", childFixture, "hang"], {
          stdio: ["ignore", "ignore", "ignore", "ipc"],
        })
        resolveChild?.(child)
        return child
      },
    })
    const result = supervisor.execute(
      request({ runId: "run-exit-close-race", timeoutMs: 5_000 })
    )
    const child = await childCreated
    await new Promise<void>(resolve => child.once("spawn", resolve))

    let shutdown = Promise.resolve()
    let shutdownResolved = false
    const resolvedBeforeClose = new Promise<boolean>(resolve => {
      child.once("exit", () => {
        shutdown = supervisor.shutdown()
        shutdown.then(() => {
          shutdownResolved = true
        })
      })
      child.once("close", () => resolve(shutdownResolved))
    })
    child.kill("SIGKILL")

    await expect(resolvedBeforeClose).resolves.toBe(false)
    await shutdown
    await result
    expect(supervisor.activeRunCount()).toBe(0)
  })
})
