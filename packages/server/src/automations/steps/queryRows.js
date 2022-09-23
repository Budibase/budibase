const rowController = require("../../api/controllers/row")
const tableController = require("../../api/controllers/table")
const { FieldTypes } = require("../../constants")
const { buildCtx } = require("./utils")
const automationUtils = require("../automationUtils")

const SortOrders = {
  ASCENDING: "ascending",
  DESCENDING: "descending",
}

const SortOrdersPretty = {
  [SortOrders.ASCENDING]: "Ascending",
  [SortOrders.DESCENDING]: "Descending",
}

const EmptyFilterOptions = {
  RETURN_ALL: "all",
  RETURN_NONE: "none",
}

const EmptyFilterOptionsPretty = {
  [EmptyFilterOptions.RETURN_ALL]: "Return all table rows",
  [EmptyFilterOptions.RETURN_NONE]: "Return no rows",
}

exports.definition = {
  description: "Query rows from the database",
  icon: "Search",
  name: "Query rows",
  tagline: "Query rows from {{inputs.enriched.table.name}} table",
  type: "ACTION",
  stepId: "QUERY_ROWS",
  internal: true,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        tableId: {
          type: "string",
          customType: "table",
          title: "Table",
        },
        filters: {
          type: "object",
          customType: "filters",
          title: "Filtering",
        },
        sortColumn: {
          type: "string",
          title: "Sort Column",
          customType: "column",
        },
        sortOrder: {
          type: "string",
          title: "Sort Order",
          enum: Object.values(SortOrders),
          pretty: Object.values(SortOrdersPretty),
        },
        limit: {
          type: "number",
          title: "Limit",
          customType: "queryLimit",
        },
        onEmptyFilter: {
          pretty: Object.values(EmptyFilterOptionsPretty),
          enum: Object.values(EmptyFilterOptions),
          type: "string",
          title: "When Filter Empty",
        },
      },
      required: ["tableId"],
    },
    outputs: {
      properties: {
        rows: {
          type: "array",
          customType: "rows",
          description: "The rows that were found",
        },
        success: {
          type: "boolean",
          description: "Whether the query was successful",
        },
      },
      required: ["rows", "success"],
    },
  },
}

async function getTable(appId, tableId) {
  const ctx = buildCtx(appId, null, {
    params: {
      tableId,
    },
  })
  await tableController.find(ctx)
  return ctx.body
}

function typeCoercion(filters, table) {
  if (!filters || !table) {
    return filters
  }
  for (let key of Object.keys(filters)) {
    if (typeof filters[key] === "object") {
      for (let [property, value] of Object.entries(filters[key])) {
        const column = table.schema[property]
        // convert string inputs
        if (!column || typeof value !== "string") {
          continue
        }
        if (column.type === FieldTypes.NUMBER) {
          filters[key][property] = parseFloat(value)
        }
      }
    }
  }
  return filters
}

const hasNullFilters = filters =>
  filters.length === 0 ||
  filters.some(filter => filter.value === null || filter.value === "")

exports.run = async function ({ inputs, appId }) {
  const { tableId, filters, sortColumn, sortOrder, limit } = inputs
  if (!tableId) {
    return {
      success: false,
      response: {
        message: "You must select a table to query.",
      },
    }
  }
  const table = await getTable(appId, tableId)
  let sortType = FieldTypes.STRING
  if (table && table.schema && table.schema[sortColumn] && sortColumn) {
    const fieldType = table.schema[sortColumn].type
    sortType =
      fieldType === FieldTypes.NUMBER ? FieldTypes.NUMBER : FieldTypes.STRING
  }
  const ctx = buildCtx(appId, null, {
    params: {
      tableId,
    },
    body: {
      sortType,
      limit,
      sort: sortColumn,
      query: typeCoercion(filters || {}, table),
      // default to ascending, like data tab
      sortOrder: sortOrder || SortOrders.ASCENDING,
    },
    version: "1",
  })
  try {
    let rows

    if (
      inputs.onEmptyFilter === EmptyFilterOptions.RETURN_NONE &&
      inputs["filters-def"] &&
      hasNullFilters(inputs["filters-def"])
    ) {
      rows = []
    } else {
      await rowController.search(ctx)
      rows = ctx.body ? ctx.body.rows : []
    }

    return {
      rows,
      success: ctx.status === 200,
    }
  } catch (err) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
