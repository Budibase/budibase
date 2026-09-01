import type {
  FunctionExecutor,
  FunctionRunExecutionOptions,
  FunctionRunResult,
} from "@budibase/types"

const createStopped = (result: FunctionRunResult): FunctionRunResult => ({
  runId: result.runId,
  status: "stopped",
  metrics: {
    ...result.metrics,
    outputBytes: 0,
    logBytes: 0,
  },
})

export interface FunctionRunSupervisorOptions {
  executor: FunctionExecutor
}

interface ActiveRun {
  terminationRequested: boolean
}

export class FunctionRunSupervisor {
  private readonly executor: FunctionExecutor
  private readonly activeRuns = new Map<string, ActiveRun>()

  constructor({ executor }: FunctionRunSupervisorOptions) {
    this.executor = executor
  }

  isHealthy(): boolean {
    return true
  }

  terminate(runId: string): void {
    const activeRun = this.activeRuns.get(runId)
    if (activeRun?.terminationRequested) {
      return
    }
    if (activeRun) {
      activeRun.terminationRequested = true
    }
    this.executor.terminate(runId).catch(error => {
      console.error(`Failed to terminate function run ${runId}`, error)
    })
  }

  async execute(
    options: FunctionRunExecutionOptions
  ): Promise<FunctionRunResult> {
    const activeRun: ActiveRun = { terminationRequested: false }
    this.activeRuns.set(options.request.runId, activeRun)
    const execution = this.executeRun(options, activeRun)
    return execution.finally(() => {
      if (this.activeRuns.get(options.request.runId) === activeRun) {
        this.activeRuns.delete(options.request.runId)
      }
    })
  }

  private async executeRun(
    { request, context, signal }: FunctionRunExecutionOptions,
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
