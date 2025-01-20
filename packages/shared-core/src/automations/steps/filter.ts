import {
  AutomationActionStepId,
  AutomationStepDefinition,
  AutomationStepType,
  AutomationIOType,
} from "@budibase/types"

export const FilterConditions = {
  EQUAL: "EQUAL",
  NOT_EQUAL: "NOT_EQUAL",
  GREATER_THAN: "GREATER_THAN",
  LESS_THAN: "LESS_THAN",
}

export const PrettyFilterConditions = {
  [FilterConditions.EQUAL]: "Equals",
  [FilterConditions.NOT_EQUAL]: "Not equals",
  [FilterConditions.GREATER_THAN]: "Greater than",
  [FilterConditions.LESS_THAN]: "Less than",
}

export const definition: AutomationStepDefinition = {
  name: "Condition",
  tagline: "{{inputs.field}} {{inputs.condition}} {{inputs.value}}",
  icon: "Branch2",
  description:
    "Conditionally halt automations which do not meet certain conditions",
  type: AutomationStepType.LOGIC,
  internal: true,
  features: {},
  stepId: AutomationActionStepId.FILTER,
  inputs: {
    condition: FilterConditions.EQUAL,
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
          enum: Object.values(FilterConditions),
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
