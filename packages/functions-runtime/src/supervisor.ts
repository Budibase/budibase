import { FunctionErrorCode } from "@budibase/types"
import type {
  FunctionExecutionContext,
  FunctionExecutor,
  FunctionSupervisor,
  FunctionRunRequest,
  FunctionRunResult,
} from "@budibase/types"

const SUPERVISOR_SHUTDOWN_MESSAGE = "Function supervisor is shutting down"

const createStopped = (result: FunctionRunResult): FunctionRunResult => ({
  runId: result.runId,
  status: "stopped",
  metrics: {
    ...result.metrics,
    outputBytes: 0,
    logBytes: 0,
  },
})

const createShutdownResult = (
  request: FunctionRunRequest
): FunctionRunResult => ({
  runId: request.runId,
  status: "error",
  metrics: {
    durationMs: 0,
    queryCount: 0,
    outputBytes: 0,
    logBytes: 0,
  },
  error: {
    code: FunctionErrorCode.FUNCTION_ORCHESTRATOR_INTERRUPTED,
    message: SUPERVISOR_SHUTDOWN_MESSAGE,
  },
})

export interface SuperviseFunctionRunOptions {
  request: FunctionRunRequest
  context: FunctionExecutionContext
  signal?: AbortSignal
}

export interface LocalFunctionRunSupervisorOptions {
  executor: FunctionExecutor
}

interface ActiveRun {
  execution?: Promise<FunctionRunResult>
  terminationRequested: boolean
}

export class LocalFunctionRunSupervisor
  implements FunctionSupervisor<SuperviseFunctionRunOptions>
{
  private readonly executor: FunctionExecutor
  private readonly activeRuns = new Map<string, ActiveRun>()
  private shuttingDown = false

  constructor({ executor }: LocalFunctionRunSupervisorOptions) {
    this.executor = executor
  }

  isHealthy(): boolean {
    return !this.shuttingDown
  }

  activeRunCount(): number {
    return this.activeRuns.size
  }

  terminate(runId: string): void {
    const activeRun = this.activeRuns.get(runId)
    if (activeRun?.terminationRequested) {
      return
    }
    if (activeRun) {
      activeRun.terminationRequested = true
    }
    void this.executor.terminate(runId)
  }

  async execute(
    options: SuperviseFunctionRunOptions
  ): Promise<FunctionRunResult> {
    if (this.shuttingDown) {
      return Promise.resolve(createShutdownResult(options.request))
    }

    const activeRun: ActiveRun = { terminationRequested: false }
    this.activeRuns.set(options.request.runId, activeRun)
    const execution = this.executeRun(options, activeRun)
    activeRun.execution = execution
    return execution.finally(() => {
      if (this.activeRuns.get(options.request.runId) === activeRun) {
        this.activeRuns.delete(options.request.runId)
      }
    })
  }

  async shutdown(): Promise<void> {
    this.shuttingDown = true
    const activeRuns = [...this.activeRuns.entries()]
    for (const [runId] of activeRuns) {
      this.terminate(runId)
    }
    await Promise.allSettled(
      activeRuns.flatMap(([, activeRun]) =>
        activeRun.execution ? [activeRun.execution] : []
      )
    )
  }

  private async executeRun(
    { request, context, signal }: SuperviseFunctionRunOptions,
    activeRun: ActiveRun
  ): Promise<FunctionRunResult> {
    const terminate = () => {
      this.terminate(request.runId)
    }

    signal?.addEventListener("abort", terminate, { once: true })
    try {
      const execution = this.executor.execute(request, context)
      if (signal?.aborted) {
        terminate()
      }
      const result = await execution
      return activeRun.terminationRequested ? createStopped(result) : result
    } finally {
      signal?.removeEventListener("abort", terminate)
    }
  }
}
