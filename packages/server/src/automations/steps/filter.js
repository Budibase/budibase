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
          description: "Whether the logic block passed",
        },
      },
      required: ["success"],
    },
  },
}

exports.run = async function filter({ inputs }) {
  let { field, condition, value } = inputs
  // coerce types so that we can use them
  if (!isNaN(value) && !isNaN(field)) {
    value = parseFloat(value)
    field = parseFloat(field)
  } else if (!isNaN(Date.parse(value)) && !isNaN(Date.parse(field))) {
    value = Date.parse(value)
    field = Date.parse(field)
  }
  let success = false
  if (typeof field !== "object" && typeof value !== "object") {
    switch (condition) {
      case FilterConditions.EQUAL:
        success = field === value
        break
      case FilterConditions.NOT_EQUAL:
        success = field !== value
        break
      case FilterConditions.GREATER_THAN:
        success = field > value
        break
      case FilterConditions.LESS_THAN:
        success = field < value
        break
    }
  } else {
    success = false
  }
  return { success }
}
