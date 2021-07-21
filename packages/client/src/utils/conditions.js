import {
  buildLuceneQuery,
  luceneQuery,
} from "../../../standard-components/src/lucene"

export const getActiveConditions = conditions => {
  if (!conditions?.length) {
    return []
  }

  const luceneCompatibleConditions = conditions.map(condition => {
    return {
      ...condition,
      type: "string",
      field: "newValue",
      value: condition.referenceValue,
    }
  })

  const query = buildLuceneQuery(luceneCompatibleConditions)
  console.log(luceneQuery)

  return luceneQuery(luceneCompatibleConditions, query)
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
