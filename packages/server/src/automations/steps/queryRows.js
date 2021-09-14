//const rowController = require("../../api/controllers/row")

const SortOrders = {
  ASCENDING: "ascending",
  DESCENDING: "descending",
}

const SortOrdersPretty = {
  [SortOrders.ASCENDING]: "Ascending",
  [SortOrders.DESCENDING]: "Descending",
}

exports.definition = {
  description: "Query rows from the database",
  icon: "ri-search-line",
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
        },
      },
      required: ["tableId", "filters"],
    },
    outputs: {
      properties: {
        row: {
          type: "array",
          customType: "rows",
          description: "The rows that were found",
        },
        success: {
          type: "boolean",
          description: "Whether the deletion was successful",
        },
      },
      required: ["rows", "success"],
    },
  },
}

exports.run = async function ({ inputs, appId }) {
  console.log(inputs)
  console.log(appId)
  // TODO: use the search controller
}
