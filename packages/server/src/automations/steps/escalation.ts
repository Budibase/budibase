import { context } from "@budibase/backend-core"
import {
  AutomationStepInputBase,
  EscalationSource,
  EscalationStepInputs,
  EscalationStepOutputs,
} from "@budibase/types"
import { AutomationContext } from "../../definitions/automations"
import sdk from "../../sdk"
import { escalationProcessor } from "../../escalation/processor"

export async function run({
  inputs,
  appId,
  context: executionContext,
  automationId,
  stepId,
}: {
  inputs: EscalationStepInputs
} & AutomationStepInputBase): Promise<EscalationStepOutputs> {
  const tenantId = context.getTenantId()
  const ctx = executionContext as AutomationContext

  const parseJsonInput = <T>(input: T | string): T =>
    typeof input === "string" ? JSON.parse(input) : input

  console.log("Escalation step inputs.resolutionStrategy", {
    resolutionStrategy: inputs.resolutionStrategy,
  })

  if (!automationId || !stepId) {
    throw new Error("Escalation step requires automationId and stepId")
  }

  const recipients = inputs.notifications
    ? parseJsonInput(inputs.notifications).recipients
    : undefined

  if (!recipients?.length) {
    return { success: false, escalationId: undefined }
  }

  const automation = await sdk.automations.get(automationId)

  const { escalationId } = await escalationProcessor.create({
    source: EscalationSource.AUTOMATION,
    automationId,
    stepId,
    appId,
    tenantId,
    message: inputs.message,
    context: {
      automation,
      userId: ctx.user?._id,
      stepResults: ctx._stepResults ?? [],
      state: ctx.state ?? {},
    },
    delay: inputs.delay * 1000,
    ...(inputs.operationId && { escalationId: inputs.operationId }),
    ...(inputs.agentId && { agentId: inputs.agentId }),
    ...(inputs.notifications && {
      recipients: parseJsonInput(inputs.notifications).recipients,
    }),
    ...(inputs.resolutionStrategy && {
      resolutionStrategy: inputs.resolutionStrategy,
    }),
  })

  return {
    success: true,
    escalationId,
  }
}
