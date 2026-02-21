import { ViewFilter, DBView } from "@budibase/types"

const TOKEN_MAP: Record<string, string> = {
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

const CONDITIONS: Record<string, string> = {
  EMPTY: "EMPTY",
  NOT_EMPTY: "NOT_EMPTY",
  CONTAINS: "CONTAINS",
}

function tokenOrThrow(type: "condition" | "conjunction", token?: string) {
  const mappedToken = token ? TOKEN_MAP[token] : undefined
  if (!mappedToken) {
    throw new Error(`Invalid filter ${type}: ${token}`)
  }
  return mappedToken
}

function docKeyExpression(key: string) {
  return `doc[${JSON.stringify(key)}]`
}

function isEmptyExpression(key: string) {
  const docExpression = docKeyExpression(key)
  return `(
      ${docExpression} === undefined ||
      ${docExpression} === null ||
      ${docExpression} === "" ||
      (Array.isArray(${docExpression}) && ${docExpression}.length === 0)
  )`
}

const GROUP_PROPERTY: Record<string, { type: string }> = {
  group: {
    type: "string",
  },
}

const GROUP_PROPERTY_MULTI: Record<string, { type: string }> = {
  group: {
    type: "array",
  },
}

const FIELD_PROPERTY: Record<string, { type: string }> = {
  field: {
    type: "string",
  },
}

const SCHEMA_MAP: Record<string, any> = {
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
 * @param filters - an array of filter objects
 * @returns JS Expression
 */
function parseFilterExpression(filters: ViewFilter[]) {
  const expression = []

  let first = true
  for (let filter of filters) {
    if (!first && filter.conjunction) {
      expression.push(tokenOrThrow("conjunction", filter.conjunction))
    }

    if (filter.condition === CONDITIONS.CONTAINS) {
      const condition = tokenOrThrow("condition", filter.condition)
      const valueLiteral = JSON.stringify(filter.value)
      expression.push(
        `${docKeyExpression(filter.key)}.${condition}(${valueLiteral})`
      )
    } else if (filter.condition === CONDITIONS.EMPTY) {
      expression.push(isEmptyExpression(filter.key))
    } else if (filter.condition === CONDITIONS.NOT_EMPTY) {
      expression.push(`!${isEmptyExpression(filter.key)}`)
    } else {
      const condition = tokenOrThrow("condition", filter.condition)
      const value = JSON.stringify(filter.value)

      expression.push(`${docKeyExpression(filter.key)} ${condition} ${value}`)
    }
    first = false
  }

  return expression.join(" ")
}

/**
 * Returns a CouchDB compliant emit() expression that is used to emit the
 * correct key/value pairs for custom views.
 * @param field - field to use for calculations, if any
 * @param groupBy - field to group calculation results on, if any
 */
function parseEmitExpression(field: string, groupBy: string) {
  return `emit(${docKeyExpression(groupBy)}, ${docKeyExpression(field)});`
}

/**
 * Return a fully parsed CouchDB compliant view definition
 * that will be stored in the design document in the database.
 *
 * @param viewDefinition - the JSON definition for a custom view.
 * field: field that calculations will be performed on
 * tableId: tableId of the table this view was created from
 * groupBy: field that calculations will be grouped by. Field must be present for this to be useful
 * filters: Array of filter objects containing predicates that are parsed into a JS expression
 * calculation: an optional calculation to be performed over the view data.
 */
export default function (
  {
    field,
    tableId,
    groupBy,
    filters = [],
    calculation,
  }: {
    field: string
    tableId: string
    groupBy?: string
    filters?: ViewFilter[]
    calculation?: string
  },
  groupByMulti?: boolean
): DBView {
  // first filter can't have a conjunction
  if (filters && filters.length > 0 && filters[0].conjunction) {
    delete filters[0].conjunction
  }

  let schema = null,
    statFilter = null

  let groupBySchema = groupByMulti ? GROUP_PROPERTY_MULTI : GROUP_PROPERTY

  if (calculation) {
    schema = {
      ...(groupBy ? groupBySchema : FIELD_PROPERTY),
      ...SCHEMA_MAP[calculation],
    }
    if (
      !filters.find(
        filter =>
          filter.key === field && filter.condition === CONDITIONS.NOT_EMPTY
      )
    ) {
      statFilter = parseFilterExpression([
        { key: field, condition: CONDITIONS.NOT_EMPTY },
      ])
    }
  }

  const parsedFilters = parseFilterExpression(filters)
  const filterExpression = parsedFilters ? `&& (${parsedFilters})` : ""

  const emitExpression = parseEmitExpression(field, groupBy || "_id")
  const tableExpression = `doc.tableId === ${JSON.stringify(tableId)}`
  const coreExpression = statFilter
    ? `(${tableExpression} && ${statFilter})`
    : tableExpression
  const reduction = field && calculation ? { reduce: `_${calculation}` } : {}

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
      if (${coreExpression} ${filterExpression}) {
        ${emitExpression}
      }
    }`,
    ...reduction,
  }
}
