import {
  Automation,
  AutomationStatus,
  TriggerAutomationStepInputs,
  TriggerAutomationStepOutputs,
} from "@budibase/types"
import * as triggers from "../triggers"
import { context } from "@budibase/backend-core"
import { features } from "@budibase/pro"
import env from "../../environment"

export async function run({
  inputs,
}: {
  inputs: TriggerAutomationStepInputs
}): Promise<TriggerAutomationStepOutputs> {
  const { automationId, ...fieldParams } = inputs.automation

  if (await features.isTriggerAutomationRunEnabled()) {
    if (!inputs.automation.automationId) {
      return {
        success: false,
        status: AutomationStatus.ERROR,
      }
    } else {
      const db = context.getAppDB()
      let automation = await db.get<Automation>(inputs.automation.automationId)

      let timeout = env.AUTOMATION_THREAD_TIMEOUT
      if (inputs.timeout !== undefined) {
        timeout = inputs.timeout * 1000
      }

      const response = await triggers.externalTrigger(
        automation,
        { fields: { ...fieldParams }, timeout },
        { getResponses: true }
      )

      if (triggers.isAutomationResults(response)) {
        return {
          success: response.status === AutomationStatus.SUCCESS,
          value: response.steps,
          status: response.status,
        }
      } else {
        throw new Error("Automation did not have a collect block")
      }
    }
  } else {
    return {
      success: false,
      status: AutomationStatus.ERROR,
    }
  }
}
