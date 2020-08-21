const TOKEN_MAP = {
  EQUALS: "===",
  LT: "<",
  LTE: "<=",
  MT: ">",
  MTE: ">=",
  CONTAINS: "includes",
  AND: "&&",
  OR: "||",
}

/**
 * Iterates through the array of filters to create a JS
 * expression that gets used in a CouchDB view.
 * @param {Array} filters - an array of filter objects
 * @returns {String} JS Expression
 */
function parseFilterExpression(filters) {
  const expression = []

  for (let filter of filters) {
    if (filter.conjunction) expression.push(TOKEN_MAP[filter.conjunction]);

    if (filter.condition === "CONTAINS") {
      expression.push(
        `doc["${filter.key}"].${TOKEN_MAP[filter.condition]}("${
        filter.value
      }")`)
      return
    }

    expression.push(`doc["${filter.key}"] ${TOKEN_MAP[filter.condition]} "${
      filter.value
    }"`)
  }

  return expression.join(" ")
}

function parseEmitExpression(field, groupBy) {
  if (field) return `emit(doc["${groupBy || "_id"}"], doc["${field}"]);`
  return `emit(doc._id);`
}

function statsViewTemplate({ field, modelId, groupBy, filters = [] }) {
  const filterExpression = parseFilterExpression(filters)

  const emitExpression = parseEmitExpression(field, groupBy)

  return {
    meta: {
      field,
      modelId,
      groupBy,
      filters,
      schema: {
        sum: "number",
        min: "number",
        max: "number",
        count: "number",
        sumsqr: "number",
        avg: "number",
      },
    },
    map: `function (doc) {
      if (doc.modelId === "${modelId}" ${
      filterExpression ? `&& ${filterExpression}` : ""
    }) {
        ${emitExpression}
      }
    }`,
    reduce: "_stats",
  }
}

module.exports = statsViewTemplate
