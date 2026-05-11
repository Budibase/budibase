import {
  AutomationActionStepId,
  AutomationCustomIOType,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Switch",
  icon: "git-branch",
  tagline: "Switch between conditions",
  description: "Switch between condition paths",
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
