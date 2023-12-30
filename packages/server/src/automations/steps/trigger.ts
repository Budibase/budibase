import {
  AutomationActionStepId,
  AutomationStepSchema,
  AutomationStepInput,
  AutomationStepType,
  AutomationIOType,
  AutomationFeature,
  AutomationResults,
  Automation,
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
        automationId: {
          type: AutomationIOType.STRING,
          title: "Automation ID to trigger",
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
  console.log("??: " + inputs.automationId)
  console.log("???DSAASDFAFSDFDSFDS")
  if (!inputs.automationId) {
    return {
      success: false,
    }
  } else {
    const db = context.getAppDB()
    let automation = await db.get<Automation>(inputs.automationId)

    const response: AutomationResults = await triggers.externalTrigger(
      automation,
      {
        fields: {},
        timeout: 120000,
      },
      { getResponses: true }
    )

    return {
      success: true,
      value: response,
    }
  }
}
