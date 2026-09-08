import type {
  FunctionCapabilityHandler,
  FunctionRunExecutionOptions,
  FunctionRunRequest,
  FunctionRunResult,
} from "@budibase/types"

export interface FunctionCapabilitySession {
  invokeCapability: FunctionCapabilityHandler
  close: () => void
}

export interface OrchestrateFunctionRunOptions<TCapabilityScope> {
  request: FunctionRunRequest
  capabilityScope: TCapabilityScope
  signal?: AbortSignal
}

export interface FunctionRunOrchestratorDependencies<TCapabilityScope> {
  execute: (options: FunctionRunExecutionOptions) => Promise<FunctionRunResult>
  createCapabilitySession: (
    scope: TCapabilityScope
  ) => Promise<FunctionCapabilitySession>
}

// Execution and capability-session creation are injected so this lifecycle can
// be shared by local and external runner transports.
export class FunctionRunOrchestrator<TCapabilityScope> {
  constructor(
    private readonly dependencies: FunctionRunOrchestratorDependencies<TCapabilityScope>
  ) {}

  async execute({
    request,
    capabilityScope,
    signal,
  }: OrchestrateFunctionRunOptions<TCapabilityScope>): Promise<FunctionRunResult> {
    const capabilitySession =
      await this.dependencies.createCapabilitySession(capabilityScope)
    try {
      return await this.dependencies.execute({
        request,
        context: {
          invokeCapability: capabilitySession.invokeCapability,
        },
        signal,
      })
    } finally {
      capabilitySession.close()
    }
  }
}
