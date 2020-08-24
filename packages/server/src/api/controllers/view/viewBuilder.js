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

const SCHEMA_MAP = {
  stats: {
    group: {
      type: "string"
    },
    sum: { 
      type: "number"
    },
    min: { 
      type: "number"
    },
    max: { 
      type: "number"
    },
    count: { 
      type: "number"
    },
    sumsqr: { 
      type: "number"
    },
    avg: { 
      type: "number"
    }
  }
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

function viewTemplate({ 
  field, 
  modelId, 
  groupBy, 
  filters = [],
  calculation
}) {
  const parsedFilters = parseFilterExpression(filters) 
  const filterExpression = parsedFilters ? `&& ${parsedFilters}` : ""

  const emitExpression = parseEmitExpression(field, groupBy)

  const reduction = field ? { reduce: "_stats" } : {}

  return {
    meta: {
      field,
      modelId,
      groupBy,
      filters,
      schema: SCHEMA_MAP[calculation],
      calculation
    },
    map: `function (doc) {
      if (doc.modelId === "${modelId}" ${filterExpression}) {
        ${emitExpression}
      }
    }`,
    ...reduction
  }
}

module.exports = viewTemplate
