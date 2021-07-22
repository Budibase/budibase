import {
  buildLuceneQuery,
  luceneQuery,
} from "../../../standard-components/src/lucene"

export const getActiveConditions = conditions => {
  if (!conditions?.length) {
    return []
  }

  return conditions.filter(condition => {
    const luceneCompatibleCondition = {
      ...condition,
      type: "string",
      field: "newValue",
      value: condition.referenceValue,
    }
    const query = buildLuceneQuery([luceneCompatibleCondition])
    const result = luceneQuery([luceneCompatibleCondition], query)
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
