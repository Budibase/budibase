const TOKEN_MAP = {
  EQUALS: "===",
  NOT_EQUALS: "!==",
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
  sum: {
    field: "string",
    value: "number",
  },
  count: {
    field: "string",
    value: "number",
  },
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

  let first = true
  for (let filter of filters) {
    if (!first && filter.conjunction) {
      expression.push(TOKEN_MAP[filter.conjunction])
    }

    if (filter.condition === "CONTAINS") {
      expression.push(
        `doc["${filter.key}"].${TOKEN_MAP[filter.condition]}("${filter.value}")`
      )
    } else {
      const value =
        typeof filter.value == "string" ? `"${filter.value}"` : filter.value

      expression.push(
        `doc["${filter.key}"] ${TOKEN_MAP[filter.condition]} ${value}`
      )
    }
    first = false
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
  return `emit(doc["${groupBy || "_id"}"], doc["${field}"]);`
}

/**
 * Return a fully parsed CouchDB compliant view definition
 * that will be stored in the design document in the database.
 *
 * @param {Object} viewDefinition - the JSON definition for a custom view.
 * field: field that calculations will be performed on
 * tableId: tableId of the table this view was created from
 * groupBy: field that calculations will be grouped by. Field must be present for this to be useful
 * filters: Array of filter objects containing predicates that are parsed into a JS expression
 * calculation: an optional calculation to be performed over the view data.
 */
function viewTemplate({ field, tableId, groupBy, filters = [], calculation }) {
  // first filter can't have a conjunction
  if (filters && filters.length > 0 && filters[0].conjunction) {
    delete filters[0].conjunction
  }
  const parsedFilters = parseFilterExpression(filters)
  const filterExpression = parsedFilters ? `&& ${parsedFilters}` : ""

  const emitExpression = parseEmitExpression(field, groupBy)

  const reduction = field && calculation ? { reduce: `_${calculation}` } : {}

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
      tableId,
      groupBy,
      filters,
      schema,
      calculation,
    },
    map: `function (doc) {
      if (doc.tableId === "${tableId}" ${filterExpression}) {
        ${emitExpression}
      }
    }`,
    ...reduction,
  }
}

module.exports = viewTemplate
