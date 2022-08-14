const FilterConditions = {
  EQUAL: "EQUAL",
  NOT_EQUAL: "NOT_EQUAL",
  GREATER_THAN: "GREATER_THAN",
  LESS_THAN: "LESS_THAN",
}

const PrettyFilterConditions = {
  [FilterConditions.EQUAL]: "Equals",
  [FilterConditions.NOT_EQUAL]: "Not equals",
  [FilterConditions.GREATER_THAN]: "Greater than",
  [FilterConditions.LESS_THAN]: "Less than",
}

exports.FilterConditions = FilterConditions
exports.PrettyFilterConditions = PrettyFilterConditions

exports.definition = {
  name: "Condition",
  tagline: "{{inputs.field}} {{inputs.condition}} {{inputs.value}}",
  icon: "Branch2",
  description:
    "Conditionally halt automations which do not meet certain conditions",
  type: "LOGIC",
  internal: true,
  stepId: "FILTER",
  inputs: {
    condition: FilterConditions.EQUALS,
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
          enum: Object.values(FilterConditions),
          pretty: Object.values(PrettyFilterConditions),
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
          description: "Whether the action was successful",
        },
        result: {
          type: "boolean",
          description: "Whether the logic block passed",
        },
      },
      required: ["success", "result"],
    },
  },
}

exports.run = async function filter({ inputs }) {
  try {
    let { field, condition, value } = inputs
    // coerce types so that we can use them
    if (!isNaN(value) && !isNaN(field)) {
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
    return { success: true, result }
  } catch (err) {
    return { success: false, result: false }
  }
}
