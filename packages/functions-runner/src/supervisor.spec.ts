import {
  FUNCTION_RUN_REQUEST_FIXTURE,
  FunctionErrorCode,
} from "@budibase/types"
import { spawn } from "node:child_process"
import { FunctionSupervisor } from "./supervisor"

const childFixture = String.raw`
const mode = process.argv[1]
if (mode === "ignore-termination" || mode === "malformed-ignore-termination") {
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
  process.send(result, () => process.disconnect())
})
`

const createSupervisor = (mode: string, terminationGraceMs = 25) =>
  new FunctionSupervisor({
    childFactory: () =>
      spawn(process.execPath, ["-e", childFixture, mode], {
        stdio: ["ignore", "ignore", "ignore", "ipc"],
      }),
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
