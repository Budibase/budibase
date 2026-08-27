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
      return await execution
    } finally {
      signal?.removeEventListener("abort", terminate)
    }
  }
}

export const functionRunSupervisor = new FunctionRunSupervisor()
