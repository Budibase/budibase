import { FilterStepInputs, FilterStepOutputs } from "@budibase/types"
import { automations } from "@budibase/shared-core"

const FilterConditions = automations.steps.filter.FilterConditions

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
