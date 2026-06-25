import {
  AutomationActionStepId,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Merge",
  icon: "git-merge",
  tagline: "Merge branch paths",
  description: "Merge branch paths back into the automation flow",
  stepId: AutomationActionStepId.MERGE,
  internal: true,
  features: {},
  inputs: {},
  schema: {
    inputs: {
      properties: {},
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the merge was successful",
        },
      },
      required: ["success"],
    },
  },
  type: AutomationStepType.LOGIC,
}
