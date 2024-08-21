import {
  AutomationActionStepId,
  AutomationStepDefinition,
  AutomationStepType,
  AutomationIOType,
  FilterStepInputs,
  FilterStepOutputs,
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

export async function run({
  inputs,
}: {
  inputs: FilterStepInputs
}): Promise<FilterStepOutputs> {
  try {
    let { field, condition, value } = inputs
    // coerce types so that we can use them
    if (
      !isNaN(value) &&
      !isNaN(field) &&
      typeof field !== "boolean" &&
      typeof value !== "boolean"
    ) {
      value = parseFloat(value)
      field = parseFloat(field)
    } else if (!isNaN(Date.parse(value)) && !isNaN(Date.parse(field))) {
      value = Date.parse(value)
      field = Date.parse(field)
    }
    let result = false
    if (typeof field !== "object" && typeof value !== "object") {
      switch (condition) {
        case FilterConditions.EQUAL:
          result = field === value
          break
        case FilterConditions.NOT_EQUAL:
          result = field !== value
          break
        case FilterConditions.GREATER_THAN:
          result = field > value
          break
        case FilterConditions.LESS_THAN:
          result = field < value
          break
      }
    } else {
      result = false
    }
    return { success: true, result, refValue: field, comparisonValue: value }
  } catch (err) {
    return { success: false, result: false }
  }
}
