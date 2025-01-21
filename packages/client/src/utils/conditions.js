import { QueryUtils } from "@budibase/frontend-core"
import { EmptyFilterOption } from "@budibase/types"

export const getActiveConditions = conditions => {
  if (!conditions?.length) {
    return []
  }

  return conditions.filter(condition => {
    // Parse values into correct types
    if (condition.valueType === "number") {
      condition.referenceValue = parseFloat(condition.referenceValue)
      condition.newValue = parseFloat(condition.newValue)
    } else if (condition.valueType === "datetime") {
      if (condition.referenceValue) {
        condition.referenceValue = new Date(
          condition.referenceValue
        ).toISOString()
      }
      if (condition.newValue) {
        condition.newValue = new Date(condition.newValue).toISOString()
      }
    } else if (condition.valueType === "boolean") {
      condition.referenceValue =
        `${condition.referenceValue}`.toLowerCase() === "true"
      condition.newValue = `${condition.newValue}`.toLowerCase() === "true"
    }

    // Build lucene compatible condition expression
    const luceneCondition = {
      ...condition,
      type: condition.valueType,
      field: "newValue",
      value: condition.referenceValue,
    }

    let query = QueryUtils.buildQuery([luceneCondition])
    query.onEmptyFilter = EmptyFilterOption.RETURN_NONE
    const result = QueryUtils.runQuery([luceneCondition], query)
    return result.length > 0
  })
}

export const reduceConditionActions = conditions => {
  let settingUpdates = {}
  let visible = null

  conditions?.forEach(condition => {
    if (condition.action === "show") {
      visible = true
    } else if (condition.action === "hide") {
      visible = false
    } else if (condition.setting) {
      settingUpdates[condition.setting] = condition.settingValue
    }
  })

  return { settingUpdates, visible }
}
