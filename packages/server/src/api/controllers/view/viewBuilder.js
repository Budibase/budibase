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

const GROUP_PROPERTY = {
  group: {
    type: "string",
  },
}

const FIELD_PROPERTY = {
  field: {
    type: "string",
  },
}

const SCHEMA_MAP = {
  stats: {
    sum: {
      type: "number",
    },
    min: {
      type: "number",
    },
    max: {
      type: "number",
    },
    count: {
      type: "number",
    },
    sumsqr: {
      type: "number",
    },
    avg: {
      type: "number",
    },
  },
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
    if (filter.conjunction) expression.push(TOKEN_MAP[filter.conjunction])

    if (filter.condition === "CONTAINS") {
      expression.push(`doc["${filter.key}"].${TOKEN_MAP[filter.condition]}("${filter.value}")`)
    } else {
      expression.push(`doc["${filter.key}"] ${TOKEN_MAP[filter.condition]} "${filter.value}"`)
    }
  }

  return expression.join(" ")
}

/**
 * Returns a CouchDB compliant emit() expression that is used to emit the
 * correct key/value pairs for custom views.
 * @param {String?} field - field to use for calculations, if any
 * @param {String?} groupBy - field to group calculation results on, if any
 */
function parseEmitExpression(field, groupBy) {
  if (field) return `emit(doc["${groupBy || "_id"}"], doc["${field}"]);`
  return `emit(doc._id);`
}

/**
 * Return a fully parsed CouchDB compliant view definition
 * that will be stored in the design document in the database.
 *
 * @param {Object} viewDefinition - the JSON definition for a custom view.
 * field: field that calculations will be performed on
 * modelId: modelId of the model this view was created from
 * groupBy: field that calculations will be grouped by. Field must be present for this to be useful
 * filters: Array of filter objects containing predicates that are parsed into a JS expression
 * calculation: an optional calculation to be performed over the view data.
 */
function viewTemplate({ field, modelId, groupBy, filters = [], calculation }) {
  const parsedFilters = parseFilterExpression(filters)
  const filterExpression = parsedFilters ? `&& ${parsedFilters}` : ""

  const emitExpression = parseEmitExpression(field, groupBy)

  const reduction = field ? { reduce: "_stats" } : {}

  let schema = null

  if (calculation) {
    schema = {
      ...(groupBy ? GROUP_PROPERTY : FIELD_PROPERTY),
      ...SCHEMA_MAP[calculation],
    }
  }

  return {
    meta: {
      field,
      modelId,
      groupBy,
      filters,
      schema,
      calculation,
    },
    map: `function (doc) {
      if (doc.modelId === "${modelId}" ${filterExpression}) {
        ${emitExpression}
      }
    }`,
    ...reduction,
  }
}

module.exports = viewTemplate
