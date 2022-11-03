import { LuceneUtils } from "@budibase/frontend-core"

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

    const query = LuceneUtils.buildLuceneQuery([luceneCondition])
    const result = LuceneUtils.runLuceneQuery([luceneCondition], query)
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

/**
 * Returns the conditional cell setting values. Empty if no conditions are met.
 * @param row the row to check the condition against
 * @param field the name of the table column
 * @param conditions a list of cell conditions
 */
export const getConditionalCellSettingValues = (row, field, conditions) => {
  if (!conditions?.length) {
    return []
  }

  return conditions.filter(condition => {
    // Parse values into correct types
    if (condition.valueType === "number") {
      condition.referenceValue = parseFloat(condition.referenceValue)
    } else if (condition.valueType === "datetime") {
      if (condition.referenceValue) {
        condition.referenceValue = new Date(
          condition.referenceValue
        ).toISOString()
      }
    } else if (condition.valueType === "boolean") {
      condition.referenceValue =
        `${condition.referenceValue}`.toLowerCase() === "true"
    }

    // Build lucene compatible condition expression
    const luceneCondition = {
      ...condition,
      type: condition.valueType,
      field,
      value: condition.referenceValue,
    }
    const query = LuceneUtils.buildLuceneQuery([luceneCondition])
    return LuceneUtils.runLuceneQuery([row], query).length > 0
  })
}
