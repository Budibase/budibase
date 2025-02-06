import {
  Automation,
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
      }
    } else {
      const db = context.getAppDB()
      let automation = await db.get<Automation>(inputs.automation.automationId)

      const response = await triggers.externalTrigger(
        automation,
        {
          fields: { ...fieldParams },
          timeout:
            inputs.timeout * 1000 || env.getDefaults().AUTOMATION_SYNC_TIMEOUT,
        },
        { getResponses: true }
      )

      if (triggers.isAutomationResults(response)) {
        return {
          success: true,
          value: response.steps,
        }
      } else {
        throw new Error("Automation did not have a collect block")
      }
    }
  } else {
    return {
      success: false,
    }
  }
}
