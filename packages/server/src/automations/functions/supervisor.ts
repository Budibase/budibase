import type {
  FunctionExecutionContext,
  FunctionExecutor,
  FunctionRunRequest,
  FunctionRunResult,
} from "@budibase/types"
import { functionExecutor } from "./executor"

interface FunctionRunSupervisorOptions {
  executor?: FunctionExecutor
}

const createStopped = (result: FunctionRunResult): FunctionRunResult => ({
  runId: result.runId,
  status: "stopped",
  metrics: {
    ...result.metrics,
    outputBytes: 0,
    logBytes: 0,
  },
})

export interface SuperviseFunctionRunOptions {
  request: FunctionRunRequest
  context: FunctionExecutionContext
  signal?: AbortSignal
}

export class FunctionRunSupervisor {
  private readonly executor: FunctionExecutor

  constructor({
    executor = functionExecutor,
  }: FunctionRunSupervisorOptions = {}) {
    this.executor = executor
  }

  async execute({
    request,
    context,
    signal,
  }: SuperviseFunctionRunOptions): Promise<FunctionRunResult> {
    let terminationRequested = false
    const terminate = () => {
      if (terminationRequested) {
        return
      }
      terminationRequested = true
      void this.executor.terminate(request.runId)
    }

    signal?.addEventListener("abort", terminate, { once: true })
    try {
      const execution = this.executor.execute(request, context)
      if (signal?.aborted) {
        terminate()
      }
      const result = await execution
      return terminationRequested ? createStopped(result) : result
    } finally {
      signal?.removeEventListener("abort", terminate)
    }
  }
}

export const functionRunSupervisor = new FunctionRunSupervisor()
