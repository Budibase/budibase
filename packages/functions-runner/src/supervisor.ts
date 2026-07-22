import { FunctionErrorCode } from "@budibase/types"
import type { FunctionRunResult } from "@budibase/types"
import { fork } from "node:child_process"
import type { ChildProcess } from "node:child_process"
import path from "node:path"
import {
  FunctionProtocolError,
  validateFunctionRunRequest,
  validateFunctionRunResult,
} from "./protocol"

const CHILD_CRASHED_MESSAGE = "Function child process exited unexpectedly"
const CHILD_NO_RESULT_MESSAGE = "Function child process exited without a result"
const MALFORMED_CHILD_RESULT_MESSAGE = "Malformed Function child result"
const RUN_ID_MISMATCH_MESSAGE =
  "Function child result run ID does not match request"
const RUN_CANCELLED_MESSAGE = "Function run was cancelled"
const RUN_TIMEOUT_MESSAGE = "Function run timed out"
const RUNNER_SHUTDOWN_MESSAGE = "Functions runner is shutting down"

type TerminationReason = "cancelled" | "timeout" | "shutdown"

interface ActiveRun {
  child: ChildProcess
  terminate: (reason: TerminationReason) => void
}

export interface FunctionSupervisorOptions {
  childFactory?: () => ChildProcess
  terminationGraceMs?: number
}

const failureResult = (
  runId: string,
  startedAt: number,
  code: FunctionErrorCode,
  message: string,
  status: "error" | "stopped" = "error"
): FunctionRunResult => ({
  runId,
  status,
  metrics: {
    durationMs: Date.now() - startedAt,
    queryCount: 0,
    outputBytes: 0,
    logBytes: 0,
  },
  error: {
    code,
    message,
  },
})

const defaultChildFactory = () =>
  fork(path.join(__dirname, "child.js"), [], {
    stdio: ["ignore", "inherit", "inherit", "ipc"],
  })

export class FunctionSupervisor {
  private readonly activeRuns = new Map<string, ActiveRun>()
  private readonly childFactory: () => ChildProcess
  private readonly terminationGraceMs: number
  private shuttingDown = false

  constructor(options: FunctionSupervisorOptions = {}) {
    this.childFactory = options.childFactory || defaultChildFactory
    this.terminationGraceMs = options.terminationGraceMs ?? 250
  }

  isHealthy() {
    return !this.shuttingDown
  }

  activeRunCount() {
    return this.activeRuns.size
  }

  execute(value: unknown): Promise<FunctionRunResult> {
    const request = validateFunctionRunRequest(value)
    const startedAt = Date.now()

    if (this.shuttingDown) {
      return Promise.resolve(
        failureResult(
          request.runId,
          startedAt,
          FunctionErrorCode.FUNCTION_RUNNER_UNAVAILABLE,
          RUNNER_SHUTDOWN_MESSAGE
        )
      )
    }
    if (this.activeRuns.has(request.runId)) {
      throw new FunctionProtocolError("Function run ID is already active")
    }

    let child: ChildProcess
    try {
      child = this.childFactory()
    } catch {
      return Promise.resolve(
        failureResult(
          request.runId,
          startedAt,
          FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
          CHILD_CRASHED_MESSAGE
        )
      )
    }

    return new Promise(resolve => {
      let receivedResult: FunctionRunResult | undefined
      let failure: FunctionRunResult | undefined
      let terminationReason: TerminationReason | undefined
      let killTimer: NodeJS.Timeout | undefined
      let runTimer: NodeJS.Timeout | undefined
      let closed = false

      const requestChildExit = () => {
        if (closed || killTimer) {
          return
        }
        child.kill("SIGTERM")
        killTimer = setTimeout(() => {
          if (!closed) {
            child.kill("SIGKILL")
          }
        }, this.terminationGraceMs)
        killTimer.unref()
      }

      const terminateChild = (reason: TerminationReason) => {
        if (closed || terminationReason) {
          return
        }
        terminationReason = reason
        requestChildExit()
      }

      this.activeRuns.set(request.runId, {
        child,
        terminate: terminateChild,
      })

      const setProtocolFailure = (message: string) => {
        if (!failure) {
          failure = failureResult(
            request.runId,
            startedAt,
            FunctionErrorCode.FUNCTION_PROTOCOL_ERROR,
            message
          )
        }
        requestChildExit()
      }

      child.on("message", (value: unknown) => {
        try {
          if (receivedResult) {
            setProtocolFailure(MALFORMED_CHILD_RESULT_MESSAGE)
            return
          }
          const result = validateFunctionRunResult(value)
          if (result.runId !== request.runId) {
            setProtocolFailure(RUN_ID_MISMATCH_MESSAGE)
            return
          }
          receivedResult = result
        } catch {
          setProtocolFailure(MALFORMED_CHILD_RESULT_MESSAGE)
        }
      })

      child.on("error", () => {
        failure = failureResult(
          request.runId,
          startedAt,
          FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
          CHILD_CRASHED_MESSAGE
        )
      })

      child.on("close", code => {
        closed = true
        if (runTimer) {
          clearTimeout(runTimer)
        }
        if (killTimer) {
          clearTimeout(killTimer)
        }
        this.activeRuns.delete(request.runId)

        if (terminationReason === "cancelled") {
          resolve(
            failureResult(
              request.runId,
              startedAt,
              FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
              RUN_CANCELLED_MESSAGE,
              "stopped"
            )
          )
          return
        }
        if (terminationReason === "timeout") {
          resolve(
            failureResult(
              request.runId,
              startedAt,
              FunctionErrorCode.FUNCTION_TIMEOUT,
              RUN_TIMEOUT_MESSAGE
            )
          )
          return
        }
        if (terminationReason === "shutdown") {
          resolve(
            failureResult(
              request.runId,
              startedAt,
              FunctionErrorCode.FUNCTION_RUNNER_UNAVAILABLE,
              RUNNER_SHUTDOWN_MESSAGE
            )
          )
          return
        }
        if (failure) {
          resolve(failure)
          return
        }
        if (receivedResult) {
          resolve(receivedResult)
          return
        }

        resolve(
          failureResult(
            request.runId,
            startedAt,
            FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
            code === 0 ? CHILD_NO_RESULT_MESSAGE : CHILD_CRASHED_MESSAGE
          )
        )
      })

      if (!child.connected) {
        failure = failureResult(
          request.runId,
          startedAt,
          FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
          CHILD_CRASHED_MESSAGE
        )
        child.kill("SIGKILL")
        return
      }

      try {
        child.send(request, error => {
          if (error && !closed && !terminationReason && !failure) {
            failure = failureResult(
              request.runId,
              startedAt,
              FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
              CHILD_CRASHED_MESSAGE
            )
            requestChildExit()
          }
        })
      } catch {
        failure = failureResult(
          request.runId,
          startedAt,
          FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
          CHILD_CRASHED_MESSAGE
        )
        requestChildExit()
      }

      runTimer = setTimeout(
        () => terminateChild("timeout"),
        request.limits.timeoutMs
      )
      runTimer.unref()
    })
  }

  terminate(runId: string) {
    this.activeRuns.get(runId)?.terminate("cancelled")
  }

  async shutdown() {
    this.shuttingDown = true
    const children = [...this.activeRuns.values()]
    for (const run of children) {
      run.terminate("shutdown")
    }
    await Promise.all(
      children.map(
        run =>
          new Promise<void>(resolve => {
            if (run.child.exitCode !== null || run.child.signalCode !== null) {
              resolve()
              return
            }
            run.child.once("close", () => resolve())
          })
      )
    )
  }
}
