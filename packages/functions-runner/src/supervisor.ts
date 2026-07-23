import { DEFAULT_FUNCTION_LIMITS, FunctionErrorCode } from "@budibase/types"
import type { FunctionRunResult, JSONValue } from "@budibase/types"
import { fork } from "node:child_process"
import type { ChildProcess } from "node:child_process"
import path from "node:path"
import type { ChildMessage, ParentMessage } from "./ipc"
import { validateChildMessage } from "./ipc"
import type { FunctionQueryHandler } from "./isolatedVmRuntime"
import { JSONLimitError, validateJSONLimits } from "./jsonLimits"
import { FunctionProtocolError, validateFunctionRunRequest } from "./protocol"

const CHILD_CRASHED_MESSAGE = "Function child process exited unexpectedly"
const CHILD_NO_RESULT_MESSAGE = "Function child process exited without a result"
const MALFORMED_CHILD_RESULT_MESSAGE = "Malformed Function child result"
const RUN_ID_MISMATCH_MESSAGE =
  "Function child result run ID does not match request"
const RUN_CANCELLED_MESSAGE = "Function run was cancelled"
const RUN_TIMEOUT_MESSAGE = "Function run timed out"
const RUNNER_SHUTDOWN_MESSAGE = "Functions runner is shutting down"
const QUERY_FAILED_MESSAGE = "Function query failed"
const INPUT_INVALID_MESSAGE = "Function input is invalid"
const QUERY_LIMIT_MESSAGE = "Function query limit exceeded"
const QUERY_PAYLOAD_INVALID_MESSAGE = "Function query payload is invalid"
const RUNNER_BUSY_MESSAGE = "Functions runner is busy"
const MEMORY_LIMIT_MESSAGE = "Function memory limit exceeded"

type TerminationReason = "cancelled" | "timeout" | "shutdown"

interface ActiveRun {
  child: ChildProcess
  terminate: (reason: TerminationReason) => void
}

export interface FunctionSupervisorOptions {
  childFactory?: (memoryLimitMb: number) => ChildProcess
  queryHandler?: FunctionQueryHandler
  terminationGraceMs?: number
  maxConcurrentRuns?: number
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

const defaultChildFactory = (memoryLimitMb: number) =>
  fork(path.join(__dirname, "child.js"), [], {
    execArgv: [`--max-old-space-size=${memoryLimitMb}`],
    stdio: ["ignore", "ignore", "ignore", "ipc"],
  })

const defaultQueryHandler = (): Promise<JSONValue> =>
  Promise.reject(new Error(QUERY_FAILED_MESSAGE))

export class FunctionSupervisor {
  private readonly activeRuns = new Map<string, ActiveRun>()
  private readonly childFactory: (memoryLimitMb: number) => ChildProcess
  private readonly queryHandler: FunctionQueryHandler
  private readonly terminationGraceMs: number
  private readonly maxConcurrentRuns: number
  private shuttingDown = false

  constructor(options: FunctionSupervisorOptions = {}) {
    this.childFactory = options.childFactory || defaultChildFactory
    this.queryHandler = options.queryHandler || defaultQueryHandler
    this.terminationGraceMs = options.terminationGraceMs ?? 250
    this.maxConcurrentRuns =
      options.maxConcurrentRuns ??
      DEFAULT_FUNCTION_LIMITS.service.maxConcurrentRuns
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
    if (this.activeRuns.size >= this.maxConcurrentRuns) {
      return Promise.resolve(
        failureResult(
          request.runId,
          startedAt,
          FunctionErrorCode.FUNCTION_RUNNER_BUSY,
          RUNNER_BUSY_MESSAGE
        )
      )
    }
    try {
      validateJSONLimits(request.inputs, {
        maxBytes: request.limits.maxInputBytes,
        maxDepth: request.limits.maxInputDepth,
      })
    } catch (error) {
      if (error instanceof JSONLimitError) {
        return Promise.resolve(
          failureResult(
            request.runId,
            startedAt,
            FunctionErrorCode.FUNCTION_PROTOCOL_ERROR,
            INPUT_INVALID_MESSAGE
          )
        )
      }
      throw error
    }

    let child: ChildProcess
    try {
      child = this.childFactory(request.limits.isolateMemoryLimitMb)
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
      const queryRequestIds = new Set<string>()
      let queryCount = 0
      let concurrentQueryCount = 0

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

      const sendMessage = (message: ParentMessage) => {
        try {
          child.send(message, error => {
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
          if (!closed && !failure) {
            failure = failureResult(
              request.runId,
              startedAt,
              FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
              CHILD_CRASHED_MESSAGE
            )
            requestChildExit()
          }
        }
      }

      child.on("message", (value: unknown) => {
        let message: ChildMessage
        try {
          message = validateChildMessage(value)
        } catch {
          setProtocolFailure(MALFORMED_CHILD_RESULT_MESSAGE)
          return
        }

        if (message.type === "result") {
          if (receivedResult) {
            setProtocolFailure(MALFORMED_CHILD_RESULT_MESSAGE)
            return
          }
          if (message.result.runId !== request.runId) {
            setProtocolFailure(RUN_ID_MISMATCH_MESSAGE)
            return
          }
          receivedResult = message.result
          return
        }

        if (
          receivedResult ||
          failure ||
          terminationReason ||
          queryRequestIds.has(message.requestId)
        ) {
          setProtocolFailure(MALFORMED_CHILD_RESULT_MESSAGE)
          return
        }
        queryRequestIds.add(message.requestId)
        try {
          validateJSONLimits(message.parameters, {
            maxBytes: request.limits.maxInputBytes,
            maxDepth: request.limits.maxInputDepth,
          })
        } catch {
          failure = failureResult(
            request.runId,
            startedAt,
            FunctionErrorCode.FUNCTION_PROTOCOL_ERROR,
            QUERY_PAYLOAD_INVALID_MESSAGE
          )
          requestChildExit()
          return
        }
        if (
          queryCount >= request.limits.maxQueryCalls ||
          concurrentQueryCount >= request.limits.maxConcurrentQueryCalls
        ) {
          failure = failureResult(
            request.runId,
            startedAt,
            FunctionErrorCode.FUNCTION_QUERY_LIMIT,
            QUERY_LIMIT_MESSAGE
          )
          requestChildExit()
          return
        }
        queryCount += 1
        concurrentQueryCount += 1
        Promise.resolve()
          .then(() =>
            this.queryHandler({
              runId: request.runId,
              grantToken: request.grantToken,
              capabilityId: message.capabilityId,
              parameters: message.parameters,
            })
          )
          .then(
            result => {
              concurrentQueryCount -= 1
              if (!closed) {
                try {
                  validateJSONLimits(result, {
                    maxBytes: request.limits.maxQueryResponseBytes,
                    maxDepth: request.limits.maxQueryResponseDepth,
                  })
                } catch {
                  failure = failureResult(
                    request.runId,
                    startedAt,
                    FunctionErrorCode.FUNCTION_PROTOCOL_ERROR,
                    QUERY_PAYLOAD_INVALID_MESSAGE
                  )
                  requestChildExit()
                  return
                }
                sendMessage({
                  type: "queryResult",
                  requestId: message.requestId,
                  result,
                })
              }
            },
            () => {
              concurrentQueryCount -= 1
              if (!closed) {
                sendMessage({
                  type: "queryResult",
                  requestId: message.requestId,
                  error: QUERY_FAILED_MESSAGE,
                })
              }
            }
          )
      })

      child.on("error", () => {
        failure = failureResult(
          request.runId,
          startedAt,
          FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
          CHILD_CRASHED_MESSAGE
        )
      })

      child.on("close", (code, signal) => {
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
        if (signal === "SIGABRT" || signal === "SIGKILL" || code === 134) {
          resolve(
            failureResult(
              request.runId,
              startedAt,
              FunctionErrorCode.FUNCTION_MEMORY_LIMIT,
              MEMORY_LIMIT_MESSAGE
            )
          )
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
        sendMessage({ type: "run", request })
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
