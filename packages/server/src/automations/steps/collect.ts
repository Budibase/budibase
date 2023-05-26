import {
  AutomationActionStepId,
  AutomationStepSchema,
  AutomationStepInput,
  AutomationStepType,
  AutomationIOType,
  AutomationFeature,
} from "@budibase/types"

export const definition: AutomationStepSchema = {
  name: "Collect Data",
  tagline: "Collect data to be sent to design",
  icon: "Collection",
  description:
    "Collects specified data so it can be provided to the design section",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {},
  stepId: AutomationActionStepId.COLLECT,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        collection: {
          type: AutomationIOType.STRING,
          title: "What to Collect",
        },
      },
      required: ["collection"],
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the action was successful",
        },
        value: {
          type: AutomationIOType.STRING,
          description: "Collected data",
        },
      },
      required: ["success", "value"],
    },
  },
}

export async function run({ inputs }: AutomationStepInput) {
  if (!inputs.collection) {
    return {
      success: false,
    }
  } else {
    return {
      success: true,
      value: inputs.collection,
    }
  }
}
