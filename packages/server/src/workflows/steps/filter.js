const LogicConditions = {
  EQUAL: "EQUAL",
  NOT_EQUAL: "NOT_EQUAL",
  GREATER_THAN: "GREATER_THAN",
  LESS_THAN: "LESS_THAN",
}

const PrettyLogicConditions = {
  [LogicConditions.EQUAL]: "Equals",
  [LogicConditions.NOT_EQUAL]: "Not equals",
  [LogicConditions.GREATER_THAN]: "Greater than",
  [LogicConditions.LESS_THAN]: "Less than",
}

module.exports.definition = {
  name: "Filter",
  tagline: "{{inputs.filter}} {{inputs.condition}} {{inputs.value}}",
  icon: "ri-git-branch-line",
  description: "Filter any workflows which do not meet certain conditions",
  type: "LOGIC",
  stepId: "FILTER",
  inputs: {
    condition: LogicConditions.EQUALS,
  },
  schema: {
    inputs: {
      properties: {
        field: {
          type: "string",
          title: "Reference Value",
        },
        condition: {
          type: "string",
          title: "Condition",
          enum: Object.values(LogicConditions),
          pretty: Object.values(PrettyLogicConditions),
        },
        value: {
          type: "string",
          title: "Comparison Value",
        },
      },
      required: ["field", "condition", "value"],
    },
    outputs: {
      properties: {
        success: {
          type: "boolean",
          description: "Whether the logic block passed",
        },
      },
      required: ["success"],
    },
  },
}

module.exports.run = async function filter({ inputs }) {
  const { field, condition, value } = inputs
  let success
  if (typeof field !== "object" && typeof value !== "object") {
    switch (condition) {
      case LogicConditions.EQUAL:
        success = field === value
        break
      case LogicConditions.NOT_EQUAL:
        success = field !== value
        break
      case LogicConditions.GREATER_THAN:
        success = field > value
        break
      case LogicConditions.LESS_THAN:
        success = field < value
        break
      default:
        return
    }
  } else {
    success = false
  }
  return { success }
}
