const LogicConditions = {
  EQUALS: "Equals",
  NOT_EQUALS: "Not equals",
  GREATER_THAN: "Greater than",
  LESS_THAN: "Less than",
}

module.exports.definition = {
  name: "Filter",
  tagline: "{{inputs.filter}} {{inputs.condition}} {{inputs.value}}",
  icon: "ri-git-branch-line",
  description: "Filter any workflows which do not meet certain conditions",
  type: "LOGIC",
  stepId: "FILTER",
  inputs: {},
  schema: {
    inputs: {
      properties: {
        filter: {
          type: "string",
          title: "Reference Value",
        },
        condition: {
          type: "string",
          title: "Condition",
          enum: Object.values(LogicConditions),
          default: "equals",
        },
        value: {
          type: "string",
          title: "Comparison Value",
        },
      },
      required: ["filter", "condition", "value"],
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
      case LogicConditions.EQUALS:
        success = field === value
        break
      case LogicConditions.NOT_EQUALS:
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
