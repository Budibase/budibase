import {
  AutomationActionStepId,
  AutomationStepDefinition,
  AutomationStepType,
  AutomationIOType,
  Automation,
  AutomationCustomIOType,
  TriggerAutomationStepInputs,
  TriggerAutomationStepOutputs,
} from "@budibase/types"
import * as triggers from "../triggers"
import { context } from "@budibase/backend-core"
import { features } from "@budibase/pro"
import env from "../../environment"

export const definition: AutomationStepDefinition = {
  name: "Trigger an automation",
  tagline: "Triggers an automation synchronously",
  icon: "Sync",
  description: "Triggers an automation synchronously",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {},
  stepId: AutomationActionStepId.TRIGGER_AUTOMATION_RUN,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        automation: {
          type: AutomationIOType.OBJECT,
          properties: {
            automationId: {
              type: AutomationIOType.STRING,
              customType: AutomationCustomIOType.AUTOMATION,
            },
          },
          customType: AutomationCustomIOType.AUTOMATION_FIELDS,
          title: "automatioFields",
          required: ["automationId"],
        },
        timeout: {
          type: AutomationIOType.NUMBER,
          title: "Timeout (ms)",
        },
      },
      required: ["automationId"],
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the automation was successful",
        },
        value: {
          type: AutomationIOType.OBJECT,
          description: "Automation Result",
        },
      },
      required: ["success", "value"],
    },
  },
}

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
