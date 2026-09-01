import { context } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import {
  createFunctionInvocationScope,
  FunctionCapabilityService,
  type FunctionCapabilityMeterResult,
  FunctionRunOrchestrator,
  type OrchestrateFunctionRunOptions,
} from "@budibase/functions-runtime"
import { ActionType } from "@budibase/types"
import type {
  FunctionCapabilityExecution,
  FunctionInvocationScopeInput,
} from "@budibase/functions-runtime"
import { executeQueryAsAutomation } from "../../api/controllers/query/executeAsAutomation"
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
    meter: meterQuery,
  })
}

export type FunctionRunOrchestrationOptions =
  OrchestrateFunctionRunOptions<FunctionInvocationScopeInput>

export const functionRunOrchestrator = new FunctionRunOrchestrator({
  execute: options => functionRunSupervisor.execute(options),
  createCapabilitySession,
})
