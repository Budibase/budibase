import {
  AutomationActionStepId,
  AutomationStepDefinition,
  AutomationStepType,
  AutomationIOType,
  FilterCondition,
} from "@budibase/types"

export const PrettyFilterConditions = {
  [FilterCondition.EQUAL]: "Equals",
  [FilterCondition.NOT_EQUAL]: "Not equals",
  [FilterCondition.GREATER_THAN]: "Greater than",
  [FilterCondition.LESS_THAN]: "Less than",
}

export const definition: AutomationStepDefinition = {
  name: "Condition",
  tagline: "{{inputs.field}} {{inputs.condition}} {{inputs.value}}",
  icon: "git-branch",
  description:
    "Conditionally halt automations which do not meet certain conditions",
  type: AutomationStepType.LOGIC,
  internal: true,
  features: {},
  stepId: AutomationActionStepId.FILTER,
  inputs: {
    condition: FilterCondition.EQUAL,
  },
  schema: {
    inputs: {
      properties: {
        field: {
          type: AutomationIOType.STRING,
          title: "Reference Value",
        },
        condition: {
          type: AutomationIOType.STRING,
          title: "Condition",
          enum: Object.values(FilterCondition),
          pretty: Object.values(PrettyFilterConditions),
        },
        value: {
          type: AutomationIOType.STRING,
          title: "Comparison Value",
        },
      },
      required: ["field", "condition", "value"],
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the action was successful",
        },
        result: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the logic block passed",
        },
      },
      required: ["success", "result"],
    },
  },
}
