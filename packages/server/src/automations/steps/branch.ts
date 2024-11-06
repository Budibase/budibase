import {
  AutomationActionStepId,
  AutomationCustomIOType,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Branch",
  icon: "Branch3",
  tagline: "Branch from this step",
  description: "Branching",
  stepId: AutomationActionStepId.BRANCH,
  internal: true,
  features: {},
  inputs: {},
  schema: {
    inputs: {
      properties: {
        branches: {
          properties: {
            name: {
              type: AutomationIOType.STRING,
            },
            condition: {
              customType: AutomationCustomIOType.FILTERS,
            },
          },
        },
        children: {
          type: AutomationIOType.ARRAY,
        },
      },
      required: ["conditions"],
    },
    outputs: {
      properties: {
        branchName: {
          type: AutomationIOType.STRING,
        },
        status: {
          type: AutomationIOType.STRING,
          description: "Branch result",
        },
        branchId: {
          type: AutomationIOType.STRING,
          description: "Branch ID",
        },
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Branch success",
        },
      },
      required: ["output"],
    },
  },
  type: AutomationStepType.LOGIC,
}
