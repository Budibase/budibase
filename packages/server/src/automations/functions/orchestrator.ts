import { context } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import {
  createFunctionInvocationScope,
  FunctionCapabilityService,
  type FunctionCapabilityMeterResult,
  type FunctionInvocation,
  FunctionRunOrchestrator,
} from "@budibase/functions-runtime"
import {
  ActionType,
  FunctionErrorCode,
  type FunctionArtifact,
  type FunctionQueryCapability,
  type JSONValue,
  type FunctionRunLimits,
  type FunctionRunResult,
  type UserBindings,
} from "@budibase/types"
import type {
  FunctionCapabilityExecution,
  FunctionInvocationScopeInput,
} from "@budibase/functions-runtime"
import { executeQueryAsAutomation } from "../../api/controllers/query/executeAsAutomation"
import {
  createRunSummary,
  finalizeRunSummary,
  type FinalizeRunSummaryInput,
} from "../../sdk/workspace/functions/history"
import { buildCtx } from "../steps/utils"
import { functionRunSupervisor } from "./supervisor"

const executeQuery = async ({
  scope,
  capability,
  parameters,
}: FunctionCapabilityExecution) =>
  context.doInWorkspaceContext(scope.workspaceId, async () => {
    const ctx = buildCtx(scope.workspaceId, null, {
      body: { parameters },
      params: { queryId: capability.queryId },
      user: scope.executionUser,
    })
    await executeQueryAsAutomation(ctx)
    return ctx.body
  })

const meterQuery = (
  execute: () => Promise<object>
): Promise<FunctionCapabilityMeterResult> =>
  quotas.addAction(
    ActionType.AUTOMATION_STEP,
    async (): Promise<
      { success: true; response: object } | { success: false }
    > => {
      try {
        return {
          success: true,
          response: await execute(),
        }
      } catch {
        return { success: false }
      }
    }
  )

const createCapabilitySession = async (input: FunctionInvocationScopeInput) => {
  return new FunctionCapabilityService(createFunctionInvocationScope(input), {
    executeQuery,
    meter: async execute =>
      await context.doInWorkspaceContext(input.workspaceId, () =>
        meterQuery(execute)
      ),
  })
}

export interface FunctionRunDefinition {
  id: string
  name: string
  artifact: FunctionArtifact
  capabilities: FunctionQueryCapability[]
}

export interface FunctionRunOrchestrationOptions {
  runId: string
  workspaceId: string
  definition: FunctionRunDefinition
  inputs: Record<string, JSONValue>
  limits: FunctionRunLimits
  invocation: FunctionInvocation
  executionUser?: UserBindings
  signal?: AbortSignal
}

const runtimeOrchestrator = new FunctionRunOrchestrator({
  execute: options => functionRunSupervisor.execute(options),
  createCapabilitySession,
})

export const functionRunOrchestrator = {
  execute: async ({
    runId,
    workspaceId,
    definition,
    inputs,
    limits,
    invocation,
    executionUser,
    signal,
  }: FunctionRunOrchestrationOptions): Promise<FunctionRunResult> => {
    const request = {
      runId,
      artifact: definition.artifact,
      inputs,
      limits,
    }
    const capabilityScope = {
      runId,
      workspaceId,
      functionId: definition.id,
      sourceHash: definition.artifact.sourceHash,
      invocation,
      executionUser,
      capabilities: definition.capabilities,
      limits,
    }

    let summaryCreated = false
    try {
      await createRunSummary({
        runId,
        functionId: definition.id,
        functionName: definition.name,
        sourceHash: definition.artifact.sourceHash,
        automationId: invocation.automationId,
        stepId: invocation.automationStepId,
      })
      summaryCreated = true
    } catch (error) {
      console.error(
        `Failed to create Function run summary for run "${runId}"`,
        error
      )
    }

    let summaryResult: FinalizeRunSummaryInput = {
      status: "error",
      code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
    }
    try {
      const result = await runtimeOrchestrator.execute({
        request,
        capabilityScope,
        signal,
      })
      if (result.runId === runId) {
        summaryResult = result
      }
      return result
    } finally {
      if (summaryCreated) {
        try {
          await finalizeRunSummary(runId, summaryResult)
        } catch (error) {
          console.error(
            `Failed to finalize Function run summary for run "${runId}"`,
            error
          )
        }
      }
    }
  },
}
