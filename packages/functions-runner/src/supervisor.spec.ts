import { FunctionErrorCode } from "@budibase/types"
import { spawn } from "node:child_process"
import type { ChildProcess } from "node:child_process"
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
  if (mode === "crash") process.exit(2)
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
  const result = {
    runId: mode === "wrong-run-id" ? "another-run" : request.runId,
    status: "success",
    output: { pid: process.pid },
    metrics: { durationMs: 1, queryCount: 0, outputBytes: 0, logBytes: 0 },
  }
  if (mode === "extra-message") {
    let pending = 2
    const sent = () => {
      pending -= 1
      if (pending === 0) process.disconnect()
    }
    process.send(result, sent)
    process.send(result, sent)
    return
  }
  if (mode === "result-delayed-close") {
    // Send the result immediately, but simulate teardown completing after the deadline.
    process.send(result, () => setTimeout(() => process.disconnect(), 1100))
    return
  }
  if (mode === "result-never-closes") {
    process.send(result, () => setInterval(() => {}, 1000))
    return
  }
  process.send(result, () => process.disconnect())
})
`

// Scenarios used to test child process supervision.
type ChildMode =
  | "success"
  | "crash"
  | "no-result"
  | "malformed"
  | "malformed-ignore-termination"
  | "extra-message"
  | "wrong-run-id"
  | "hang"
  | "ignore-termination"
  | "result-delayed-close"
  | "result-never-closes"

const createSupervisor = ({
  mode,
  terminationGraceMs = 25,
}: {
  mode: ChildMode
  terminationGraceMs?: number
}) =>
  new FunctionSupervisor({
    childFactory: () =>
      spawn(process.execPath, ["-e", childFixture, mode], {
        stdio: ["ignore", "ignore", "ignore", "ipc"],
      }),
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
