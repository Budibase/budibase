import {
  AutomationActionStepId,
  AutomationStepSchema,
  AutomationStepInput,
  AutomationStepType,
  AutomationIOType,
  AutomationFeature,
  AutomationResults,
  Automation,
  AutomationCustomIOType,
} from "@budibase/types"
import * as triggers from "../triggers"
import { db as dbCore, context } from "@budibase/backend-core"

export const definition: AutomationStepSchema = {
  name: "Trigger Automation",
  tagline: "Triggers an automation synchronously",
  icon: "Sync",
  description: "Triggers an automation synchronously",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {},
  stepId: AutomationActionStepId.TRIGGER,
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

export async function run({ inputs }: AutomationStepInput) {
  const { automationId, ...fieldParams } = inputs.automation

  if (!inputs.automation.automationId) {
    return {
      success: false,
    }
  } else {
    const db = context.getAppDB()
    let automation = await db.get<Automation>(inputs.automation.automationId)

    const response: AutomationResults = await triggers.externalTrigger(
      automation,
      {
        fields: { ...fieldParams },
        timeout: inputs.timeout * 1000 || 120000,
      },
      { getResponses: true }
    )

    return {
      success: true,
      value: response.steps,
    }
  }
}
